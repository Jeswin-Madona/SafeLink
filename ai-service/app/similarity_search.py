import logging
import numpy as np
from typing import List
from app.models import SimilarIncidentsRequest, SimilarIncidentsResponse, SimilarIncidentResult

logger = logging.getLogger(__name__)

# Lazy model loader for Sentence Transformers
_model = None

def get_embedding_model():
    global _model
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
            logger.info("Loading sentence-transformers/all-MiniLM-L6-v2 model...")
            _model = SentenceTransformer('all-MiniLM-L6-v2')
            logger.info("Sentence Transformer model loaded successfully.")
        except Exception as e:
            logger.warning(f"Could not load SentenceTransformer ({e}). Falling back to TF-IDF cosine similarity.")
            _model = False
    return _model

def cosine_similarity(v1: np.ndarray, v2: np.ndarray) -> float:
    dot = np.dot(v1, v2)
    norm1 = np.linalg.norm(v1)
    norm2 = np.linalg.norm(v2)
    if norm1 == 0 or norm2 == 0:
        return 0.0
    return float(dot / (norm1 * norm2))

def find_similar_incidents(req: SimilarIncidentsRequest) -> SimilarIncidentsResponse:
    if not req.historical_incidents:
        return SimilarIncidentsResponse(query=req.query_text, matches=[])

    model = get_embedding_model()
    results: List[SimilarIncidentResult] = []

    if model:
        try:
            query_emb = model.encode(req.query_text)
            corpus_texts = [f"{item.title} {item.description} {item.category}" for item in req.historical_incidents]
            corpus_embs = model.encode(corpus_texts)

            for idx, item in enumerate(req.historical_incidents):
                score = cosine_similarity(query_emb, corpus_embs[idx])
                if score >= req.similarity_threshold:
                    results.append(SimilarIncidentResult(
                        incident_id=item.id,
                        title=item.title,
                        similarity_score=round(score, 4),
                        category=item.category,
                        severity=item.severity,
                        location=item.location,
                        date=item.date
                    ))
        except Exception as ex:
            logger.error(f"Error during sentence transformer embedding: {ex}")
            results = fallback_tfidf_similarity(req)
    else:
        results = fallback_tfidf_similarity(req)

    # Sort descending by similarity score
    results.sort(key=lambda x: x.similarity_score, reverse=True)
    results = results[:req.top_k]

    return SimilarIncidentsResponse(
        query=req.query_text,
        matches=results,
        disclaimer="Semantic similarity computed via Sentence Transformers cosine distance. Does not establish legal connection."
    )

def fallback_tfidf_similarity(req: SimilarIncidentsRequest) -> List[SimilarIncidentResult]:
    """Fallback TF-IDF vectorizer when neural weights are not yet cached."""
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity as sklearn_cos

    corpus_texts = [f"{item.title} {item.description} {item.category}" for item in req.historical_incidents]
    all_texts = [req.query_text] + corpus_texts

    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(all_texts)

    query_vec = tfidf_matrix[0:1]
    corpus_vecs = tfidf_matrix[1:]

    sims = sklearn_cos(query_vec, corpus_vecs).flatten()

    matches = []
    for idx, item in enumerate(req.historical_incidents):
        score = float(sims[idx])
        if score >= req.similarity_threshold:
            matches.append(SimilarIncidentResult(
                incident_id=item.id,
                title=item.title,
                similarity_score=round(score, 4),
                category=item.category,
                severity=item.severity,
                location=item.location,
                date=item.date
            ))
    return matches
