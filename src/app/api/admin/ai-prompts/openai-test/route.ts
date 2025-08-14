import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { system_prompt, user_prompt, ai_model = 'gpt-4o', ai_provider = 'openai', test_data } = body

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'Missing OpenAI API key' }, { status: 500 })
    }
    if (!system_prompt || !user_prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 })
    }
    if (ai_provider !== 'openai') {
      return NextResponse.json({ error: 'Only OpenAI is supported in this test endpoint.' }, { status: 400 })
    }

    // Replace variables in user_prompt
    let filledUserPrompt = user_prompt
    if (test_data && typeof test_data === 'object') {
      Object.entries(test_data).forEach(([key, value]) => {
        filledUserPrompt = filledUserPrompt.replace(new RegExp(`{{${key}}}`, 'g'), String(value))
      })
    }

    const messages = [
      { role: 'system', content: system_prompt },
      { role: 'user', content: filledUserPrompt }
    ]

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: ai_model,
        messages,
        max_tokens: 512,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json({ error: error.error?.message || 'OpenAI error' }, { status: 500 })
    }

    const data = await response.json()
    const generated = data.choices?.[0]?.message?.content || ''
    return NextResponse.json({ generated_text: generated })
  } catch (error: any) {
    console.error('OpenAI test error:', error)
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 })
  }
}
