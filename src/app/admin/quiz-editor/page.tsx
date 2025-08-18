'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import AdminAuthWrapper from '../components/admin-auth-wrapper'

// Import all editor components based on documentation
import QuizMetaEditor from './components/quiz-meta-editor'
import TranslationEditor, { type TranslationEditorHandle } from './components/translation-editor'
import QuestionsEditor from './components/questions-editor'
import ScoringRulesEditor from './components/scoring-rules-editor'
import AIPromptsEditor from './components/ai-prompts-editor'
// TODO: Create remaining components
// import ProductsEditor from './components/products-editor'
// import EmailTemplatesEditor from './components/email-templates-editor'
// import AuditLogViewer from './components/audit-log-viewer'

interface QuizData {
  id: string
  slug: string
  status: 'draft' | 'active' | 'archived'
  default_lang: string
  feature_flags: any
  theme: any
  translations: Record<string, Record<string, string>>
  title: string
  description: string
  quiz_questions: any[]
  scoring_rules: any[]
  prompts: any[]
  products: any[]
  email_templates: any[]
  created_at: string
  updated_at: string
}

type TabType = 'meta' | 'translations' | 'questions' | 'scoring' | 'ai-prompts' | 'products' | 'emails' | 'audit'

const tabs: { id: TabType; label: string; icon: string }[] = [
  { id: 'meta', label: 'Quiz Meta', icon: '⚙️' },
  { id: 'translations', label: 'Fordítások', icon: '🌐' },
  { id: 'questions', label: 'Kérdések', icon: '❓' },
  { id: 'scoring', label: 'Pontozás', icon: '🎯' },
  { id: 'ai-prompts', label: 'AI Promptok', icon: '🤖' },
  { id: 'products', label: 'Termékek', icon: '💰' },
  { id: 'emails', label: 'Email sablonok', icon: '📧' },
  { id: 'audit', label: 'Audit Log', icon: '📋' }
]

function QuizEditorContent() {
  const searchParams = useSearchParams()
  const quizId = searchParams.get('id')
  
  const [activeTab, setActiveTab] = useState<TabType>('meta')
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const translationEditorRef = useRef<TranslationEditorHandle | null>(null)

  // Load quiz data
  useEffect(() => {
    if (!quizId) {
      setError('Nincs quiz ID megadva')
      setLoading(false)
      return
    }

    const loadQuiz = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/quizzes/${quizId}`)
        
        if (!response.ok) {
          throw new Error('Quiz betöltése sikertelen')
        }
        
        const data = await response.json()
        setQuizData(data)
      } catch (err) {
        console.error('Quiz loading error:', err)
        setError('Quiz betöltése sikertelen')
      } finally {
        setLoading(false)
      }
    }

    loadQuiz()
  }, [quizId])

  const handleDataChange = (updatedData: Partial<QuizData>) => {
    if (quizData) {
      setQuizData({ ...quizData, ...updatedData })
      setUnsavedChanges(true)
    }
  }

  // For child editors that report granular field updates
  const handleFieldChange = (field: string, value: any) => {
    if (quizData) {
      setQuizData({ ...quizData, [field]: value })
      setUnsavedChanges(true)
    }
  }

  const handleSave = async () => {
    if (!quizId || !quizData) return

    try {
      // Pull latest translations from the child editor (manual mode)
      const latestTranslations = translationEditorRef.current?.getLocalTranslations()
      const payload = {
        ...quizData,
        ...(latestTranslations ? { translations: latestTranslations } : {})
      }
      const response = await fetch(`/api/admin/quizzes/${quizId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Mentés sikertelen')
      }
      // Reflect saved translations locally to keep state in sync
      if (latestTranslations) {
        setQuizData(prev => (prev ? { ...prev, translations: latestTranslations } : prev))
      }
      setUnsavedChanges(false)
      alert('Quiz sikeresen mentve!')
    } catch (err) {
      console.error('Save error:', err)
      alert('Mentés sikertelen!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Quiz betöltése...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Hiba történt</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quiz nem található</h1>
          <p className="text-gray-600">A kért quiz nem található.</p>
        </div>
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'meta':
        return (
          <QuizMetaEditor 
            quizData={quizData}
            onDataChange={handleDataChange}
          />
        )
      case 'translations':
        return (
          <TranslationEditor 
            ref={translationEditorRef}
            quizData={quizData}
            onDataChange={handleDataChange}
            onDirtyChange={(dirty) => setUnsavedChanges(dirty)}
          />
        )
      case 'questions':
        return (
          <QuestionsEditor 
            quizData={quizData}
            onDataChange={handleFieldChange}
          />
        )
      case 'scoring':
        return (
          <ScoringRulesEditor 
            quizData={quizData}
            onDataChange={handleFieldChange}
          />
        )
      case 'ai-prompts':
        return (
          <AIPromptsEditor 
            quizData={quizData}
            onDataChange={handleFieldChange}
          />
        )
      case 'products':
        return (
          <div className="p-8 text-center bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Products Editor</h3>
            <p className="text-gray-600">Ez a komponens még fejlesztés alatt áll...</p>
          </div>
        )
      case 'emails':
        return (
          <div className="p-8 text-center bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Email Templates Editor</h3>
            <p className="text-gray-600">Ez a komponens még fejlesztés alatt áll...</p>
          </div>
        )
      case 'audit':
        return (
          <div className="p-8 text-center bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Audit Log Viewer</h3>
            <p className="text-gray-600">Ez a komponens még fejlesztés alatt áll...</p>
          </div>
        )
      default:
        return <div>Ismeretlen tab</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quiz Szerkesztő: {quizData.title || quizData.slug}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              ID: {quizData.id} • Státusz: {quizData.status} • Nyelv: {quizData.default_lang}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {unsavedChanges && (
              <span className="text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                ⚠️ Nem mentett változások
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={!unsavedChanges}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              💾 Mentés
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {renderTabContent()}
      </div>
    </div>
  )
}

export default function QuizEditorPage() {
  return (
    <AdminAuthWrapper>
      <QuizEditorContent />
    </AdminAuthWrapper>
  )
}
