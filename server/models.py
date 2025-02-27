from pydantic import BaseModel, Field, validator
from typing import Dict, List, Optional
from datetime import datetime

class Node(BaseModel):
    id: int
    type: str = Field(..., description="Type of supply chain node")
    name: str = Field(..., min_length=1, max_length=100)
    position: Dict[str, float] = Field(..., description="x,y coordinates of the node")
    data: Dict[str, str]

    @validator('type')
    def validate_node_type(cls, v):
        valid_types = [
            "supplier", "manufacturer", "processor",
            "warehouse", "distributor", "crossdock",
            "retailer", "wholesaler", "lastmile",
            "coldchain", "customs", "quality"
        ]
        if v not in valid_types:
            raise ValueError(f"Invalid node type. Must be one of: {', '.join(valid_types)}")
        return v

class Edge(BaseModel):
    id: int
    source: str
    target: str
    data: Dict[str, str]

    @validator('data')
    def validate_edge_data(cls, v):
        required_fields = ['type', 'capacity']
        if not all(field in v for field in required_fields):
            raise ValueError(f"Edge data must contain: {', '.join(required_fields)}")
        return v

class DisasterSimulation(BaseModel):
    disasterType: str = Field(..., description="Type of disaster to simulate")
    region: str = Field(..., description="Geographic region affected")
    duration: str = Field(..., description="Expected duration of the disaster")
    magnitude: float = Field(..., ge=0, le=100, description="Severity of the disaster (0-100)")

    @validator('disasterType')
    def validate_disaster_type(cls, v):
        valid_types = ["Natural Disaster", "Political Crisis", "Economic Crisis", "Technological Failure"]
        if v not in valid_types:
            raise ValueError(f"Invalid disaster type. Must be one of: {', '.join(valid_types)}")
        return v

class RiskFactor(BaseModel):
    category: str
    impact: float = Field(..., ge=0, le=10)
    description: str

class RiskAssessment(BaseModel):
    nodeId: int
    riskScore: float = Field(..., ge=0, le=100)
    analysisData: Dict = Field(..., description="Detailed risk analysis data")
    timestamp: datetime = Field(default_factory=datetime.now)

    @validator('riskScore')
    def validate_risk_score(cls, v):
        if not 0 <= v <= 100:
            raise ValueError("Risk score must be between 0 and 100")
        return v

class SimulationResponse(BaseModel):
    supplyChainDisruption: float = Field(..., ge=0, le=100)
    revenueImpact: float = Field(..., ge=-100, le=100)
    recoveryTime: str
    mitigationStrategies: List[str]

    @validator('mitigationStrategies')
    def validate_strategies(cls, v):
        if not v:
            raise ValueError("At least one mitigation strategy must be provided")
        return v