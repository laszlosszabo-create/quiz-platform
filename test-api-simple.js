const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

// Simple test using node's built-in fetch (Node 18+)
async function testAPI() {
  try {
    console.log('🔍 Testing API health endpoint...')
    const healthResponse = await fetch('http://localhost:3000/api/health')
    console.log('Health status:', healthResponse.status)
    if (healthResponse.ok) {
      const healthData = await healthResponse.json()
      console.log('Health data:', healthData)
    } else {
      console.log('Health failed:', await healthResponse.text())
    }

    console.log('\n🔍 Testing AI Prompts POST endpoint...')
    const postResponse = await fetch('http://localhost:3000/api/admin/ai-prompts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-debug': 'true'
      },
      body: JSON.stringify({
        quiz_id: 'test-node-' + Date.now(),
        lang: 'en',
        ai_prompt: 'Node.js test prompt'
      })
    })
    
    console.log('POST status:', postResponse.status)
    const postData = await postResponse.text()
    console.log('POST response:', postData)

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    if (error.cause) {
      console.error('Cause:', error.cause)
    }
  }
}

testAPI()
