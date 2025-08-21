-- Alter product_ai_results to store AI metadata (provider/model/tokens/mock/request)
-- Safe to run multiple times with IF NOT EXISTS guards

ALTER TABLE IF EXISTS public.product_ai_results
  ADD COLUMN IF NOT EXISTS provider text,
  ADD COLUMN IF NOT EXISTS model text,
  ADD COLUMN IF NOT EXISTS prompt_tokens integer,
  ADD COLUMN IF NOT EXISTS completion_tokens integer,
  ADD COLUMN IF NOT EXISTS total_tokens integer,
  ADD COLUMN IF NOT EXISTS mocked boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS request_id text,
  ADD COLUMN IF NOT EXISTS metadata jsonb;

-- Hint PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
