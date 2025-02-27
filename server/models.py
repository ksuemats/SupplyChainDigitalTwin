from pydantic import BaseModel
from typing import Dict, List, Optional
from datetime import datetime

class Node(BaseModel):
    id: int
    type: str
    name: str
    position: Dict[str, float]
    data: Dict[str, str]

class Edge(BaseModel):
    id: int
    source: str
    target: str
    data: Dict[str, str]

class DisasterSimulation(BaseModel):
    disasterType: str
    region: str
    duration: str
    magnitude: float

class RiskAssessment(BaseModel):
    nodeId: int
    riskScore: float
    analysisData: Dict

class SimulationResponse(BaseModel):
    supplyChainDisruption: float
    revenueImpact: float
    recoveryTime: str
    mitigationStrategies: List[str]
