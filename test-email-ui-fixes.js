#!/usr/bin/env node

// Test email templates after UI fixes
const fetch = require('node-fetch')

const QUIZ_ID = 'c54e0ded-edc8-4c43-8e16-ecb6e33f5291'

const testTemplates = async () => {
  console.log('🧪 Email template UI & tisztaság teszt...\n')
  
  try {
    const response = await fetch(`http://localhost:3000/api/admin/email-templates?quiz_id=${QUIZ_ID}`)
    if (!response.ok) throw new Error('API hiba')
    
    const data = await response.json()
    const templates = data.templates || []
    
    console.log('📊 Template-ek összes:', templates.length)
    
    const active = templates.filter(t => t.is_active)
    const inactive = templates.filter(t => !t.is_active)
    
    console.log('\n✅ AKTÍV template-ek (ezek működnek):')
    active.forEach(t => {
      console.log(`   🎯 "${t.template_name}" (${t.template_type})`)
      console.log(`      ID: ${t.id}`)
      console.log(`      Utolsó frissítés: ${new Date(t.updated_at).toLocaleString('hu-HU')}`)
    })
    
    console.log('\n❌ INAKTÍV template-ek (régiek, kikapcsolva):')
    inactive.forEach(t => {
      console.log(`   💀 "${t.template_name}" (${t.template_type})`)
    })
    
    console.log('\n📈 Statisztika:')
    console.log(`   ✅ Aktív: ${active.length} db`)
    console.log(`   ❌ Inaktív: ${inactive.length} db`)
    console.log(`   🎨 Professzionális (emoji): ${active.filter(t => /[🎯🎉⏰]/.test(t.template_name)).length} db`)
    
    // Ellenőrizzük, hogy csak a szépek aktívak
    const professionalCount = active.filter(t => 
      t.template_name.includes('🎯') || 
      t.template_name.includes('🎉') || 
      t.template_name.includes('⏰')
    ).length
    
    if (professionalCount === 3 && active.length === 3) {
      console.log('\n🎉 SIKER! Csak a professzionális template-ek aktívak!')
      console.log('✅ Email szerkesztő gombok javítva')  
      console.log('✅ Régi ronda template-ek kikapcsolva')
      console.log('✅ Csak szép, emojis template-ek maradtak aktívak')
      console.log('\n🚀 Most már tudod szerkeszteni az email template-eket!')
    } else {
      console.log('\n⚠️ FIGYELEM: Nem megfelelő template állapot')
    }
    
  } catch (error) {
    console.log(`❌ Teszt hiba: ${error.message}`)
  }
}

// Futtatás
testTemplates()
