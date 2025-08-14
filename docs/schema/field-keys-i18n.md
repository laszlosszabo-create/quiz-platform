# Internationalization Field Keys

## Overview

Az összes felhasználói szöveg a `quiz_translations` táblában tárolódik `field_key` alapján, amely lehetővé teszi a teljes többnyelvűséget és centralizált tartalomkezelést.

## Field Key Konvenciók

### Naming Rules
- **Snake_case**: Csak kisbetűk és aláhúzás
- **Hierarchikus**: Kategória:alkategória:specifikus_mező
- **Beszédes**: A kulcs alapján egyértelmű a tartalom
- **Konzisztens**: Azonos típusú tartalmak azonos mintát követnek

## Landing Page Szövegek

### Fő elemek
```
landing_headline          # Fő cím
landing_sub              # Alcím/leírás
landing_hero_image_url   # Hero kép URL
landing_hero_image_alt   # Hero kép alt text
cta_text                 # Fő CTA gomb szöveg
cta_secondary_text       # Másodlagos CTA szöveg
```

### Social Proof
```
social_proof_title       # "Mit mondanak rólunk" típusú cím
social_proof_item_1      # Első testimonial
social_proof_item_2      # Második testimonial  
social_proof_item_3      # Harmadik testimonial
social_proof_stats_text  # "1000+ kitöltött teszt" típus
```

### Meta adatok
```
meta_title              # SEO title tag
meta_description        # SEO meta description
og_title               # Open Graph title
og_description         # Open Graph description
```

## Quiz Kérdések és Opciók

### Kérdés szövegek
```
question:<key>:text           # Kérdés szövege
question:<key>:help          # Segítő szöveg/tooltip
question:<key>:description   # Részletes leírás
```

**Példa**:
```
question:attention_span:text        # "Mennyire nehéz koncentrálnod?"
question:attention_span:help        # "Gondolj a munkahelyi feladatokra"
question:hyperactivity:text         # "Gyakran érzed magad nyugtalannak?"
```

### Válaszopciók
```
option:<option_key>:label           # Opció szövege
option:<option_key>:description     # Opció részletes leírása
```

**Példa**:
```
option:never:label                  # "Soha"
option:rarely:label                 # "Ritkán"  
option:sometimes:label              # "Néha"
option:often:label                  # "Gyakran"
option:always:label                 # "Mindig"

option:scale_1:label                # "1 - Egyáltalán nem"
option:scale_5:label                # "5 - Teljes mértékben"
```

## Eredmény Szövegek

### Statikus eredmények (scoring alapú)
```
result_static_low                   # Alacsony pontszám eredmény
result_static_medium                # Közepes pontszám eredmény  
result_static_high                  # Magas pontszám eredmény

result_static_low_title             # Alacsony eredmény címe
result_static_low_description       # Alacsony eredmény leírása
result_static_low_recommendations   # Javaslatok alacsony eredményhez

result_static_medium_title          # Közepes eredmény címe
result_static_medium_description    # Közepes eredmény leírása
result_static_medium_recommendations # Javaslatok közepes eredményhez

result_static_high_title            # Magas eredmény címe
result_static_high_description      # Magas eredmény leírása
result_static_high_recommendations  # Javaslatok magas eredményhez
```

### Eredmény oldal elemek
```
result_headline                     # "Az eredményed" típusú cím
result_share_text                   # Social sharing szöveg
result_cta_product                  # Termék vásárlás CTA
result_cta_booking                  # Foglalás CTA  
result_disclaimer                   # Jogi disclaimer
```

## E-mail Sablonok

### Üdvözlő e-mail (0. nap)
```
email:welcome:subject               # E-mail tárgy
email:welcome:preheader            # Preview szöveg
email:welcome:body                 # E-mail törzs (HTML/text)
email:welcome:cta_text             # CTA gomb szöveg
email:welcome:footer               # E-mail lábjegyzet
```

### Tippek e-mail (2. nap)
```
email:tips_2d:subject              # "Hasznos tippek" tárgy
email:tips_2d:preheader           # Preview szöveg
email:tips_2d:body                # E-mail törzs
email:tips_2d:cta_text            # CTA gomb szöveg
```

### Upsell e-mail (5. nap)
```
email:upsell_5d:subject           # "Segíthetünk még többet" tárgy
email:upsell_5d:preheader        # Preview szöveg  
email:upsell_5d:body             # E-mail törzs
email:upsell_5d:cta_text         # "Coaching foglalás" CTA
```

### Tranzakciós e-mailek
```
email:purchase_confirmation:subject    # Vásárlás visszaigazolás tárgy
email:purchase_confirmation:body      # Vásárlás visszaigazolás törzs
email:download_ready:subject          # Letöltés kész tárgy
email:download_ready:body            # Letöltés kész törzs
```

## Termék Szövegek

