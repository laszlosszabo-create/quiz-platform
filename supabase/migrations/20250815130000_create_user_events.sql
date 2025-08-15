-- Create user_events table for public user tracking
-- This separates user analytics from admin audit logs

CREATE TABLE IF NOT EXISTS public.user_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    user_agent TEXT,
    url TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_user_events_quiz_id ON public.user_events (quiz_id);
CREATE INDEX IF NOT EXISTS idx_user_events_session_id ON public.user_events (session_id);
CREATE INDEX IF NOT EXISTS idx_user_events_event_type ON public.user_events (event_type);
CREATE INDEX IF NOT EXISTS idx_user_events_created_at ON public.user_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_events_quiz_date ON public.user_events (quiz_id, created_at DESC);

-- No RLS needed - this is public tracking data
-- Anyone can insert tracking events, but only admins can read them via API

-- Add comment for documentation
COMMENT ON TABLE public.user_events IS 'Public user tracking events for analytics. Separate from audit_logs which are for admin actions only.';
COMMENT ON COLUMN public.user_events.event_type IS 'Type of event: page_view, quiz_start, answer_select, quiz_complete, email_submitted, etc.';
COMMENT ON COLUMN public.user_events.event_data IS 'Event-specific data like question_key, answer_key, etc.';
COMMENT ON COLUMN public.user_events.user_agent IS 'Browser user agent for analytics';
COMMENT ON COLUMN public.user_events.url IS 'Page URL where event occurred';
COMMENT ON COLUMN public.user_events.ip_address IS 'User IP for analytics (optional, privacy considerations)';
