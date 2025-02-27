from fastapi import APIRouter, HTTPException, status
from typing import List
from .models import (
    Node, Edge, DisasterSimulation, RiskAssessment,
    SimulationResponse, RiskFactor
)
from .database import Neo4jConnection

router = APIRouter()

@router.get("/nodes", response_model=List[Node])
async def get_nodes():
    """Get all supply chain nodes"""
    db = Neo4jConnection.get_instance()
    session = db.get_session()

    try:
        result = session.run("MATCH (n:Node) RETURN n")
        nodes = []
        for record in result:
            node = record["n"]
            nodes.append(Node(
                id=node.id,
                type=node["type"],
                name=node["name"],
                position=node["position"],
                data=node["data"]
            ))
        return nodes
    finally:
        session.close()

@router.post("/nodes", response_model=Node, status_code=status.HTTP_201_CREATED)
async def create_node(node: Node):
    """Create a new supply chain node"""
    db = Neo4jConnection.get_instance()
    session = db.get_session()

    try:
        result = session.run(
            """
            CREATE (n:Node {
                type: $type,
                name: $name,
                position: $position,
                data: $data
            })
            RETURN n
            """,
            {
                "type": node.type,
                "name": node.name,
                "position": node.position,
                "data": node.data
            }
        )
        created_node = result.single()["n"]
        return Node(
            id=created_node.id,
            type=created_node["type"],
            name=created_node["name"],
            position=created_node["position"],
            data=created_node["data"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    finally:
        session.close()

@router.get("/edges", response_model=List[Edge])
async def get_edges():
    """Get all supply chain edges"""
    db = Neo4jConnection.get_instance()
    session = db.get_session()

    try:
        result = session.run(
            """
            MATCH (source:Node)-[r:CONNECTS]->(target:Node)
            RETURN r, source.id as source_id, target.id as target_id
            """
        )
        edges = []
        for record in result:
            rel = record["r"]
            edges.append(Edge(
                id=rel.id,
                source=str(record["source_id"]),
                target=str(record["target_id"]),
                data=rel["data"]
            ))
        return edges
    finally:
        session.close()

@router.post("/edges", response_model=Edge, status_code=status.HTTP_201_CREATED)
async def create_edge(edge: Edge):
    """Create a new supply chain edge"""
    db = Neo4jConnection.get_instance()
    session = db.get_session()

    try:
        result = session.run(
            """
            MATCH (source:Node), (target:Node)
            WHERE source.id = $source AND target.id = $target
            CREATE (source)-[r:CONNECTS {data: $data}]->(target)
            RETURN r, source.id as source_id, target.id as target_id
            """,
            {
                "source": edge.source,
                "target": edge.target,
                "data": edge.data
            }
        )
        if not result.peek():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Source or target node not found"
            )

        record = result.single()
        return Edge(
            id=record["r"].id,
            source=str(record["source_id"]),
            target=str(record["target_id"]),
            data=record["r"]["data"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    finally:
        session.close()

@router.delete("/nodes/{node_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_node(node_id: int):
    """Delete a supply chain node"""
    db = Neo4jConnection.get_instance()
    session = db.get_session()
    try:
        result = session.run(f"MATCH (n:Node) WHERE ID(n) = {node_id} DETACH DELETE n")
        if result.summary().counters.nodes_deleted == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Node not found"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    finally:
        session.close()


@router.delete("/edges/{edge_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_edge(edge_id: int):
    """Delete a supply chain edge"""
    db = Neo4jConnection.get_instance()
    session = db.get_session()
    try:
        result = session.run(f"MATCH ()-[r:CONNECTS]->() WHERE ID(r) = {edge_id} DELETE r")
        if result.summary().counters.relationships_deleted == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Edge not found"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    finally:
        session.close()

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
    db = Neo4jConnection.get_instance()
    session = db.get_session()
    try:
        result = session.run(f"MATCH (n:Node) WHERE ID(n) = {node_id} RETURN n")
        node = result.single()
        if not node:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Node not found"
            )
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
    finally:
        session.close()