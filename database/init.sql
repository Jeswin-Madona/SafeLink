-- ============================================================
-- SAFELINK Database Initialization Script (PostgreSQL)
-- ============================================================

-- Create Extensions if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Schema creation is managed automatically by Hibernate ddl-auto=update,
-- but the following represents the normalized relational schema:

COMMENT ON DATABASE safelink IS 'SAFELINK - Women''s Safety & Emergency Response Platform Data Store';
