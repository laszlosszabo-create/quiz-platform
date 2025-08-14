-- Create quiz_prompts table for AI prompt management
-- This table stores AI prompts for each quiz in multiple languages

CREATE TABLE IF NOT EXISTS quiz_prompts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    lang VARCHAR(5) NOT NULL,
    system_prompt TEXT,
    user_prompt TEXT,
    ai_provider VARCHAR(50) DEFAULT 'openai',
    ai_model VARCHAR(100) DEFAULT 'gpt-4o',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique prompt per quiz/language combination
    UNIQUE(quiz_id, lang)
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_quiz_prompts_quiz_id ON quiz_prompts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_prompts_lang ON quiz_prompts(lang);

-- Row Level Security (RLS) policies
ALTER TABLE quiz_prompts ENABLE ROW LEVEL SECURITY;

-- Admin users can read all prompts
CREATE POLICY "Admin users can read all quiz prompts" ON quiz_prompts
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id::text = auth.uid()::text
        )
    );

-- Admin users can insert prompts
CREATE POLICY "Admin users can insert quiz prompts" ON quiz_prompts
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id::text = auth.uid()::text
            AND role IN ('owner', 'editor')
        )
    );

-- Admin users can update their own prompts
CREATE POLICY "Admin users can update quiz prompts" ON quiz_prompts
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id::text = auth.uid()::text
            AND role IN ('owner', 'editor')
        )
    );

-- Admin users can delete prompts
CREATE POLICY "Admin users can delete quiz prompts" ON quiz_prompts
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id::text = auth.uid()::text
            AND role IN ('owner', 'editor')
        )
    );

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_quiz_prompts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_quiz_prompts_updated_at
    BEFORE UPDATE ON quiz_prompts
    FOR EACH ROW
    EXECUTE PROCEDURE update_quiz_prompts_updated_at();
