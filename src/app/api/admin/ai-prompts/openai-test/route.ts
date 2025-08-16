import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('[AI-TEST] Received request body:', JSON.stringify(body, null, 2))
    
    const { system_prompt, user_prompt, ai_prompt, ai_model = 'gpt-4o', ai_provider = 'openai', test_data } = body

    // Support both canonical ai_prompt and legacy user_prompt
    const actualUserPrompt = ai_prompt || user_prompt
    console.log('[AI-TEST] Using user prompt:', actualUserPrompt)

    if (!process.env.OPENAI_API_KEY) {
      console.log('[AI-TEST] Missing OpenAI API key — returning mocked response for local testing')
      // Return a mocked response so the admin UI test works locally without a key
      const mocked = `MOCKED AI RESPONSE\n\n${(system_prompt ? `[SYSTEM]\n${system_prompt}\n\n` : '')}[USER]\n${(actualUserPrompt || '').slice(0, 2000)}`
      return NextResponse.json({ generated_text: mocked, mocked: true })
    }
    // Only the user prompt is required for a test; system prompt is optional
    if (!actualUserPrompt) {
      const missing = { ai_prompt: true }
      console.log('[AI-TEST] Missing user prompt')
      return NextResponse.json({ error: 'Missing prompt', missing }, { status: 400 })
    }
    if (ai_provider !== 'openai') {
      return NextResponse.json({ error: 'Only OpenAI is supported in this test endpoint.' }, { status: 400 })
    }

    // Replace variables in user_prompt
    let filledUserPrompt = actualUserPrompt
    if (test_data && typeof test_data === 'object') {
      Object.entries(test_data).forEach(([key, value]) => {
        filledUserPrompt = filledUserPrompt.replace(new RegExp(`{{${key}}}`, 'g'), String(value))
      })
    }

    const messages = (
      [
        ...(system_prompt ? [{ role: 'system' as const, content: system_prompt as string }] : []),
        { role: 'user' as const, content: filledUserPrompt }
      ]
    )

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
