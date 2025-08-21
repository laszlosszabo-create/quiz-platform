## [1.0.0] - 2025-08-18 - 🎯 MASTER BRIEF COMPLETE

**Commit Hash**: `latest` ✅  
**Status**: Master Brief Modul 8 - COMPLETE

### 🏁 Module 8: Edge Cases + Final QA - COMPLETE
- **Edge Case Master Checklist**: 27/28 checks PASS ✅
  - ✅ Duplikáció: Question keys + slug collision handling
  - ✅ I18n fallback: HU/EN translations with default_lang fallback  
  - ✅ AI fallback: Static scoring rules ready
  - ✅ Stripe idempotency: payment_intent uniqueness
  - ✅ Rate limit + validation: Middleware and Zod schemas
  - 🟡 Products CRUD audit logging → Sprint 1

- **Products Editor E2E Validation**: PASS ✅
  - ✅ Full CRUD cycle validated (Create/Read/Update/Delete)
  - ✅ POST→GET and PUT→GET data consistency confirmed
  - ✅ Admin list integration working

- **Production Deployment Ready**: ✅
  - ✅ Environment variables documented
  - ✅ Rollout/Rollback runbook complete
  - ✅ Go-Live checklist: 5/5 validation points PASS

### 🎯 Master Brief Status
- **8/8 Modules Complete**: ✅ ALL DONE
- **System Status**: Production Ready
- **Next Phase**: Design-skin prompt preparation

## 2025-08-16

- Kick off Phase 0 diagnostics for AI Prompts POST 500.
- Added x-debug gated detailed error payloads to admin AI Prompts API (POST/PUT/DELETE).
- Added scripts:
  - `scripts/inspect-table-quiz-ai-prompts.js` to inventory columns/constraints/triggers.
  - `scripts/insert-probe-quiz-ai-prompts.js` to run direct service-role insert and log exact DB error.
- Updated CRUD smoke test to pass `x-debug: true` and print full error bodies on failures.

### Admin AI Prompt Test Improvements
- Editor test button updated to send canonical `ai_prompt` and validate required fields
- Rich client-side error reporting (shows missing fields and server error text)
- `/api/admin/ai-prompts/openai-test` endpoint now supports both `ai_prompt` and legacy `user_prompt`
- System prompt is optional for tests; only user prompt is required
- If `OPENAI_API_KEY` is missing, endpoint returns a mocked response for local testing (200)

# Quiz Platform - Változásnapló

## [Docs] 2025-08-15 – AI Prompts Canonicalization (Option 1)

### 📚 Documentation
- Added `docs/admin/ai-prompts-canonicalization.md` detailing the canonical single-column `ai_prompt` approach, API contract, types, UI, and migration path.
- Updated `docs/admin/quiz-editor-issues.md` with Option 1 approval and next steps.

### 🔧 Validation
- Adjusted `src/lib/zod-schemas.ts` to validate `ai_prompt` and required variables; PUT accepts optional `id` to support conflict-upsert behavior.

Notes: Implementation will follow in a subsequent commit after docs-first checkpoint.

Minden jelentős változás dokumentálva ebben a fájlban.

A formátum a [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) alapján készült.

## [Unreleased]

### 🎯 In Progress
- Module 6: Products Editor - Advanced admin tools

### 🐛 Fixed - 2025-08-21
- Quiz AI timeout → 500 helyett 200-as score-only fallback + e-mail trigger (jobb UX)
- Modellhasználat egységesítése env alapon: `OPENAI_CHAT_MODEL` (alap: gpt-4.1-mini)
- Dev szerver log-zaj csökkentés: `/.well-known/appspecific/com.chrome.devtools.json` → 204

### 📚 Docs
- `docs/AI_TIMEOUT_FALLBACK_20250821.md` – részletek a fallbackról, konfigokról és tesztelésről

## [0.6.4] - 2025-08-15

**Commit Hash**: `72f072d` ✅  
**Status**: AI & Tracking System Fixes - COMPLETE

### 🐛 Fixed
- **AI Result Generation 404 Error**: Fixed missing AI API endpoint functionality
  - Updated `src/app/api/ai/generate-result/route.ts` to use centralized Supabase configuration
  - Replaced old `@/lib/supabase` import with `getSupabaseAdmin()` from `@/lib/supabase-config`
  - AI endpoint now returns 200 status with 2-3 second response times
  - Full caching functionality restored for repeated requests

