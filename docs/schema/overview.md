# Database Schema Overview

## Scope

A Quiz Platform MVP adatbázis sémája 12 táblából áll, teljes többnyelvűség (i18n) támogatással, optimalizált indexekkel és szigorú Row Level Security (RLS) szabályokkal.

### Core Requirements
- **12 tábla** a teljes quiz rendszerhez
- **Többnyelvű tartalom** quiz_translations táblán keresztül
- **Quiz ID alapú szeparáció** minden adatnál
- **Optimalizált indexek** gyors lekérésekhez
- **RLS policies** biztonságos adateléréshez

## Entity-k és kapcsolatok

### Core Entities
- **quizzes** - Fő quiz entitás (slug, status, theme, feature_flags)
- **quiz_translations** - Többnyelvű tartalom (field_key alapú)
- **quiz_questions** - Kérdések pontozási logikával
- **quiz_scoring_rules** - Pontozási szabályok és thresholdok
- **quiz_prompts** - AI prompt sablonok nyelvenkét

### User Journey Entities  
- **leads** - Felhasználói adatok (email, demographics, utm)
- **sessions** - Quiz kitöltési folyamat és állapot
- **products** - Értékesíthető termékek
- **orders** - Megrendelések Stripe integrációval
- **email_events** - E-mail kampány események

### Admin Entities
- **admin_users** - Adminisztrátori felhasználók
- **audit_logs** - Változtatások naplózása

### Key Relationships
- Minden quiz-specifikus tábla **quiz_id** FK-val kapcsolódik
- **Cascade delete** translations, questions, prompts esetén
- **Lead → Sessions → Orders** user journey lánc
- **Foreign keys** minden kapcsolathoz integritás biztosítására

## Migrations futtatás menete

### Local Development
```bash
# Supabase indítása
supabase start

# Migrációk futtatása
supabase db reset

# Új migráció létrehozása
supabase migration new 20250814120000_initial_schema

# Migráció futtatása
supabase db reset
```

### Naming Convention
- **Format**: `YYYYMMDDHHMMSS_description`
- **Example**: `20250814120000_initial_schema.sql`
- **Description**: Rövid, beszédes leírás angol nyelven

## Rollback/Redo parancsok

### Local Environment
```bash
# Teljes reset (dev adatok elvesznek)
supabase db reset

# Specifikus migráció visszavonása
# (manuális rollback SQL futtatása szükséges)

# Fresh start
supabase stop
supabase start
supabase db reset
```

### Production Considerations
- **Rollback tervek** minden breaking change-hez
- **Backup** stratégia kritikus adatokhoz  
- **Schema versioning** és kompatibilitás figyelése

## Next Steps
1. Enum típusok definálása
2. Táblák létrehozása indexekkel
3. RLS policies implementálása
4. Seed data előkészítése
