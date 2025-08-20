# Email Integrációs Útmutató

Ez a dokumentum leírja a jelenlegi email rendszer működését és azt, hogyan kell új oldal(ak)ba bekötni az email automatizmust.

## 1) Rendszer áttekintés

- Szolgáltatók: Supabase (adat), Resend (küldés)
- Fő komponensek:
  - `email_templates` — sablonok (subject + body)
  - `email_automation_rules` — triggerek és feltételek (schema: legacy `rule_type` vagy új `trigger_event`)
  - `email_queue` — várakozási sor (küldés ütemezése, státuszok)
  - Feldolgozó: `/api/cron/process-email-queue` (biztonságos, rate-limitelt küldés)
  - Trigger könyvtár: `src/lib/email-automation.ts` (enrichment, feltételek, queue)

## 2) Jelenlegi működés – fontos részletek

- Email cím backfill és türelmi idő:
  - Ha a címzett email a queue-olás pillanatában még nem ismert, az elem +5 perc késleltetést kap.
  - A cron nem törli azonnal a hiányzó címzettet, hanem +2 perccel reschedule-öl; ez a türelmi idő alapértéken 2 óra.
  - Ha a türelmi idő lejár és továbbra sincs címzett, az elem `missing_recipient_timeout`-tal `cancelled` lesz.
- Szabály-keresés kompatibilitás:
  - A rendszer előbb `trigger_event` (új séma), majd `rule_type` (legacy) oszlopra szűr.
- Fallback email feloldás (enrichment):
  1) `quiz_sessions` (user_email/email, user_name/name)
  2) `leads` `session.lead_id` alapján (ha létezik a tábla)
  3) `quiz_leads` session alapján (legacy)
  4) legutóbbi `leads` a quiz-hez
  5) legutóbbi `quiz_leads` a quiz-hez
- Validáció: sablon renderelés után keresünk megmaradt `{{placeholder}}`-eket — csak azokat jelöljük hiányzónak.
- Stuck védelem: `processing` státuszban ragadt tételek 15 perc után visszakerülnek `pending`-be.

## 3) Hogyan kösd be egy új oldalba

Általános forgatókönyv — „Quiz befejezése” oldalon (vagy bármely új oldal logikájában):

1. Legyen session és quiz azonosító a komponensben (pl. route paramokból, state-ből).
2. A lead bekérése történjen a funnelben (landing/quiz email gate) az `/api/quiz/lead` végponton; ez kezeli a `leads` hiányát is és legacy `quiz_leads`-be esik vissza.
3. Eredmény generálásnál hívd az AI/score-only végpontot, ami triggeli az email automatizmust (akkor is, ha még nincs azonnal email a sessionben):

```ts
await fetch('/api/ai/generate-result', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ session_id, quiz_id, lang, skip_ai_generation: true /* vagy false */})
})
```

4. Ha manuálisan (kódon belül) akarod triggerezni az automatizmust, használd a helper-t:

```ts
import { emailTrigger } from '@/lib/email-automation'

await emailTrigger.triggerQuizCompletion(quizId, userEmail /* lehet üres string is */, {
  percentage,
  text: category,
  ai_result: htmlOrMarkdown
}, userName, sessionId)
```

5. A küldésről a cron gondoskodik. Dev környezetben fusson periódikusan:
- scripts/dev-email-cron.js már indítható: `npm run dev:email-cron`
- vagy hívd kézzel: `GET /api/cron/process-email-queue`

## 4) Sablonok és szabályok létrehozása

- Hozz létre (vagy válaszd ki) egy `email_templates` rekordot a quiz-hez és nyelvhez (subject, body_markdown/body_html, változók).
- Adj hozzá `email_automation_rules` rekordot:
  - `trigger_event` (új) VAGY `rule_type` (legacy) = `quiz_complete` | `purchase` | `no_purchase_reminder`
  - `email_template_id`
  - `delay_minutes` (0 = azonnali)
  - `is_active` = true
  - (opcionális) `conditions` pl. min/max percentage

## 5) Hasznos API-k

- Queue ellenőrzés: `GET /api/admin/email-queue?quiz_id=<uuid>&status=pending`
- Szabályok: `GET /api/admin/email-automation-rules?quiz_id=<uuid>`
- Backfill kézi futtatás: `POST /api/admin/email-queue/backfill`
- Cron: `GET /api/cron/process-email-queue?safe=true&backfill=true&retry=true`

## 6) Környezeti változók

```
RESEND_API_KEY=...
FROM_EMAIL=noreply@yourdomain.com
SUPPORT_EMAIL=support@yourdomain.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
EMAIL_RECIPIENT_GRACE_MS=7200000   # 2 óra
EMAIL_PROCESSING_STALE_MS=900000    # 15 perc
```

## 7) Tippek és edge case-ek

- Ha a lead később érkezik meg, a backfill és a türelmi idő biztosítja, hogy az email mégis elmenjen.
- Ha régi környezetben a szabályok `rule_type` oszlopban vannak, a rendszer automatikusan ahhoz igazodik.
- Ha sok `processing` tétel ragadna, a stale-requeue visszaállítja őket `pending`-re.
- Történelmi `failed` tételeket csak manuálisan érdemes újraküldeni (változók/konfiguráció javítása után).

## 8) Példa integráció új oldalba (összefoglaló)

- Új oldal komponensében a submit/befejezés után hívd meg a fenti AI/score-only API-t.
- Győződj meg róla, hogy a lead már mentésre került (email gate -> `/api/quiz/lead`).
- Nincs szükség direkt email küldésre: a cron feldolgozza a sort és küld.

--
Utolsó frissítés: 2025-08-20
