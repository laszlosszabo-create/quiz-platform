-- Migration: Ensure quiz_sessions has expected columns and refresh PostgREST cache
-- Date: 2025-08-16

-- 1) Ensure columns exist with safe IF checks
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'quiz_sessions' AND column_name = 'scores'
  ) THEN
    ALTER TABLE public.quiz_sessions ADD COLUMN scores JSONB DEFAULT '{}'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'quiz_sessions' AND column_name = 'result_snapshot'
  ) THEN
    ALTER TABLE public.quiz_sessions ADD COLUMN result_snapshot JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- 2) Touch table to update updated_at and hint cache refresh
UPDATE public.quiz_sessions SET updated_at = NOW() WHERE false;

-- 3) PostgREST schema cache reload (works when running inside the Supabase stack)
NOTIFY pgrst, 'reload schema';
