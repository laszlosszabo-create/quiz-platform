# QUIZ MVP Master Brief

## **1. RÉSZ – BEVEZETŐ ÉS GLOBÁLIS SZABÁLYOK**

**Fontos előre:**  
- Ez a fejlesztés **funkcionális MVP fókuszban** történjen.  
- A vizuális **design** (Tailwind theme finomítás, komponens variánsok, illusztrációk, tipográfia) **csak a core modulok elkészülte után, külön "Design‑skin promptban"** kerül kialakításra.  
- Amíg a design promptot nem kapod meg:  
  - **Ne** módosíts API-kontraktusokat, adatmodellt, Zod sémákat.  
  - Csak alap **shadcn/ui** + minimál Tailwind scaffold stílust használj.  
  - Theme‑konfigurációs pontokat (theme tokens, layout_version mező) hozd létre, de **ne** építs rájuk vizuális finomítást.
  - Ha designként értelmezhető kérést észlelsz, írd ki:  
    > "Design a külön promptban jön" – majd folytasd a funkcionális fejlesztést.  

### **Cél**
Fejlessz egy **Next.js alapú, Supabase hátterű** quiz rendszert, amely:
- **Stabil és bolondbiztos** MVP:  
  Landing → Quiz → Eredmény → Stripe fizetés → E-mail kézbesítés → Upsell → Foglalás.
- **Teljesen konfigurációvezérelt** (adminból szerkeszthető) tartalmak.  
- **Könnyen duplikálható** több témára, adatütközés nélkül.  
- **Nyelvesítésre előkészített**: minden szöveg DB-ben, nyelv szerint elkülönítve.  
- Moduláris kódszerkezet, **minden modul után Git commit** és belső dokumentáció.  
- Minden API-séma **Zod validációval**, és biztosítékokkal: RLS, idempotencia, fallback.

### **Technológiai stack**
- **Frontend**: Next.js (App Router) + TypeScript + Tailwind + shadcn/ui  
- **Backend**: Next.js API Routes  
- **Adatbázis/Auth/Storage**: Supabase (Postgres + RLS)  
- **Fizetés**: Stripe Hosted Checkout + Webhooks  
- **Email**: Resend vagy Postmark  
- **AI**: OpenAI/Claude API szerveroldalon, prompt sablonból  
- **I18n**: DB-ben fordítás, lang paraméteres URL-ek  
- **Dokumentáció**: `/docs` könyvtár modulonként

[... Rest of brief content ...]

## Environment Variables

### AI Provider
- `OPENAI_API_KEY` - OpenAI API kulcs (server-side)

### Email Service  
- `RESEND_API_KEY` - Resend API kulcs
- `FROM_EMAIL` - Feladó email cím

### Supabase
- `SUPABASE_URL` - Supabase projekt URL
- `SUPABASE_ANON_KEY` - Public anon kulcs
- `SUPABASE_SERVICE_ROLE_KEY` - Service role kulcs (csak szerver)

### Stripe
- `STRIPE_SECRET_KEY` - Stripe secret kulcs (test)
- `STRIPE_WEBHOOK_SECRET` - Webhook aláírás kulcs
- `STRIPE_PRICE_ID` - Seeded termék price ID (adminban állítható)

### Theme Assets (Placeholder)
- Logo: `/public/logo-placeholder.svg`
- Hero: `/public/hero-placeholder.svg`
- Fallback: default theme színek ha asset hiányzik

## Modul 3 - Publikus Funnel Implementáció

### Végrehajtási sorrend:

1. **Oldalak**
   - `/[lang]/[quizSlug]` (LP): quiz_translations tartalom, CTA → /quiz
   - `/[lang]/[quizSlug]/quiz`: lépéses render, autosave, email gate
   - `/[lang]/[quizSlug]/result`: scores + AI/fallback, product/booking blokk

2. **Tracking pipeline** 
   - 9 esemény implementálása és dokumentálása

3. **Fallbackok**
   - AI hiba → statikus eredmény
   - Hiányzó fordítás → default_lang
   - Hiányzó asset → default theme

4. **Acceptance**
   - ADHD quiz HU/EN teljes funnel
   - Dokumentáció frissítés
   - Git commit

## Session Token kezelés
- Dokumentáció: `/docs/funnel/session.md`
- client_token létrehozás, tárolás, élettartam, tisztítás
