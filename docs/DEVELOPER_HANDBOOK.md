# Quiz Platform – Fejlesztői kézikönyv (egyetlen fájl)

Ez a dokumentum mindent tartalmaz, ami a platform teljes megértéséhez és üzemeltetéséhez szükséges – backendtől a frontendig, adatbázistól az API-kon át a fejlesztési és üzemeltetési folyamatokig.

Dátum: 2025-08-21

---

## 1. Rövid összefoglaló

- Keretrendszer: Next.js 15 (App Router) + TypeScript
- Adatbázis: Supabase (PostgreSQL + RLS)
- AI: OpenAI Chat Completions, modell env-ből: `OPENAI_CHAT_MODEL` (alap: `gpt-4.1-mini`)
- E-mail: Resend + saját email queue/automation
- Fizetés: Stripe (webhook alapú feldolgozás, purchase e-mail)
- I18n: Többnyelvű tartalom és AI promptok (HU/EN)
- Fallback: AI-hiba/timeout esetén score-only HTML és 200-as válasz (jobb UX)

---

## 2. Monorepó felépítés (részletek)

- `src/app` – Next.js App Router route-ok (köz- és admin felület, API-k, utility route-ok)
- `src/lib` – kiszolgáló oldali könyvtárak (Supabase kliens, e-mail automatizmus, audit log, markdown konverzió, stb.)
- `supabase/migrations` – SQL migrációk (séma, indexek, RLS, funkciók)
- `docs/` – projekt dokumentáció (ez a kézikönyv is)
- `public/` – statikus fájlok
- `scripts/` – segédszkriptek (ellenőrzők, feltöltők)
- Gyökérfájlok – `package.json`, `tsconfig.json`, `next.config.js`, stb.

---

## 3. Futtatási és fejlesztői környezet

### 3.1. Minimális követelmények
- Node.js 18+
- NPM 9+
- Supabase projekt (PostgREST, RLS)
- Resend API kulcs
- OpenAI API kulcs (vagy mock mód lokális tesztre)
- Stripe kulcsok (fejlesztői és/vagy éles)

### 3.2. Környezeti változók (.env.local)
- Supabase
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY` (szerver oldali admin műveletekhez)
- OpenAI
  - `OPENAI_API_KEY`
  - `OPENAI_CHAT_MODEL` (alap: `gpt-4.1-mini`)
  - `QUIZ_AI_TIMEOUT_MS` (alap: `20000`)
  - `PRODUCT_AI_TIMEOUT_MS` (alap: `20000`)
  - (opcionális) `MOCK_AI=1` – explicit mock mód (csak tesztre)
- E-mail / Resend
  - `RESEND_API_KEY`
- Stripe
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET` (ha webhook feldolgozás aktív)

### 3.3. Lokális indítás

- Dev szerver egy példányban fusson. Ha furcsa 404/chunk hibák vannak, zárd le minden példányát és töröld a `.next` cache-t.

Példa parancsok:
```bash
# fejlesztői szerver
npm run dev

# cache tisztítás problémák esetén
rm -rf .next
```

Megjegyzés: A Chrome DevTools egyes környezetekben zajos 404-et generál egy appspecific JSON-ra. Ezt csendesítjük egy 204-es route-tal (lásd 9.8).

---

## 4. Adatbázis (Supabase / PostgreSQL)

### 4.1. Főbb táblák (nem teljes lista, a lényegre fókuszálva)

- Tartalom
  - `quizzes` – kvízek törzse (cím, slug, meta)
  - `quiz_translations` – i18n tartalmak
  - `quiz_questions` – kérdések (típus: single/multi/scale; `order_index`)
  - `quiz_scoring_rules` – pontozási szabályok és kategóriák
  - `quiz_ai_prompts` – kvíz AI promptok nyelvek szerint (canonical: `ai_prompt`, opcionális `system_prompt`, `max_tokens`)
- Felhasználói folyamat
  - `quiz_leads` – e-mail leadek (session/quiz kapcsolattal)
  - `quiz_sessions` – session adatok (válaszok, score-ok, snapshot-ok, product AI ideiglenes JSON cache)
- Termékek
  - `products` – terméktörzs
  - `product_configs` – termékspecifikus beállítások (pl. `ai_prompts` kulcson default promptok és max_tokens)
  - `product_ai_prompts` – termék AI promptok nyelvenként
  - `product_ai_results` – termék AI eredmények cache + metaadatok (SQL perzisztencia)
