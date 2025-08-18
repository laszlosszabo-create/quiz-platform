# ADHD Landing Page - Translation Keys

## Használat

Az ADHD landing oldal (`/[lang]/adhd-quick-check`) mostantól teljes mértékben a Supabase fordítási rendszerből tölti a szövegeket. Minden szöveg szerkeszthető az admin felületen: `/admin/quiz-editor` → ADHD kvíz → Fordítások tab.

## Fordítási kulcsok listája

### Hero szekció
- `landing_hero_title` - Főcím (fallback: `landing_headline`)
- `landing_hero_sub` - Alcím (fallback: `landing_sub`)
- `landing_hero_note` - Apró szöveg a CTA alatt (alapértelmezett: "Nincs e-mail szükséges • Nincs mentés • Átlátható eredmény")
- `landing_badge_1` - Első jelvény (alapértelmezett: "Gyors")
- `landing_badge_2` - Második jelvény (alapértelmezett: "Ingyenes")
- `landing_badge_3` - Harmadik jelvény (alapértelmezett: "Nem diagnózis")
- `landing_time_estimate` - Becsült idő (alapértelmezett: "Becsült idő: 2-3 perc")
- `landing_question_count` - Kérdések száma (alapértelmezett: "8-10 kérdés")

### CTA gombok
- `landing_cta_primary` - Főgomb szövege (fallback: `landing_cta_text`, `cta_text`)
- `landing_cta_secondary` - Mellékgomb szövege (alapértelmezett: "Tudj meg többet")
- `landing_cta_mid` - Középső CTA (fallback: `landing_cta_primary`)
- `landing_cta_urgency` - Urgencia szekció CTA
- `landing_final_cta_button` - Utolsó CTA gomb

### Statisztikák szekció
- `landing_stats_title` - Statisztikák cím (alapértelmezett: "Már több ezren használták")
- `landing_stats_desc` - Statisztikák leírás (alapértelmezett: "Gyors, megbízható és tájékoztató eredmények")
- `landing_stat_1_number` - Első szám (alapértelmezett: "15.000+")
- `landing_stat_1_label` - Első címke (alapértelmezett: "Kitöltő")
- `landing_stat_2_number` - Második szám (alapértelmezett: "2 perc")
- `landing_stat_2_label` - Második címke (alapértelmezett: "Átlagos idő")
- `landing_stat_3_number` - Harmadik szám (alapértelmezett: "94%")
- `landing_stat_3_label` - Harmadik címke (alapértelmezett: "Elégedettség")
- `landing_stat_4_number` - Negyedik szám (alapértelmezett: "100%")
- `landing_stat_4_label` - Negyedik címke (alapértelmezett: "Ingyenes")

### Trust/Előnyök szekció
- `landing_trust_section_title` - Szekció cím (alapértelmezett: "Miért választják sokan?")
- `landing_trust_section_desc` - Szekció leírás
- `landing_trust_item_1_title` - Első előny címe (alapértelmezett: "Gyors és egyszerű")
- `landing_trust_item_1_desc` - Első előny leírása
- `landing_trust_item_2_title` - Második előny címe (alapértelmezett: "Személyre szabott")
- `landing_trust_item_2_desc` - Második előny leírása
- `landing_trust_item_3_title` - Harmadik előny címe (alapértelmezett: "Tájékoztató jellegű")
- `landing_trust_item_3_desc` - Harmadik előny leírása

### Hogyan működik szekció
- `landing_how_section_title` - Szekció cím (alapértelmezett: "Hogyan működik?")
- `landing_how_section_desc` - Szekció leírás
- `landing_how_1_title` - Első lépés címe (alapértelmezett: "Válaszolj")
- `landing_how_1_desc` - Első lépés leírása
- `landing_how_2_title` - Második lépés címe (alapértelmezett: "Értékelünk")
- `landing_how_2_desc` - Második lépés leírása
- `landing_how_3_title` - Harmadik lépés címe (alapértelmezett: "Visszajelzés")
- `landing_how_3_desc` - Harmadik lépés leírása

