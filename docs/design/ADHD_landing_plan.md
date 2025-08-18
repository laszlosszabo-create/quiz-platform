# ADHD Landing – Long‑form, magas konverziójú oldal terv

Dátum: 2025-08-18  
Fókusz: HU/EN többnyelvű, social proof fókusz, ismétlődő kvíz‑indító CTA, gyors bizalomépítés, akadályok csökkentése.

---

## 1) Üzleti célok és KPI-k
- Elsődleges KPI: Quiz Start Rate (LP → Quiz indítás) ≥ 35%
- Másodlagos: Lead capture rate (Result → Email), Session completion ≥ 70%
- Kiegészítő: Scroll depth 50%+, CTA CTR per section, Time-to-first-interaction < 8s

## 2) Célcsoport, insightok
- Felnőttek, akik gyanítják az ADHD jeleit (időmenedzsment, fókusz, impulzivitás)
- Érzelmi állapot: kíváncsiság + bizonytalanság; gyors, kockázatmentes első lépés kell
- Kulcs igények: hitelesség, diszkréció, rövid időráfordítás (2 perc), érthető nyelv

## 3) UVP (Unique Value Proposition)
- „2 perces, orvosi forrásokra építő gyorsellenőrzés, azonnali visszajelzéssel.”
- Kockázatmentes, ingyenes, anonim; nem diagnózis, hanem eligazítás.

## 4) Meggyőzési keretrendszer
- Problem → Agitate → Solve (PAS) + Social proof + Risk reduction.
- Fő akadályok: „Ez biztos butaság?”, „Nincs időm.”, „Mi lesz az adataimmal?”
- Válaszok: Szakmai hivatkozások, 2 perces időígéret, GDPR/anonimitás, transzparens disclaimer.

## 5) Információs architektúra (szekciók és céljuk)
1. Hero (értékajánlat, 2–3 bullet, elsődleges CTA)
2. Trust bar (logók/„Több mint 12 000 kitöltés” + értékelés csillagok)
3. Tünet‑checklist (felhasználó felismerés – rövid lista)
4. Hogyan működik (3 lépés: 2 perc → eredmény → további lépések)
5. Eredmények/mit kapsz (példaképernyő + rövid magyarázat)
6. Social proof (felhasználói vélemények, minőségi idézetek, min. 3‑5)
7. Szakmai háttér (források, módszertan, disclaimerek)
8. Gyakori kérdések (ellenállások kezelése – adatkezelés, pontosság, következő lépés)
9. Végső CTA banner (erős ismétlés, micro‑garancia: ingyenes/anonim)
10. Footer (jogi, adatvédelem, kapcsolat)

CTA elhelyezések: Hero, S2 (trust), S4, S6, S9 + sticky mobil CTA.

## 6) CTA stratégia
- Fő szöveg (HU):
  - „Indítsd el a 2 perces ADHD gyorstesztet”
  - „Kezdd el most – ingyenes és anonim”
  - „Válaszolj pár kérdésre, azonnali visszajelzés”
- EN változat: „Start the 2‑minute ADHD quick check” / „Free & anonymous”
- Variánsok A/B-re: „Kezdjük” vs „Indítás” vs „Teszt elkezdése”
- URL: /[lang]/[quizSlug]/quiz?start=1
- Sticky CTA mobilon; desktopon a jobb alsó sarokban lebegő gomb, alacsony takarással.

## 7) Social proof terv
- Formátumok: számosság (x kitöltés), átlagos értékelés (★4.8/5), rövid idézetek (keresztnév+kor), szakmai hivatkozás.
- Elhelyezés: trust bar a hajtás felett; részletes vélemények a középmezőnyben; szakmai blokk a végén.
- Moderáció: kerüljük a túlzó állításokat; orvosi disclaimerek.

## 8) Vizuális irány (színek, tipográfia, képi világ)
- Paletta (Tailwind):
  - Primary: sky-600/700 (nyugodt, bizalom)
  - Accent: emerald-500 (CTA), hover: emerald-600
  - Neutrals: zinc-800 szöveg, zinc-500 kiegészítő, zinc-50 háttér
  - Feedback: amber-500 (figyelem), red-500 (hiba) – visszafogottan
- Tipográfia: Inter vagy Source Sans 16–18px base, 28–36px hero headline; 1.5–1.7 line-height
- Képi világ: finom illusztrációk/ikonok, stock kerülése; képernyőkép‑mockup a „Mit kapsz?” blokkban
- Hozzáférhetőség: kontraszt ≥ 4.5:1; fókusz‑állapot; billentyű‑navigáció; mozgás minimalizálás

## 9) UX microcopy + compliance
- Disclaimerek: „Az eredmény tájékoztató jellegű, nem helyettesíti az orvosi diagnózist.”
- Adatvédelem: GDPR, cookie banner, anonimitás – rövid magyarázat az LP‑n
- Hangnem: empatikus, nem stigmatizáló; rövid, aktív mondatok

