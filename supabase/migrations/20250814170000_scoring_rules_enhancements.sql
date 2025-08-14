-- Enhanced scoring rules for Module 6 Translation Management
-- This migration extends the existing quiz_scoring_rules table functionality

-- Add columns for the scoring rules editor if they don't exist
DO $$ 
BEGIN
    -- Check if we need to add columns (in case table structure is different)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'quiz_scoring_rules' 
        AND column_name = 'weights' 
        AND data_type = 'jsonb'
    ) THEN
        -- If the current structure doesn't support our needs, we'll use the weights JSONB field
        RAISE NOTICE 'Using existing quiz_scoring_rules.weights JSONB field for scoring data';
    END IF;
END $$;

-- Ensure proper indexes exist for scoring rules
CREATE INDEX IF NOT EXISTS idx_quiz_scoring_rules_quiz_id ON quiz_scoring_rules(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_scoring_rules_rule_type ON quiz_scoring_rules(rule_type);

-- Update RLS policies for scoring rules
-- Allow admin users to read scoring rules
DROP POLICY IF EXISTS "Allow admin users to read scoring rules" ON quiz_scoring_rules;
CREATE POLICY "Allow admin users to read scoring rules" ON quiz_scoring_rules
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id::text = auth.uid()::text
        )
    );

-- Allow admin users to insert scoring rules
DROP POLICY IF EXISTS "Allow admin users to insert scoring rules" ON quiz_scoring_rules;
CREATE POLICY "Allow admin users to insert scoring rules" ON quiz_scoring_rules
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id::text = auth.uid()::text
        )
    );

-- Allow admin users to update scoring rules
DROP POLICY IF EXISTS "Allow admin users to update scoring rules" ON quiz_scoring_rules;
CREATE POLICY "Allow admin users to update scoring rules" ON quiz_scoring_rules
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id::text = auth.uid()::text
        )
    );

-- Allow admin users to delete scoring rules
DROP POLICY IF EXISTS "Allow admin users to delete scoring rules" ON quiz_scoring_rules;
CREATE POLICY "Allow admin users to delete scoring rules" ON quiz_scoring_rules
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE admin_users.id::text = auth.uid()::text
        )
    );

-- Sample scoring rules for demonstration (optional)
-- You can remove this section if you don't want sample data
/*
INSERT INTO quiz_scoring_rules (quiz_id, rule_type, weights) 
SELECT 
    id as quiz_id,
    'weighted' as rule_type,
    jsonb_build_object(
        'category', 'Introvert',
        'weight', 1.0,
        'min_score', 0,
        'max_score', 50,
        'threshold', 25,
        'result_template', 'Te egy introvertált személyiség vagy! {score} pontot értél el a {category} kategóriában.',
        'description', 'Befelé forduló, csendes, megfontolt személyiség'
    )
FROM quizzes 
WHERE slug = 'personality-test'
AND NOT EXISTS (
    SELECT 1 FROM quiz_scoring_rules 
    WHERE quiz_id = quizzes.id 
    AND weights->>'category' = 'Introvert'
)
LIMIT 1;

INSERT INTO quiz_scoring_rules (quiz_id, rule_type, weights) 
SELECT 
    id as quiz_id,
    'weighted' as rule_type,
    jsonb_build_object(
        'category', 'Extrovert',
        'weight', 1.0,
        'min_score', 51,
        'max_score', 100,
        'threshold', 75,
        'result_template', 'Te egy extrovertált személyiség vagy! {score} pontot értél el a {category} kategóriában.',
        'description', 'Kifelé forduló, társaságkedvelő, energikus személyiség'
    )
FROM quizzes 
WHERE slug = 'personality-test'
AND NOT EXISTS (
    SELECT 1 FROM quiz_scoring_rules 
    WHERE quiz_id = quizzes.id 
    AND weights->>'category' = 'Extrovert'
)
LIMIT 1;
*/
