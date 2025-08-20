-- Update email queue schema for better compatibility
-- Created: 2025-08-19

-- Make session_id optional in email_queue (some emails might not be tied to sessions)
ALTER TABLE email_queue 
ALTER COLUMN session_id DROP NOT NULL;

-- Add missing columns for better tracking
ALTER TABLE email_queue 
ADD COLUMN IF NOT EXISTS quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS product_id TEXT,
ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 5;

-- Update indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_queue_quiz_status 
ON email_queue(quiz_id, status, scheduled_at);

CREATE INDEX IF NOT EXISTS idx_email_queue_priority 
ON email_queue(priority DESC, scheduled_at ASC);

COMMENT ON COLUMN email_queue.quiz_id IS 'Quiz ID for the email (for filtering and analytics)';
COMMENT ON COLUMN email_queue.product_id IS 'Product ID if email is product-specific';
COMMENT ON COLUMN email_queue.priority IS 'Email priority (1-10, higher numbers processed first)';
