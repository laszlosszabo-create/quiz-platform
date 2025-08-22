const fetch = require('node-fetch');

async function testQuestions() {
  console.log('🧪 Testing questions_and_answers variable...');
  
  try {
    const response = await fetch('http://localhost:3000/api/debug-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: "compose_product_prompt",
        session_id: "f0f40980-e20f-4f22-b10a-a281c4c05f1c",
        lang: "hu"
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('✅ Success!');
    console.log('📊 Questions and Answers Variable:');
    console.log(data.composed?.variables?.questions_and_answers || 'EMPTY');
    
    console.log('\n🔍 All Variables:');
    console.log(JSON.stringify(data.composed?.variables || {}, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testQuestions();
