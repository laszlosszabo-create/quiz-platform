#!/usr/bin/env node

// Script to setup email automation rules via API
const fetch = require('node-fetch')

const QUIZ_ID = 'c54e0ded-edc8-4c43-8e16-ecb6e33f5291' // Real quiz ID

const automationRules = [
  {
    trigger_type: 'quiz_complete',
    template_type: 'result',
    delay_minutes: 5, // 5 perc késleltetéssel küldi az eredményt
    conditions: {
      min_percentage: 0 // Minden eredményre küld
    },
    is_active: true,
    description: 'Eredmény email küldése quiz kitöltés után 5 perccel'
  },
  
  {
    trigger_type: 'purchase',
    template_type: 'purchase', 
    delay_minutes: 2, // 2 perc késleltetéssel küldi a vásárlás megerősítést
    conditions: {
      has_purchase: true
    },
    is_active: true,
    description: 'Vásárlás megerősítő email 2 perccel a fizetés után'
  },
  
  {
    trigger_type: 'no_purchase_reminder',
    template_type: 'reminder',
    delay_minutes: 1440, // 24 óra (1440 perc) múlva küldi az emlékeztetőt
    conditions: {
      has_purchase: false,
      min_percentage: 50 // Csak 50% feletti eredményre
    },
    is_active: true,
    description: '24 órás emlékeztető email azoknak, akik nem vásároltak, de jó eredményt értek el'
  }
]

const setupAutomation = async () => {
  console.log('🤖 Email automation szabályok beállítása...\n')
  
  for (let i = 0; i < automationRules.length; i++) {
    const rule = automationRules[i]
    
    try {
      console.log(`⚙️ Szabály létrehozása: ${rule.trigger_type}`)
      console.log(`   ⏱️  Késleltetés: ${rule.delay_minutes} perc`)
      console.log(`   📧 Template: ${rule.template_type}`)
      
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
        console.log(`✅ Sikeresen létrehozva! ID: ${result.id}`)
        console.log(`   📋 Leírás: ${rule.description}\n`)
      } else {
        const error = await response.text()
        console.log(`❌ Hiba: ${rule.trigger_type} - ${error}\n`)
      }
      
    } catch (error) {
      console.log(`❌ Kapcsolódási hiba: ${error.message}\n`)
    }
  }
  
  console.log('🎯 Automation beállítás befejezve!')
  console.log('\n📊 Beállított triggerek:')
  console.log('1. Quiz befejezés → Eredmény email (5 perc késés)')
  console.log('2. Vásárlás → Megerősítő email (2 perc késés)')
  console.log('3. Emlékeztető → 24 óra múlva (csak jó eredményűeknek)')
  console.log('\n🔧 Teszteléshez használja az Admin UI-t!')
}

// Futtatás
if (require.main === module) {
  console.log('FIGYELEM: Cserélje le a QUIZ_ID értéket a valós quiz ID-re!')
  console.log('Aktuális QUIZ_ID:', QUIZ_ID)
  console.log('Folytatja? (Ctrl+C a megszakításhoz)\n')
  
  setTimeout(() => {
    setupAutomation()
  }, 3000)
}
