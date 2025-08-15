# AI Prompts Canonicalization (Option 1) – Single Column `ai_prompt`

Created: 2025-08-15
Owner: Platform Engineering
Status: Approved and In-Progress

## Döntés és Indoklás

- Canonical shape: `quiz_ai_prompts(id, quiz_id, lang, ai_prompt, fallback_results?, created_at, updated_at)`
- Indokok:
  - Meglévő környezet(ek) már ezt a sémát használják (quick/minimal setup SQL)
  - Azonnali stabilizáció és 500-as hibák megszüntetése POST/PUT esetén
  - Könnyű visszaút Option 2-re (két oszlop: system_prompt + user_prompt_template) később biztonságos migrációval

## API Szerződés (v1 – canonical)

- Endpoint: `/api/admin/ai-prompts`
- GET
  - Query: `quiz_id`
  - Válasz: `[{ id, quiz_id, lang, ai_prompt }]`
  - UI kompatibilitás: a válaszban kiegészítjük `user_prompt_template = ai_prompt` aliasszal (DB-ben NEM tároljuk külön)
- POST
  - Body: `{ quiz_id: UUID, lang: string, ai_prompt: string }`
  - Validáció: kötelező változók a template-ben: `{{scores}}, {{top_category}}, {{name}}`
  - Viselkedés: létrehozás; duplikáció (quiz_id, lang) → 409
- PUT
  - Body: `{ quiz_id: UUID, lang: string, ai_prompt: string, id?: UUID }`
  - Viselkedés: "idempotens upsert" – ON CONFLICT (quiz_id, lang) DO UPDATE
- DELETE
  - Query: `id`, `quiz_id`
- Hibaformátum (minden metódus): `{ error: string, code?: string, details?: string }` – a PostgREST hibakód és rövid üzenet szerepeljen a diagnosztika miatt

## Típusok

- `src/types/database.ts` – `quiz_ai_prompts` táblához:
  - Row: `{ id, quiz_id, lang, ai_prompt, fallback_results?, created_at, updated_at }`
  - Insert/Update: a fenti mezők részmetszete
- UI View Model (vékony alias típus):
  - `{ id, quiz_id, lang, ai_prompt, user_prompt_template: string }` – kizárólag a klienskomponensek kényelmére; DB-ben nem jelenik meg külön oszlop

## UI – AIPromptsEditor

- Olvasás: `ai_prompt` → `user_prompt_template` aliasra map-pelve jelenítjük meg
- Mentés: kizárólag `ai_prompt` írása (POST/PUT)
- Validáció: kötelező változók ellenőrzése az `ai_prompt`-ban
- HU/EN CRUD próba: mindkét nyelven létrehozás/mentés/törlés és visszatöltés

## AI Generálás (Result)

- Elsődleges template: `quiz_ai_prompts.ai_prompt`
- Átmeneti visszafelé kompatibilitás: ha nincs `ai_prompt`, fallback a régi `user_prompt_template` mezőre (ha található)
- Logoljuk a fallback-et (monitorozhatóság)

## Audit Logs – Schema Cache Hiba Javítás

- Jelenség: `PGRST204 Could not find the 'action' column of 'audit_logs' in the schema cache`
- Megoldás: no-op migráció (COMMENT, index touch), majd `pg_notify('pgrst','reload schema')`
- Ha fennmarad: minimális ALTER (index drop/create), újabb `pg_notify`
- Ellenőrzés: /api/tracking alatt ne legyen több PGRST204 a logban

## Edge case-ek és hibakezelés

- POST duplikáció (quiz_id, lang) → 409
- PUT: idempotens upsert (ON CONFLICT)
- Üres/hibás template → 400 (mely kötelező változó hiányzik)
- PostgREST cache flake: egyszeri retry olvasáskor; írásnál strukturált válasz a kliensnek
- Admin route-ok service role-lal működnek – RLS nem blokkolhat

## Smoke Tesztek

- Authenticated CRUD (HU/EN): GET/POST/PUT/DELETE – státuszok + rövid response kivonat + audit diff tail
- Result generálás: igazoljuk, hogy `ai_prompt` alapján készül; fallback használat logolása

## Migrációs útvonal (Option 2 – két oszlop később)

- Új oszlopok: `system_prompt`, `user_prompt_template`
- Backfill: `user_prompt_template := ai_prompt`, `system_prompt := ''` (vagy konfigurált default)
- API kompat: új szerződés; átállás RPC/VIEW segítségével lehetséges, hogy a kliensoldali szerződés változatlan maradjon

## Rollback terv

- Ha az Option 1 változtatás váratlan regressziót okoz, a korábbi API útvonal fallback olvasása (`user_prompt_template`) visszakapcsolható ideiglenesen, de írás továbbra is csak `ai_prompt`

## Elfogadási kritériumok

- CRUD műveletek 2xx/4xx státuszokkal, 5xx nélkül
- Result generálás `ai_prompt` alapján
- audit_logs cache hiba megszűnt
- Doksik és changelog frissítve; commit-olva

---

## Végrehajtási feladatlista (rövid)

- [x] Döntés rögzítése és dokumentálása (ez a fájl)
- [x] Zod sémák előkészítése `ai_prompt`-ra (PUT opcionális `id`)
- [ ] API: GET mapping, POST/PUT kizárólag `ai_prompt` + ON CONFLICT; hibakódok
- [ ] Types: `quiz_ai_prompts` típus frissítés + vékony ViewModel
- [ ] UI: AIPromptsEditor read/write `ai_prompt` + validáció
- [ ] Result: `ai_prompt` elsődleges, fallback + log
- [ ] audit_logs cache fix migráció + verifikáció
- [ ] Auth CRUD smoke + log kivonatok
- [ ] Dokumentáció és CHANGELOG frissítés, commit