- E-mail és automatizmus
  - `email_templates`, `email_queue`, `email_automation_rules`, `email_events`
- Audit és követés
  - `audit_logs` – audit és tracking események (legacy kompatibilitással)

### 4.2. Kulcs migráció: Product AI metaadatok

Fájl: `supabase/migrations/20250821123000_alter_product_ai_results_add_metadata.sql`

Kivonat:
```sql
ALTER TABLE IF EXISTS public.product_ai_results
  ADD COLUMN IF NOT EXISTS provider text,
  ADD COLUMN IF NOT EXISTS model text,
  ADD COLUMN IF NOT EXISTS prompt_tokens integer,
  ADD COLUMN IF NOT EXISTS completion_tokens integer,
  ADD COLUMN IF NOT EXISTS total_tokens integer,
  ADD COLUMN IF NOT EXISTS mocked boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS request_id text,
  ADD COLUMN IF NOT EXISTS metadata jsonb;

NOTIFY pgrst, 'reload schema';
```

Cél: AI hívások metaadatainak tárolása (szolgáltató, modell, tokenek, mock flag, request id, tetszőleges meta JSON). A `product_ai_results` az elsődleges cache a termék-elemzéshez.

### 4.3. RLS és jogosultságok
- A publikus útvonalak csak szükséges SELECT/INSERT műveleteket kapnak.
- Admin és automatizmus API-k a service role kulcsot használják szerver oldalon (`getSupabaseAdmin()`).
- Audit log beszúrás legacy kompatibilitással (ha új sémát nem talál, régi oszlopokra esik vissza).

---

## 5. AI integráció (OpenAI)

### 5.1. Modell és időkorlátok
- Modell: `OPENAI_CHAT_MODEL` (alap: `gpt-4.1-mini`).
- Időkorlátok: `QUIZ_AI_TIMEOUT_MS`, `PRODUCT_AI_TIMEOUT_MS` (alap: 20s).
- Kulcs: `OPENAI_API_KEY` (modul-szintű init elkerülve a build-time hibákat).

### 5.2. Prompt forrás prioritások
- Quiz flow: `quiz_ai_prompts` (canonical `ai_prompt`, opcionális `system_prompt`, `max_tokens`).
- Product flow: `product_configs.ai_prompts` > `product_ai_prompts` > `quiz_ai_prompts`.

### 5.3. Mock mód
- Lekérdezés: `?mock=1` query param vagy env: `MOCK_AI=1`.
- Mock esetén is futnak az e-mail triggerek (végpont-végpont tesztelhetőség).

### 5.4. Fallback stratégia
- Quiz AI hiba/timeout: 200 OK válasz score-only HTML tartalommal, és e-mail trigger megtörténik.
- Product AI hiba/timeout: jelenleg 500-at ad (szándékosan), de e-mail reschedule logika az email queue oldalon igyekszik később pótolni a hiányzó tartalmat.

### 5.5. Metaadatok mentése
- Product flow: `product_ai_results` táblába upsert, meta kitöltve (provider/model/tokens/mocked/request_id/metadata). Ha a táblába írás hibázik, visszaesik a `quiz_sessions.product_ai_results` JSON cache-re.
- Quiz flow: az AI szöveg a `quiz_sessions.result_snapshot.ai_result` mezőbe kerül, és e-mail kiküldéskor HTML-re konvertálódik.

---

## 6. E-mail rendszer

### 6.1. E-mail automatizmusok
- Könyvtár: `src/lib/email-automation.ts`
- Események:
  - Quiz befejezés: AI/score-only eredménnyel fut a completion e-mail.
  - Purchase (Stripe): termék AI elemzéssel bővített e-mail (ha AI még nem kész, reschedule).

### 6.2. Tartalom és formátum
- AI output → `markdownToHtml()` konverzió e-mailhez (könyvtár: `src/lib/markdown.ts`).
- Sablonok: `email_templates` táblában.

### 6.3. Queue feldolgozás
- Cron API: `src/app/api/cron/process-email-queue/route.ts`
  - Késleltetés és reschedule: ha termék AI még nem elérhető, sorbaállítás későbbre.
  - SQL cache preferencia: `product_ai_results`, ha nincs, session JSON fallback.

---

## 7. Fizetés (Stripe)

