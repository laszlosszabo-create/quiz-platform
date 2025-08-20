#!/usr/bin/env node

// Test professional email template sending
const fetch = require('node-fetch')

const QUIZ_ID = 'c54e0ded-edc8-4c43-8e16-ecb6e33f5291'
const TEMPLATE_ID = '41a7161f-5e10-4eb5-b8bb-d71afa63c4dc' // Result template

const testEmail = async () => {
  console.log('📧 Professzionális email sablon teszt...\n')
  
  const testData = {
    template_id: TEMPLATE_ID,
    to_email: 'test@example.com',
    test_variables: {
      user_name: 'Kovács Péter',
      quiz_title: 'ADHD Gyors Teszt', 
      score: '24',
      percentage: '85',
      category: 'Magas kockázat',
      ai_result: 'Az eredmények alapján erős ADHD tüneteket mutat. Javasoljuk szakorvosi konzultáció igénybevételét a további lépések megbeszélésére.',
      quiz_completion_date: new Date().toLocaleDateString('hu-HU'),
      result_url: 'https://example.com/result/123',
      booking_url: 'https://example.com/booking',
      download_url: 'https://example.com/download',
      unsubscribe_url: 'https://example.com/unsubscribe'
    }
  }
  
  try {
    console.log('📤 Teszt email küldés...')
    console.log(`   Template ID: ${TEMPLATE_ID}`)
    console.log(`   To: ${testData.to_email}`)
    console.log(`   Variables:`, Object.keys(testData.test_variables).length, 'db')
    
    const response = await fetch('http://localhost:3000/api/admin/email-templates/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ Teszt email sikeresen elküldve!')
      console.log('📨 Email ID:', result.id || 'N/A')
      console.log('\n🎨 Professional design with:')
      console.log('   • Gradient header background')
      console.log('   • Table-based layout for email clients')
      console.log('   • Hungarian content')  
      console.log('   • Responsive design')
      console.log('   • Professional typography')
    } else {
      const error = await response.text()
      console.log('❌ Hiba teszt email küldése során:')
      console.log(error)
    }
    
  } catch (error) {
    console.log('❌ Kapcsolódási hiba:', error.message)
  }
}

// Futtatás
if (require.main === module) {
  console.log('🎯 Professional Email Template Test')
  console.log('===================================')
  testEmail()
}
