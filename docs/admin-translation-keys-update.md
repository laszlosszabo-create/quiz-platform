# Admin Fordítási Kulcsok Frissítése - ADHD Landing

## ✅ Módosított Fájlok

### 1. `/public/admin/translations-native.html`
**Hatás**: Fő admin fordítási felület (iframe-es szerkesztő)
**Változások**: 
- Teljes átkategorializálás: 12 új szekció
- 80+ új fordítási kulcs hozzáadása
- Kategóriák: Hero szekció, CTA gombok, Statisztikák, Trust/Előnyök, Hogyan működik, Mire számíthatsz, Urgencia, Garanciák, Ajánlások, GYIK, Adatvédelem, Orvosi disclaimer, Utolsó CTA, SEO, Legacy

### 2. `/src/app/admin/quizzes/[id]/translations/edit-native.html`
**Hatás**: Kvíz-specifikus fordítási szerkesztő
**Változások**:
- `fieldKeys` array kibővítése az összes új kulccsal  
- Legacy kulcsok megtartása kompatibilitás miatt
- Rendezett struktúra szekciókra bontva

### 3. `/src/app/admin/components/simple-translation-editor.tsx`
**Hatás**: React-alapú egyszerű fordítási szerkesztő komponens
**Változások**:
- `FIELD_KEYS` konstans bővítése 
- Csak a legfontosabb kulcsok (Hero, Trust, How) a túl hosszú lista elkerülésére

### 4. `/src/app/admin/translations/page.tsx`
**Hatás**: Globális fordítások kezelő oldal
**Változások**:
- `requiredFields` frissítése prioritások szerint
- Magas/közepes prioritású kulcsok kiemelése
- Legacy kulcsok megtartása

## 🎯 Új Kategóriák az Adminban

### Magas prioritás (16 szekció)
1. **Hero szekció** - főcím, alcím, jelvények, időbecslés
2. **CTA gombok** - összes gomb szövege  
3. **Statisztikák** - 4 szám + címkék
4. **Trust/Előnyök** - 3 előny cím + leírás
5. **Hogyan működik** - 3 lépés cím + leírás
6. **SEO** - meta title + description

### Közepes prioritás (6 szekció)
7. **Mire számíthatsz** - 4 elem
8. **Urgencia** - sürgető üzenet + 3 pont
9. **Garanciák** - 4 garancia
10. **Adatvédelem** - 4 pont
11. **Orvosi disclaimer** - 4 pont + főszöveg
12. **Utolsó CTA** - végső felhívás

### Opcionális (4 szekció)
13. **Ajánlások** - 3 testimonial
14. **GYIK** - 6 kérdés-válasz pár  
15. **Legacy** - kompatibilitási kulcsok

## 📋 Admin Workflow

### Hol kell szerkeszteni:
1. **Direkt link**: http://localhost:3000/admin/quiz-editor?id=c54e0ded-edc8-4c43-8e16-ecb6e33f5291
2. **Navigáció**: Admin → Quiz Editor → ADHD kvíz → Fordítások tab
3. **Alternatíva**: Admin → Translations → ADHD kvíz

### Mit kell kitölteni először:
1. **Hero szekció**: `landing_hero_title`, `landing_hero_sub`, `landing_cta_primary`
2. **Trust elemek**: Mind a 6 trust kulcs (3 cím + 3 leírás)  
3. **How lépések**: Mind a 6 how kulcs (3 cím + 3 leírás)
4. **Statisztikák**: 8 kulcs (4 szám + 4 címke)
5. **SEO**: `meta_title`, `meta_description`

### Magyarázat minden mezőhöz:
- Az admin felület most kategóriánként csoportosítva mutatja a mezőket
- Minden mezőnek van érthető magyar címkéje
- A multiline mezők textarea-ként jelennek meg
- A kategóriák összecsukhatók/kinyithatók

## ✅ Tesztelés

- Admin quiz editor: ✓ 200 
- Admin translations: ✓ 200
- Landing page: ✓ 200 (változatlanul működik)

## 🚀 Következő Lépések

1. **Adminban** töltsd ki a prioritási sorrendben a kulcsokat
2. **Magyar nyelvű** tartalommal kezdj
3. **Angol fordítás** csak a legfontosabb kulcsokhoz
4. **Tesztelj** minden szekciót külön-külön a landen

A fordítási rendszer most teljes mértékben támogatja az ADHD landing komplett tartalmát!
