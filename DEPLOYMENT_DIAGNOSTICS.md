# Vercel Deployment Diagnostics

Ha a git push NEM indít automatikus deploymentet, kövesd ezt a sorrendet.

## 1. Git kapcsolat ellenőrzése
Project → Settings → Git:
* Connected Git Repository: kell látnod `SZSL333/quiz-platform`-ot.
* Ha nincs: `Connect Git Repository` gomb → válaszd ki a repo-t.
* Ha rossz repo van csatolva: `Disconnect` → újra csatlakoztat.

## 2. GitHub App jogosultság
GitHub → Settings → Applications → Installed GitHub Apps → Vercel.
* Configure → repos listában legyen pipálva a `quiz-platform`.
* Ha org / user wide, ellenőrizd hogy nem "selected repositories" állapotban van repo nélkül.

## 3. Branch beállítás
Settings → Git → Production Branch = `main`.
Ha más, állítsd vissza `main`-re.

## 4. Build trigger manuális teszt
Deployment listában `Redeploy` helyett használd a `Deploy from Git` (ha elérhető).
Ha nincs ilyen opció, akkor a projekt *nem git-alapú* (manuális feltöltés mód). Új projekt kell git alapból:
1. Vercel fő dashboard → `Add New...` → `Project`.
2. Válaszd ki a `quiz-platform` repo-t.
3. Root Directory: `.`
4. Framework: Next.js (auto), Build Command: üres.
5. Deploy.
Ez után a régi (manuál) projektet töröld vagy nevezd át, és a domaint (tools.szabosutilaszlo.com) átirányítod az újra.

## 5. Domain átmozgatás
Settings → Domains (a régi, manuális projektben): `Remove` a custom domain-ről.
Majd az új (git-linked) projektben → `Add Domain` → tools.szabosutilaszlo.com.
Propagation után (1-3 perc) ellenőrzés: `curl -I https://tools.szabosutilaszlo.com/api/version`.

## 6. Statikus export kizárása
Ne legyen semmilyen env var ami exportot kényszerít:
* Settings → Environment Variables: töröld: `STATIC_EXPORT`, `NEXT_EXPORT`, `OUTPUT=export` stb.
`next.config.js` jelenleg NEM állít `output: 'export'`-ot, így rendben.

## 7. Ellenőrző endpointok
* https://<vercel-app-domain>/api/version → JSON (sha)
* https://tools.szabosutilaszlo.com/api/version → ugyanaz a sha
* Ha version megy, de /api/quiz/session 404: nézd a Functions listát (Deployment oldal alja). Ha hiányzik: route nincs buildelve.

## 8. Forced dynamic (ha még mindig export-gyanú)
Adj a `src/app/api/version/route.ts` tetejére ideiglenesen:
```ts
export const runtime = 'node';
export const dynamic = 'force-dynamic';
```
Új push → ha továbbra sincs function, biztosan rossz projektet nézel.

## 9. Vercel CLI gyors validálás
```bash
npm i -g vercel
vercel link   # ha kéri, válaszd ki a git projektet
vercel env pull .env.vercel
vercel inspect <deployment-url>
```
Keress `api/quiz/session` a kimenetben.

## 10. Gyors differenciálás (custom domain vs vercel domain)
| Teszt | vercel.app | tools.* |
|-------|------------|---------|
| /api/version | ? | ? |
| /api/ping | ? | ? |
| /api/quiz/session (GET) | 405/Method? | 404? |

Ha csak a custom domain 404, domain assignment a hiba. Ha mindkettő 404, a build.

## 11. Miután megjavult
Töröld a diagnosztikai overlayt (`CommitInfo`) ha zavar.

---
Ha átmigráltad az új git-linked projektre és még mindig gond van, jegyezd fel a legutóbbi deployment URL-t és a `x-vercel-id` headert, és küldd el.
