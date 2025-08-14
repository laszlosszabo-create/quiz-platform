# Module 2: Seed Script + Duplikáció

## ✅ Acceptance Checklist

- [x] **seed.ts script létrehozása** - TypeScript-based szkript Supabase-zel
- [x] **ADHD quiz komplett seed data** - 8 kérdés, scoring, translations (HU+EN)
- [x] **Idempotent futtatás** - Meglévő quiz törlése/újralétrehozása
- [x] **Quiz duplikáció API** - POST `/api/admin/quizzes/:id/duplicate` endpoint
- [x] **Key collision handling** - Unique key generálás kérdéseknél
- [x] **Slug collision handling** - Copy suffix automatikus generálás

## 📋 Implementation Details

### Seed Script Features
- **Environment validation** - SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY ellenőrzés
- **Clean database state** - Meglévő ADHD quiz eltávolítása (idempotent)
- **Complete quiz creation** - Quiz + translations + questions + scoring + prompts + product
- **Multi-language support** - Teljes HU/EN fordítások minden elemhez
- **Batch processing** - 50-es csomagokban történő translation insert
- **Success summary** - Quiz URLs és admin link kiírása

### Quiz Duplication API
- **Collision-safe slug generation** - Automatic `-copy-N` suffix handling
- **Question key regeneration** - Unique keys with timestamp + random suffix
- **Translation field_key mapping** - Automatic question translation updates
- **Draft status for copies** - New quizzes start as draft for safety
- **Product deactivation** - Copied products start inactive (no double billing)
- **Stripe ID clearing** - Admin must set new Stripe price IDs

### ADHD Quiz Content
- **8 comprehensive questions** covering core ADHD domains:
  1. Attention span (1-5 scale)
  2. Hyperactivity (4 options)
  3. Impulsivity (4 options)
  4. Organization (1-5 reverse scored)
  5. Time management (4 options)
  6. Emotional regulation (1-5 reverse scored)
  7. Social situations (4 options)
  8. Daily functioning (1-5 scale)

- **Sophisticated scoring system**:
  - Low risk: 8-15 points
  - Medium risk: 16-24 points  
  - High risk: 25-33 points
  - Mixed direct/reverse scoring for balance

- **AI prompts** - Clinical psychologist persona with empathetic, professional tone
- **Product configuration** - 3000 HUF detailed report with multi-language descriptions

## 🚀 Usage

```bash
# Run seed script
cd /Users/suti/Appok/Quiz
npx tsx scripts/seed.ts

# Expected output:
# 🌱 Starting ADHD Quiz seed process...
# ✅ Quiz created: [uuid]
# ✅ Translations created (HU + EN)
# ✅ Questions created (8 questions)
# ✅ Scoring rules created
# ✅ AI prompts created (HU + EN)
# ✅ Product created
# 🎉 Seed completed successfully!
```

```bash
# Duplicate quiz via API
curl -X POST http://localhost:3000/api/admin/quizzes/[quiz-id]/duplicate \
  -H "Authorization: Bearer [admin-token]" \
  -H "Content-Type: application/json" \
  -d '{"slug_suffix": "variant-1"}'

# Response:
# {
#   "success": true,
#   "original_id": "[original-uuid]",
#   "duplicated_id": "[new-uuid]", 
#   "new_slug": "adhd-quick-check-variant-1",
#   "message": "Quiz successfully duplicated"
# }
```

## 📊 Database Impact

**Created records:**
- 1 quiz (`quizzes`)
- 62 translations (`quiz_translations`)
- 8 questions (`quiz_questions`)
- 1 scoring rule (`quiz_scoring_rules`)
- 2 AI prompts (`quiz_prompts`)
- 1 product (`products`)

**Total: 75 database records** for a fully functional quiz

## 🔗 Module Integration

- **Schema Module** ✅ - Uses all 12 tables and RLS policies
- **Public Funnel** 🔄 - Provides quiz data for user interface
- **Stripe + Email** 🔄 - Product configured for payment flow
- **Admin Module** 🔄 - Duplication API for admin interface
- **Guardrails** 🔄 - Draft status and validation hooks ready

## 🎯 Next Steps

Module 3: **Publikus Funnel** - User-facing quiz interface using seeded data
