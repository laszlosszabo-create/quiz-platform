-- Quiz Platform Initial Schema
-- Migration: 20250814120000_initial_schema
-- Description: Create base tables, enums, indexes, and RLS policies

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUM TYPES
-- =====================================================

-- Quiz status enum
CREATE TYPE quiz_status AS ENUM ('draft', 'active', 'archived');

-- Question type enum  
CREATE TYPE question_type AS ENUM ('single', 'multi', 'scale');

-- Scoring rule type enum
CREATE TYPE scoring_rule_type AS ENUM ('sum', 'weighted', 'composite');

-- Session state enum
CREATE TYPE session_state AS ENUM ('started', 'completed');

-- Product delivery type enum
CREATE TYPE product_delivery_type AS ENUM ('static_pdf', 'ai_generated', 'link');

-- Order status enum
CREATE TYPE order_status AS ENUM ('paid', 'refunded', 'failed');

-- Email event status enum
CREATE TYPE email_status AS ENUM ('queued', 'sent', 'failed');

-- Admin role enum
CREATE TYPE admin_role AS ENUM ('owner', 'editor', 'viewer');

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
CREATE TABLE quizzes (
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
CREATE TABLE quiz_translations (
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
CREATE TABLE quiz_questions (
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
CREATE TABLE quiz_scoring_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    rule_type scoring_rule_type NOT NULL,
    weights JSONB DEFAULT '{}',
    thresholds JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. QUIZ_PROMPTS TABLE
CREATE TABLE quiz_prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    lang TEXT NOT NULL,
    system_prompt TEXT,
    user_prompt_template TEXT,
    variables JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. LEADS TABLE
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT,
    lang TEXT NOT NULL,
    demographics JSONB DEFAULT '{}',
    utm JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SESSIONS TABLE
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    lang TEXT NOT NULL,
    state session_state NOT NULL DEFAULT 'started',
    answers JSONB DEFAULT '{}',
    scores JSONB DEFAULT '{}',
    result_snapshot JSONB DEFAULT '{}',
    client_token TEXT, -- For future session management
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PRODUCTS TABLE
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    active BOOLEAN NOT NULL DEFAULT FALSE,
    price_cents INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'HUF',
    stripe_price_id TEXT,
    delivery_type product_delivery_type NOT NULL,
    asset_url TEXT,
    translations JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ORDERS TABLE
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    amount_cents INTEGER NOT NULL,
    currency TEXT NOT NULL,
    stripe_payment_intent TEXT UNIQUE,
    status order_status NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. EMAIL_EVENTS TABLE
CREATE TABLE email_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    template_key TEXT NOT NULL,
    lang TEXT NOT NULL,
    status email_status NOT NULL DEFAULT 'queued',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ADMIN_USERS TABLE
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    role admin_role NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. AUDIT_LOGS TABLE
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id UUID,
    diff JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Unique indexes
CREATE UNIQUE INDEX idx_quizzes_slug ON quizzes(slug);
CREATE UNIQUE INDEX idx_orders_stripe_payment_intent ON orders(stripe_payment_intent);

-- Composite indexes for performance
CREATE INDEX idx_quiz_translations_quiz_lang ON quiz_translations(quiz_id, lang);
CREATE INDEX idx_quiz_questions_quiz_order ON quiz_questions(quiz_id, "order");
CREATE INDEX idx_quiz_prompts_quiz_lang ON quiz_prompts(quiz_id, lang);
CREATE INDEX idx_sessions_quiz_state ON sessions(quiz_id, state);
CREATE INDEX idx_leads_quiz_id ON leads(quiz_id);
CREATE INDEX idx_leads_email ON leads(email);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Updated timestamp triggers
CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON quizzes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_quiz_translations_updated_at BEFORE UPDATE ON quiz_translations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_quiz_questions_updated_at BEFORE UPDATE ON quiz_questions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_quiz_scoring_rules_updated_at BEFORE UPDATE ON quiz_scoring_rules FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_quiz_prompts_updated_at BEFORE UPDATE ON quiz_prompts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_email_events_updated_at BEFORE UPDATE ON email_events FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
