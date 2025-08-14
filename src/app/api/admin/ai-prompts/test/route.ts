import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { system_prompt, user_prompt, ai_provider, ai_model, test_data } = body

    // Validation
    if (!system_prompt || !user_prompt || !test_data) {
      return NextResponse.json(
        { error: 'Missing required fields: system_prompt, user_prompt, test_data' },
        { status: 400 }
      )
    }

    // Replace variables in user prompt with test data
    let processedPrompt = user_prompt
    Object.entries(test_data).forEach(([key, value]) => {
      const variable = `{{${key}}}`
      processedPrompt = processedPrompt.replace(new RegExp(variable, 'g'), value as string)
    })

    // For MVP, return a mock response instead of calling actual AI
    // In production, this would call the actual AI service
    const mockResponse = generateMockAIResponse(test_data, ai_provider, ai_model)

    return NextResponse.json({ 
      success: true,
      generated_text: mockResponse,
      processed_prompt: processedPrompt,
      ai_provider,
      ai_model
    })
  } catch (error) {
    console.error('AI prompt test error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateMockAIResponse(testData: any, provider: string, model: string): string {
  const { name, top_category } = testData
  
  return `Üdvözöljük ${name}!

Az Ön quiz eredményei alapján a legkiemelkedőbb kategóriája: ${top_category}.

Ez egy teszt válasz, amely demonstrálja az AI prompt működését. A valós implementációban ez egy ${provider} ${model} modell által generált személyre szabott elemzés lenne.

A teszt eredmények alapján:
- Személyiségprofil: Részletes elemzés következne itt
- Ajánlások: Konkrét tanácsok és következő lépések
- Betekintés: Mélyebb önismeret és fejlődési lehetőségek

Ez a válasz validálja, hogy a prompt template megfelelően működik és az AI integráció készen áll az éles használatra.

---
Generálva: ${provider} ${model} (teszt mód)
Dátum: ${new Date().toLocaleDateString('hu-HU')}`
}
