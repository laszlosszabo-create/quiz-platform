'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../../../../lib/supabase'
import { QuizPrompt } from '@/types/database'

interface AIPromptsEditorProps {
  quizData: any
  onDataChange: (field: string, value: any) => void
}

interface PromptFormData {
  id?: string
  lang: string
  system_prompt: string
  user_prompt: string
  ai_provider: string
  ai_model: string
}

const SUPPORTED_LANGUAGES = [
  { code: 'hu', name: 'Magyar (HU)' },
  { code: 'en', name: 'English (EN)' }
]

const AI_PROVIDERS = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'claude', label: 'Anthropic Claude' }
]

const AI_MODELS = {
  openai: [
    { value: 'gpt-4o', label: 'GPT-4o' },
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' }
  ],
  claude: [
    { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
    { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' }
  ]
}

const REQUIRED_VARIABLES = ['{{scores}}', '{{top_category}}', '{{name}}']

export default function AIPromptsEditor({ quizData, onDataChange }: AIPromptsEditorProps) {
  const [prompts, setPrompts] = useState<QuizPrompt[]>([])
  const [currentLang, setCurrentLang] = useState('hu')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState<PromptFormData>({
    lang: 'hu',
    system_prompt: '',
    user_prompt: '',
    ai_provider: 'openai',
    ai_model: 'gpt-4o'
  })

  const supabase = createClient()

  // Load existing prompts
  useEffect(() => {
    if (quizData?.id) {
      loadPrompts()
    }
  }, [quizData?.id])

  // Load current language prompt when language changes
  useEffect(() => {
    loadCurrentLanguagePrompt()
  }, [currentLang, prompts])

  const loadPrompts = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('quiz_ai_prompts')
        .select('*')
        .eq('quiz_id', quizData.id)

      if (error) throw error

      setPrompts(data || [])
      onDataChange('_ai_prompts_count', (data || []).length)
    } catch (err) {
      console.error('Failed to load AI prompts:', err)
      setError('Nem sikerült betölteni az AI prompt-okat')
    } finally {
      setIsLoading(false)
    }
  }

  const loadCurrentLanguagePrompt = () => {
    const currentPrompt = prompts.find(p => p.lang === currentLang)
  if (currentPrompt) {
      setFormData({
        id: currentPrompt.id,
        lang: currentLang,
        system_prompt: currentPrompt.system_prompt || '',
        user_prompt: (currentPrompt as any).ai_prompt || '',
        ai_provider: 'openai', // Default since not stored in DB
        ai_model: 'gpt-4o' // Default since not stored in DB
      })
    } else {
      // Create default prompt for new language
      setFormData({
        lang: currentLang,
        system_prompt: getDefaultSystemPrompt(currentLang),
        user_prompt: getDefaultUserPrompt(currentLang),
        ai_provider: 'openai',
        ai_model: 'gpt-4o'
      })
    }
  }

  const getDefaultSystemPrompt = (lang: string) => {
    if (lang === 'hu') {
      return `Te egy személyiség és pszichológiai szakértő vagy. A felhasználó egy kvízt töltött ki, és a válaszai alapján részletes, személyre szabott eredményt szeretne kapni.

Feladatod:
- Elemezd a kvíz eredményeket
- Adj személyre szabott visszajelzést
- Fogalmazz pozitívan és építő jelleggel
- Használj szakmai, de közérthető nyelvet
- Ajánlj konkrét lépéseket a fejlődéshez`
    } else {
      return `You are a personality and psychology expert. The user has completed a quiz and wants detailed, personalized results based on their answers.

Your task:
- Analyze the quiz results
- Provide personalized feedback
- Be positive and constructive
- Use professional but understandable language
- Suggest concrete steps for improvement`
    }
  }

  const getDefaultUserPrompt = (lang: string) => {
    if (lang === 'hu') {
      return `Szia {{name}}!

A kvíz eredményeid alapján az alábbi pontszámokat értél el:
{{scores}}

A legmagasabb pontszámod: {{top_category}}

Kérlek adj személyre szabott visszajelzést ezen eredmények alapján. Fogalmazz pozitívan és építő jelleggel.`
    } else {
      return `Hi {{name}}!

Based on your quiz results, you achieved the following scores:
{{scores}}

Your highest score: {{top_category}}

Please provide personalized feedback based on these results. Be positive and constructive.`
    }
  }

  const validatePrompts = () => {
    const errors: string[] = []
    
    if (!formData.system_prompt.trim()) {
      errors.push('System prompt kötelező')
    }
    
    if (!formData.user_prompt.trim()) {
      errors.push('User prompt kötelező')
    }

    // Check for required variables in user prompt
    const missingVars = REQUIRED_VARIABLES.filter(variable => 
      !formData.user_prompt.includes(variable)
    )
    
    if (missingVars.length > 0) {
      errors.push(`Hiányzó kötelező változók: ${missingVars.join(', ')}`)
    }

    // Check for invalid variables (basic check)
    const varMatches = formData.user_prompt.match(/\{\{([^}]+)\}\}/g)
    if (varMatches) {
      const invalidVars = varMatches.filter(variable => 
        !REQUIRED_VARIABLES.includes(variable) && 
        !['{{quiz_title}}', '{{completion_date}}'].includes(variable)
      )
      
      if (invalidVars.length > 0) {
        errors.push(`Ismeretlen változók: ${invalidVars.join(', ')}`)
      }
    }

    return errors
  }

  const savePrompts = async () => {
    try {
      setIsSaving(true)
      setError('')

      const validationErrors = validatePrompts()
      if (validationErrors.length > 0) {
        setError(validationErrors.join(', '))
        return
      }

      // Canonical: single-column ai_prompt in DB
      const promptData = {
        quiz_id: quizData.id,
        lang: formData.lang,
        ai_prompt: formData.user_prompt,
      }

      if (formData.id) {
        // Update existing prompt
        const { error } = await supabase
          .from('quiz_ai_prompts')
          .update({ ai_prompt: formData.user_prompt })
          .eq('id', formData.id)

        if (error) throw error
      } else {
        // Create new prompt
        const { data, error } = await supabase
          .from('quiz_ai_prompts')
          .insert(promptData)
          .select()
          .single()

        if (error) throw error

        // Update form data with new ID
        setFormData(prev => ({ ...prev, id: data.id }))
      }

      // Create audit log
      await createAuditLogEntry(
        formData.id ? 'update_ai_prompt' : 'create_ai_prompt',
        formData.id || 'new',
        {
          lang: formData.lang,
          ai_provider: formData.ai_provider,
          quiz_id: quizData.id
        }
      )

      // Reload prompts
      await loadPrompts()
      
      setSuccessMessage(`AI prompt mentve (${formData.lang.toUpperCase()})!`)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Failed to save AI prompt:', err)
      setError('Nem sikerült menteni az AI prompt-ot')
    } finally {
      setIsSaving(false)
    }
  }

  const deletePrompt = async () => {
    if (!formData.id) return
    try {
      setError('')
      const confirmed = confirm('Biztosan törli ezt az AI promptot?')
      if (!confirmed) return

      const { error } = await supabase
        .from('quiz_ai_prompts')
        .delete()
        .eq('id', formData.id)

      if (error) throw error

      await createAuditLogEntry('delete_ai_prompt', formData.id, { 
        quiz_id: quizData.id, 
        lang: formData.lang 
      })

      await loadPrompts()
      setFormData({
        lang: currentLang,
        system_prompt: getDefaultSystemPrompt(currentLang),
        user_prompt: getDefaultUserPrompt(currentLang),
        ai_provider: 'openai',
        ai_model: 'gpt-4o'
      })
      
      setSuccessMessage('AI prompt törölve!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Failed to delete AI prompt:', err)
      setError('Nem sikerült törölni az AI prompt-ot')
    }
  }

  const updateFormData = (field: keyof PromptFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const testAIPrompt = async () => {
    try {
      setError('')
      if (!formData.system_prompt?.trim() || !formData.user_prompt?.trim()) {
        setError('Töltsd ki a System és User prompt mezőket a teszteléshez.')
        return
      }
      // Mock test data
      const testData = {
        name: 'Teszt Felhasználó',
        scores: 'Introvert: 75, Extrovert: 45, Analytical: 60',
        top_category: 'Introvert'
      }

      const response = await fetch('/api/admin/ai-prompts/openai-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_prompt: formData.system_prompt,
          ai_prompt: formData.user_prompt, // Send as canonical ai_prompt field
          ai_provider: formData.ai_provider,
          ai_model: formData.ai_model,
          test_data: testData
        })
      })

      if (!response.ok) {
        let msg = 'AI prompt teszt sikertelen'
        try {
          const err = await response.json()
          if (err?.error) {
            msg += `: ${err.error}`
            if (err?.missing) {
              msg += ` (missing: ${Object.keys(err.missing).filter(k => err.missing[k]).join(', ')})`
            }
          }
        } catch {}
        setError(msg)
        return
      }

      const result = await response.json()
      alert(`AI Teszt Eredmény:\n\n${result.generated_text}`)
    } catch (err) {
      console.error('AI prompt test failed:', err)
      setError('AI prompt teszt sikertelen')
    }
  }

  const createAuditLogEntry = async (action: string, resourceId: string, details?: any) => {
    try {
      await fetch('/api/admin/audit-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'system', // Will be updated when auth is available
          user_email: 'system@quiz.app',
          action,
          resource_type: 'quiz_ai_prompt',
          resource_id: resourceId,
          details
        })
      })
    } catch (error) {
      console.error('Failed to create audit log:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  const currentPrompt = prompts.find(p => p.lang === currentLang)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">AI Prompt Editor</h3>
          <p className="text-sm text-gray-500">
            System és user prompt-ok konfigurálása AI eredmény generálásához ({prompts.length} prompt)
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={testAIPrompt}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm"
          >
            🧪 Teszt
          </button>
          {formData.id && (
            <button
              onClick={deletePrompt}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
            >
              🗑️ Törlés
            </button>
          )}
          <button
            onClick={savePrompts}
            disabled={isSaving}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            💾 {isSaving ? 'Mentés...' : 'Mentés'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          ⚠️ {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          ✅ {successMessage}
        </div>
      )}

      {/* Language Selector */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-base font-medium text-gray-900 mb-4">Nyelv Kiválasztása</h4>
        <div className="flex gap-2">
          {SUPPORTED_LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => setCurrentLang(lang.code)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentLang === lang.code
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {lang.name}
              {prompts.find(p => p.lang === lang.code) && (
                <span className="ml-2 text-xs">✅</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* AI Provider & Model Configuration */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-base font-medium text-gray-900 mb-4">AI Konfiguráció</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Provider
            </label>
            <select
              value={formData.ai_provider}
              onChange={(e) => updateFormData('ai_provider', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {AI_PROVIDERS.map(provider => (
                <option key={provider.value} value={provider.value}>
                  {provider.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Model
            </label>
            <select
              value={formData.ai_model}
              onChange={(e) => updateFormData('ai_model', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {AI_MODELS[formData.ai_provider as keyof typeof AI_MODELS]?.map(model => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* System Prompt */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-base font-medium text-gray-900 mb-2">System Prompt</h4>
        <p className="text-sm text-gray-600 mb-4">
          AI-nak szóló rendszer utasítások és kontextus
        </p>
        <textarea
          value={formData.system_prompt}
          onChange={(e) => updateFormData('system_prompt', e.target.value)}
          rows={8}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="System prompt az AI számára..."
        />
      </div>

      {/* User Prompt */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-base font-medium text-gray-900 mb-2">User Prompt Template</h4>
        <p className="text-sm text-gray-600 mb-4">
          Felhasználó prompt template változókkal
        </p>
        <textarea
          value={formData.user_prompt}
          onChange={(e) => updateFormData('user_prompt', e.target.value)}
          rows={10}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="User prompt template változókkal..."
        />
        
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">📋 Template változók:</h5>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Kötelező változók:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><code>{'{{name}}'}</code> - Felhasználó neve</li>
              <li><code>{'{{scores}}'}</code> - Quiz pontszámok</li>
              <li><code>{'{{top_category}}'}</code> - Legmagasabb kategória</li>
            </ul>
            <p><strong>Opcionális változók:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><code>{'{{quiz_title}}'}</code> - Quiz címe</li>
              <li><code>{'{{completion_date}}'}</code> - Kitöltés dátuma</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">📊 Jelenlegi állapot:</h4>
        <div className="text-sm text-gray-700 space-y-1">
          <p><strong>Nyelv:</strong> {currentLang.toUpperCase()}</p>
          <p><strong>Állapot:</strong> {currentPrompt ? 'Létezik' : 'Új prompt'}</p>
          <p><strong>Utolsó mentés:</strong> {currentPrompt?.updated_at ? new Date(currentPrompt.updated_at).toLocaleString('hu-HU') : 'Soha'}</p>
          <p><strong>Validáció:</strong> {validatePrompts().length === 0 ? '✅ Rendben' : `⚠️ ${validatePrompts().length} hiba`}</p>
        </div>
      </div>
    </div>
  )
}
