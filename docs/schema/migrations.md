# Database Migrations Guide

## Overview

A Quiz Platform adatbázis migrációk Supabase CLI-n keresztül kezeltek, verziókövetett SQL fájlokkal.

## Migration Files

### Current Migrations

#### 20250814120000_initial_schema.sql
- **Méret**: ~15KB SQL
- **Tartalom**: 
  - 8 enum típus létrehozása
  - 12 tábla teljes szerkezettel
  - Indexek és unique constraints
  - Updated timestamp triggerek
- **Funkciók**: Base schema minden entitással

#### 20250814120001_rls_policies.sql  
- **Méret**: ~8KB SQL
- **Tartalom**:
  - RLS bekapcsolása minden táblára
  - Helper függvények (is_admin, is_admin_viewer)
  - Táblánkénti policy definíciók
  - Role-based hozzáférési szabályok
- **Funkciók**: Teljes biztonsági modell

## Local Development Workflow

### Initial Setup
```bash
# Supabase CLI telepítése (ha nincs)
npm install -g @supabase/cli

# Projekt inicializálása
supabase init

# Helyi Supabase indítása
supabase start
```

### Migration Commands

#### Reset Database (Fresh Start)
```bash
# Teljes adatbázis reset
supabase db reset

# Ez futtatja:
# 1. Minden migráció drop-olása
# 2. Migrációk újrafuttatása sorrendben
# 3. Seed adatok betöltése (ha van)
```

#### New Migration Creation
```bash
# Új migráció létrehozása
supabase migration new "description_of_change"

# Példa:
supabase migration new "add_webhook_events_table"
```

#### Migration Status Check
```bash
# Alkalmazott migrációk listázása
supabase migration list

# Pending migrációk mutatása
supabase db diff --file=<filename>
```

### File Naming Convention

**Format**: `YYYYMMDDHHMMSS_description.sql`

**Examples**:
- `20250814120000_initial_schema.sql`
- `20250814120001_rls_policies.sql`  
- `20250814130000_add_webhook_events.sql`
- `20250814140000_update_quiz_scoring.sql`

## Migration Development Process

### Step-by-Step Workflow

1. **Create Migration File**
   ```bash
   supabase migration new "feature_description"
   ```

2. **Write SQL Changes**
   ```sql
   -- Add your schema changes
   CREATE TABLE new_table (...);
   ALTER TABLE existing_table ADD COLUMN new_field;
   ```

3. **Test Migration**
   ```bash
   # Reset to test from clean state
   supabase db reset
   
   # Check for errors in migration
   supabase db diff
   ```

4. **Verify Schema**
   ```bash
   # Check applied migrations
   supabase migration list
   
   # Verify table structure
   supabase db diff --schema
   ```

## Rollback Strategies

### Local Environment

#### Full Rollback (Nuclear Option)
```bash
# Teljes reset - MINDEN ADAT ELVÉSZ
supabase stop
supabase start  
supabase db reset
```

#### Manual Rollback
```sql
-- Kézi rollback SQL írása
-- Például: DROP TABLE ha CREATE TABLE volt
-- Vagy: ALTER TABLE DROP COLUMN ha ADD COLUMN volt

-- Rollback migráció futtatása
supabase db reset --file=rollback_migration.sql
```

### Production Considerations

#### Migration Safety Checklist
- [ ] **Backward Compatibility**: Új mezők nullable-ek
- [ ] **No Data Loss**: DROP műveletek helyett ALTER  
- [ ] **Index Performance**: Nagy táblák indexelése háttérben
- [ ] **Rollback Plan**: Minden breaking change-hez rollback SQL

#### Production Rollback Strategy
```sql
-- Rollback template minden migrációhoz
-- File: rollback_20250814120000_initial_schema.sql

-- DROP tables in reverse dependency order
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS admin_users;
-- ... continue in reverse order

-- DROP functions
DROP FUNCTION IF EXISTS update_updated_at_column();

-- DROP enums
DROP TYPE IF EXISTS admin_role;
-- ... continue with all enums
```

## Environment-Specific Commands

### Local Development
```bash
# Start local Supabase
supabase start

# Apply migrations to local
supabase db reset

# Generate types for TypeScript
supabase gen types typescript --local > src/types/database.ts
```

### Production Deployment
```bash
# Link to production project
supabase link --project-ref <your-project-ref>

# Push migrations to production
supabase db push

# Generate types for production
supabase gen types typescript > src/types/database.ts
```

## Troubleshooting

### Common Issues

#### Migration Failed
```bash
# Error details
supabase db reset --debug

# Manual fix options:
# 1. Fix SQL syntax in migration file
# 2. Delete problematic migration
# 3. Create corrective migration
```

#### Dependency Conflicts  
```sql
-- Check foreign key dependencies
SELECT tc.table_name, kcu.column_name, rc.table_name AS foreign_table_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.referential_constraints rc ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY';
```

#### RLS Policy Errors
```sql
-- Test policies manually
SET ROLE anon;
SELECT * FROM quizzes;  -- Should only return active

SET ROLE service_role;  
SELECT * FROM quizzes;  -- Should return all
```

## Backup & Recovery

### Local Backup
```bash
# Export current schema
pg_dump -h localhost -p 54322 -U postgres postgres > backup.sql

# Restore from backup
psql -h localhost -p 54322 -U postgres postgres < backup.sql
```

### Production Backup
```bash
# Supabase automatic backups are enabled
# Manual backup via dashboard or CLI
supabase db dump --data-only > data_backup.sql
```

## Next Steps

1. **Schema Validation**: RLS policies tesztelése
2. **Type Generation**: TypeScript típusok generálása  
3. **Seed Data**: Test adatok létrehozása
4. **Documentation**: Schema changes tracking CHANGELOG-ban