- **Missing Result Page Translations**: Added 9 critical translation keys to database
  - `result_headline`: "Az Ön eredménye"
  - `result_sub`: "Az ADHD kvíz alapján az alábbi eredményt kaptuk:"
  - `result_ai_loading`: "AI elemzés generálása..."
  - `result_product_headline`: "Ajánlott termék" 
  - `result_product_cta`: "Termék megtekintése"
  - `result_booking_headline`: "Foglaljon konzultációt"
  - `result_booking_cta`: "Időpont foglalása"
  - `result_static_low`: "Alacsony ADHD kockázat"
  - `result_low_description`: Complete low-risk result description
  - Console translation warnings reduced from 9 to 0

### 🔧 Technical Improvements
- **Centralized Supabase Configuration**: Enforced usage of singleton pattern across AI endpoints
- **Translation Coverage**: Complete result page translation coverage (15/15 keys)
- **Error Reduction**: Eliminated all console translation warnings on result page
- **Performance**: AI result generation latency optimized to 2-3 seconds

### 📋 Key Changes
- `/src/app/api/ai/generate-result/route.ts` - Fixed Supabase import and client initialization
- Database: Added 9 missing `result_*` translation keys for ADHD quiz
- `AI_TRACKING_FIXES_20250815.md` - Comprehensive patch documentation with testing results

### 🧪 Testing Results
- AI API endpoint: 404 → 200 ✅
- Result page UX: `[field_key]` placeholders → Hungarian text ✅
- Console errors: 9 warnings → 0 warnings ✅  
- Translation coverage: 6/15 → 15/15 keys ✅
- Cache functionality: Broken → Working ✅

## [0.6.3] - 2025-08-15

**Commit Hash**: `851a403` ✅  
**Status**: AI Prompts Editor CRUD - COMPLETE

### ✨ Added
- **AI Prompts Editor CRUD véglegesítés**: Complete CRUD functionality for AI prompt management
  - Full API endpoints (GET/POST/PUT/DELETE) with Zod validation
  - Role-based authorization (owner/editor only for modifications)
  - Required template variables validation (`{{scores}}`, `{{top_category}}`, `{{name}}`)
  - Multi-language support (HU/EN) with isolated prompt management
  - Real-time error handling with user-friendly validation messages
  - Complete audit logging with before/after diff tracking
  - OpenAI test endpoint integration for prompt validation
  - Comprehensive documentation and acceptance testing

### 🔧 Technical Improvements  
- **Zod Schema Integration**: Comprehensive input validation across all CRUD operations
- **Enhanced Error Handling**: Structured error responses with field-specific messages
- **Audit Trail Enhancement**: Detailed before/after change tracking for prompts
- **Type Safety**: Full TypeScript integration with proper interfaces and validation

### 📋 Key Changes
- `/src/lib/zod-schemas.ts` - New validation schemas for AI prompts
- `/src/app/admin/components/ai-prompts-editor.tsx` - Enhanced error handling
- `/src/app/api/admin/ai-prompts/route.ts` - Complete CRUD API implementation
- `/docs/admin/ai-prompts.md` - Comprehensive documentation and acceptance results
- `/test-ai-prompts-crud.js` - Automated testing script

### 📚 Documentation
- Added comprehensive `/docs/admin/ai-prompts.md` with API specs and testing guides
- Updated troubleshooting documentation for common AI prompts issues
- Enhanced acceptance criteria documentation with validation checklists

### 📋 Planned Modules
4. [Stripe + E-mail] - Fizetés és kommunikáció
5. [Admin Panel] - Tartalomkezelő felület
6. [Guardrails + i18n] - Biztonság és nyelvesítés

---

## [0.6.2] - 2025-08-14

### ✅ Added
- **Scoring Rules Editor almódúl** - Teljes kategória-alapú pontozási rendszer
- **Category-based Scoring System** - Pontozási kategóriák és súlyozás
- **Threshold Management** - Küszöbértékek beállítása eredményekhez
- **Result Templates** - Dinamikus eredmény template-ek változókkal
- **Weight System** - Scoring súlyozási rendszer (0.1-10x multipliers)
- **Validation System** - Duplikált kategóriák és boundary ellenőrzés

