-- Add user_email and user_name columns if not exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='quiz_sessions' AND column_name='user_email'
  ) THEN
    ALTER TABLE quiz_sessions ADD COLUMN user_email text;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='quiz_sessions' AND column_name='user_name'
  ) THEN
    ALTER TABLE quiz_sessions ADD COLUMN user_name text;
  END IF;
END $$;

-- Backfill user_email from legacy email column where missing
UPDATE quiz_sessions SET user_email = email WHERE user_email IS NULL AND email IS NOT NULL;
