-- Optional: Install RPC helper to execute arbitrary SQL via PostgREST
-- SECURITY REVIEW REQUIRED before applying in any non-dev environment.
-- This function executes arbitrary SQL passed as text. Restrict usage to service role only.

create or replace function public.exec(sql text)
returns void
language plpgsql
security definer
as $$
begin
  execute sql;
end;
$$;

revoke all on function public.exec(text) from public;
-- Ensure only service role (used by server) can call it via RLS bypass
-- In Supabase, the service role key bypasses RLS; do not expose this to clients.
