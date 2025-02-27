from fastapi import APIRouter, HTTPException, status
from typing import List
from .models import (
    Node, Edge, DisasterSimulation, RiskAssessment,
    SimulationResponse, RiskFactor
)

router = APIRouter()

# In-memory storage until Neo4j is configured
nodes: List[Node] = []
edges: List[Edge] = []
next_node_id = 1
next_edge_id = 1

@router.get("/nodes", response_model=List[Node])
async def get_nodes():
    """Get all supply chain nodes"""
    return nodes

@router.post("/nodes", response_model=Node, status_code=status.HTTP_201_CREATED)
async def create_node(node: Node):
    """Create a new supply chain node"""
    global next_node_id
    try:
        node.id = next_node_id
        next_node_id += 1
        nodes.append(node)
        return node
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/edges", response_model=List[Edge])
async def get_edges():
    """Get all supply chain edges"""
    return edges

@router.post("/edges", response_model=Edge, status_code=status.HTTP_201_CREATED)
async def create_edge(edge: Edge):
    """Create a new supply chain edge"""
    global next_edge_id
    try:
        # Validate that source and target nodes exist
        source_node = next((n for n in nodes if str(n.id) == edge.source), None)
        target_node = next((n for n in nodes if str(n.id) == edge.target), None)

        if not source_node or not target_node:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Source or target node not found"
            )

        edge.id = next_edge_id
        next_edge_id += 1
        edges.append(edge)
        return edge
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.delete("/nodes/{node_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_node(node_id: int):
    """Delete a supply chain node"""
    global nodes
    original_length = len(nodes)
    nodes = [n for n in nodes if n.id != node_id]
    if len(nodes) == original_length:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Node not found"
        )

@router.delete("/edges/{edge_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_edge(edge_id: int):
    """Delete a supply chain edge"""
    global edges
    original_length = len(edges)
    edges = [e for e in edges if e.id != edge_id]
    if len(edges) == original_length:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Edge not found"
        )

@router.post("/simulate-disaster", response_model=SimulationResponse)
async def simulate_disaster(simulation: DisasterSimulation):
    """Simulate a disaster's impact on the supply chain"""
    try:
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
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/nodes/{node_id}/risk-assessment", response_model=RiskAssessment)
async def assess_node_risk(node_id: int):
    """Assess risk for a specific supply chain node"""
    node = next((n for n in nodes if n.id == node_id), None)
    if not node:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Node not found"
        )

    try:
        # Placeholder risk assessment until AI models are integrated
        return RiskAssessment(
            nodeId=node_id,
            riskScore=25.0,
            analysisData={
                "factors": [
                    RiskFactor(
                        category="Environmental",
                        impact=7.0,
                        description="High exposure to natural disasters"
                    ).dict()
                ],
                "recommendations": [
                    "Implement backup supply routes",
                    "Increase safety stock levels"
                ]
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )