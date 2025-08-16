# Database Setup Instructions

## Current Status
- ✅ Supabase project linked: gkmeqvuahoyuxexoohmy  
- ✅ Migrations exist: 20250814120000_initial_schema.sql, 20250814120001_rls_policies.sql
- ❌ Tables not created in remote database yet

## Quick Setup Steps

### Option 1: Manual SQL Execution (Recommended)
1. Open: https://supabase.com/dashboard/project/gkmeqvuahoyuxexoohmy/sql
2. Copy the contents of `scripts/quick-setup.sql`
3. Paste into SQL Editor and execute
4. Run: `npm run seed`

### Option 2: Migration Push (If Docker Available)
```bash
supabase db push
npm run seed
```

### Option 3: Individual Table Creation
If the full SQL fails, create tables one by one:

1. **Extensions & Types** (run first):
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TYPE quiz_status AS ENUM ('draft', 'active', 'archived');
CREATE TYPE question_type AS ENUM ('single', 'multi', 'scale');
CREATE TYPE scoring_rule_type AS ENUM ('sum', 'weighted', 'composite');
CREATE TYPE session_state AS ENUM ('started', 'completed');
```

2. **Core Table** (run second):
```sql
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    status quiz_status NOT NULL DEFAULT 'draft',
    default_lang TEXT NOT NULL DEFAULT 'hu',
    feature_flags JSONB DEFAULT '{}',
    theme JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

3. Then continue with other tables from `scripts/quick-setup.sql`

## Verification
After setup, verify with:
```bash
npm run seed
```

## Test the Application
Once seeded:
- http://localhost:3000/hu/adhd-quick-check (Hungarian)
- http://localhost:3000/en/adhd-quick-check (English)

## Troubleshooting
- **PGRST205 Error**: Tables not created or PostgREST cache issue
- **Migration conflicts**: Use `supabase migration repair`
- **Permission issues**: Check service role key in .env.local
