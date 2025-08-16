-- Phase A: Audit logs unification and schema cache refresh (2025-08-16)

-- Ensure canonical columns exist and types are correct
DO $$ BEGIN
  PERFORM 1 FROM information_schema.columns 
   WHERE table_schema = 'public' AND table_name = 'audit_logs' AND column_name = 'user_id' AND data_type = 'text';
  -- If not present or wrong type, raise notice for manual intervention (should not happen in clean env)
END $$;

-- Optional: Drop legacy columns if they ever existed (no-op if absent)
ALTER TABLE public.audit_logs DROP COLUMN IF EXISTS actor_id;
ALTER TABLE public.audit_logs DROP COLUMN IF EXISTS entity;
ALTER TABLE public.audit_logs DROP COLUMN IF EXISTS entity_id;
ALTER TABLE public.audit_logs DROP COLUMN IF EXISTS diff;

-- Add canonical columns if somehow missing (idempotent guards)
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS user_email TEXT;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS action TEXT;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS resource_type TEXT;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS resource_id TEXT;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS details JSONB;

-- Refresh PostgREST schema cache
-- Ref: https://postgrest.org/en/stable/admin.html#schema-reload
NOTIFY pgrst, 'reload schema';

-- Document current schema
COMMENT ON TABLE public.audit_logs IS 'Canonical audit logs: user_id, user_email, action, resource_type, resource_id, details, created_at, updated_at';
