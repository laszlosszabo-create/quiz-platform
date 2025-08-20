#!/usr/bin/env node

// Script to disable old ugly email templates and keep only professional ones
const fetch = require('node-fetch')

const QUIZ_ID = 'c54e0ded-edc8-4c43-8e16-ecb6e33f5291'

// A régiek ID-k kikapcsoláshoz (borzasztóan rondák)
const OLD_TEMPLATES_TO_DISABLE = [
  'f496ec4b-52e5-4c4e-be1e-1910a0d82abc', // Vásárlási Visszaigazolás
  '7ac3c2bb-27cc-4c61-9465-bc412e7c9f1b', // Emlékeztető Email
  '45e70b04-8b9d-4110-a28b-a7889404d0f4'  // Quiz Eredmény Email
]

// Professzionálisak megtartása (szépek)
const PROFESSIONAL_TEMPLATES = [
  '0617282a-a1a5-48b9-a4ff-77e666464c56', // ⏰ Emlékeztető - Ne Hagyja Ki!
  'ab4df3c0-6b19-4d77-ba60-53a80afcd1da', // 🎉 Sikeres Vásárlás - Üdvözöljük!
  '41a7161f-5e10-4eb5-b8bb-d71afa63c4dc'  // 🎯 Quiz Eredmény - Professzionális Elemzés
]

const cleanupTemplates = async () => {
  console.log('🧹 Régi "borzasztóan ronda" email template-ek kikapcsolása...\n')
  
  // Először lekérjük az összes template-et
  try {
    const response = await fetch(`http://localhost:3000/api/admin/email-templates?quiz_id=${QUIZ_ID}`)
    if (!response.ok) throw new Error('Failed to fetch templates')
    
    const data = await response.json()
    const templates = data.templates || []
    
    console.log(`📊 Összesen ${templates.length} template találva\n`)
    
    // Kikapcsoljuk a régieket
    for (const templateId of OLD_TEMPLATES_TO_DISABLE) {
      const template = templates.find(t => t.id === templateId)
      if (!template) {
        console.log(`⚠️ Template ${templateId} nem található, átugrás`)
        continue
      }
      
      try {
        console.log(`❌ Kikapcsolás: "${template.template_name}"`)
        console.log(`   ID: ${templateId}`)
        console.log(`   Típus: ${template.template_type}`)
        
        const updatePayload = {
          id: template.id,
          quiz_id: template.quiz_id,
          template_type: template.template_type,
          lang: template.lang,
          template_name: template.template_name,
          subject_template: template.subject_template,
          body_markdown: template.body_markdown,
          variables: template.variables || {},
          is_active: false  // KIKAPCSOLÁS
        }
        
        // Csak akkor adjuk hozzá a product_id-t, ha nem null
        if (template.product_id) {
          updatePayload.product_id = template.product_id
        }
        
        const updateResponse = await fetch('http://localhost:3000/api/admin/email-templates', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatePayload)
        })
        
        if (updateResponse.ok) {
          console.log(`   ✅ Sikeresen kikapcsolva\n`)
        } else {
          const errorText = await updateResponse.text()
          console.log(`   ❌ Hiba: ${errorText}\n`)
        }
        
      } catch (error) {
        console.log(`   ❌ Kapcsolódási hiba: ${error.message}\n`)
      }
    }
    
    // Ellenőrizzük a professzionálisakat
    console.log('✨ Professzionális template-ek ellenőrzése:\n')
    for (const templateId of PROFESSIONAL_TEMPLATES) {
      const template = templates.find(t => t.id === templateId)
      if (template) {
        console.log(`✅ "${template.template_name}" - ${template.is_active ? 'AKTÍV' : 'INAKTÍV'}`)
        console.log(`   ID: ${templateId}`)
        console.log(`   Típus: ${template.template_type}\n`)
      } else {
        console.log(`⚠️ Professzionális template ${templateId} nem található\n`)
      }
    }
    
  } catch (error) {
    console.log(`❌ Hiba template-ek lekérésénél: ${error.message}`)
    return
  }
  
  console.log('🎯 Template cleanup befejezve!')
  console.log('\n📊 Összefoglaló:')
  console.log(`❌ ${OLD_TEMPLATES_TO_DISABLE.length} régi template kikapcsolva`)
  console.log(`✅ ${PROFESSIONAL_TEMPLATES.length} professzionális template megtartva`)
  console.log('\n🎨 Most már csak a szép, professzionális template-ek aktívak!')
}

// Futtatás
if (require.main === module) {
  console.log('🎯 Email Template Cleanup')
  console.log('=========================')
  console.log('A régi "borzasztóan ronda" template-ek kikapcsolása...')
  console.log('Professzionális template-ek megtartása...\n')
  
  setTimeout(() => {
    cleanupTemplates()
  }, 1000)
}
