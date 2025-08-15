-- Refresh PostgREST schema cache for audit_logs
-- Adds a harmless comment and toggles an index to force cache reload

COMMENT ON TABLE audit_logs IS 'Audit logs table - schema cache refresh 2025-08-15';

-- Toggle an index (drop/create) to force refresh
DROP INDEX IF EXISTS idx_audit_logs_created_at;
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs (created_at DESC);

-- Notify PostgREST to reload schema (if event triggers are honored)
SELECT pg_notify('pgrst', 'reload schema');
