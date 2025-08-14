-- Quick Database Setup SQL
-- This combines migrations for rapid development setup

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUM TYPES
-- =====================================================

-- Quiz status enum
DO $$ BEGIN
    CREATE TYPE quiz_status AS ENUM ('draft', 'active', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Question type enum  
DO $$ BEGIN
    CREATE TYPE question_type AS ENUM ('single', 'multi', 'scale');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Scoring rule type enum
DO $$ BEGIN
    CREATE TYPE scoring_rule_type AS ENUM ('sum', 'weighted', 'composite');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Session state enum
DO $$ BEGIN
    CREATE TYPE session_state AS ENUM ('started', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Product delivery type enum
DO $$ BEGIN
    CREATE TYPE product_delivery_type AS ENUM ('static_pdf', 'ai_generated', 'link');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Order status enum
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('paid', 'refunded', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Email event status enum
DO $$ BEGIN
    CREATE TYPE email_status AS ENUM ('queued', 'sent', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Admin role enum
DO $$ BEGIN
    CREATE TYPE admin_role AS ENUM ('owner', 'editor', 'viewer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Updated timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- TABLES
-- =====================================================

-- 1. QUIZZES TABLE
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    status quiz_status NOT NULL DEFAULT 'draft',
    default_lang TEXT NOT NULL DEFAULT 'hu',
    feature_flags JSONB DEFAULT '{}',
    theme JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. QUIZ_TRANSLATIONS TABLE
CREATE TABLE IF NOT EXISTS quiz_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    lang TEXT NOT NULL,
    field_key TEXT NOT NULL,
    value TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(quiz_id, lang, field_key)
);

-- 3. QUIZ_QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    "order" INTEGER NOT NULL,
    type question_type NOT NULL,
    key TEXT NOT NULL,
    help_text TEXT,
    options JSONB DEFAULT '[]',
    scoring JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(quiz_id, key)
);

-- 4. QUIZ_SCORING_RULES TABLE
CREATE TABLE IF NOT EXISTS quiz_scoring_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    rule_type scoring_rule_type NOT NULL,
    weights JSONB DEFAULT '{}',
    thresholds JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. QUIZ_AI_PROMPTS TABLE
CREATE TABLE IF NOT EXISTS quiz_ai_prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    lang TEXT NOT NULL,
    ai_prompt TEXT NOT NULL,
    fallback_results JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(quiz_id, lang)
);

-- 6. QUIZ_PRODUCT_OFFERS TABLE
CREATE TABLE IF NOT EXISTS quiz_product_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    score_range_min INTEGER,
    score_range_max INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. QUIZ_RESULTS TABLE
CREATE TABLE IF NOT EXISTS quiz_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL,
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    scores JSONB NOT NULL DEFAULT '{}',
    ai_result TEXT,
    lang TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. QUIZ_SESSIONS TABLE
CREATE TABLE IF NOT EXISTS quiz_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    client_token TEXT NOT NULL,
    state session_state NOT NULL DEFAULT 'started',
    answers JSONB DEFAULT '{}',
    current_question INTEGER DEFAULT 1,
    email TEXT,
    lang TEXT NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. QUIZ_LEADS TABLE
CREATE TABLE IF NOT EXISTS quiz_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES quiz_sessions(id) ON DELETE CASCADE,
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    lang TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES quiz_sessions(id) ON DELETE CASCADE,
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    stripe_payment_intent_id TEXT,
    amount INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'EUR',
    status order_status NOT NULL DEFAULT 'paid',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. EMAIL_EVENTS TABLE
CREATE TABLE IF NOT EXISTS email_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES quiz_sessions(id) ON DELETE CASCADE,
    email_type TEXT NOT NULL,
    recipient TEXT NOT NULL,
    status email_status NOT NULL DEFAULT 'queued',
    provider_id TEXT,
    provider_response JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. AUDIT_LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID,
    event_name TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. ADMINS TABLE  
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role admin_role NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Quiz indexes
CREATE INDEX IF NOT EXISTS idx_quizzes_slug ON quizzes(slug);
CREATE INDEX IF NOT EXISTS idx_quizzes_status ON quizzes(status);

-- Quiz translations indexes
CREATE INDEX IF NOT EXISTS idx_quiz_translations_quiz_lang ON quiz_translations(quiz_id, lang);
CREATE INDEX IF NOT EXISTS idx_quiz_translations_field_key ON quiz_translations(field_key);

-- Quiz questions indexes
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_order ON quiz_questions(quiz_id, "order");
CREATE INDEX IF NOT EXISTS idx_quiz_questions_key ON quiz_questions(key);

-- Quiz sessions indexes
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_client_token ON quiz_sessions(client_token);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_quiz_state ON quiz_sessions(quiz_id, state);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_email ON quiz_sessions(email);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_created_at ON quiz_sessions(created_at);

-- Quiz results indexes
CREATE INDEX IF NOT EXISTS idx_quiz_results_session ON quiz_results(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_quiz ON quiz_results(quiz_id);

-- Quiz leads indexes
CREATE INDEX IF NOT EXISTS idx_quiz_leads_email ON quiz_leads(email);
CREATE INDEX IF NOT EXISTS idx_quiz_leads_quiz ON quiz_leads(quiz_id);

-- Orders indexes
CREATE INDEX IF NOT EXISTS idx_orders_session ON orders(session_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_intent ON orders(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Email events indexes
CREATE INDEX IF NOT EXISTS idx_email_events_session ON email_events(session_id);
CREATE INDEX IF NOT EXISTS idx_email_events_status ON email_events(status);
CREATE INDEX IF NOT EXISTS idx_email_events_type ON email_events(email_type);

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_session ON audit_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_event ON audit_logs(event_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update triggers for updated_at columns
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_quizzes_updated_at') THEN
        CREATE TRIGGER trigger_quizzes_updated_at
            BEFORE UPDATE ON quizzes
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_quiz_translations_updated_at') THEN
        CREATE TRIGGER trigger_quiz_translations_updated_at
            BEFORE UPDATE ON quiz_translations
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_quiz_questions_updated_at') THEN
        CREATE TRIGGER trigger_quiz_questions_updated_at
            BEFORE UPDATE ON quiz_questions
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_quiz_scoring_rules_updated_at') THEN
        CREATE TRIGGER trigger_quiz_scoring_rules_updated_at
            BEFORE UPDATE ON quiz_scoring_rules
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_quiz_ai_prompts_updated_at') THEN
        CREATE TRIGGER trigger_quiz_ai_prompts_updated_at
            BEFORE UPDATE ON quiz_ai_prompts
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_quiz_sessions_updated_at') THEN
        CREATE TRIGGER trigger_quiz_sessions_updated_at
            BEFORE UPDATE ON quiz_sessions
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_orders_updated_at') THEN
        CREATE TRIGGER trigger_orders_updated_at
            BEFORE UPDATE ON orders
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_email_events_updated_at') THEN
        CREATE TRIGGER trigger_email_events_updated_at
            BEFORE UPDATE ON email_events
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_admins_updated_at') THEN
        CREATE TRIGGER trigger_admins_updated_at
            BEFORE UPDATE ON admins
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
