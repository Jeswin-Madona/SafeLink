# SAFELINK — AI Incident Intelligence Module

## 1. Concepts from IncidentIQ Integration

SAFELINK incorporates the core concepts pioneered in the IncidentIQ architecture:
1. **Unstructured Incident Text Processing**: Cleans and normalizes citizen-reported narratives.
2. **Abstractive & Extractive Summarization**: Leverages DistilGPT-2 and sequence-to-sequence transformers to produce concise summaries for emergency dispatchers.
3. **Dense Vector Embeddings**: Utilizes `sentence-transformers/all-MiniLM-L6-v2` to map incident texts into a 384-dimensional dense semantic embedding space.
4. **Cosine Similarity Search**: Computes mathematical cosine distance between new incident embeddings and historical case records to detect patterns, repeat offenders, and hazard clusters.

## 2. Mathematical Formulation

The cosine similarity between query embedding $\mathbf{q}$ and historical case embedding $\mathbf{c}$ is calculated as:

$$\text{Similarity}(\mathbf{q}, \mathbf{c}) = \frac{\mathbf{q} \cdot \mathbf{c}}{\|\mathbf{q}\| \|\mathbf{c}\|} = \frac{\sum_{i=1}^{384} q_i c_i}{\sqrt{\sum_{i=1}^{384} q_i^2} \sqrt{\sum_{i=1}^{384} c_i^2}}$$

- Matches with similarity $\ge 0.40$ are returned to investigating officers.
- **Academic Disclaimer**: High semantic similarity indicates topical or pattern overlap; it is labeled as an *AI-generated indicator* and not conclusive legal proof.

## 3. Extensible Architecture

The Python microservice is built using **FastAPI** with structured Pydantic DTOs:
- `IncidentAnalysisRequest` / `IncidentAnalysisResponse`
- `SimilarIncidentsRequest` / `SimilarIncidentsResponse`
- `SummarizeRequest` / `SummarizeResponse`

This decoupled design allows the underlying NLP pipeline to be swapped out in the future with larger Foundation Models (e.g. Llama-3, Mistral, or OpenAI API) without altering a single line of Java or React code.
