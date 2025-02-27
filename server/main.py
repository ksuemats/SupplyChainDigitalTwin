from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import asyncio
import json
from datetime import datetime, timedelta
import math
import random

from .routes import router

app = FastAPI(title="SupplyTwin API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api")

# Temporary in-memory storage for metrics
class MemoryStore:
    def __init__(self):
        self.metrics = {
            "totalNodes": 120,
            "activeNodes": 115,
            "averageRiskScore": 25,
            "throughput": 5500,
            "bottlenecks": 2,
            "delayedShipments": 5,
        }

store = MemoryStore()

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

manager = ConnectionManager()

def generate_metrics():
    # Generate slightly varied metrics based on previous values
    store.metrics["totalNodes"] += random.randint(-1, 1)
    store.metrics["activeNodes"] = min(
        store.metrics["activeNodes"] + random.randint(-2, 2),
        store.metrics["totalNodes"]
    )
    store.metrics["averageRiskScore"] = max(5, min(95,
        store.metrics["averageRiskScore"] + (random.random() * 4) - 2
    ))
    store.metrics["throughput"] = max(1000,
        store.metrics["throughput"] + random.randint(-100, 100)
    )
    store.metrics["bottlenecks"] = max(0,
        store.metrics["bottlenecks"] + random.randint(-1, 1)
    )
    store.metrics["delayedShipments"] = max(0,
        store.metrics["delayedShipments"] + random.randint(-1, 1)
    )

    # Generate risk trend data
    now = datetime.now()
    risk_trend = []
    for i in range(20):
        base_risk = store.metrics["averageRiskScore"]
        variation = math.sin(i / 3) * 5
        noise = (random.random() - 0.5) * 3
        risk_trend.append({
            "timestamp": (now - timedelta(minutes=5 * (19-i))).isoformat(),
            "riskScore": max(0, min(100, base_risk + variation + noise))
        })

    return {**store.metrics, "riskTrend": risk_trend}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Send initial metrics
        metrics = generate_metrics()
        await websocket.send_text(json.dumps(metrics))

        # Keep connection alive and send updates
        while True:
            metrics = generate_metrics()
            await websocket.send_text(json.dumps(metrics))
            await asyncio.sleep(5)  # Update every 5 seconds
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/")
async def root():
    return {"message": "SupplyTwin API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}