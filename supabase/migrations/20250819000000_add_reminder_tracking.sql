-- Add reminder tracking to quiz_sessions
-- Created: 2025-08-19

ALTER TABLE quiz_sessions 
ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMPTZ;

-- Create index for reminder queries
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_reminder_tracking 
ON quiz_sessions(status, completed_at, reminder_sent_at, user_email);

COMMENT ON COLUMN quiz_sessions.reminder_sent_at IS 'Timestamp when reminder email was sent to user';
