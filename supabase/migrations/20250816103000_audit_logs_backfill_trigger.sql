-- Phase A (compat): Backfill/compat trigger for mixed audit_logs schemas (2025-08-16)

-- Ensure canonical columns exist
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS action TEXT;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS details JSONB;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS user_email TEXT;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS resource_type TEXT;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS resource_id TEXT;

-- Optional legacy columns (from older quick/minimal setups)
-- event_name TEXT NOT NULL
-- data JSONB DEFAULT '{}'

-- Create a BEFORE INSERT trigger to map canonical → legacy when legacy columns exist
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'audit_logs' AND column_name = 'event_name'
  ) THEN
    CREATE OR REPLACE FUNCTION public.audit_logs_canonical_backfill()
    RETURNS trigger AS $$
    BEGIN
      -- Map action → event_name (to satisfy NOT NULL on some envs)
      IF NEW.event_name IS NULL THEN
        NEW.event_name := COALESCE(NEW.action, NEW.event_name);
      END IF;

      -- Map details → data for backward compatibility
      IF NEW.data IS NULL THEN
        NEW.data := COALESCE(NEW.details, '{}'::jsonb);
      END IF;

      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Create trigger if not exists
    IF NOT EXISTS (
      SELECT 1 FROM pg_trigger WHERE tgname = 'trg_audit_logs_canonical_backfill'
    ) THEN
      CREATE TRIGGER trg_audit_logs_canonical_backfill
      BEFORE INSERT ON public.audit_logs
      FOR EACH ROW EXECUTE FUNCTION public.audit_logs_canonical_backfill();
    END IF;

    -- One-time backfill for existing rows
    UPDATE public.audit_logs
      SET event_name = COALESCE(event_name, action),
          data = COALESCE(data, details, '{}'::jsonb)
      WHERE event_name IS NULL OR data IS NULL;
  END IF;
END$$;

-- Refresh PostgREST schema cache to pick up changes
NOTIFY pgrst, 'reload schema';

COMMENT ON FUNCTION public.audit_logs_canonical_backfill() IS 'Backfills legacy audit_logs columns from canonical fields on insert.';
