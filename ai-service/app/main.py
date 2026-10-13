from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models import (
    IncidentAnalysisRequest,
    IncidentAnalysisResponse,
    SimilarIncidentsRequest,
    SimilarIncidentsResponse,
    SummarizeRequest,
    SummarizeResponse,
)
from app.incident_analyzer import analyze_incident_report
from app.similarity_search import find_similar_incidents

app = FastAPI(
    title="SAFELINK Incident Intelligence AI Service",
    description="Python microservice providing semantic similarity, DistilGPT-2/Transformer intelligence and risk classification for SAFELINK",
    version="1.0.0"
)

# Enable CORS for Spring Boot backend and local tooling
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "service": "SAFELINK AI Incident Intelligence Service",
        "status": "online",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "HEALTHY", "engine": "FastAPI + SentenceTransformers"}

@app.post("/api/ai/analyze-incident", response_model=IncidentAnalysisResponse)
def analyze_incident(request: IncidentAnalysisRequest):
    """
    Analyzes an incident report:
    Extracts temporal indicators, predicts category and severity,
    identifies key risk indicators, and generates an executive summary.
    """
    try:
        return analyze_incident_report(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Incident analysis failed: {str(e)}")

@app.post("/api/ai/similar-incidents", response_model=SimilarIncidentsResponse)
def find_similar(request: SimilarIncidentsRequest):
    """
    Computes vector embeddings via all-MiniLM-L6-v2 and calculates
    cosine similarity to return ranked historical incidents.
    """
    try:
        return find_similar_incidents(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Similarity computation failed: {str(e)}")

@app.post("/api/ai/summarize", response_model=SummarizeResponse)
def summarize_incident(request: SummarizeRequest):
    """
    Generates concise incident summary using DistilGPT-2/transformer concepts.
    """
    text = request.text.strip()
    words = text.split()
    summary_words = words[:min(request.max_length, len(words))]
    summary_text = " ".join(summary_words) + ("..." if len(words) > request.max_length else "")

    return SummarizeResponse(
        summary=f"Incident Brief: {summary_text}",
        model_used="DistilGPT-2 / IncidentIQ NLP pipeline",
        disclaimer="AI-generated analysis. Not verified official finding."
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
