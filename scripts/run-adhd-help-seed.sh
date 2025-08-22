#!/usr/bin/env bash
set -euo pipefail

# scripts/run-adhd-help-seed.sh
# Safe runner for supabase/seed/adhd_questions_help_only.sql
# Usage:
#  - Preview only: ./scripts/run-adhd-help-seed.sh
#  - Apply (non-interactive): APPLY_SEED=1 ./scripts/run-adhd-help-seed.sh
# This script prefers the `supabase` CLI (supabase db query). If not available,
# it will try to use psql with $DATABASE_URL.

SEED_FILE="supabase/seed/adhd_questions_help_only.sql"
if [ ! -f "$SEED_FILE" ]; then
  echo "ERROR: seed file not found: $SEED_FILE"
  exit 2
fi

echo "Seed file: $SEED_FILE"

# Detect runners
if command -v supabase >/dev/null 2>&1; then
  RUNNER="supabase"
elif command -v psql >/dev/null 2>&1; then
  RUNNER="psql"
else
  RUNNER="none"
fi

echo "Detected runner: $RUNNER"

if [ "$RUNNER" = "none" ]; then
  cat <<-MSG
No supabase CLI or psql found in PATH.
You can either:
  - Install the Supabase CLI and authenticate (https://supabase.com/docs/guides/cli), or
  - Set DATABASE_URL and install psql, or
  - Paste the SQL into the Supabase project SQL editor manually (supabase.io).

To apply automatically once you have an authenticated CLI, rerun this script.
MSG
  exit 3
fi

if [ "${APPLY_SEED:-}" != "1" ]; then
  echo
  echo "DRY-RUN: no changes will be applied. To actually apply the seed set APPLY_SEED=1"
  echo
  echo "---- BEGIN $SEED_FILE ----"
  sed -n '1,200p' "$SEED_FILE"
  echo "----  END  $SEED_FILE ----"
  exit 0
fi

# APPLY_SEED=1 was set — proceed
echo "Applying seed using $RUNNER..."

if [ "$RUNNER" = "supabase" ]; then
  # supabase db query reads SQL from stdin
  supabase db query < "$SEED_FILE"
  STATUS=$?
elif [ "$RUNNER" = "psql" ]; then
  if [ -z "${DATABASE_URL:-}" ]; then
    echo "ERROR: DATABASE_URL is not set. Set it to your Postgres connection string and retry."
    exit 4
  fi
  psql "$DATABASE_URL" -f "$SEED_FILE"
  STATUS=$?
fi

if [ "$STATUS" -eq 0 ]; then
  echo "Seed applied successfully."
else
  echo "Seed runner exited with status $STATUS"
fi
exit $STATUS