### Termék leírások (products.translations JSONB-ben)
```json
{
  "hu": {
    "name": "Személyre szabott ADHD Jelentés",
    "short_description": "Részletes elemzés és személyre szabott javaslatok",
    "long_description": "...",
    "features": ["Részletes elemzés", "Személyre szabott javaslatok"],
    "cta_text": "Megvásárlom most"
  },
  "en": {
    "name": "Personalized ADHD Report", 
    "short_description": "Detailed analysis with personalized recommendations",
    "long_description": "...",
    "features": ["Detailed analysis", "Personal recommendations"],
    "cta_text": "Buy Now"
  }
}
```

## UI Elemek

### Navigáció és általános
```
ui_loading_text                    # "Betöltés..." szöveg
ui_error_general                   # Általános hibaüzenet
ui_error_network                   # Hálózati hiba üzenet
ui_retry_button                    # "Újra" gomb szöveg
ui_back_button                     # "Vissza" gomb szöveg
ui_next_button                     # "Tovább" gomb szöveg
ui_submit_button                   # "Küldés" gomb szöveg
```

### Progress és státusz
```
progress_question_x_of_y           # "3/8 kérdés" formátum
progress_completion_percent        # "75% kész" formátum
status_saving                      # "Mentés..." szöveg
status_saved                       # "Elmentve" szöveg
```

### Formok
```
form_email_label                   # "E-mail cím" label
form_email_placeholder            # "pelda@email.com" placeholder
form_name_label                   # "Név" label  
form_name_placeholder             # "Teljes név" placeholder
form_required_field               # "*kötelező mező" szöveg
form_invalid_email                # "Érvénytelen e-mail" hiba
```

## Admin Felület Szövegek

### Dashboard
```
admin_dashboard_title              # "Quiz Adminisztrció" 
admin_quiz_list_title             # "Quiz-ek kezelése"
admin_create_quiz_button          # "Új quiz létrehozása"
admin_duplicate_quiz_button       # "Quiz duplikálása"
```

### Szerkesztő felület
```
admin_editor_title                # "Quiz szerkesztő"
admin_translations_tab            # "Fordítások" tab
admin_questions_tab               # "Kérdések" tab
admin_scoring_tab                 # "Pontozás" tab
admin_save_button                 # "Mentés" gomb
admin_preview_button              # "Előnézet" gomb
```

## Validáció és hibaüzenetek

### Űrlap validáció
```
validation_required               # "Ez a mező kötelező"
validation_email_invalid          # "Érvénytelen e-mail formátum"
validation_min_length            # "Minimum {n} karakter szükséges"
validation_max_length            # "Maximum {n} karakter engedélyezett"
```

### Quiz validáció
```
validation_select_option          # "Kérlek válassz egy opciót"
validation_all_questions_required # "Minden kérdést meg kell válaszolni"
validation_quiz_not_found        # "A kívánt quiz nem található"
```

## Változók a szövegekben

### Támogatott placeholder-ek
```
{{name}}                          # Lead neve
{{email}}                         # Lead e-mail címe
{{quiz_title}}                    # Quiz címe
{{score}}                         # Elért pontszám
{{percentage}}                    # Százalékos eredmény
{{result_category}}               # Eredmény kategória (low/medium/high)
{{download_url}}                  # Letöltési link
{{booking_url}}                   # Foglalási link
{{unsubscribe_url}}              # Leiratkozási link
```

### Használati példa
```
email:welcome:body: "Kedves {{name}}! A {{quiz_title}} eredményed {{percentage}}%. Letöltési link: {{download_url}}"
```

## Fallback Mechanizmus

### Hiányzó fordítás kezelése
1. **Elsődleges**: Kért nyelv (`lang` paraméter)
2. **Fallback**: Quiz default_lang mezője  
3. **Ultimate fallback**: Magyar ("hu") nyelv
4. **Error fallback**: `"[MISSING: {field_key}]"` placeholder

### Példa fallback logika
```typescript
function getTranslation(quizId: string, lang: string, fieldKey: string): string {
  // 1. Kért nyelv
  let translation = findTranslation(quizId, lang, fieldKey);
  if (translation) return translation;
  
  // 2. Default nyelv
  const quiz = getQuiz(quizId);
  translation = findTranslation(quizId, quiz.default_lang, fieldKey);
  if (translation) return translation;
  
  // 3. Magyar fallback
  translation = findTranslation(quizId, 'hu', fieldKey);
  if (translation) return translation;
  
  // 4. Error placeholder
  return `[MISSING: ${fieldKey}]`;
}
```

## Best Practices

### Field Key Tervezés
- **Anticipate changes**: Jövőbeli bővítések figyelembevétele
- **Consistent naming**: Hasonló funkciók hasonló kulcsokkal
- **Avoid conflicts**: Unique kulcsok quiz-on belül
- **Document everything**: Minden kulcs dokumentálása

### Content Management
- **Version control**: Tartalom változások követése
- **A/B testing**: Múltiple verziók támogatása `field_key_v2` stílusban
- **Content validation**: Kötelező mezők ellenőrzése admin felületen
- **Preview system**: Változások előnézete publikálás előtt
