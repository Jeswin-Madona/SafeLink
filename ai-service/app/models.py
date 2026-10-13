from pydantic import BaseModel, Field
from typing import List, Optional

class IncidentAnalysisRequest(BaseModel):
    title: str = Field(..., description="Title of the incident")
    description: str = Field(..., description="Full citizen report description")
    reported_category: Optional[str] = None
    location: Optional[str] = None

class IncidentAnalysisResponse(BaseModel):
    summary: str
    suggested_category: str
    estimated_severity: str
    extracted_location: Optional[str] = None
    extracted_time_indicators: Optional[str] = None
    key_risk_indicators: List[str]
    disclaimer: str = "AI-generated analysis. Not verified official finding."

class IncidentCorpusItem(BaseModel):
    id: int
    title: str
    description: str
    category: str
    severity: str
    location: Optional[str] = None
    date: Optional[str] = None

class SimilarIncidentsRequest(BaseModel):
    query_text: str
    historical_incidents: List[IncidentCorpusItem]
    top_k: int = 3
    similarity_threshold: float = 0.40

class SimilarIncidentResult(BaseModel):
    incident_id: int
    title: str
    similarity_score: float
    category: str
    severity: str
    location: Optional[str] = None
    date: Optional[str] = None

class SimilarIncidentsResponse(BaseModel):
    query: str
    matches: List[SimilarIncidentResult]
    disclaimer: str = "Semantic similarity computed via Sentence Transformers cosine distance. Does not establish legal connection."

class SummarizeRequest(BaseModel):
    text: str
    max_length: Optional[int] = 60

class SummarizeResponse(BaseModel):
    summary: str
    model_used: str
    disclaimer: str = "AI-generated analysis."
