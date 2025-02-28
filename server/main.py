from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import asyncio
import json
from datetime import datetime, timedelta
import math
import random
import os

from .database import Neo4jConnection
from .routes import router
from dotenv import load_dotenv
import csv
import math
import random
from datetime import datetime, timedelta
from .csv_loader import load_supply_chain_csv, compute_metrics_from_csv, generate_risk_trend

app = FastAPI(title="SupplyTwin API")

load_dotenv()

# Now access your variables
neo4j_uri = os.getenv("NEO4J_URI")
neo4j_username=os.getenv("NEO4J_USERNAME")
neo4j_password=os.getenv("NEO4J_PASSWORD")

print(neo4j_uri)


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    # Initialize Neo4j connection
    print("Starting NEO4J connection!")
    global csv_data
    csv_data = load_supply_chain_csv("server/supply_chain_metrics.csv")
    global aggregated_metrics
    aggregated_metrics = compute_metrics_from_csv(csv_data)
    db = Neo4jConnection.get_instance()
    db.connect(
        uri=neo4j_uri,
        user=neo4j_username,
        password=neo4j_password
    )

@app.on_event("shutdown")
async def shutdown_event():
    # Close Neo4j connection
    db = Neo4jConnection.get_instance()
    db.close()

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

    # If CSV changes rarely, we can reuse 'aggregated_metrics'
    # or re-compute on each call if you want real-time data
    global aggregated_metrics

    # Add risk trend to the metrics
    risk_trend = generate_risk_trend(aggregated_metrics["averageRiskScore"])

    # Merge them
    return {**aggregated_metrics, "riskTrend": risk_trend}

    # Generate slightly varied metrics based on previous values
    # store.metrics["totalNodes"] += random.randint(-1, 1)
    # store.metrics["activeNodes"] = min(
    #     store.metrics["activeNodes"] + random.randint(-2, 2),
    #     store.metrics["totalNodes"]
    # )
    # store.metrics["averageRiskScore"] = max(5, min(95,
    #     store.metrics["averageRiskScore"] + (random.random() * 4) - 2
    # ))
    # store.metrics["throughput"] = max(1000,
    #     store.metrics["throughput"] + random.randint(-100, 100)
    # )
    # store.metrics["bottlenecks"] = max(0,
    #     store.metrics["bottlenecks"] + random.randint(-1, 1)
    # )
    # store.metrics["delayedShipments"] = max(0,
    #     store.metrics["delayedShipments"] + random.randint(-1, 1)
    # )

    # # Generate risk trend data
    # now = datetime.now()
    # risk_trend = []
    # for i in range(20):
    #     base_risk = store.metrics["averageRiskScore"]
    #     variation = math.sin(i / 3) * 5
    #     noise = (random.random() - 0.5) * 3
    #     risk_trend.append({
    #         "timestamp": (now - timedelta(minutes=5 * (19-i))).isoformat(),
    #         "riskScore": max(0, min(100, base_risk + variation + noise))
    #     })

    # return {**store.metrics, "riskTrend": risk_trend}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Send initial metrics
        print(metrics)
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