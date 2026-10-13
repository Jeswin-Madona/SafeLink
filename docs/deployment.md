# SAFELINK — Deployment & Cloud Architecture Guide

## 1. Local Development (Zero Configuration)

SAFELINK is designed so examiners and developers can evaluate the platform immediately without installing Docker or external database servers.

### Backend (Spring Boot with embedded H2 in PostgreSQL mode):
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```
The backend initializes at `http://localhost:8080`, seeds demo accounts, and mounts the H2 Console at `http://localhost:8080/h2-console`.

### Frontend (React + Vite):
```powershell
cd frontend
npm install
npm run dev
```
The React enterprise application runs at `http://localhost:5173`.

### Python AI Microservice:
```powershell
cd ai-service
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Runs at `http://localhost:8000`. Interactive OpenAPI documentation available at `http://localhost:8000/docs`.

---

## 2. Docker Compose (Full Stack Orchestration)

To spin up all 4 services (PostgreSQL, AI Service, Spring Boot, React + Nginx) with one command:
```bash
docker compose up --build
```
- Frontend UI: `http://localhost:3000`
- Spring Boot Backend: `http://localhost:8080`
- AI Microservice: `http://localhost:8000`
- PostgreSQL 16: `localhost:5432`

---

## 3. Production AWS Architecture

When deploying to enterprise production on Amazon Web Services (AWS):

```
[ Route 53 DNS / CloudFront CDN ]
                │
                ▼
  [ AWS Application Load Balancer (ALB) ]
       │                                │
       ▼                                ▼
[ ECS Fargate: React SPA ]    [ ECS Fargate: Spring Boot Backend ]
                                        │
                       ┌────────────────┴────────────────┐
                       ▼                                 ▼
         [ AWS RDS PostgreSQL 16 ]            [ ECS Fargate: FastAPI AI ]
         (Multi-AZ, Encrypted EBS)            (Spot Instances for PyTorch)
                       │
                       ▼
            [ AWS S3 Evidence Bucket ]
            (Incident Photos/Videos)
```

- **Amazon RDS for PostgreSQL**: Multi-AZ automated backups, storage encryption with AWS KMS.
- **Amazon ECS / Fargate**: Serverless Docker containers for backend and AI services with auto-scaling based on CPU/Memory.
- **Amazon S3**: Secure storage of evidence photos and audio notes.
- **Amazon CloudWatch**: Centralized log streaming and alarms for active SOS spikes.
