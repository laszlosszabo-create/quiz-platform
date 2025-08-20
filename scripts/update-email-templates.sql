-- Professional email templates with beautiful design
-- Created: 2025-08-19

-- Clear existing templates and insert new professional ones
DELETE FROM email_templates WHERE quiz_id IN (SELECT id FROM quizzes WHERE slug = 'adhd-quick-check');

-- Insert professional Result Email Template (Hungarian)
INSERT INTO email_templates (
    quiz_id, 
    template_type, 
    lang,
    template_name,
    subject_template,
    body_markdown,
    variables
) 
SELECT 
    id as quiz_id,
    'result' as template_type,
    'hu' as lang,
    '🎯 Quiz Eredmény - Professzionális Elemzés' as template_name,
    '{{quiz_title}} - Személyre Szabott Eredményei ({{percentage}}%)' as subject_template,
    '# Kedves {{user_name}}! 👋

Köszönjük, hogy kitöltötte a **{{quiz_title}}** kvízünket! Az alábbi részletes elemzést készítettük Önnek.

---

## 📊 Az Ön Eredménye

**🎯 Pontszám:** {{score}} pont  
**📈 Teljesítmény:** {{percentage}}% ({{category}})  
**📅 Dátum:** {{quiz_completion_date}}

---

## 🧠 AI Alapú Személyre Szabott Elemzés

{{ai_result}}

---

## 🚀 Következő Lépések

Az eredményei alapján az alábbi lépéseket javasoljuk:

- 📊 [**Részletes Elemzés Letöltése**]({{result_url}})  
  *Teljes körű, nyomtatható jelentés az eredményeivel*

- 📞 [**Ingyenes Konzultáció Foglalása**]({{booking_url}})  
  *15 perces személyes megbeszélés szakértőnkkel*

- 📥 [**Fejlesztési Útmutató Letöltése**]({{download_url}})  
  *Gyakorlati tippek és gyakorlatok*

---

## 💡 Tudta?

Az eredményei alapján személyre szabott fejlesztési tervet állíthatunk össze Önnek. Foglaljon időpontot, és beszéljük meg a lehetőségeket!

**Üdvözlettel,**  
**A Quiz Platform Szakértői Csapata** 

---

*Ha nem szeretne több emailt kapni tőlünk, [kattintson ide a leiratkozáshoz]({{unsubscribe_url}}).*' as body_markdown,
    '{
        "user_name": "Felhasználó neve",
        "user_email": "Email címe", 
        "quiz_title": "Quiz címe",
        "score": "Pontszám",
        "percentage": "Százalékos eredmény",
        "category": "Eredmény kategória",
        "ai_result": "AI generált személyre szabott elemzés",
        "quiz_completion_date": "Quiz kitöltésének dátuma",
        "result_url": "Részletes eredmény oldal URL",
        "booking_url": "Konzultáció foglalási URL",
        "download_url": "Anyagok letöltési URL",
        "unsubscribe_url": "Leiratkozási URL"
    }'::jsonb as variables
FROM quizzes 
WHERE slug = 'adhd-quick-check'
ON CONFLICT (quiz_id, product_id, template_type, lang) 
DO NOTHING;

-- Insert professional Purchase Confirmation Template (Hungarian)
INSERT INTO email_templates (
    quiz_id,
    template_type,
    lang,
    template_name, 
    subject_template,
    body_markdown,
    variables
)
SELECT 
    id as quiz_id,
    'purchase' as template_type,
    'hu' as lang,
    '🎉 Sikeres Vásárlás - Üdvözöljük!' as template_name,
    '✅ Vásárlás Megerősítése - {{product_name}}' as subject_template,
    '# Kedves {{user_name}}! 🎉

**Gratulálunk!** Sikeresen megvásárolta a **{{product_name}}** terméket. Köszönjük a bizalmat!

---

## 📦 Rendelés Részletei

**💎 Termék:** {{product_name}}  
**📅 Vásárlás dátuma:** {{purchase_date}}  
**💰 Összeg:** {{amount}} {{currency}}  
**🔗 Rendelés azonosító:** `{{order_id}}`

---

## 🎯 Quiz Eredményei

**📊 Pontszám:** {{score}} pont  
**🧠 AI Elemzés:**

{{ai_result}}

---

## 🚀 Termék Hozzáférés

Az Ön egyedi hozzáférési kódja: **`{{saved_analysis_code}}`**

### 🎯 Mit tehet most:

- 🔗 [**Termék Elérése**]({{product_url}})  
  *Azonnali hozzáférés a vásárolt tartalomhoz*

- 📥 [**Anyagok Letöltése**]({{download_url}})  
  *Minden mellékelt dokumentum és útmutató*

- 📞 [**Prémium Konzultáció**]({{booking_url}})  
  *Kiegészítő támogatás szakértőinktől*

---

## 🎊 Exkluzív Bónusz

Vásárlás alkalmából **20% kedvezményt** kap a következő termékünkre! A kedvezmény kód hamarosan megérkezik külön emailben.

---

## 💬 Támogatás

Kérdése van? Írjon nekünk bátran!  
📧 **support@quizplatform.hu**  
📞 **+36 1 234 5678**

**Köszönjük újra a bizalmat!**  
**A Quiz Platform Csapata**

---

*Ez az email megerősíti a vásárlását. Kérjük, őrizze meg a későbbi hivatkozás céljából.*' as body_markdown,
    '{
        "user_name": "Vásárló neve",
        "product_name": "Termék neve",
        "purchase_date": "Vásárlás dátuma",
        "amount": "Vásárolt összeg", 
        "currency": "Pénznem",
        "score": "Quiz pontszám",
        "ai_result": "AI személyre szabott elemzés",
        "saved_analysis_code": "Egyedi hozzáférési kód",
        "order_id": "Rendelés azonosító",
        "product_url": "Termék hozzáférési URL",
        "download_url": "Letöltési URL",
        "booking_url": "Konzultáció foglalás URL"
    }'::jsonb as variables
