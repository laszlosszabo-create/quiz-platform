-- Adds composite unique index for product_ai_results upsert conflict target
-- Safe to run multiple times (IF NOT EXISTS)
CREATE UNIQUE INDEX IF NOT EXISTS product_ai_results_session_product_lang_idx
  ON product_ai_results (session_id, product_id, lang);
