-- ASAGUS Admin Panel - PostgreSQL Initialization
-- This script runs on first database creation

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create databases for each service (if using separate DBs in future)
-- For now, we use a single database with schemas
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS content;
CREATE SCHEMA IF NOT EXISTS analytics;
CREATE SCHEMA IF NOT EXISTS media;

-- Grant permissions
GRANT ALL ON SCHEMA auth TO asagus_admin;
GRANT ALL ON SCHEMA content TO asagus_admin;
GRANT ALL ON SCHEMA analytics TO asagus_admin;
GRANT ALL ON SCHEMA media TO asagus_admin;