- Vásárlás esetén purchase e-mail megy ki, AI termék-elemzéssel kiegészítve, amikor rendelkezésre áll.
- Webhook-implementáció a projektben (env szükséges). A purchase tranzakcióhoz kapcsolódó e-mail trigger a folyamat része.

---

## 8. Frontend oldalak és UX

### 8.1. Közönség oldalak
- `/[lang]/[quizSlug]` – landing (fordításokból, SSR)
- `/[lang]/[quizSlug]/quiz` – kérdések lépésenként, autosave, e-mail gate, session kezelés
- `/[lang]/[quizSlug]/result` – eredmény oldal
  - Quiz AI generálás (vagy score-only), termékajánló, foglalás blokk

### 8.2. Termék eredmény oldal
- `src/app/[lang]/product/[productId]/result/product-result-client.tsx`
  - Kliens oldali retry 500-ra (legacy), cache használat, AI készenlét.

### 8.3. Admin felület
- Prompt editorok: `src/app/admin/components/ai-prompts-editor.tsx` és a quiz editor tabjai
- Model választó UI címkék frissítve (pl. "GPT-3.5 Turbo (legacy)" jelölés)

### 8.4. I18n
- Fordítások és AI promptok nyelvek szerint külön kezelve (HU/EN), default fallback logika.

---

## 9. API végpontok (főbbek)

### 9.1. Quiz session
- `POST /api/quiz/session`
  - Létrehozás: `quizSlug`, `lang`
  - Válaszban: `session_id`, `quiz_id`, kezdeti állapot
- `PATCH /api/quiz/session`
  - Válaszok, progressz, score-ok mentése

### 9.2. Lead
- `POST /api/quiz/lead`
  - E-mail rögzítése session/quiz kontextusban

### 9.3. AI eredmény generálás
- `POST /api/ai/generate-result`
  - Törzs: `{ session_id, quiz_id, lang, result_type?: 'quiz'|'product', product_id?, skip_ai_generation? }`
  - Quiz flow:
    - Prompt: `quiz_ai_prompts`
    - Timeout: `QUIZ_AI_TIMEOUT_MS`
    - Hiba/timeout → 200 OK, `fallback: 'score_only'`, e-mail trigger fut
  - Product flow:
    - Prompt prioritás: `product_configs.ai_prompts` > `product_ai_prompts` > `quiz_ai_prompts`
    - Timeout: `PRODUCT_AI_TIMEOUT_MS`
    - Eredmény mentése: `product_ai_results` (metaadatokkal), fallback: session JSON
    - Force e-mail: `?force_email=1` cache-ből is küld purchase e-mailt
  - Mock: `?mock=1` vagy `MOCK_AI=1`

### 9.4. E-mail queue
- `POST /api/cron/process-email-queue`
  - Késleltetett feldolgozás, reschedule, product AI készenlét figyelése

### 9.5. Debug AI
- `GET /api/debug-ai?session_id=...&quiz_id=...&product_id=...&lang=...`
  - Visszaadja: env-modell, timeoutok, prompt feloldás forrásai, és tárolt product AI metaadatok

### 9.6. Tracking
- `POST /api/tracking`
  - Események auditálása (pl. page_view, quiz_start, answer_select, quiz_complete, stb.)

### 9.7. Admin API-k
- AI prompt CRUD (korábbi modulokból): canonical `ai_prompt` támogatás, Zod-validáció, audit logok

### 9.8. DevTools well-known route
- `GET /.well-known/appspecific/com.chrome.devtools.json` → 204 (zajcsökkentés a logokban)

---

## 10. Szerviz-könyvtárak

- `src/lib/supabase-config.ts` – admin Supabase kliens (service role)
- `src/lib/email-automation.ts` – e-mail triggerek (quiz completion, purchase)
- `src/lib/markdown.ts` – Markdown → HTML e-mailhez
- `src/lib/audit-log.ts` – audit log beszúrás (legacy fallbackkel)
- `src/lib/translations.ts` – i18n segédletek
- `src/lib/zod-schemas.ts` – szerver oldali validációk

---

## 11. Hibakezelés és megfigyelhetőség

- AI hiba/timeout (quiz):
  - 200 OK + score-only HTML + e-mail trigger
  - Audit: `AI_ERROR` esemény `audit_logs` táblában
- AI hiba/timeout (product):
  - 500 (szándékosan), audit log bejegyzés, későbbi e-mail reschedule lehetséges