### 🔧 Enhanced
- **Quiz Editor Tabs** - Scoring Rules tab hozzáadva
- **UI Components** - Shadcn/ui teljes component library
- **Database Migration** - Enhanced scoring rules with RLS policies
- **Admin Interface** - Tab-based navigation továbbfejlesztve

### 📚 Technical
- **JSONB Storage** - Flexible scoring data structure
- **Component Architecture** - Extended scoring rule interface
- **API Integration** - Audit logging for scoring operations
- **Responsive Design** - Mobile-friendly scoring rule editor

## [0.6.1] - 2025-08-14

### ✅ Added
- **Questions Editor almódúl** - Teljes CRUD funkciók quiz kérdésekhez
- **Drag & Drop Reordering** - @hello-pangea/dnd integráció
- **Question Validation** - 5-20 kérdés limit ellenőrzés
- **Audit Logging System** - Admin műveletek nyomon követése
- **API Route Architecture** - Client-server kommunikáció audit logokhoz

### 🔧 Fixed
- **Multiple GoTrueClient Warning** - Singleton pattern implementálása
- **Client-Server Import Conflicts** - Proper separation of concerns
- **Import/Export Mismatches** - Consistent module exports
- **Component Architecture** - React optimization with useMemo

### 📚 Documentation
- **TROUBLESHOOTING.md** - Comprehensive error handling guide
- **QUICK_FIX_REFERENCE.md** - Quick reference for common issues
- **MODULE6_PROGRESS.md** - Detailed implementation progress
- **Architecture Best Practices** - Client/server separation patterns

### 🎯 Technical Improvements
- Supabase client architecture refactor
- Enhanced error handling and validation
- Production-ready Questions Editor component
- Audit logging infrastructure

## [0.3.0] - 2025-08-14

### ✅ Added - Module 3: Public Funnel
- **Landing Page** (`/[lang]/[quizSlug]`):
  - Server-side rendering with quiz translations
  - Multi-language support (HU/EN) with fallbacks
  - Theme integration (logo, hero, colors)
  - CTA and page view tracking
  - Social proof sections from DB translations

- **Quiz Page** (`/[lang]/[quizSlug]/quiz`):
  - Step-by-step question renderer with progress bar
  - Support for single/multi/scale question types
  - Session management with client tokens
  - Autosave every 2 questions to sessions table
  - Email gate with configurable positioning
  - Real-time answer tracking and validation

- **Result Page** (`/[lang]/[quizSlug]/result`):
  - Score calculation from quiz answers
  - AI result generation with OpenAI integration
  - Fallback to static results when AI fails
  - Product section with Stripe checkout integration
  - Booking section with Calendly integration
  - Product and booking view tracking

- **Session Management**:
  - Client token lifecycle with localStorage
  - 24-hour expiration with auto-refresh
  - Anonymous tracking until email submission
  - GDPR compliant data handling

- **API Endpoints**:
  - `/api/quiz/session` - Session create/update
  - `/api/quiz/lead` - Lead capture from email gate
  - `/api/ai/generate-result` - OpenAI result generation
  - `/api/stripe/checkout` - Stripe payment initiation
  - `/api/tracking` - Event tracking pipeline

- **Tracking System**:
  - 9 event types: page_view, cta_click, quiz_start, answer_select, quiz_complete, email_submitted, product_view, booking_view, checkout_start
  - Events stored in audit_logs table
  - Silent error handling to preserve UX
  - Async tracking to avoid blocking

- **Fallback Mechanisms**:
  - AI failure → static scoring results
  - Missing translations → default_lang fallback
  - Missing assets → placeholder/theme defaults
  - Network errors → graceful degradation

- **Documentation**:
  - Complete tracking event documentation
  - Session token lifecycle guide
  - API endpoint specifications
  - Acceptance criteria checklist

### 🔧 Technical Details
- TypeScript interfaces for all data structures
- Zod validation on all API endpoints
- Multi-language AI prompts per quiz
- Placeholder assets (logo, hero image)
- Error boundaries and loading states
- Optimistic UI updates for better UX

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
