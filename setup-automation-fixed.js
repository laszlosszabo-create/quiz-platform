#!/usr/bin/env node

// Fixed automation rules with actual template IDs
const fetch = require('node-fetch')

const QUIZ_ID = 'c54e0ded-edc8-4c43-8e16-ecb6e33f5291'

// Template ID-k a feltöltött professzionális sablonokhoz
const TEMPLATE_IDS = {
  'result': '41a7161f-5e10-4eb5-b8bb-d71afa63c4dc',     // 🎯 Quiz Eredmény - Professzionális Elemzés
  'purchase': 'ab4df3c0-6b19-4d77-ba60-53a80afcd1da',  // 🎉 Sikeres Vásárlás - Üdvözöljük!
  'reminder': '0617282a-a1a5-48b9-a4ff-77e666464c56'   // ⏰ Emlékeztető - Ne Hagyja Ki!
}

const automationRules = [
  {
    rule_name: 'AI Eredmény Email Automatikus Küldés',
    trigger_event: 'quiz_complete',
    template_id: TEMPLATE_IDS.result,
    delay_minutes: 5, // 5 perc késleltetéssel küldi az eredményt
    conditions: {
      min_percentage: 0 // Minden eredményre küld
    },
    is_active: true,
    max_sends: 1,
    priority: 8 // Magas prioritás
  },
  
  {
    rule_name: 'Vásárlás Megerősítő Email',
    trigger_event: 'purchase', 
    template_id: TEMPLATE_IDS.purchase,
    delay_minutes: 2, // 2 perc késleltetéssel küldi a vásárlás megerősítést
    conditions: {
      has_purchase: true
    },
    is_active: true,
    max_sends: 1,
    priority: 10 // Legmagasabb prioritás
  },
  
  {
    rule_name: '24 Órás Emlékeztető (Jó Eredményűeknek)',
    trigger_event: 'no_purchase_reminder',
    template_id: TEMPLATE_IDS.reminder,
    delay_minutes: 1440, // 24 óra (1440 perc) múlva küldi az emlékeztetőt
    conditions: {
      has_purchase: false,
      min_percentage: 50 // Csak 50% feletti eredményre
    },
    is_active: true,
    max_sends: 1, 
    priority: 5 // Közepes prioritás
  }
]

const setupAutomation = async () => {
  console.log('🤖 Email automation szabályok beállítása (helyes template ID-kkal)...\n')
  
  for (let i = 0; i < automationRules.length; i++) {
    const rule = automationRules[i]
    
    try {
      console.log(`⚙️ Szabály: ${rule.rule_name}`)
      console.log(`   📧 Template ID: ${rule.template_id}`)
      console.log(`   🎯 Trigger: ${rule.trigger_event}`)
      console.log(`   ⏱️  Késleltetés: ${rule.delay_minutes} perc`)
      console.log(`   🔥 Prioritás: ${rule.priority}/10`)
      
      const response = await fetch('http://localhost:3000/api/admin/email-automation-rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quiz_id: QUIZ_ID,
          ...rule
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log(`✅ Sikeresen létrehozva! Rule ID: ${result.rule?.id || 'N/A'}`)
        console.log(`   📋 Status: Aktív (${rule.is_active ? 'Enabled' : 'Disabled'})\n`)
      } else {
        const errorText = await response.text()
        console.log(`❌ Hiba: ${rule.rule_name}`)
        console.log(`   📝 Response: ${errorText}\n`)
      }
      
    } catch (error) {
      console.log(`❌ Kapcsolódási hiba: ${error.message}\n`)
    }
  }
  
  console.log('🎯 Automation beállítás befejezve!')
  console.log('\n🚀 Beállított triggerek (időzítéssel):')
  console.log('1. ✅ Quiz befejezés → Professzionális eredmény email (5 perc)')
  console.log('2. 💳 Vásárlás → Szép megerősítő email (2 perc)')  
  console.log('3. ⏰ Emlékeztető → Gyönyörű reminder email (24 óra)')
  console.log('\n💡 Az emailek automatikusan kimennek a triggerek után!')
  console.log('🎨 Minden email gyönyörű HTML design-nal készült!')
  console.log('\n🔧 Ellenőrizze a működést az Admin UI-ban!')
}

// Futtatás
if (require.main === module) {
  console.log('🎯 Email Automation Rules Setup')
  console.log('================================')
  console.log(`Quiz ID: ${QUIZ_ID}`)
  console.log(`Result Template: ${TEMPLATE_IDS.result}`)
  console.log(`Purchase Template: ${TEMPLATE_IDS.purchase}`)
  console.log(`Reminder Template: ${TEMPLATE_IDS.reminder}`)
  console.log('Folytatás 2 másodperc múlva...\n')
  
  setTimeout(() => {
    setupAutomation()
  }, 2000)
}
