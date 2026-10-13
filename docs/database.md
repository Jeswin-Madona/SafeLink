# SAFELINK — Database Design & Schema Architecture

## 1. Relational Entity-Relationship Structure

SAFELINK uses PostgreSQL for relational data integrity, foreign key cascading constraints, and ACID transactions. For local development and zero-config viva demonstrations, it also supports H2 in PostgreSQL compatibility mode.

### Core Tables

1. `users`:
   - `id` (BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY)
   - `email` (VARCHAR(120) UNIQUE NOT NULL)
   - `password_hash` (VARCHAR(255) NOT NULL - BCrypt salted)
   - `full_name` (VARCHAR(100) NOT NULL)
   - `phone_number` (VARCHAR(20))
   - `role` (VARCHAR(30) NOT NULL: `ROLE_USER`, `ROLE_GUARDIAN`, `ROLE_OFFICIAL`, `ROLE_ADMIN`)
   - `badge_number` (VARCHAR(50))
   - `department` (VARCHAR(100))
   - `active` (BOOLEAN DEFAULT TRUE)
   - `created_at`, `updated_at` (TIMESTAMP)

2. `guardian_relationships`:
   - `id` (BIGINT PRIMARY KEY)
   - `user_id` (FK to `users.id`)
   - `guardian_id` (FK to `users.id`)
   - `relationship_type` (VARCHAR(50))
   - `is_sos_recipient` (BOOLEAN DEFAULT TRUE)
   - `is_journey_tracking_authorized` (BOOLEAN DEFAULT TRUE)
   - `verified` (BOOLEAN DEFAULT TRUE)

3. `emergencies`:
   - `id` (BIGINT PRIMARY KEY)
   - `user_id` (FK to `users.id`)
   - `latitude` (DOUBLE PRECISION NOT NULL)
   - `longitude` (DOUBLE PRECISION NOT NULL)
   - `address` (VARCHAR(255))
   - `status` (`ACTIVE`, `ACKNOWLEDGED`, `RESPONDING`, `RESOLVED`, `CANCELLED`)
   - `trigger_reason` (TEXT)
   - `response_notes` (TEXT)
   - `assigned_official_id` (FK to `users.id`)
   - `acknowledged_at`, `resolved_at`, `created_at` (TIMESTAMP)

4. `incidents`:
   - `id` (BIGINT PRIMARY KEY)
   - `reporter_id` (FK to `users.id`)
   - `title` (VARCHAR(150) NOT NULL)
   - `description` (TEXT NOT NULL)
   - `category` (VARCHAR(80) NOT NULL)
   - `severity` (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`)
   - `status` (`SUBMITTED`, `UNDER_REVIEW`, `VERIFIED`, `REJECTED`, `RESOLVED`)
   - `latitude`, `longitude` (DOUBLE PRECISION NOT NULL)
   - `approximate_address` (VARCHAR(255))
   - `anonymous` (BOOLEAN DEFAULT FALSE)
   - `ai_analyzed` (BOOLEAN DEFAULT FALSE)
   - `ai_summary` (TEXT)
   - `ai_suggested_category` (VARCHAR(50))
   - `ai_suggested_severity` (VARCHAR(30))
   - `ai_risk_factors` (TEXT)
   - `official_notes` (TEXT)
   - `reviewed_by_id` (FK to `users.id`)

5. `community_posts`:
   - `id` (BIGINT PRIMARY KEY)
   - `user_id` (FK to `users.id`)
   - `title` (VARCHAR(120) NOT NULL)
   - `content` (TEXT NOT NULL)
   - `category` (VARCHAR(60) NOT NULL)
   - `location_name` (VARCHAR(255))
   - `anonymous` (BOOLEAN DEFAULT TRUE)
   - `status` (`SUBMITTED`, `UNDER_REVIEW`, `VERIFIED`, `REJECTED`, `RESOLVED`)
   - `confirmations_count` (INT DEFAULT 0)
   - `official_review_note` (TEXT)

6. `journeys`:
   - `id` (BIGINT PRIMARY KEY)
   - `user_id` (FK to `users.id`)
   - `origin_name` (VARCHAR(150))
   - `destination_name` (VARCHAR(150))
   - `start_latitude`, `start_longitude` (DOUBLE PRECISION)
   - `destination_latitude`, `destination_longitude` (DOUBLE PRECISION)
   - `current_latitude`, `current_longitude` (DOUBLE PRECISION)
   - `status` (`PLANNED`, `ACTIVE`, `COMPLETED`, `CANCELLED`)
   - `estimated_risk_score` (INT)
   - `route_label` (VARCHAR(255))
   - `companion_mode_enabled` (BOOLEAN)
   - `share_with_guardians` (BOOLEAN)

7. `audit_logs`:
   - `id` (BIGINT PRIMARY KEY)
   - `actor_id` (BIGINT)
   - `actor_email` (VARCHAR(120))
   - `actor_role` (VARCHAR(50))
   - `action` (VARCHAR(80))
   - `entity_type` (VARCHAR(50))
   - `entity_id` (BIGINT)
   - `details` (TEXT)
   - `client_ip` (VARCHAR(45))
   - `record_hash` (VARCHAR(64) - SHA-256 integrity hash)
   - `timestamp` (TIMESTAMP NOT NULL)