## 10) SEO/SMO
- Meta title: „ADHD Gyorsteszt (2 perc) – Ingyenes, anonim eredmény”
- Meta desc: 150–160 char; kulcsszavak: ADHD teszt, gyorsteszt, tünetek
- OG cím/kép: letisztult, szöveg-minimál; twitter:summary_large_image
- Sémák: FAQ schema a GYIK szekcióból

## 11) Teljesítmény
- LCP < 2.5s (kritikus CSS, next/image, képek AVIF/WebP)
- CLS ~0 (helykitöltők), TTI < 3s; szekcionált betöltés, lazyload

## 12) i18n tartalomszerkezet (kulcstérkép)
- landing.hero.title, subtitle, bullets[ ]
- landing.cta.primary, secondary
- landing.trust.stats, logos.alt[ ]
- landing.checklist.items[ ]
- landing.how.steps[ ] (title, desc)
- landing.results.preview.title, bullets[ ]
- landing.testimonials.items[ ] (quote, author, meta)
- landing.expert.title, sources[ ]
- landing.faq.items[ ] (q, a)
- landing.disclaimer, privacy.blurb

## 13) Komponensek (Next.js + Tailwind)
- HeroSection: { title, subtitle, bullets[], cta }
- TrustBar: { stats, logoUrls[] }
- SymptomChecklist: { items[] }
- HowItWorks: { steps[] }
- ResultPreview: { image, bullets[] }
- Testimonials: { items[] }
- ExpertSources: { items[] }
- FAQ: { items[] }
- FinalCTABanner: { title, subtitle, cta }
- StickyCTA: { label, href }
- Shared CTAButton: { variant, size, href, tracking }

Props‑szintű i18n: kulcsok → fordítás → komponens.

## 14) Tracking és mérés
- Események: LP_CTA_CLICK (section_id), SCROLL_50/75/90, FAQ_TOGGLE, TESTIMONIAL_NAV
- Fő funnel: LP_VIEW → LP_CTA_CLICK → QUIZ_START → QUIZ_COMPLETE → LEAD_SUBMIT
- Mérőszámok: CTA CTR szekciónként; heatmap‑alternatíva: scroll proxies
- Adattárolás: `audit_logs` (USER_ prefixű események) vagy dedikált tracking táblák

## 15) A/B teszt hipotézisek
1) Hero CTA szöveg („Indítsd el…” vs „Kezdjük el most”) → CTR +5–10%
2) Social proof pozíció (hero alatt vs középen) → LP → Quiz indítás +3–5%
3) Tünet‑checklist hossza (5 vs 8 pont) → Engagement + scroll depth

## 16) Tartalomváz (HU) – első iteráció
- Hero cím: „Gyanakszol ADHD‑ra? 2 perc alatt kapsz visszajelzést.”
- Alcím: „Ingyenes és anonim gyorsteszt, hétköznapi nyelven, azonnali eredménnyel.”
- Bullet‑pontok: „2 perc • Anonim • Szakmai háttér”
- CTA: „Indítsd el a 2 perces ADHD gyorstesztet”
- Trust stat: „12 000+ kitöltés, ★4.8/5 értékelés”
- Checklist: 5 jel – „nehezen fókuszálsz…”, „csúsznak a határidők…” stb.
- 3 lépés: Kérdések → Eredmény → Következő lépések
- Eredmény blokk: képernyőkép + „nem diagnózis” disclaimer
- Vélemények: 3–5 rövid idézet (keresztnév + kor)
- Szakmai források: 2–3 hivatkozás
- GYIK: adatkezelés, pontosság, mennyi idő, következő lépés
- Záró CTA: ismétlés + micro‑garancia

## 17) Oldalstruktúra és útvonal
- Útvonal: `/[lang]/adhd-quick-check` (landing) → CTA → `/[lang]/adhd-quick-check/quiz`
- Későbbi bővítés: UTM paraméterek, külön variánsok teszteléshez

## 18) Megvalósítási lépések (iteratív)
1) Komponens vázak + routing (HU) – statikus copy placeholderrel
2) Szín- és tipográfiai tokenek (Tailwind config finomhangolás)
3) Copy első kör (HU), majd EN változat
4) Social proof adatok feltöltése (mock → valós)
5) Sticky CTA + ismétlési pontok bekötése
6) Tracking események bekötése (LP_CTA_CLICK, SCROLL)
7) A11y és performance ellenőrzések (Lighthouse)
8) A/B teszthez hookok (feature flag/variant param)

## 19) Elfogadási kritériumok
- HU/EN oldal kész, többszörös CTA elhelyezéssel
- Social proof látható hero felett és középen
- Legal + adatvédelmi információk elérhetőek
- Teljesítmény és hozzáférhetőség megfelel
- Tracking események naplózódnak (Supabase)

---

## Rövid összefoglaló
A long‑form oldal célja, hogy gyors bizalmat építsen (social proof), csökkentse a belépési akadályokat (2 perc, anonim), és több ponton kínáljon CTA‑t. Az információs ív PAS + bizonyítékok + GYIK. A vizuális irány nyugodt, orvosi témához illeszkedő; a CTA kontrasztos, ismétlődik, és mobilon sticky. A mérés és A/B teszt előkészítve.