### Mire számíthatsz szekció
- `landing_expect_title` - Szekció cím (alapértelmezett: "Mire számíthatsz?")
- `landing_expect_desc` - Szekció leírás
- `landing_expect_1_title` - Első elem címe (alapértelmezett: "Pontos értékelés")
- `landing_expect_1_desc` - Első elem leírása
- `landing_expect_2_title` - Második elem címe (alapértelmezett: "Azonnali eredmény")
- `landing_expect_2_desc` - Második elem leírása
- `landing_expect_3_title` - Harmadik elem címe (alapértelmezett: "Praktikus tanács")
- `landing_expect_3_desc` - Harmadik elem leírása
- `landing_expect_4_title` - Negyedik elem címe (alapértelmezett: "Biztonságos")
- `landing_expect_4_desc` - Negyedik elem leírása

### Urgencia szekció
- `landing_urgency_title` - Szekció cím (alapértelmezett: "Miért fontos most elkezdeni?")
- `landing_urgency_desc` - Szekció leírás
- `landing_urgency_point_1` - Első pont
- `landing_urgency_point_2` - Második pont
- `landing_urgency_point_3` - Harmadik pont

### Garanciák szekció
- `landing_guarantee_title` - Szekció cím (alapértelmezett: "Garanciáink")
- `landing_guarantee_1` - Első garancia (alapértelmezett: "✓ 100% ingyenes...")
- `landing_guarantee_2` - Második garancia
- `landing_guarantee_3` - Harmadik garancia
- `landing_guarantee_4` - Negyedik garancia

### Ajánlások (opcionális)
- `landing_testimonial_1_quote` - Első ajánlás szövege
- `landing_testimonial_1_author` - Első ajánlás szerzője
- `landing_testimonial_2_quote` - Második ajánlás szövege
- `landing_testimonial_2_author` - Második ajánlás szerzője
- `landing_testimonial_3_quote` - Harmadik ajánlás szövege
- `landing_testimonial_3_author` - Harmadik ajánlás szerzője

### GYIK (opcionális)
- `landing_faq_section_title` - GYIK szekció cím (alapértelmezett: "Gyakori kérdések")
- `landing_faq_1_q` - Első kérdés
- `landing_faq_1_a` - Első válasz
- `landing_faq_2_q` - Második kérdés
- `landing_faq_2_a` - Második válasz
- `landing_faq_3_q` - Harmadik kérdés
- `landing_faq_3_a` - Harmadik válasz
- `landing_faq_4_q` - Negyedik kérdés
- `landing_faq_4_a` - Negyedik válasz
- `landing_faq_5_q` - Ötödik kérdés
- `landing_faq_5_a` - Ötödik válasz
- `landing_faq_6_q` - Hatodik kérdés
- `landing_faq_6_a` - Hatodik válasz

### Adatvédelem szekció
- `landing_privacy_title` - Szekció cím (alapértelmezett: "Adatvédelem és biztonság")
- `landing_privacy_desc` - Szekció leírás
- `landing_privacy_point_1` - Első pont
- `landing_privacy_point_2` - Második pont
- `landing_privacy_point_3` - Harmadik pont
- `landing_privacy_point_4` - Negyedik pont

### Orvosi disclaimer
- `landing_medical_title` - Szekció cím (alapértelmezett: "Fontos orvosi tudnivalók")
- `landing_medical_point_1` - Első pont
- `landing_medical_point_2` - Második pont
- `landing_medical_point_3` - Harmadik pont
- `landing_medical_point_4` - Negyedik pont
- `landing_disclaimer` - Főszöveg

### Utolsó CTA szekció
- `landing_final_cta_title` - Utolsó CTA cím
- `landing_final_cta_desc` - Utolsó CTA leírás

### SEO Metadata
- `meta_title` - Oldal címe (fallback: `landing_headline`)
- `meta_description` - Oldal leírása (fallback: `landing_description`)

## Prioritás

### Magas prioritás (mindenképpen kitöltendő)
1. Hero szekció alapok (title, sub, cta_primary)
2. Trust elemek (1-3 title + desc)
3. How elemek (1-3 title + desc)
4. Statisztikák számok és címkék
5. Meta title és description

### Közepes prioritás (konverzió növelése)
1. Urgencia szekció
2. Garanciák
3. Expect szekció
4. Privacy pontok
5. Medical disclaimer pontok

### Alacsony prioritás (extra tartalom)
1. Testimonials (ha vannak)
2. GYIK (ha vannak gyakori kérdések)
3. További badge-ek és pontok

## Megjegyzések

- Minden kulcs opcionális, van fallback értéke
- A szekciók automatikusan eltűnnek, ha nincs tartalom (pl. testimonials, GYIK)
- A fordítások magyar és angol nyelvre is kitölthetők
- Az adminban kategóriánként csoportosítva jelennek meg a mezők
