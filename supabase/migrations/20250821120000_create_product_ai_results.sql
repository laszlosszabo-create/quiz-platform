-- Create table for per-product AI results cached per session
-- Ensures simpler SQL queries and consistent email enrichment

-- Enable required extension for UUIDs (Supabase usually has this enabled)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.product_ai_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
  quiz_id uuid NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  lang text NOT NULL DEFAULT 'hu',
  ai_result text NOT NULL,
  generated_at timestamptz NOT NULL DEFAULT NOW(),
  UNIQUE (session_id, product_id, lang)
);

CREATE INDEX IF NOT EXISTS idx_product_ai_results_session ON public.product_ai_results(session_id);
CREATE INDEX IF NOT EXISTS idx_product_ai_results_product ON public.product_ai_results(product_id);
CREATE INDEX IF NOT EXISTS idx_product_ai_results_session_product ON public.product_ai_results(session_id, product_id);

-- Optional: RLS (service role bypasses); enable if needed for client access later
ALTER TABLE public.product_ai_results ENABLE ROW LEVEL SECURITY;

-- Backfill from quiz_sessions.product_ai_results JSON cache (if present)
INSERT INTO public.product_ai_results (session_id, quiz_id, product_id, lang, ai_result, generated_at)
SELECT s.id,
       s.quiz_id,
       (kv.key)::uuid AS product_id,
       COALESCE(kv.value->>'lang', 'hu') AS lang,
       kv.value->>'ai_result' AS ai_result,
       COALESCE((kv.value->>'generated_at')::timestamptz, NOW()) AS generated_at
FROM public.quiz_sessions s
CROSS JOIN LATERAL jsonb_each(COALESCE(s.product_ai_results, '{}'::jsonb)) AS kv
WHERE (kv.value ? 'ai_result')
ON CONFLICT (session_id, product_id, lang) DO NOTHING;

-- Hint PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
