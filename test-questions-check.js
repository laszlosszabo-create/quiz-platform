// Quick database check for quiz_questions structure
require('dotenv').config({ path: '.env.local' })

async function checkQuizQuestions() {
  try {
    console.log('📊 Checking quiz_questions table structure...')
    
    // Use fetch to call our debug endpoint which already has proper Supabase setup
    const response = await fetch('http://localhost:3000/api/debug-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'compose_product_prompt',
        quiz_id: 'c54e0ded-edc8-4c43-8e16-ecb6e33f5291', 
        session_id: 'f0f40980-e20f-4f22-b10a-a281c4c05f1c'
      })
    })

    if (!response.ok) {
      console.log('❌ Response not OK:', response.status)
      const errorText = await response.text()
      console.log('Error:', errorText)
      return
    }

    const data = await response.json()
    console.log('✅ Success:', data.success)
    console.log('Selection:', data.selection)
    console.log('Questions and answers length:', data.prompt_variables?.questions_and_answers?.length || 0)
    
    if (data.composed?.variables) {
      console.log('Variables keys:', Object.keys(data.composed.variables))
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

checkQuizQuestions()
