# SAFELINK — System Architecture & Design Specification

## 1. High-Level Architecture Overview

SAFELINK is architected as a **Modular Monolith Backend** paired with an **Asynchronous Python AI Microservice** and an **Enterprise React Single-Page Application (SPA)**.

```
                           [ React 18 + TS Client ]
                           (Port 5173 / Nginx Port 3000)
                                       │
                                       │ HTTPS / REST (JWT Bearer)
                                       ▼
                    [ Spring Boot 3.3 Backend (Port 8080) ]
                    ├── Security & Session (JWT + Spring Security)
                    ├── REST Controllers & Bean Validation
                    ├── Domain Services (SOS, Journey, Community, RouteScoring)
                    ├── Tamper-Evident SHA-256 Audit Logger
                    └── Spring Data JPA Repositories
                           │                     │
                (JDBC/JPA) │                     │ (HTTP REST Client)
                           ▼                     ▼
          [ PostgreSQL / H2 Database ]     [ Python FastAPI AI Microservice (Port 8000) ]
          - Users & Credentials            - DistilGPT-2 Summarizer & NLP Pipeline
          - Emergency SOS Events           - all-MiniLM-L6-v2 Semantic Embeddings
          - Incidents & Evidence           - Cosine Similarity Incident Search
          - Journeys & Waypoints           - Temporal & Risk Indicator Extraction
          - Cryptographic Audit Trail
```

## 2. Core Architectural Decisions & Rationale

### Why Modular Monolith for Spring Boot?
For a final-year engineering system, distributed microservices for every single domain (users, incidents, journeys) introduce immense operational complexity: distributed transactions (Saga), network partitions, service discovery overhead, and Docker orchestration bottlenecks. A clean layered modular architecture inside Spring Boot provides clean separation of concerns, compile-time type safety, and instant zero-config startup for academic evaluation.

### Why a Separate Python AI Microservice?
Deep Learning models (Hugging Face Transformers, PyTorch, Sentence Transformers) are native to the Python ecosystem. Running them in a dedicated FastAPI service decouples heavy AI inference from the reactive, transaction-heavy Java backend. Spring Boot mediates all AI requests, enforcing authentication, authorization, and rate limiting before invoking the AI pipeline.

### Why Ephemeral Location Tracking?
Continuous surveillance of citizens without consent violates privacy norms. SAFELINK only captures GPS coordinates when:
1. An explicit Emergency SOS alert is triggered.
2. The user initiates a live Journey with guardian tracking consented.
3. A citizen reports a localized safety hazard or safe zone.
