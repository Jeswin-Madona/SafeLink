# SAFELINK — Security Architecture & Privacy Framework

## 1. Authentication & Session Security
- **Stateless JWT**: Standard RFC 7519 tokens signed with HMAC-SHA256 using a 256-bit cryptographically secure key.
- **BCrypt Password Hashing**: Passwords undergo salted BCrypt hashing with work factor 10 before database persistence. Plaintext passwords never exist in logs or tables.
- **CORS Protection**: Vite frontend origins are explicitly configured; wildcards with credentials are disallowed in production.

## 2. Role-Based Access Control (RBAC)
- `ROLE_USER`: Can only trigger their own SOS, manage their journeys, and view public/verified feeds.
- `ROLE_GUARDIAN`: Can only access wards who explicitly authorized them via `GuardianRelationship`.
- `ROLE_OFFICIAL`: Police/emergency rescue personnel who can triage active SOS distress signals and verify community reports.
- `ROLE_ADMIN`: Platform operators who manage user accounts, configuration, and audit logs.

## 3. Privacy & Pseudonymity
- **Minimal Exposure**: Reports submitted with `anonymous = true` render as `"Anonymous Reporter"` across public feeds and maps.
- **Audit-Gated Inspection**: Only official investigators can inspect true reporter identity when reviewing actionable incidents, and each inspection creates an unforgeable entry in `audit_logs`.

## 4. Tamper-Evident Cryptographic Auditing
Every security-critical event computes a SHA-256 hash chaining:
$$\text{Hash} = \text{SHA256}(\text{actorEmail} \parallel \text{action} \parallel \text{entityType} \parallel \text{entityId} \parallel \text{details} \parallel \text{timestamp})$$
This prevents internal data tampering and satisfies legal traceability standards.
