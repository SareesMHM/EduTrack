from typing import Dict, List
from pydantic import BaseModel, Field


class Features(BaseModel):
    attendancePct: float = Field(ge=0, le=100)
    avgScorePct: float = Field(ge=0, le=100)
    examsTaken: int = Field(ge=0)
    scoreTrend: float = Field(ge=-100, le=100)
    lateRate: float = Field(ge=0, le=1)


class PredictRequest(BaseModel):
    studentId: str
    features: Features


class PredictResponse(BaseModel):
    studentId: str
    prediction: str  # AT_RISK | ON_TRACK
    probability: float  # P(at risk)
    confidence: float  # certainty of the predicted class
    modelVersion: str
    disclaimer: str


class BatchRequest(BaseModel):
    items: List[PredictRequest] = Field(max_length=1000)


class BatchResponse(BaseModel):
    results: List[PredictResponse]


class ExplainResponse(BaseModel):
    studentId: str
    probability: float
    contributions: Dict[str, float]  # + pushes towards AT_RISK, - towards ON_TRACK
    method: str
