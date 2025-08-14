# Quiz Platform - Változásnapló

Minden jelentős változás dokumentálva ebben a fájlban.

A formátum a [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) alapján készült.

## [Unreleased]

### 🎯 In Progress
- Schema és RLS szabályok fejlesztés

### 📋 Planned Modules
1. [Schema + RLS] - Adatbázis séma és biztonsági szabályok
2. [Seed + Duplikáció] - Minta adatok és quiz duplikálás  
3. [Publikus Funnel] - Felhasználói oldal és tracking
4. [Stripe + E-mail] - Fizetés és kommunikáció
5. [Admin Panel] - Tartalomkezelő felület
6. [Guardrails + i18n] - Biztonság és nyelvesítés

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