FROM quizzes 
WHERE slug = 'adhd-quick-check'
ON CONFLICT (quiz_id, product_id, template_type, lang) 
DO NOTHING;

-- Insert professional Reminder Email Template (Hungarian) 
INSERT INTO email_templates (
    quiz_id,
    template_type,
    lang,
    template_name,
    subject_template,
    body_markdown, 
    variables
)
SELECT 
    id as quiz_id,
    'reminder' as template_type,
    'hu' as lang,
    '⏰ Emlékeztető - Ne Hagyja Ki!' as template_name,
    '⏰ {{user_name}}, ne feledkezzen meg eredményéről! ({{percentage}}%)' as subject_template,
    '# Kedves {{user_name}}! ⏰

Tegnap kitöltötte a **{{quiz_title}}** kvízünket, de még nem nézte meg a **teljes részletes eredményét**.

---

## 🎯 Az Ön Eddigi Eredménye

**📊 Pontszám:** {{score}} pont  
**📈 Teljesítmény:** {{percentage}}%  

---

## 🚀 Miért Érdemes Most Megnézni?

### 🧠 **Ami vár Önre:**
- **AI alapú személyre szabott elemzés** - Részletes betekintés a képességeibe
- **Fejlesztési terv** - Konkrét lépések a javuláshoz  
- **Szakértői ajánlások** - Személyre szabott tanácsok
- **Letölthető útmutatók** - Gyakorlati segédanyagok

---

## 🎁 **CSAK MA! Exkluzív Ajánlat**

### 💥 **50% Kedvezmény** 
**Személyre szabott konzultációból** - **csak a mai napon!**

Használja a **REMINDER50** kódot a foglaláskor.

---

## 🔥 **Gyors Hozzáférés**

[**🔍 Eredmény Megtekintése Most**]({{result_url}})

*Egyetlen kattintás, és máris hozzáfér minden részlethez!*

---

## ⭐ **Mit Mondanak Mások?**

*"A részletes elemzés teljesen megváltoztatta a önmagamról alkotott képemet. Köszönöm!"*  
**- Kovács Petra**

*"Végre értem, hogy mire kell összpontosítanom. Fantasztikus!"*  
**- Nagy Gábor**

---

## ⏳ **Ne Halasszaon!**

Az eredmények **csak 48 óráig** érhetők el teljes részletességgel. Ezt követően csak alapvető információk maradnak elérhetők.

**[📊 Teljes Eredmény Megnyitása]({{result_url}})**

---

**Üdvözlettel,**  
**A Quiz Platform Csapata**

---

*Ha már nem szeretne emlékeztetőt kapni, [kattintson ide]({{unsubscribe_url}}).*' as body_markdown,
    '{
        "user_name": "Felhasználó neve",
        "quiz_title": "Quiz címe",
        "score": "Pontszám",
        "percentage": "Százalékos eredmény", 
        "result_url": "Eredmény megtekintési URL",
        "unsubscribe_url": "Leiratkozás URL"
    }'::jsonb as variables
FROM quizzes 
WHERE slug = 'adhd-quick-check'
ON CONFLICT (quiz_id, product_id, template_type, lang) 
DO NOTHING;

-- Create sample automation rules
INSERT INTO email_automation_rules (
    quiz_id,
    rule_name,
    trigger_event,
    conditions,
    email_template_id,
    delay_minutes,
    is_active,
    max_sends,
    priority
)
SELECT 
    q.id as quiz_id,
    'Quiz Befejezés - Azonnali Eredmény Email',
    'quiz_complete',
    '{"min_percentage": 0}'::jsonb,
    et.id,
    0, -- Azonnal küldés
    true,
    1,
    8
FROM quizzes q
JOIN email_templates et ON et.quiz_id = q.id 
WHERE q.slug = 'adhd-quick-check' 
AND et.template_type = 'result'
ON CONFLICT DO NOTHING;

INSERT INTO email_automation_rules (
    quiz_id,
    rule_name,
    trigger_event,
    conditions,
    email_template_id,
    delay_minutes,
    is_active,
    max_sends,
    priority
)
SELECT 
    q.id as quiz_id,
    'Vásárlás Visszaigazolás',
    'purchase',
    '{}'::jsonb,
    et.id,
    0, -- Azonnal küldés
    true,
    1,
    10
FROM quizzes q
JOIN email_templates et ON et.quiz_id = q.id 
WHERE q.slug = 'adhd-quick-check' 
AND et.template_type = 'purchase'
ON CONFLICT DO NOTHING;

INSERT INTO email_automation_rules (
    quiz_id,
    rule_name,
    trigger_event,
    conditions,
    email_template_id,
    delay_minutes,
    is_active,
    max_sends,
    priority
)
SELECT 
    q.id as quiz_id,
    'Emlékeztető - 24 óra után',
    'no_purchase_reminder',
    '{"days_since_completion": 1}'::jsonb,
    et.id,
    1440, -- 24 óra késleltetés (1440 perc)
    true,
    1,
    5
FROM quizzes q
JOIN email_templates et ON et.quiz_id = q.id 
WHERE q.slug = 'adhd-quick-check' 
AND et.template_type = 'reminder'
ON CONFLICT DO NOTHING;

-- Notify completion
RAISE NOTICE 'Professional email templates and automation rules installed successfully!';
