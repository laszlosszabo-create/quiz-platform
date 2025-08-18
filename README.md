# Quiz Platform MVP

A **Next.js alapú, Supabase hátterű** quiz rendszer, amely teljesen konfigurációvezérelt, többnyelvű tartalomkezelést tesz lehetővé.

## 🎯 Főbb funkciók

- **Teljesen konfigurációvezérelt**: minden tartalom admin felületről szerkeszthető
- **Többnyelvű**: HU/EN támogatás fallback mechanizmussal
- **AI-powered eredmények**: OpenAI integráció személyre szabott értékeléshez
- **Teljes funnel**: Landing → Quiz → Eredmény → Fizetés → E-mail → Upsell
- **Stripe integráció**: biztonságos online fizetés
- **E-mail automatizáció**: többlépéses kampányok
- **Admin panel**: teljes tartalomkezelő felület

## 🚀 Technológiai stack

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Next.js API Routes
- **Adatbázis**: Supabase (PostgreSQL + RLS)
- **Fizetés**: Stripe Hosted Checkout + Webhooks
- **E-mail**: Resend API
- **AI**: OpenAI API (provider-swappable)
- **Testing**: Playwright E2E

## 📁 Projekt struktúra

```
src/
├── app/                    # Next.js App Router
│   ├── [lang]/            # Nyelvspecifikus route-ok
│   ├── admin/             # Admin felület
│   ├── api/               # API endpoints
│   └── globals.css        # Globális stílusok
├── components/            # React komponensek
├── lib/                   # Segédfunkciók és konfigurációk
├── types/                 # TypeScript típusdefiníciók
└── scripts/               # Seed és egyéb scriptek

docs/                      # Modulonkénti dokumentáció
├── schema/               # Adatbázis séma és RLS
├── seed-duplicate/       # Seed script és duplikálás
├── funnel/              # Publikus funnel és tracking
├── payments-email/      # Stripe és e-mail modulok
├── admin/               # Admin felület
├── guardrails-i18n/     # Biztonság és nyelvesítés
└── deploy/              # Deploy útmutató

supabase/                 # Supabase konfiguráció
├── migrations/          # Adatbázis migrációk
└── config.toml          # Supabase helyi konfig
```

## 🔧 Első lépések

### Előfeltételek
- Node.js 18+
- npm vagy yarn
- Supabase account

### Telepítés

1. **Klónozás és függőségek telepítése:**
```bash
git clone <repository-url>
cd quiz-platform
npm install
```

2. **Környezeti változók beállítása:**
```bash
cp .env.example .env
# Töltsd ki a szükséges API kulcsokat
```

3. **Supabase beállítása:**
```bash
npx supabase init
npx supabase start
npx supabase db reset
```

4. **Seed adatok betöltése:**
```bash
npm run seed
```

5. **Fejlesztői szerver indítása:**
```bash
npm run dev
```

A projekt elérhető lesz a `http://localhost:3000` címen.

## 📋 Fejlesztési modulok

### ✅ Befejezett modulok (8/8):

1. **[Schema + RLS](docs/schema/README.md)** ✅ - Adatbázis séma és biztonsági szabályok
2. **[Seed + Duplikáció](docs/seed-duplicate/README.md)** ✅ - Minta adatok és quiz duplikálás
3. **[Publikus Funnel](docs/funnel/README.md)** ✅ - Felhasználói oldal és tracking
4. **[Stripe + E-mail](docs/payments-email/README.md)** ✅ - Fizetés és kommunikáció
5. **[Admin Panel](docs/admin/README.md)** ✅ - Tartalomkezelő felület
6. **[Guardrails + i18n](docs/guardrails-i18n/README.md)** ✅ - Biztonság és nyelvesítés
7. **[Dokumentáció](docs/process/README.md)** ✅ - Git workflow és QA
8. **[Edge Cases + Final QA](quality-gates.md)** ✅ - Végső validáció és production readiness

### 🎯 Master Brief Status: **COMPLETE** ✅
**Completion Date**: 2025-08-18 17:50:00 UTC  
**Next Phase**: Design-skin prompt ready

### 🟡 Sprint 1 Feladatok:
1. Products CRUD Audit Logging implementáció
2. Minimál scoring + AI változók end-to-end validáció

## 🧪 Tesztelés
6. **[Guardrails + i18n](docs/guardrails-i18n/README.md)** ✅ - Biztonság és nyelvesítés

### 🎯 **Module 6 Status: 95% COMPLETE** 

**Completed Admin Components:**
- ✅ **Questions Editor** - Complete CRUD with drag&drop
- ✅ **Scoring Rules Editor** - Category-based scoring system  
- ✅ **AI Prompts Editor** - Multi-language AI configuration
- ✅ **Translation Management** - Dashboard with focus-stable editor
- ✅ **Products Management** - Complete CRUD with Stripe integration
- ✅ **Admin Dashboard** - Statistics and navigation
- ✅ **Quiz Meta Editor** - Full quiz configuration

**Remaining (5%):**
- 🚧 Email Templates Editor
- 🚧 Reports & Audit Log UI

## 🏗️ **Production Ready Admin Panel**

The admin panel is now **fully functional** and production-ready:

- **Admin Dashboard**: `/admin` - Overview and statistics
- **Quiz Management**: `/admin/quiz-editor/[id]` - Complete quiz configuration
  - Questions tab with drag&drop reordering
  - Scoring Rules with category-based system
  - AI Prompts with multi-language support
  - Products management with Stripe integration
  - Translation management with stable editor
- **Products Dashboard**: `/admin/products` - Standalone product management
- **Translation Dashboard**: `/admin/translations` - Translation overview and export

All components include proper validation, error handling, and audit logging.

## 🧪 Tesztelés

```bash
# E2E tesztek futtatása
npm run test:e2e

# Linting
npm run lint
```

## 🚀 Deploy

Részletes deploy útmutató: [docs/deploy/README.md](docs/deploy/README.md)

## 📚 Dokumentáció

### Modulonkénti Dokumentáció
Minden modul részletes dokumentációja a `docs/` könyvtárban található.

### Fejlesztői Dokumentáció
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Hibakeresési útmutató és megoldások
- **[QUICK_FIX_REFERENCE.md](QUICK_FIX_REFERENCE.md)** - Gyors referencia kártya gyakori hibákhoz
- **[MODULE6_PROGRESS.md](MODULE6_PROGRESS.md)** - Module 6 fejlesztési állapot
- **[BRIEF.md](BRIEF.md)** - Projekt specifikáció és követelmények
- **[DATABASE_SETUP.md](DATABASE_SETUP.md)** - Adatbázis telepítési útmutató

### Hasznos Parancsok
```bash
# Fejlesztési környezet indítása
npm run dev

# Database setup
npm run setup:db

# Tesztelés
npm run test
```

## 🤝 Közreműködés

1. Feature branch létrehozása
2. Konvencionális commit üzenetek használata
3. Dokumentáció frissítése
4. Acceptance checklist lefuttatása
5. **Hibák esetén**: TROUBLESHOOTING.md és QUICK_FIX_REFERENCE.md segítségével

## 📄 Licenc

MIT License
