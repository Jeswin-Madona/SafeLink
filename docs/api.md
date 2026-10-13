# SAFELINK — REST API Specification

All protected endpoints require an `Authorization: Bearer <JWT>` header.

## 1. Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new account (`ROLE_USER`, `ROLE_GUARDIAN`, `ROLE_OFFICIAL`)
- `POST /api/auth/login` — Authenticate and receive signed JWT
- `GET /api/auth/me` — Retrieve active authenticated user profile

## 2. Emergency Operations (`/api/emergencies`)
- `POST /api/emergencies/sos` — Immediately trigger high-priority SOS alert
- `GET /api/emergencies/my` — Get authenticated user's SOS history
- `GET /api/emergencies/active` — (Officials only) Get active dispatch queue
- `GET /api/emergencies/{id}` — Get details of specific emergency
- `PATCH /api/emergencies/{id}/status` — Transition emergency status (`ACTIVE` -> `ACKNOWLEDGED` -> `RESPONDING` -> `RESOLVED` / `CANCELLED`)

## 3. Incident Intelligence (`/api/incidents`)
- `POST /api/incidents` — Submit a safety incident hazard (triggers AI analysis pipeline)
- `GET /api/incidents` — List all incidents (pseudonymizes author if anonymous)
- `GET /api/incidents/verified` — List only officially verified incidents
- `GET /api/incidents/{id}` — Get single incident with full details
- `PATCH /api/incidents/{id}/review` — (Officials only) Verify, reject, or mark under review

## 4. Community Safety Network (`/api/community`)
- `POST /api/community/posts` — Share community report / safe zone checkpoint
- `GET /api/community/posts` — Get public community safety feed
- `POST /api/community/posts/{id}/confirm` — Crowdsourced confirmation/upvote
- `PATCH /api/community/posts/{id}/review` — (Officials only) Moderate community post

## 5. Journey & Route Safety (`/api/journeys`)
- `POST /api/journeys` — Initiate planned travel with route risk scoring
- `GET /api/journeys/my` — Get user's travel history
- `GET /api/journeys/companions` — List active companion travel groups
- `PATCH /api/journeys/{id}/location` — Update consented GPS position
- `POST /api/journeys/{id}/complete` — Mark journey as reached safely

## 6. AI Microservice Proxy (`/api/ai`)
- `POST /api/ai/analyze` — Extract risk indicators, time, and category
- `POST /api/ai/similar-incidents` — Compute vector similarity against historical incident database

## 7. IoT Telemetry Simulation (`/api/iot`)
- `POST /api/iot/events` — Simulated ESP32 wearable acceleration and impact trigger

## 8. Audit Logs (`/api/audit-logs`)
- `GET /api/audit-logs` — (Officials / Admins only) Forensics log with SHA-256 hashes
