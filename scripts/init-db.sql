-- Created automatically by Cursor AI (2024-12-19)
-- Initialize Crisis Crew Database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgvector for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Create database if it doesn't exist
-- (This will be handled by docker-compose environment variables)

-- Create organizations table
CREATE TABLE IF NOT EXISTS orgs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    plan TEXT DEFAULT 'free',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES orgs(id),
    email CITEXT UNIQUE,
    name TEXT,
    role TEXT,
    tz TEXT DEFAULT 'UTC',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create memberships table
CREATE TABLE IF NOT EXISTS memberships (
    user_id UUID REFERENCES users(id),
    org_id UUID REFERENCES orgs(id),
    workspace_role TEXT CHECK (workspace_role IN ('owner','admin','pr','legal','social','exec','viewer')),
    PRIMARY KEY (user_id, org_id)
);

-- Create incidents table
CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES orgs(id),
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    severity TEXT CHECK (severity IN ('low','medium','high','critical')) DEFAULT 'high',
    status TEXT CHECK (status IN ('created','triage','drafting','legal_review','approvals','ready','published','monitoring','resolved','exported','archived')) DEFAULT 'created',
    detected_at TIMESTAMPTZ,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create incident facts table
CREATE TABLE IF NOT EXISTS incident_facts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    confidence TEXT CHECK (confidence IN ('low','medium','high')) DEFAULT 'medium',
    source TEXT,
    is_unknown BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create jurisdictions table
CREATE TABLE IF NOT EXISTS jurisdictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    notes TEXT
);

-- Create data categories table
CREATE TABLE IF NOT EXISTS data_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    scope_estimate TEXT
);

-- Create stakeholders table
CREATE TABLE IF NOT EXISTS stakeholders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    segment TEXT NOT NULL,
    size_estimate INT,
    priority INT,
    notes TEXT
);

-- Create channels table
CREATE TABLE IF NOT EXISTS channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    target_when TEXT
);

-- Create artifacts table
CREATE TABLE IF NOT EXISTS artifacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    kind TEXT NOT NULL,
    version INT DEFAULT 1,
    author_id UUID REFERENCES users(id),
    text TEXT NOT NULL,
    mdx TEXT,
    meta JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create redlines table
CREATE TABLE IF NOT EXISTS redlines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artifact_id UUID REFERENCES artifacts(id) ON DELETE CASCADE,
    agent TEXT NOT NULL,
    start_pos INT NOT NULL,
    end_pos INT NOT NULL,
    suggestion TEXT NOT NULL,
    risk_tag TEXT NOT NULL,
    applied BOOLEAN DEFAULT FALSE
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    owner_id UUID REFERENCES users(id),
    due_at TIMESTAMPTZ,
    depends_on UUID REFERENCES tasks(id),
    status TEXT CHECK (status IN ('todo','doing','blocked','done')) DEFAULT 'todo',
    priority INT DEFAULT 3,
    channel_hint TEXT
);

-- Create milestones table
CREATE TABLE IF NOT EXISTS milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    at TIMESTAMPTZ NOT NULL,
    description TEXT
);

-- Create approvals table
CREATE TABLE IF NOT EXISTS approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    artifact_kind TEXT NOT NULL,
    order_idx INT NOT NULL,
    role_required TEXT NOT NULL,
    user_id UUID REFERENCES users(id),
    status TEXT CHECK (status IN ('pending','approved','rejected')) DEFAULT 'pending',
    comment TEXT,
    acted_at TIMESTAMPTZ
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    artifact_id UUID REFERENCES artifacts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id),
    body TEXT NOT NULL,
    anchor JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY,
    org_id UUID REFERENCES orgs(id),
    user_id UUID REFERENCES users(id),
    incident_id UUID REFERENCES incidents(id),
    action TEXT NOT NULL,
    target TEXT NOT NULL,
    meta JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create feeds table
CREATE TABLE IF NOT EXISTS feeds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    source TEXT NOT NULL,
    config JSONB
);

-- Create mentions table
CREATE TABLE IF NOT EXISTS mentions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    feed_id UUID REFERENCES feeds(id) ON DELETE CASCADE,
    ts TIMESTAMPTZ NOT NULL,
    source TEXT NOT NULL,
    author TEXT,
    content TEXT NOT NULL,
    url TEXT,
    sentiment NUMERIC
);

-- Create rumors table
CREATE TABLE IF NOT EXISTS rumors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    statement TEXT NOT NULL,
    confidence TEXT CHECK (confidence IN ('low','medium','high')) DEFAULT 'medium',
    status TEXT CHECK (status IN ('unverified','monitor','rebutted','confirmed')) DEFAULT 'unverified',
    recommended_reply TEXT,
    embedding VECTOR(1536)
);

-- Create exports table
CREATE TABLE IF NOT EXISTS exports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
    kind TEXT NOT NULL,
    s3_key TEXT NOT NULL,
    meta JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_incidents_org_id ON incidents(org_id);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_created_at ON incidents(created_at);
CREATE INDEX IF NOT EXISTS idx_incident_facts_incident_id ON incident_facts(incident_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_incident_id_kind_version ON artifacts(incident_id, kind, version DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_incident_id_status_due_at ON tasks(incident_id, status, due_at);
CREATE INDEX IF NOT EXISTS idx_approvals_incident_id_artifact_kind ON approvals(incident_id, artifact_kind);
CREATE INDEX IF NOT EXISTS idx_audit_log_org_id_created_at ON audit_log(org_id, created_at);
CREATE INDEX IF NOT EXISTS idx_rumors_embedding ON rumors USING ivfflat (embedding vector_cosine_ops);

-- Create RLS policies (basic setup)
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;

-- Insert sample data for development
INSERT INTO orgs (id, name, plan) VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'Demo Organization', 'pro')
ON CONFLICT DO NOTHING;

INSERT INTO users (id, org_id, email, name, role) VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'admin@demo.com', 'Demo Admin', 'admin')
ON CONFLICT DO NOTHING;

INSERT INTO memberships (user_id, org_id, workspace_role) VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'owner')
ON CONFLICT DO NOTHING;
