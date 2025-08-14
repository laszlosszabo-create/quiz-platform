# Seed Script + Duplication Module Overview

## Scope

A Seed + Duplikáció modul célja egy komplett minta ADHD quiz létrehozása HU+EN nyelveken, valamint egy adminból elérhető quiz duplikálási funkció implementálása.

### Core Requirements
- **Minta ADHD quiz** teljes tartalommal (8 kérdés)
- **Kétnyelvű tartalom** (HU alapnyelv + EN fordítás)
- **Idempotens seed script** (`npm run seed`)
- **Quiz duplikálás API** új slug és question key generálással
- **Adatütközés elkerülése** minden duplikáció esetén

## Seed Script részletei

### Quiz tartalom
- **Slug**: `adhd-quick-check`
- **Status**: `active` (azonnal tesztelhető)
- **Default lang**: `hu`
- **8 kérdés**: Mix single choice + scale típusok
- **Scoring**: Egyszerű sum alapú low/medium/high kategóriák
- **AI prompt**: HU+EN rendszer és user prompt sablonok

### Feature flags és theme
```json
{
  "feature_flags": {
    "email_gate_position": "end",
    "ai_result_enabled": true,
    "layout_version": 1
  },
  "theme": {
    "primary_color": "#3B82F6",
    "secondary_color": "#10B981", 
    "logo_url": "https://placeholder.example.com/logo.png",
    "hero_image_url": "https://placeholder.example.com/hero.jpg",
    "calendly_url": "https://calendly.com/demo-account"
  }
}
```

### Termék konfiguráció
- **Price**: 3000 HUF (30 EUR)
- **Delivery**: `static_pdf`
- **Asset URL**: Demo PDF link
- **Translations**: HU+EN terméknév és leírás

## Duplikálás logika

### API Endpoint
- **Route**: `POST /api/admin/quizzes/:id/duplicate`
- **Auth**: Owner/Editor role szükséges
- **Input**: `source_quiz_id`, opcionális `new_slug`
- **Output**: `new_quiz_id`, `new_slug`

### Másolandó entitások
1. **quizzes** → új ID, slug, default status: draft
2. **quiz_translations** → új quiz_id-val
3. **quiz_questions** → új quiz_id + új question key-k
4. **quiz_scoring_rules** → új quiz_id
5. **quiz_prompts** → új quiz_id  
6. **products** → új ID, stripe_price_id NULL

### Nem másolandók
- `leads`, `sessions`, `orders`, `email_events` (quiz-specifikus adatok)
- `admin_users`, `audit_logs` (globális entitások)

## Key Generation Strategy

### Slug collision handling
- Base slug: `original-slug`
- Collision: `original-slug-copy-{timestamp}`
- Format: `YYYYMMDD-HHMMSS`

### Question key regeneration
- Original: `attention_span`, `hyperactivity`
- New: `attention_span-{shortId}`, `hyperactivity-{shortId}`
- ShortId: 8 karakteres random string

### Stripe price_id reset
- Eredeti termék `stripe_price_id` másolás után `NULL`
- Admin manuálisan állítja be új Stripe price-t
- Megelőzi bevétel keveredést

## Technical Implementation

### Seed Script (`scripts/seed.ts`)
- TypeScript script tsx futtatóval
- Supabase service role client
- Idempotens: létező quiz törlése → újra létrehozás
- Console output: Generated URLs és summary

### Duplication API
- Zod input validation
- Transactional operations (rollback on failure)
- Audit log entry minden duplikálásról
- Error handling és részletes hibaüzenetek

### Database Safety
- Foreign key constraints betartása
- Unique constraint violations kezelése
- Cascade delete tiszta orphan cleanup

## Next Steps
1. ADHD quiz tartalom generálása
2. Seed script implementáció
3. Duplikálás API és logika
4. Admin UI integration (későbbi modulban)
5. E2E tesztelés seed → duplikálás → cleanup
