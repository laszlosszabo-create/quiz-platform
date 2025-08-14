# Quiz Platform - Változásnapló

Minden jelentős változás dokumentálva ebben a fájlban.

A formátum a [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) alapján készült.

## [Unreleased]

### 🎯 In Progress
- Seed script és duplikációs funkció fejlesztés

### 📋 Planned Modules
2. [Seed + Duplikáció] - Minta adatok és quiz duplikálás  
3. [Publikus Funnel] - Felhasználói oldal és tracking
4. [Stripe + E-mail] - Fizetés és kommunikáció
5. [Admin Panel] - Tartalomkezelő felület
6. [Guardrails + i18n] - Biztonság és nyelvesítés

---

## [0.2.0] - 2025-08-14

### ✅ Added - Schema + RLS Module
- **Database Schema**: 12 tábla teljes quiz rendszerhez
  - Core entities: quizzes, quiz_translations, quiz_questions
  - User journey: leads, sessions, products, orders, email_events
  - Admin: admin_users, audit_logs
- **Enum Types**: 8 controlled vocabulary (quiz_status, question_type, stb.)
- **Indexes**: Composite indexek quiz_id alapú teljesítményhez
- **RLS Policies**: Role-based security (public/admin/service)
- **Helper Functions**: is_admin(), is_admin_viewer() policy supporthoz

### 🔧 Technical Implementation
- **Migrations**: Supabase migrations 2 fájlban (schema + RLS)
- **TypeScript Types**: Database interface generálva
- **Foreign Keys**: CASCADE delete translations/questions-höz
- **Unique Constraints**: slug, stripe_payment_intent business rules

### 📚 Documentation - Schema Module
- **overview.md**: Scope, entities, migration workflow
- **er-diagram.md**: Teljes kapcsolati diagram ASCII formátumban
- **policies.md**: RLS szabályok táblánként SQL példákkal
- **migrations.md**: Migration parancsok és troubleshooting
- **field-keys-i18n.md**: 200+ i18n kulcs konvenció
- **acceptance.md**: Validation checklist és limitációk

### 🔒 Security Features
- Quiz ID szeparáció minden quiz-specific adatnál
- Row Level Security minden táblán
- Admin role checking (owner/editor/viewer)
- Public insert csak email gate és anonymous sessions
- Service role hozzáférés webhook/automation számára

### 🏗️ Database Structure
```
12 táblák → 8 enum → indexek → RLS policies → helper functions
quizzes (core) → translations (i18n) → questions → scoring → prompts
leads → sessions → products → orders → email_events
admin_users → audit_logs
```

---

## [0.1.0] - 2025-08-14

### ✅ Added
- Next.js 15 projekt scaffolding TypeScript-tel
- Tailwind CSS konfiguráció
- ESLint beállítások
- Alapvető könyvtárstruktúra
- Environment változók template (.env.example)
- Git konfiguráció és .gitignore
- README.md projekt dokumentációval
- Függőségek telepítése:
  - Next.js, React, TypeScript
  - Supabase client
  - Stripe SDK
  - Resend email
  - Zod validáció
  - OpenAI API
  - Playwright testing

### 🔧 Technical Details
- **Framework**: Next.js 15 App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Package Manager**: npm
- **Project Structure**: src/ könyvtár App Router-rel

### 📚 Documentation
- Projekt README.md elkészítve
- CHANGELOG.md inicializálva
- .github/copilot-instructions.md létrehozva

---

## Konfigurációs jegyzetek

### Git Workflow
- Konvencionális commit üzenetek használata
- Feature branch → main squash merge
- Minden modul után dokumentáció frissítés

### Követendő commit formátum
- `feat(module): description` - új funkció
- `fix(module): description` - hibajavítás  
- `docs(module): description` - dokumentáció
- `refactor(module): description` - refaktorálás
- `test(module): description` - tesztek
