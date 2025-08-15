-- Row Level Security Policies
-- Migration: 20250814120001_rls_policies
-- Description: Implement RLS policies for secure data access

-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================

ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_scoring_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- HELPER FUNCTIONS FOR RLS
-- =====================================================

-- Check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    -- In production this will check authenticated admin user
    -- For now, allow service role access
    RETURN auth.role() = 'service_role' OR 
           EXISTS (
               SELECT 1 FROM admin_users 
               WHERE email = auth.email() 
               AND role IN ('owner', 'editor')
           );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if current user is viewer or higher
CREATE OR REPLACE FUNCTION is_admin_viewer()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.role() = 'service_role' OR 
           EXISTS (
               SELECT 1 FROM admin_users 
               WHERE email = auth.email() 
               AND role IN ('owner', 'editor', 'viewer')
           );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get current client token (placeholder for future implementation)
CREATE OR REPLACE FUNCTION current_client_token()
RETURNS TEXT AS $$
BEGIN
    -- This will be implemented in funnel module
    -- For now return NULL to disable session access
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- QUIZZES POLICIES
-- =====================================================

-- Public read access to active quizzes (limited fields)
CREATE POLICY quizzes_public_select ON quizzes
    FOR SELECT
    USING (status = 'active');

-- Admin full access
CREATE POLICY quizzes_admin_all ON quizzes
    FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- =====================================================
-- QUIZ_TRANSLATIONS POLICIES
-- =====================================================

-- Public read access to translations for active quizzes
CREATE POLICY quiz_translations_public_select ON quiz_translations
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM quizzes 
            WHERE quizzes.id = quiz_translations.quiz_id 
            AND quizzes.status = 'active'
        )
    );

-- Admin full access
CREATE POLICY quiz_translations_admin_all ON quiz_translations
    FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- =====================================================
-- QUIZ_QUESTIONS POLICIES
-- =====================================================

-- Public read access to questions for active quizzes
CREATE POLICY quiz_questions_public_select ON quiz_questions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM quizzes 
            WHERE quizzes.id = quiz_questions.quiz_id 
            AND quizzes.status = 'active'
        )
    );

-- Admin full access
CREATE POLICY quiz_questions_admin_all ON quiz_questions
    FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- =====================================================
-- QUIZ_SCORING_RULES POLICIES
-- =====================================================

-- Public read access to scoring rules for active quizzes
CREATE POLICY quiz_scoring_rules_public_select ON quiz_scoring_rules
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM quizzes 
            WHERE quizzes.id = quiz_scoring_rules.quiz_id 
            AND quizzes.status = 'active'
        )
    );

-- Admin full access
CREATE POLICY quiz_scoring_rules_admin_all ON quiz_scoring_rules
    FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- =====================================================
-- QUIZ_PROMPTS POLICIES
-- =====================================================

-- Admin and service role read access only (contains AI prompts)
CREATE POLICY quiz_prompts_admin_select ON quiz_prompts
    FOR SELECT
    USING (is_admin_viewer());

-- Admin full access
CREATE POLICY quiz_prompts_admin_all ON quiz_prompts
    FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- =====================================================
-- LEADS POLICIES
-- =====================================================

-- Public insert with limited validation (email gate)
CREATE POLICY leads_public_insert ON leads
    FOR INSERT
    WITH CHECK (
        email IS NOT NULL 
        AND email ~ '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'
        AND quiz_id IS NOT NULL
    );

-- Admin full access
CREATE POLICY leads_admin_all ON leads
    FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- =====================================================
-- QUIZ_SESSIONS POLICIES
-- =====================================================

-- Public insert/update based on client token (future implementation)
-- For now, allow public insert for anonymous sessions
CREATE POLICY sessions_public_insert ON quiz_sessions
    FOR INSERT
    WITH CHECK (quiz_id IS NOT NULL);

-- Public update own session (placeholder - will be refined in funnel module)
CREATE POLICY sessions_public_update ON quiz_sessions
    FOR UPDATE
    USING (
        -- Future: client_token = current_client_token() OR
        lead_id IS NULL  -- Allow anonymous session updates for now
    )
    WITH CHECK (
        -- Future: client_token = current_client_token() OR  
        lead_id IS NULL  -- Allow anonymous session updates for now
    );

-- Admin full access
CREATE POLICY sessions_admin_all ON quiz_sessions
    FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- =====================================================
-- PRODUCTS POLICIES
-- =====================================================

-- Public read access to active products (limited fields)
CREATE POLICY products_public_select ON products
    FOR SELECT
    USING (
        active = true AND
        EXISTS (
            SELECT 1 FROM quizzes 
            WHERE quizzes.id = products.quiz_id 
            AND quizzes.status = 'active'
        )
    );

-- Admin full access
CREATE POLICY products_admin_all ON products
    FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- =====================================================
-- ORDERS POLICIES
-- =====================================================

-- Admin and service role access only
CREATE POLICY orders_admin_all ON orders
    FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- =====================================================
-- EMAIL_EVENTS POLICIES
-- =====================================================

-- Admin and service role access only
CREATE POLICY email_events_admin_all ON email_events
    FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- =====================================================
-- ADMIN_USERS POLICIES
-- =====================================================

-- Admin access only
CREATE POLICY admin_users_admin_all ON admin_users
    FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- =====================================================
-- AUDIT_LOGS POLICIES
-- =====================================================

-- Read-only access for admins
CREATE POLICY audit_logs_admin_select ON audit_logs
    FOR SELECT
    USING (is_admin_viewer());

-- Insert access for admin actions
CREATE POLICY audit_logs_admin_insert ON audit_logs
    FOR INSERT
    WITH CHECK (is_admin());
