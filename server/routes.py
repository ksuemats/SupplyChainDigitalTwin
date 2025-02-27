from fastapi import APIRouter, HTTPException
from typing import List
from .models import Node, Edge, DisasterSimulation, RiskAssessment, SimulationResponse

router = APIRouter()

# In-memory storage until Neo4j is configured
nodes: List[Node] = []
edges: List[Edge] = []
next_node_id = 1
next_edge_id = 1

@router.get("/nodes", response_model=List[Node])
async def get_nodes():
    return nodes

@router.post("/nodes", response_model=Node)
async def create_node(node: Node):
    global next_node_id
    node.id = next_node_id
    next_node_id += 1
    nodes.append(node)
    return node

@router.get("/edges", response_model=List[Edge])
async def get_edges():
    return edges

@router.post("/edges", response_model=Edge)
async def create_edge(edge: Edge):
    global next_edge_id
    edge.id = next_edge_id
    next_edge_id += 1
    edges.append(edge)
    return edge

@router.post("/simulate-disaster", response_model=SimulationResponse)
async def simulate_disaster(simulation: DisasterSimulation):
    # Placeholder simulation logic until AI models are integrated
    return SimulationResponse(
        supplyChainDisruption=78.0,
        revenueImpact=-45.0,
        recoveryTime="3-4 months",
        mitigationStrategies=[
            "Establish backup suppliers in safe zones",
            "Reroute through alternative logistics hubs",
            "Increase buffer inventory by 25%"
        ]
    )

@router.post("/nodes/{node_id}/risk-assessment", response_model=RiskAssessment)
async def assess_node_risk(node_id: int):
    node = next((n for n in nodes if n.id == node_id), None)
    if not node:
        raise HTTPException(status_code=404, detail="Node not found")
    
    # Placeholder risk assessment until AI models are integrated
    return RiskAssessment(
        nodeId=node_id,
        riskScore=25.0,
        analysisData={
            "factors": [
                {
                    "category": "Environmental",
                    "impact": 7,
                    "description": "High exposure to natural disasters"
                }
            ],
            "recommendations": [
                "Implement backup supply routes",
                "Increase safety stock levels"
            ]
        }
    )
