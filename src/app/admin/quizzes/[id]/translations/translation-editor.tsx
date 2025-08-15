'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '../../../../../lib/supabase'

interface TranslationEditorProps {
  quizId: string
}

interface QuizData {
  id: string
  title: Record<string, string>
  subtitle: Record<string, string>
  description: Record<string, string>
  cta_text: Record<string, string>
  questions: Array<{
    id: string
    question_text: Record<string, string>
    answers: Array<{
      id: string
      answer_text: Record<string, string>
    }>
  }>
}

export default function TranslationEditor({ quizId }: TranslationEditorProps) {
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [currentLang, setCurrentLang] = useState<'hu' | 'en'>('hu')
  const [error, setError] = useState<string | null>(null)
  const [unsavedChanges, setUnsavedChanges] = useState(false)

  // Use useMemo to prevent client recreation on every render
  const supabaseClient = useMemo(() => createClient(), [])

  // Quiz adatok betöltése
  useEffect(() => {
    if (!supabaseClient) return
    
    const loadQuizData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Quiz alapadatok betöltése
        const { data: quizInfo, error: quizError } = await supabaseClient
          .from('quizzes')
          .select('*')
          .eq('id', quizId)
          .single()

        if (quizError) throw quizError

        // Kérdések és válaszok betöltése
        const { data: questions, error: questionsError } = await supabaseClient
          .from('questions')
          .select(`
            *,
            answers (*)
          `)
          .eq('quiz_id', quizId)
          .order('question_order')

        if (questionsError) throw questionsError

        // Adatok strukturálása
        const structuredData: QuizData = {
          id: quizInfo.id,
          title: quizInfo.title || {},
          subtitle: quizInfo.subtitle || {},
          description: quizInfo.description || {},
          cta_text: quizInfo.cta_text || {},
          questions: questions?.map((q: any) => ({
            id: q.id,
            question_text: q.question_text || {},
            answers: q.answers?.map((a: any) => ({
              id: a.id,
              answer_text: a.answer_text || {}
            })) || []
          })) || []
        }

        setQuizData(structuredData)
      } catch (err) {
        console.error('Quiz adatok betöltési hibája:', err)
        setError('Quiz adatok betöltése sikertelen')
      } finally {
        setLoading(false)
      }
    }

    loadQuizData()
  }, [quizId, supabaseClient])

  const updateField = (path: (string | number)[], value: string) => {
    if (!quizData) return

    setUnsavedChanges(true)
    
    const newQuiz = { ...quizData }
    let current: any = newQuiz

    // Navigálás a szülő objektumhoz
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]]
      if (!current) return
    }

    // Érték beállítása
    const lastKey = path[path.length - 1]
    if (!current[lastKey]) {
      current[lastKey] = {}
    }
    current[lastKey][currentLang] = value

    setQuizData(newQuiz)
  }

  const getFieldValue = (path: (string | number)[]): string => {
    if (!quizData) return ''

    let current: any = quizData
    for (const key of path) {
      current = current?.[key]
      if (!current) return ''
    }
    return current?.[currentLang] || ''
  }

  const hasTranslation = (path: (string | number)[], lang: string): boolean => {
    if (!quizData) return false

    let current: any = quizData
    for (const key of path) {
      current = current?.[key]
      if (!current) return false
    }
    return !!(current?.[lang]?.trim())
  }

  const saveChanges = async () => {
    if (!quizData || !unsavedChanges || !supabaseClient) return

    try {
      setSaving(true)

      // Quiz alapadatok frissítése
      const { error: quizError } = await supabaseClient
        .from('quizzes')
        .update({
          title: quizData.title,
          subtitle: quizData.subtitle,
          description: quizData.description,
          cta_text: quizData.cta_text,
          updated_at: new Date().toISOString()
        })
        .eq('id', quizId)

      if (quizError) throw quizError

      // Kérdések frissítése
      for (const question of quizData.questions) {
        const { error: questionError } = await supabaseClient
          .from('questions')
          .update({
            question_text: question.question_text,
            updated_at: new Date().toISOString()
          })
          .eq('id', question.id)

        if (questionError) throw questionError

        // Válaszok frissítése
        for (const answer of question.answers) {
          const { error: answerError } = await supabaseClient
            .from('answers')
            .update({
              answer_text: answer.answer_text,
              updated_at: new Date().toISOString()
            })
            .eq('id', answer.id)

          if (answerError) throw answerError
        }
      }

      setUnsavedChanges(false)
    } catch (err) {
      console.error('Mentési hiba:', err)
      setError('Mentés sikertelen')
    } finally {
      setSaving(false)
    }
  }

  // Automatikus mentés
  useEffect(() => {
    if (unsavedChanges) {
      const timer = setTimeout(() => {
        saveChanges()
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [unsavedChanges, quizData])

  if (!supabaseClient) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Inicializálás...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Hiba</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!quizData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nincs quiz adat</p>
      </div>
    )
  }

  const TranslationField = ({
    label,
    path,
    multiline = false,
    placeholder = ''
  }: {
    label: string
    path: (string | number)[]
    multiline?: boolean
    placeholder?: string
  }) => {
    const value = getFieldValue(path)
    const hasHu = hasTranslation(path, 'hu')
    const hasEn = hasTranslation(path, 'en')
    const isMissing = !hasTranslation(path, currentLang)

    const InputComponent = multiline ? 'textarea' : 'input'

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {isMissing && (
              <span className="ml-2 text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                Hiányzó fordítás
              </span>
            )}
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-xs">
              <span className={`w-2 h-2 rounded-full ${hasHu ? 'bg-green-500' : 'bg-gray-300'}`}></span>
              <span>HU</span>
            </div>
            <div className="flex items-center space-x-1 text-xs">
              <span className={`w-2 h-2 rounded-full ${hasEn ? 'bg-green-500' : 'bg-gray-300'}`}></span>
              <span>EN</span>
            </div>
          </div>
        </div>
        <InputComponent
          className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            isMissing ? 'border-red-300 bg-red-50' : ''
          } ${multiline ? 'min-h-[100px] resize-vertical' : ''}`}
          value={value}
          onChange={(e) => updateField(path, e.target.value)}
          placeholder={placeholder}
          {...(multiline ? { rows: 4 } : { type: 'text' })}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Fejléc nyelv választóval és mentési státusszal */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setCurrentLang('hu')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                currentLang === 'hu'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🇭🇺 Magyar
            </button>
            <button
              onClick={() => setCurrentLang('en')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                currentLang === 'en'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🇬🇧 Angol
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {saving && (
            <div className="flex items-center text-sm text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Mentés...
            </div>
          )}
          {unsavedChanges && !saving && (
            <div className="flex items-center text-sm text-amber-600">
              <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
              Nem mentett változások
            </div>
          )}
          {!unsavedChanges && !saving && (
            <div className="flex items-center text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Mentve
            </div>
          )}
          <button
            onClick={saveChanges}
            disabled={!unsavedChanges || saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Változások mentése
          </button>
        </div>
      </div>

      {/* Quiz alapadatok */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quiz alapadatok</h3>
        </div>
        <div className="p-6 space-y-4">
          <TranslationField 
            label="Cím" 
            path={['title']}
            placeholder="Quiz cím megadása..."
          />
          <TranslationField 
            label="Alcím" 
            path={['subtitle']}
            placeholder="Quiz alcím megadása..."
          />
          <TranslationField 
            label="Leírás" 
            path={['description']}
            multiline
            placeholder="Quiz leírás megadása..."
          />
          <TranslationField 
            label="Művelet gomb szövege" 
            path={['cta_text']}
            placeholder="Gomb szöveg megadása..."
          />
        </div>
      </div>

      {/* Kérdések */}
      {quizData.questions.map((question, qIndex) => (
        <div key={question.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">{qIndex + 1}. kérdés</h3>
          </div>
          <div className="p-6 space-y-4">
            <TranslationField 
              label="Kérdés szövege" 
              path={['questions', qIndex, 'question_text']}
              multiline
              placeholder="Kérdés szövegének megadása..."
            />
            
            <div className="ml-4 space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Válaszok:</h4>
              {question.answers.map((answer, aIndex) => (
                <TranslationField 
                  key={answer.id}
                  label={`${aIndex + 1}. válasz`} 
                  path={['questions', qIndex, 'answers', aIndex, 'answer_text']}
                  placeholder="Válasz szövegének megadása..."
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
