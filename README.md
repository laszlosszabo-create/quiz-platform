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

1. **[Schema + RLS](docs/schema/README.md)** - Adatbázis séma és biztonsági szabályok
2. **[Seed + Duplikáció](docs/seed-duplicate/README.md)** - Minta adatok és quiz duplikálás
3. **[Publikus Funnel](docs/funnel/README.md)** - Felhasználói oldal és tracking
4. **[Stripe + E-mail](docs/payments-email/README.md)** - Fizetés és kommunikáció
5. **[Admin Panel](docs/admin/README.md)** - Tartalomkezelő felület
6. **[Guardrails + i18n](docs/guardrails-i18n/README.md)** - Biztonság és nyelvesítés

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

Minden modul részletes dokumentációja a `docs/` könyvtárban található.

## 🤝 Közreműködés

1. Feature branch létrehozása
2. Konvencionális commit üzenetek használata
3. Dokumentáció frissítése
4. Acceptance checklist lefuttatása

## 📄 Licenc

MIT License
