# Quiz AI timeout → 200-as score-only fallback + DevTools 404 zajcsillapítás

Dátum: 2025-08-21

## Mi változott
- Quiz AI generálásnál (endpoint: `/api/ai/generate-result`, result_type=quiz) az AI hiba/timeout mostantól NEM ad 500-at. Helyette:
  - 200 OK választ adunk egy score-only fallback HTML-lel.
  - Elindítjuk a quiz completion e-mail automatizmust a fallback tartalommal.
- Hozzáadtunk egy route-ot a DevTools zaj csökkentésére: `/.well-known/appspecific/com.chrome.devtools.json` → 204 No Content.

## Érintett fájlok
- `src/app/api/ai/generate-result/route.ts`
  - AI hiba/timeout ág: 200-as válasz, score-only fallback, e-mail trigger biztosítva.
  - Last-ditch fallback is, ha a score-only helper sem elérhető.
- `src/app/.well-known/appspecific/com.chrome.devtools.json/route.ts`
  - Új: 204 No Content a Chrome DevTools lekérésekre.

## Konfigurációk
- Modell: `OPENAI_CHAT_MODEL` (alapértelmezett: `gpt-4.1-mini`).
- Időkorlát: `QUIZ_AI_TIMEOUT_MS` (alap: 20000 ms), `PRODUCT_AI_TIMEOUT_MS` (alap: 20000 ms).

## Tesztelés
- Szándékos timeout: állítsd alacsonyra a `QUIZ_AI_TIMEOUT_MS` értéket (pl. 1000). A result oldal 200-zal tölt be score-only tartalommal, nem 500-zal.
- DevTools zaj: a böngésző többé nem generál 404-et a `/.well-known/appspecific/com.chrome.devtools.json` útvonalra.

## Kapcsolódó adatbázis
- A termék-elemzés metaadatainak tárolásához a `supabase/migrations/20250821123000_alter_product_ai_results_add_metadata.sql` hozzáadja: `provider`, `model`, `prompt_tokens`, `completion_tokens`, `total_tokens`, `mocked`, `request_id`, `metadata`.
- A fenti mezők írása megtörténik a product AI ágon (OpenAI hívás után upsert).

## Visszagörgetés
- Ha szükséges, a fallback logikát vissza lehet állítani az 500-as viselkedésre az AI error catch ágon, de nem javasolt (rossz UX).