- Debug endpoint: `/api/debug-ai` – konfigurációs és prompt forrás információk

---

## 12. Biztonság

- RLS minden olyan táblán, ahol publikus/anon elérés lehetséges
- Szerver oldali kulcsok nem kerülnek kliensre (admin műveletek `getSupabaseAdmin()`)
- Zod validáció minden író API-n
- Stripe webhook és e-mail küldés idempotencia és retry szemlélettel

---

## 13. Tesztelés és minőség

- Acceptance és smoke teszt szkriptek a gyökérben (`test-*.js`, `test-*.sh`)
- Quality Gates: `quality-gates.md` és `quality-gates-test.js`
- Gyors ellenőrzés lokálisan: mock AI, alacsony timeout, manuális végigkattintás a funnelön

---

## 14. Üzemeltetés és deploy

- Build: `next build` (CI), env-k biztosítása deployment során
- Email queue process periodikus meghívása (cron/worker)
- Konfigurációk tuningja:
  - Modellek és időkorlátok env-ben (OPENAI_CHAT_MODEL, QUIZ_AI_TIMEOUT_MS, PRODUCT_AI_TIMEOUT_MS)
- Incidenskezelés:
  - OpenAI down/lassú → quiz oldal nem esik el (score-only 200), product e-mail később pótlódhat
  - Dev 404/chunk hibák → `.next` törlés + single-instance dev

---

## 15. Elfogadási kritériumok (kivonat)

- Kvíz teljes funnel (landing → quiz → result) HU/EN működik
- AI eredmény generálás quiz esetén: hiba/timeout nem okoz 500-at
- Termék AI: SQL cache-elve metaadatokkal; purchase e-mail AI-val
- E-mail automatizmusok futnak, markdown → HTML konverzióval
- Admin szerkesztők: promptok, scoring, kérdések karbantartása

---

## 16. Gyakori hibák és megoldások

- 404/webpack chunk hibák dev közben: több dev példány fut vagy sérült cache → zárd le, `.next` törlés, újraindítás
- `OPENAI_API_KEY` hiányzik: mock mód (`?mock=1` vagy `MOCK_AI=1`) fejlesztéshez; éleshez kulcs szükséges
- E-mail nem érkezik: nézd meg a queue feldolgozót és a `email_events`/`audit_logs` táblát; `process-email-queue` route futtatása
- Product AI nincs az e-mailben: ellenőrizd a `product_ai_results` táblát és a reschedule-t

---

## 17. Kapcsolódó dokumentumok

- `CHANGELOG.md` – változások
- `docs/AI_TIMEOUT_FALLBACK_20250821.md` – AI timeout és fallback részletek
- `DATABASE_SETUP.md`, `BRIEF.md`, `SUPABASE_CENTRALIZATION_AUDIT.md` – mélyebb háttéranyagok
- `TROUBLESHOOTING.md` – hibaelhárítás

---

## 18. Példa hívások

### 18.1. Quiz session létrehozása
```bash
curl -X POST http://localhost:3000/api/quiz/session \
  -H 'content-type: application/json' \
  -d '{"quizSlug":"adhd-quick-check","lang":"hu"}'
```

### 18.2. AI eredmény (quiz)
```bash
curl -X POST http://localhost:3000/api/ai/generate-result \
  -H 'content-type: application/json' \
  -d '{"session_id":"<UUID>","quiz_id":"<UUID>","lang":"hu"}'
```
Várható viselkedés timeoutnál: 200 OK, `fallback: "score_only"`.

### 18.3. AI eredmény (product)
```bash
curl -X POST 'http://localhost:3000/api/ai/generate-result?force_email=1' \
  -H 'content-type: application/json' \
  -d '{"session_id":"<UUID>","quiz_id":"<UUID>","lang":"hu","result_type":"product","product_id":"<UUID>"}'
```

### 18.4. Debug AI
```bash
curl 'http://localhost:3000/api/debug-ai?session_id=<UUID>&quiz_id=<UUID>&lang=hu'
```

---

## 19. Záró megjegyzés

A rendszer moduláris és env-vezérelt. Az AI és e-mail komponensek kegyesen hibakezelnek, így a felhasználói UX 500-asok nélkül is stabil marad. Új csapat számára a legfontosabb: tartsák be az env-konvenciókat, használják a debug végpontot és kövessék a fallback logikákat.
