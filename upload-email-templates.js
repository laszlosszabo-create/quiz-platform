#!/usr/bin/env node

// Script to upload professional email templates via API
const fetch = require('node-fetch')

const QUIZ_ID = 'c54e0ded-edc8-4c43-8e16-ecb6e33f5291' // Real quiz ID

const professionalTemplates = [
  {
    template_type: 'result',
    lang: 'hu',
    template_name: '🎯 Quiz Eredmény - Professzionális Elemzés',
    subject_template: '{{quiz_title}} - Személyre Szabott Eredményei ({{percentage}}%)',
    body_markdown: `# Kedves {{user_name}}! 👋

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

*Ha nem szeretne több emailt kapni tőlünk, [kattintson ide a leiratkozáshoz]({{unsubscribe_url}}).*`,
    variables: {
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
    },
    is_active: true
  },
  
  {
    template_type: 'purchase',
    lang: 'hu', 
    template_name: '🎉 Sikeres Vásárlás - Üdvözöljük!',
    subject_template: '✅ Vásárlás Megerősítése - {{product_name}}',
    body_markdown: `# Kedves {{user_name}}! 🎉

**Gratulálunk!** Sikeresen megvásárolta a **{{product_name}}** terméket. Köszönjük a bizalmat!

---

## 📦 Rendelés Részletei

**💎 Termék:** {{product_name}}  
**📅 Vásárlás dátuma:** {{purchase_date}}  
**💰 Összeg:** {{amount}} {{currency}}  
**🔗 Rendelés azonosító:** \`{{order_id}}\`

---

## 🎯 Quiz Eredményei

**📊 Pontszám:** {{score}} pont  
**🧠 AI Elemzés:**

{{ai_result}}

---

## 🚀 Termék Hozzáférés

Az Ön egyedi hozzáférési kódja: **\`{{saved_analysis_code}}\`**

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

*Ez az email megerősíti a vásárlását. Kérjük, őrizze meg a későbbi hivatkozás céljából.*`,
    variables: {
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
    },
    is_active: true
  },
  
  {
    template_type: 'reminder',
    lang: 'hu',
    template_name: '⏰ Emlékeztető - Ne Hagyja Ki!',
    subject_template: '⏰ {{user_name}}, ne feledkezzen meg eredményéről! ({{percentage}}%)',
    body_markdown: `# Kedves {{user_name}}! ⏰

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

*Ha már nem szeretne emlékeztetőt kapni, [kattintson ide]({{unsubscribe_url}}).*`,
    variables: {
      "user_name": "Felhasználó neve",
      "quiz_title": "Quiz címe",
      "score": "Pontszám",
      "percentage": "Százalékos eredmény", 
      "result_url": "Eredmény megtekintési URL",
      "unsubscribe_url": "Leiratkozás URL"
    },
    is_active: true
  }
]

const uploadTemplates = async () => {
  console.log('🚀 Professzionális email sablonok feltöltése...\n')
  
  for (let i = 0; i < professionalTemplates.length; i++) {
    const template = professionalTemplates[i]
    
    try {
      console.log(`📧 Feltöltés: ${template.template_name}`)
      
      const response = await fetch('http://localhost:3000/api/admin/email-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quiz_id: QUIZ_ID,
          ...template
        })
      })
      
      if (response.ok) {
        console.log(`✅ Sikeresen feltöltve: ${template.template_type}\n`)
      } else {
        const error = await response.text()
        console.log(`❌ Hiba: ${template.template_type} - ${error}\n`)
      }
      
    } catch (error) {
      console.log(`❌ Kapcsolódási hiba: ${error.message}\n`)
    }
  }
  
  console.log('🎯 Template feltöltés befejezve!')
  console.log('\nKövetkező lépések:')
  console.log('1. Ellenőrizze a sablonokat az Admin UI-ban')
  console.log('2. Állítson be automation rules-okat')  
  console.log('3. Tesztelje az email küldést')
}

// Futtatás
if (require.main === module) {
  console.log('FIGYELEM: Cserélje le a QUIZ_ID értéket a valós quiz ID-re!')
  console.log('Aktuális QUIZ_ID:', QUIZ_ID)
  console.log('Folytatja? (Ctrl+C a megszakításhoz)\n')
  
  setTimeout(() => {
    uploadTemplates()
  }, 3000)
}
