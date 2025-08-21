'use client'

import { useState, useEffect } from 'react'
import { QuizPrompt } from '@/types/database'
import type { AdminUser } from '@/lib/admin-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Save, AlertCircle, TestTube, Eye } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface AIPromptsEditorProps {
  quizId: string
  adminUser: AdminUser
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
  { value: 'gpt-4.1-mini', label: 'GPT-4.1 Mini (alapértelmezett)' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (legacy)' }
  ],
  claude: [
    { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
    { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' }
  ]
}

const REQUIRED_VARIABLES = ['{{scores}}', '{{top_category}}', '{{name}}']

export default function AIPromptsEditor({ quizId, adminUser }: AIPromptsEditorProps) {
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

  // Load existing prompts
  useEffect(() => {
    loadPrompts()
  }, [quizId])

  // Load current language prompt when language changes
  useEffect(() => {
    loadCurrentLanguagePrompt()
  }, [currentLang, prompts])

  const loadPrompts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/ai-prompts?quiz_id=${quizId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch AI prompts')
      }
      
      const result = await response.json()
      setPrompts(result.data || [])
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
1. Elemezd a kvíz eredményeket
2. Adj személyre szabott visszajelzést
3. Legyél támogató és építő jellegű
4. Használj professzionális, de barátságos hangnemet

Kerüld:
- Diagnózis felállítását
- Negatív címkézést
- Általánosításokat`
    } else {
      return `You are a personality and psychological expert. The user has completed a quiz and wants to receive detailed, personalized results based on their answers.

Your task:
1. Analyze the quiz results
2. Provide personalized feedback
3. Be supportive and constructive
4. Use a professional but friendly tone

Avoid:
- Making diagnoses
- Negative labeling
- Generalizations`
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

      const promptData = {
        quiz_id: quizId,
        lang: formData.lang,
        ai_prompt: formData.user_prompt,
        // Extra fields kept for UI continuity; server ignores them in canonical mode
        system_prompt: formData.system_prompt,
        ai_provider: formData.ai_provider,
        ai_model: formData.ai_model
      }

      const method = formData.id ? 'PUT' : 'POST'
      const url = '/api/admin/ai-prompts'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData.id ? { ...promptData, id: formData.id } : promptData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        
        // Handle Zod validation errors
        if (errorData.details && Array.isArray(errorData.details)) {
          const validationMessages = errorData.details.map((detail: any) => 
            `${detail.path?.join('.')}: ${detail.message}`
          ).join(', ')
          setError(`Validation Error: ${validationMessages}`)
        } else {
          setError(errorData.error || 'Failed to save AI prompt')
        }
        return
      }

      const result = await response.json()

      // Create audit log
      await createAuditLogEntry(
        formData.id ? 'update_ai_prompt' : 'create_ai_prompt',
        result.data.id,
        {
          lang: formData.lang,
          ai_provider: formData.ai_provider,
          quiz_id: quizId
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

      const url = `/api/admin/ai-prompts?id=${formData.id}&quiz_id=${quizId}`
      const response = await fetch(url, { method: 'DELETE' })

      if (!response.ok) {
        const errorData = await response.json()
        
        // Handle Zod validation errors
        if (errorData.details && Array.isArray(errorData.details)) {
          const validationMessages = errorData.details.map((detail: any) => 
            `${detail.path?.join('.')}: ${detail.message}`
          ).join(', ')
          setError(`Validation Error: ${validationMessages}`)
        } else {
          setError(errorData.error || 'Failed to delete AI prompt')
        }
        return
      }

      // Optionally create audit log entry client-side if server doesn't
      await createAuditLogEntry('delete_ai_prompt', formData.id, { quiz_id: quizId, lang: formData.lang })

      await loadPrompts()
      setFormData({
        lang: currentLang,
        system_prompt: getDefaultSystemPrompt(currentLang),
        user_prompt: getDefaultUserPrompt(currentLang),
        ai_provider: 'openai',
        ai_model: 'gpt-4o'
      })
      setSuccessMessage('AI prompt törölve')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Failed to delete AI prompt:', err)
      setError('AI prompt törlése sikertelen')
    }
  }

  // Create audit log entry
  const createAuditLogEntry = async (action: string, resourceId: string, details?: any) => {
    try {
      await fetch('/api/admin/audit-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: adminUser.id,
          user_email: adminUser.email,
          action,
          resource_type: 'quiz_prompt',
          resource_id: resourceId,
          details
        })
      })
    } catch (error) {
      console.error('Failed to create audit log:', error)
    }
  }

  const updateFormData = (field: keyof PromptFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const testAIPrompt = async () => {
    try {
      setError('')
      // Validate required fields before calling API
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
          ai_prompt: formData.user_prompt, // canonical field
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

  if (isLoading) {
    return <div className="p-4">AI prompt-ok betöltése...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">AI Prompt Editor</h3>
          <p className="text-sm text-gray-600">
            System és user prompt-ok konfigurálása AI eredmény generálásához
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={testAIPrompt} variant="outline" size="sm">
            <TestTube className="w-4 h-4 mr-2" />
            Teszt
          </Button>
          {formData.id && (
            <Button onClick={deletePrompt} variant="destructive" size="sm">
              Törlés
            </Button>
          )}
          <Button 
            onClick={savePrompts} 
            disabled={isSaving}
            size="sm"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Mentés...' : 'Mentés'}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className="border-green-200 bg-green-50">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Language Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nyelv Kiválasztása</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={currentLang} onValueChange={setCurrentLang}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map(lang => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* AI Provider & Model Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">AI Konfiguráció</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ai_provider">AI Provider</Label>
              <Select value={formData.ai_provider} onValueChange={(value) => updateFormData('ai_provider', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AI_PROVIDERS.map(provider => (
                    <SelectItem key={provider.value} value={provider.value}>
                      {provider.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="ai_model">AI Model</Label>
              <Select value={formData.ai_model} onValueChange={(value) => updateFormData('ai_model', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AI_MODELS[formData.ai_provider as keyof typeof AI_MODELS]?.map(model => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Prompt */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">System Prompt</CardTitle>
          <p className="text-sm text-gray-600">
            AI-nak szóló rendszer utasítások és kontextus
          </p>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.system_prompt}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFormData('system_prompt', e.target.value)}
            rows={8}
            placeholder="System prompt az AI számára..."
          />
        </CardContent>
      </Card>

      {/* User Prompt */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">User Prompt Template</CardTitle>
          <p className="text-sm text-gray-600">
            Felhasználó prompt template változókkal
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={formData.user_prompt}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFormData('user_prompt', e.target.value)}
            rows={10}
            placeholder="User prompt template változókkal..."
          />
          
          <div className="text-sm text-gray-500 space-y-1">
            <p><strong>Kötelező változók:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li><code>{'{{name}}'}</code> - Felhasználó neve</li>
              <li><code>{'{{scores}}'}</code> - Quiz pontszámok</li>
              <li><code>{'{{top_category}}'}</code> - Legmagasabb kategória</li>
            </ul>
            <p><strong>Opcionális változók:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li><code>{'{{quiz_title}}'}</code> - Quiz címe</li>
              <li><code>{'{{completion_date}}'}</code> - Kitöltés dátuma</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
