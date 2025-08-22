'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '../../../../lib/supabase'
import { QuizQuestion, QuestionType } from '@/types/database'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { PlusIcon, TrashIcon, Bars3Icon, EyeIcon, PencilIcon } from '@heroicons/react/24/outline'

interface EnhancedQuestionsEditorProps {
  quizData: any
  onDataChange: (field: string, value: any) => void
}

interface QuestionOption {
  key: string
  score: number
  textHu: string
  textEn: string
}

interface EnhancedQuestionFormData {
  key: string
  type: QuestionType
  textHu: string
  textEn: string
  helpTextHu?: string
  helpTextEn?: string
  active: boolean
  options: QuestionOption[]
}

interface QuestionFormProps {
  question: QuizQuestion | null
  onSave: (formData: EnhancedQuestionFormData, questionId?: string) => void
  onCancel: () => void
  saving: boolean
  quizId: string
}

export default function EnhancedQuestionsEditor({ quizData, onDataChange }: EnhancedQuestionsEditorProps) {
  console.log('🔥 ENHANCED QUESTIONS EDITOR LOADED!', quizData?.id)
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewQuestion, setPreviewQuestion] = useState<QuizQuestion | null>(null)

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    if (quizData?.id) {
      loadQuestions()
    }
  }, [quizData?.id])

  const loadQuestions = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quizData.id)
        .order('order')

      if (error) throw error
      // Default active to true if undefined/null
      setQuestions((data || []).map(q => ({ ...q, active: q.active ?? true })))
    } catch (err) {
      console.error('Error loading questions:', err)
      setError('Hiba a kérdések betöltésekor')
    } finally {
      setLoading(false)
    }
  }

  // Load question translations for form
  const loadQuestionTranslations = async (questionKey: string) => {
    const { data } = await supabase
      .from('quiz_translations')
      .select('field_key, value')
      .eq('quiz_id', quizData.id)
      .in('field_key', [
        `question:${questionKey}:text`,
        `question:${questionKey}:help`
      ])
    
    const translations: { [key: string]: string } = {}
    data?.forEach(t => {
      translations[t.field_key] = t.value
    })
    return translations
  }

  // Load option translations
  const loadOptionTranslations = async (optionKeys: string[]) => {
    const translationKeys = optionKeys.flatMap(key => [
      `option:${key}:label`
    ])
    
    const { data } = await supabase
      .from('quiz_translations')
      .select('field_key, value')
      .eq('quiz_id', quizData.id)
      .in('field_key', translationKeys)
    
    const translations: { [key: string]: string } = {}
    data?.forEach(t => {
      translations[t.field_key] = t.value
    })
    return translations
  }

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(questions)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1
    }))

    setQuestions(updatedItems)

    try {
      setSaving(true)
      const updates = updatedItems.map(item => ({
        id: item.id,
        order: item.order
      }))

      const { error } = await supabase
        .from('quiz_questions')
        .upsert(updates)

      if (error) throw error
    } catch (err) {
      console.error('Error updating question order:', err)
      setError('Hiba a sorrend mentésekor')
      loadQuestions() // Reload to revert changes
    } finally {
      setSaving(false)
    }
  }

  const saveQuestion = async (formData: EnhancedQuestionFormData, questionId?: string) => {
    try {
      setSaving(true)
      setError(null)

      // 1. Save/update question in quiz_questions
      const questionData = {
        quiz_id: quizData.id,
        key: formData.key,
        type: formData.type,
        active: formData.active,
        options: formData.options.map(opt => ({
          key: opt.key,
          score: opt.score
        })),
        order: questionId ? undefined : (questions.length + 1)
      }

      let savedQuestion
      if (questionId) {
        const { data, error } = await supabase
          .from('quiz_questions')
          .update(questionData)
          .eq('id', questionId)
          .select()
          .single()
        if (error) throw error
        savedQuestion = data
      } else {
        const { data, error } = await supabase
          .from('quiz_questions')
          .insert(questionData)
          .select()
          .single()
        if (error) throw error
        savedQuestion = data
      }

      // 2. Save translations
      const translations = [
        {
          quiz_id: quizData.id,
          field_key: `question:${formData.key}:text`,
          value: formData.textHu,
          lang: 'hu'
        },
        ...(formData.helpTextHu ? [{
          quiz_id: quizData.id,
          field_key: `question:${formData.key}:help`,
          value: formData.helpTextHu,
          lang: 'hu'
        }] : []),
        ...formData.options.flatMap(opt => [
          {
            quiz_id: quizData.id,
            field_key: `option:${opt.key}:label`,
            value: opt.textHu,
            lang: 'hu'
          }
        ])
      ]

      // Delete existing translations for this question
      await supabase
        .from('quiz_translations')
        .delete()
        .eq('quiz_id', quizData.id)
        .like('field_key', `question:${formData.key}:%`)

      // Delete existing option translations
      for (const opt of formData.options) {
        await supabase
          .from('quiz_translations')
          .delete()
          .eq('quiz_id', quizData.id)
          .eq('field_key', `option:${opt.key}:label`)
      }

      // Insert new translations
      if (translations.length > 0) {
        const { error: translationError } = await supabase
          .from('quiz_translations')
          .insert(translations)
        if (translationError) throw translationError
      }

      await loadQuestions()
      setEditingQuestion(null)
      setIsAddingNew(false)
    } catch (err) {
      console.error('Error saving question:', err)
      setError('Hiba a kérdés mentésekor')
    } finally {
      setSaving(false)
    }
  }

  const deleteQuestion = async (questionId: string, questionKey: string) => {
    if (!confirm('Biztosan törölni szeretnéd ezt a kérdést?')) return

    try {
      setSaving(true)
      
      // Delete translations
      await supabase
        .from('quiz_translations')
        .delete()
        .eq('quiz_id', quizData.id)
        .like('field_key', `question:${questionKey}:%`)

      // Delete question
      const { error } = await supabase
        .from('quiz_questions')
        .delete()
        .eq('id', questionId)

      if (error) throw error
      await loadQuestions()
    } catch (err) {
      console.error('Error deleting question:', err)
      setError('Hiba a kérdés törlésekor')
    } finally {
      setSaving(false)
    }
  }

  const toggleQuestionActive = async (questionId: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('quiz_questions')
        .update({ active: !currentActive })
        .eq('id', questionId)

      if (error) throw error
      await loadQuestions()
    } catch (err) {
      console.error('Error toggling question active:', err)
      setError('Hiba a kérdés állapotának változtatásakor')
    }
  }

  if (loading) {
    return (
      <div className="p-4 bg-green-100 border-2 border-green-500 rounded">
        <h2 className="text-2xl font-bold text-green-800">🚀 ENHANCED KÉRDÉS EDITOR</h2>
        <p>Quiz ID: {quizData?.id}</p>
        <p>Kérdések betöltése...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Kérdések szerkesztése</h2>
        <button
          onClick={() => setIsAddingNew(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Új kérdés
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <div className="text-red-800">{error}</div>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="questions">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {questions.map((question, index) => (
                <Draggable key={question.id} draggableId={question.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`bg-white rounded-lg border p-4 ${
                        question.active ? 'border-gray-200' : 'border-red-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            {...provided.dragHandleProps}
                            className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                          >
                            <Bars3Icon className="h-5 w-5" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-gray-500">
                                #{question.order}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                question.active 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {question.active ? 'Aktív' : 'Inaktív'}
                              </span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                {question.type === 'scale' ? 'Skála' : 
                                 question.type === 'single' ? 'Egyszer' : 'Többször'}
                              </span>
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {question.key}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {Array.isArray(question.options) ? question.options.length : 0} válaszlehetőség
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setPreviewQuestion(question)}
                            className="text-gray-400 hover:text-blue-600"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setEditingQuestion(question)}
                            className="text-gray-400 hover:text-blue-600"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => toggleQuestionActive(question.id, question.active || false)}
                            className={`px-3 py-1 rounded text-sm ${
                              question.active
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {question.active ? 'Inaktiválás' : 'Aktiválás'}
                          </button>
                          <button
                            onClick={() => deleteQuestion(question.id, question.key)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {(isAddingNew || editingQuestion) && (
        <QuestionForm
          question={editingQuestion}
          onSave={saveQuestion}
          onCancel={() => {
            setIsAddingNew(false)
            setEditingQuestion(null)
          }}
          saving={saving}
          quizId={quizData.id}
        />
      )}

      {previewQuestion && (
        <QuestionPreview
          question={previewQuestion}
          onClose={() => setPreviewQuestion(null)}
          quizId={quizData.id}
        />
      )}
    </div>
  )
}

// Question Form Component
function QuestionForm({ question, onSave, onCancel, saving, quizId }: QuestionFormProps) {
  const [formData, setFormData] = useState<EnhancedQuestionFormData>({
    key: question?.key || '',
    type: question?.type || 'single',
    textHu: '',
    textEn: '',
    helpTextHu: '',
    helpTextEn: '',
    active: question?.active ?? true,
    options: Array.isArray(question?.options) ? question.options.map((opt: any) => ({
      key: opt.key,
      score: opt.score,
      textHu: '',
      textEn: ''
    })) : []
  })

  const [activeTab, setActiveTab] = useState<'hu' | 'en'>('hu')
  const [loadingTranslations, setLoadingTranslations] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const supabase = useMemo(() => createClient(), [])

  // Load translations when editing existing question
  useEffect(() => {
    if (question) {
      loadTranslations()
    }
  }, [question])

  const loadTranslations = async () => {
    if (!question) return
    
    try {
      setLoadingTranslations(true)
      
      // Load question translations
      const questionKeys = [
        `question:${question.key}:text`,
        `question:${question.key}:help`
      ]
      
      // Load option translations
      const optionKeys = Array.isArray(question.options) 
        ? question.options.map((opt: any) => `option:${opt.key}:label`)
        : []
      
      const { data } = await supabase
        .from('quiz_translations')
        .select('field_key, value, lang')
        .eq('quiz_id', quizId)
        .in('field_key', [...questionKeys, ...optionKeys])
      
      const translations: { [key: string]: string } = {}
      data?.forEach(t => {
        translations[`${t.field_key}_${t.lang}`] = t.value
      })
      
      setFormData(prev => ({
        ...prev,
        textHu: translations[`question:${question.key}:text_hu`] || '',
        textEn: translations[`question:${question.key}:text_en`] || '',
        helpTextHu: translations[`question:${question.key}:help_hu`] || '',
        helpTextEn: translations[`question:${question.key}:help_en`] || '',
        options: Array.isArray(question.options) ? question.options.map((opt: any) => ({
          key: opt.key,
          score: opt.score,
          textHu: translations[`option:${opt.key}:label_hu`] || '',
          textEn: translations[`option:${opt.key}:label_en`] || ''
        })) : []
      }))
    } catch (err) {
      console.error('Error loading translations:', err)
    } finally {
      setLoadingTranslations(false)
    }
  }

  const generateDefaultOptions = (type: QuestionType) => {
    if (type === 'scale') {
      return Array.from({ length: 5 }, (_, i) => ({
        key: `scale_${i + 1}`,
        score: i + 1,
        textHu: `${i + 1} - ${['Egyáltalán nem', 'Ritkán', 'Néha', 'Gyakran', 'Majdnem mindig'][i]}`,
        textEn: `${i + 1} - ${['Never', 'Rarely', 'Sometimes', 'Often', 'Almost always'][i]}`
      }))
    }
    return []
  }

  const handleTypeChange = (newType: QuestionType) => {
    setFormData(prev => ({
      ...prev,
      type: newType,
      options: newType === 'scale' ? generateDefaultOptions(newType) : prev.options
    }))
  }

  const addOption = () => {
    const newKey = `${formData.key}_${formData.options.length + 1}`
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, {
        key: newKey,
        score: prev.options.length + 1,
        textHu: '',
        textEn: ''
      }]
    }))
  }

  const removeOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }))
  }

  const updateOption = (index: number, field: keyof QuestionOption, value: any) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => 
        i === index ? { ...opt, [field]: value } : opt
      )
    }))
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.key.trim()) {
      newErrors.key = 'Kérdés kulcs kötelező'
    }

    if (formData.key && !/^[a-z0-9_]+$/.test(formData.key)) {
      newErrors.key = 'Csak kisbetűk, számok és aláhúzás használható'
    }

    if (!formData.textHu.trim()) {
      newErrors.textHu = 'Magyar kérdés szöveg kötelező'
    }

    if (formData.options.length === 0) {
      newErrors.options = 'Legalább egy válaszlehetőség kötelező'
    }

    formData.options.forEach((opt, i) => {
      if (!opt.textHu.trim()) {
        newErrors[`option_${i}_textHu`] = 'Magyar szöveg kötelező'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    onSave(formData, question?.id)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {question ? 'Kérdés szerkesztése' : 'Új kérdés hozzáadása'}
          </h3>
          
          {loadingTranslations && (
            <div className="text-center py-4">Fordítások betöltése...</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kérdés kulcs *
                </label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.key ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="pl: attention_span"
                />
                {errors.key && (
                  <p className="mt-1 text-sm text-red-600">{errors.key}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kérdés típus
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleTypeChange(e.target.value as QuestionType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="single">Egyszeres választás</option>
                  <option value="multi">Többszörös választás</option>
                  <option value="scale">Skála (1-5)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                className="mr-2"
              />
              <label htmlFor="active" className="text-sm font-medium text-gray-700">
                Aktív kérdés
              </label>
            </div>

            {/* Language Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  type="button"
                  onClick={() => setActiveTab('hu')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'hu'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Magyar
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('en')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'en'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  English
                </button>
              </nav>
            </div>

            {/* Question Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kérdés szöveg {activeTab === 'hu' && '*'}
              </label>
              <textarea
                value={activeTab === 'hu' ? formData.textHu : formData.textEn}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  [activeTab === 'hu' ? 'textHu' : 'textEn']: e.target.value 
                }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  activeTab === 'hu' && errors.textHu ? 'border-red-300' : 'border-gray-300'
                }`}
                rows={3}
                placeholder={activeTab === 'hu' ? 'Mennyire nehéz koncentrálnod hosszabb feladatok során?' : 'How difficult is it for you to concentrate during longer tasks?'}
              />
              {activeTab === 'hu' && errors.textHu && (
                <p className="mt-1 text-sm text-red-600">{errors.textHu}</p>
              )}
            </div>

            {/* Help Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Segítő szöveg (opcionális)
              </label>
              <textarea
                value={activeTab === 'hu' ? formData.helpTextHu : formData.helpTextEn}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  [activeTab === 'hu' ? 'helpTextHu' : 'helpTextEn']: e.target.value 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder={activeTab === 'hu' ? 'Gondolj olyan helyzetekre, amikor 30+ percig kellett egy dologra figyelned' : 'Think about situations when you had to focus on one thing for 30+ minutes'}
              />
            </div>

            {/* Options */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Válaszlehetőségek *
                </label>
                {formData.type !== 'scale' && (
                  <button
                    type="button"
                    onClick={addOption}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    + Opció
                  </button>
                )}
              </div>

              {errors.options && (
                <p className="mb-2 text-sm text-red-600">{errors.options}</p>
              )}

              <div className="space-y-3">
                {formData.options.map((option, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Opció #{index + 1}
                      </span>
                      {formData.type !== 'scale' && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-3">
                        <input
                          type="text"
                          value={option.key}
                          onChange={(e) => updateOption(index, 'key', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="kulcs"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          value={option.score}
                          onChange={(e) => updateOption(index, 'score', parseInt(e.target.value))}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="pont"
                        />
                      </div>
                      <div className="col-span-7">
                        <input
                          type="text"
                          value={activeTab === 'hu' ? option.textHu : option.textEn}
                          onChange={(e) => updateOption(index, activeTab === 'hu' ? 'textHu' : 'textEn', e.target.value)}
                          className={`w-full px-2 py-1 border rounded text-sm ${
                            activeTab === 'hu' && errors[`option_${index}_textHu`] ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder={activeTab === 'hu' ? 'Válasz szöveg' : 'Answer text'}
                        />
                        {activeTab === 'hu' && errors[`option_${index}_textHu`] && (
                          <p className="mt-1 text-xs text-red-600">{errors[`option_${index}_textHu`]}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-4 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Mégse
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Mentés...' : 'Mentés'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Question Preview Component
function QuestionPreview({ question, onClose, quizId }: { question: QuizQuestion, onClose: () => void, quizId: string }) {
  const [translations, setTranslations] = useState<{ [key: string]: string }>({})
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    loadTranslations()
  }, [question])

  const loadTranslations = async () => {
    try {
      setLoading(true)
      const questionKeys = [
        `question:${question.key}:text`,
        `question:${question.key}:help`
      ]
      const optionKeys = Array.isArray(question.options) 
        ? question.options.map((opt: any) => `option:${opt.key}:label`) 
        : []
      
      const { data } = await supabase
        .from('quiz_translations')
        .select('field_key, value')
        .eq('quiz_id', quizId)
        .eq('lang', 'hu')
        .in('field_key', [...questionKeys, ...optionKeys])
      
      const translationMap: { [key: string]: string } = {}
      data?.forEach(t => {
        translationMap[t.field_key] = t.value
      })
      setTranslations(translationMap)
    } catch (err) {
      console.error('Error loading preview translations:', err)
    } finally {
      setLoading(false)
    }
  }

  const questionText = translations[`question:${question.key}:text`] || question.key
  const helpText = translations[`question:${question.key}:help`]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Kérdés előnézet</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-8">Előnézet betöltése...</div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{questionText}</h4>
                {helpText && (
                  <p className="text-sm text-gray-600 mb-4">{helpText}</p>
                )}
                
                <div className="space-y-2">
                  {Array.isArray(question.options) ? question.options.map((opt: any, index: number) => {
                    const optionText = translations[`option:${opt.key}:label`] || opt.key
                    return (
                      <div key={opt.key} className="flex items-center space-x-3">
                        <input
                          type={question.type === 'multi' ? 'checkbox' : 'radio'}
                          name={`preview-${question.key}`}
                          disabled
                          className="text-blue-600"
                        />
                        <span className="text-sm">{optionText}</span>
                        <span className="text-xs text-gray-500">({opt.score} pont)</span>
                      </div>
                    )
                  }) : null}
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                Típus: {question.type} | Aktív: {question.active ? 'Igen' : 'Nem'} | Sorrend: {question.order}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
