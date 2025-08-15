'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '../../../../lib/supabase'
import { QuizQuestion, QuestionType } from '@/types/database'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

interface QuestionsEditorProps {
  quizData: any
  onDataChange: (field: string, value: any) => void
}

interface QuestionFormData {
  key: string
  type: QuestionType
  help_text?: string
  options?: any
  scoring?: any
}

interface QuestionFormProps {
  question: QuizQuestion | null
  onSave: (formData: QuestionFormData, questionId?: string) => void
  onCancel: () => void
  saving: boolean
}

export default function QuestionsEditor({ quizData, onDataChange }: QuestionsEditorProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Use useMemo to prevent client recreation on every render
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
        .order('order', { ascending: true })

      if (error) throw error
      setQuestions(data || [])
      
      // Update parent component with current questions count
      onDataChange('_questions_count', data?.length || 0)
    } catch (error) {
      console.error('Error loading questions:', error)
      setError('Hiba a kérdések betöltésekor')
    } finally {
      setLoading(false)
    }
  }

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(questions)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update order property for all items
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1
    }))

    setQuestions(updatedItems)

    // Save to database
    try {
      setSaving(true)
      const updates = updatedItems.map(item => ({
        id: item.id,
        order: item.order
      }))

      for (const update of updates) {
        const { error } = await supabase
          .from('quiz_questions')
          .update({ order: update.order })
          .eq('id', update.id)

        if (error) throw error
      }
    } catch (error) {
      console.error('Error updating question order:', error)
      setError('Hiba a sorrend mentésekor')
      // Reload questions to reset order
      loadQuestions()
    } finally {
      setSaving(false)
    }
  }

  const createAuditLogEntry = async (action: string, resourceId: string, details?: any) => {
    try {
      await fetch('/api/admin/audit-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 'system', // Will be updated when auth is available
          user_email: 'system@quiz.app',
          action,
          resource_type: 'quiz_question',
          resource_id: resourceId,
          details: {
            quiz_id: quizData.id,
            ...details
          }
        })
      })
    } catch (error) {
      console.error('Failed to create audit log:', error)
      // Don't fail the operation if audit log fails
    }
  }

  const deleteQuestion = async (questionId: string) => {
    if (!confirm('Biztosan törölni szeretnéd ezt a kérdést?')) return

    try {
      setSaving(true)
      const questionToDelete = questions.find(q => q.id === questionId)
      
      const { error } = await supabase
        .from('quiz_questions')
        .delete()
        .eq('id', questionId)

      if (error) throw error

      // Create audit log
      try {
        await createAuditLogEntry('delete', questionId, {
          question_key: questionToDelete?.key,
          question_type: questionToDelete?.type
        })
      } catch (auditError) {
        console.error('Failed to create audit log:', auditError)
        // Don't fail the operation if audit log fails
      }

      // Reload questions and reorder
      await loadQuestions()
    } catch (error) {
      console.error('Error deleting question:', error)
      setError('Hiba a kérdés törlésekor')
    } finally {
      setSaving(false)
    }
  }

  const saveQuestion = async (formData: QuestionFormData, questionId?: string) => {
    try {
      setSaving(true)

      const questionData = {
        quiz_id: quizData.id,
        key: formData.key,
        type: formData.type,
        help_text: formData.help_text || null,
        options: formData.options || null,
        scoring: formData.scoring || null,
        order: questionId ? undefined : questions.length + 1
      }

      let resultData
      if (questionId) {
        // Update existing question
        const { data, error } = await supabase
          .from('quiz_questions')
          .update(questionData)
          .eq('id', questionId)
          .select()
          .single()

        if (error) throw error
        resultData = data
      } else {
        // Create new question
        const { data, error } = await supabase
          .from('quiz_questions')
          .insert(questionData)
          .select()
          .single()

        if (error) throw error
        resultData = data
      }

      // Create audit log
      try {
        await createAuditLogEntry(questionId ? 'update' : 'create', resultData.id, {
          question_key: formData.key,
          question_type: formData.type,
          changes: questionData
        })
      } catch (auditError) {
        console.error('Failed to create audit log:', auditError)
        // Don't fail the operation if audit log fails
      }

      setEditingQuestion(null)
      setIsAddingNew(false)
      await loadQuestions()
    } catch (error) {
      console.error('Error saving question:', error)
      setError('Hiba a kérdés mentésekor')
    } finally {
      setSaving(false)
    }
  }

  const validateQuestionCount = () => {
    if (questions.length < 5) {
      return 'Minimum 5 kérdés szükséges'
    }
    if (questions.length > 20) {
      return 'Maximum 20 kérdés engedélyezett'
    }
    return null
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  const validationError = validateQuestionCount()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Kérdések szerkesztése</h3>
          <p className="text-sm text-gray-500">
            {questions.length} kérdés • {validationError || 'Érvényes mennyiség'}
          </p>
        </div>
        <button
          onClick={() => setIsAddingNew(true)}
          disabled={questions.length >= 20 || saving}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + Új kérdés
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {validationError && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          ⚠️ {validationError}
        </div>
      )}

      {questions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-400 text-6xl mb-4">❓</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nincsenek kérdések</h3>
          <p className="text-gray-500 mb-4">Kezdd el az első kérdés hozzáadásával.</p>
          <button
            onClick={() => setIsAddingNew(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Első kérdés hozzáadása
          </button>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="questions">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {questions.map((question, index) => (
                  <Draggable key={question.id} draggableId={question.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm transition-shadow ${
                          snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-500' : 'hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab hover:cursor-grabbing text-gray-400 p-1 hover:text-gray-600"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{question.key}</div>
                              <div className="text-sm text-gray-500">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100">
                                  {question.type === 'single' ? 'Egyszeres választás' : 
                                   question.type === 'multi' ? 'Többszörös választás' : 
                                   question.type === 'scale' ? 'Skála' : question.type}
                                </span>
                                <span className="ml-2">#{question.order}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingQuestion(question)}
                              className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded text-sm"
                            >
                              ✏️ Szerkesztés
                            </button>
                            <button
                              onClick={() => deleteQuestion(question.id)}
                              disabled={saving}
                              className="text-red-600 hover:text-red-800 disabled:opacity-50 px-3 py-1 rounded text-sm"
                            >
                              🗑️ Törlés
                            </button>
                          </div>
                        </div>
                        
                        {question.help_text && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <div className="text-sm text-blue-800">
                              💡 <strong>Segítő szöveg:</strong> {question.help_text}
                            </div>
                          </div>
                        )}
                        
                        {question.options && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm">
                              <div className="text-gray-700 font-medium mb-1">📋 Opciók:</div>
                              <pre className="font-mono text-xs bg-white px-2 py-1 rounded border overflow-x-auto">
                                {JSON.stringify(question.options, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}

                        {question.scoring && (
                          <div className="mt-3 p-3 bg-green-50 rounded-lg">
                            <div className="text-sm">
                              <div className="text-green-800 font-medium mb-1">⚖️ Pontozás:</div>
                              <pre className="font-mono text-xs bg-white px-2 py-1 rounded border overflow-x-auto">
                                {JSON.stringify(question.scoring, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Question Form Modal */}
      {(editingQuestion || isAddingNew) && (
        <QuestionForm
          question={editingQuestion}
          onSave={saveQuestion}
          onCancel={() => {
            setEditingQuestion(null)
            setIsAddingNew(false)
          }}
          saving={saving}
        />
      )}
    </div>
  )
}

function QuestionForm({ question, onSave, onCancel, saving }: QuestionFormProps) {
  const [formData, setFormData] = useState<QuestionFormData>({
    key: question?.key || '',
    type: question?.type || 'single',
    help_text: question?.help_text || '',
    options: question?.options || {},
    scoring: question?.scoring || {}
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.key.trim()) {
      newErrors.key = 'Kérdés kulcs kötelező'
    }

    if (formData.key && !/^[a-z0-9_]+$/.test(formData.key)) {
      newErrors.key = 'Csak kisbetűk, számok és aláhúzás használható'
    }

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
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {question ? 'Kérdés szerkesztése' : 'Új kérdés hozzáadása'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="pl: personality_question_1"
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
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as QuestionType }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="single">Egyszeres választás</option>
                <option value="multi">Többszörös választás</option>
                <option value="scale">Skála (1-5)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Segítő szöveg
              </label>
              <textarea
                value={formData.help_text}
                onChange={(e) => setFormData(prev => ({ ...prev, help_text: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Opcionális segítő szöveg a felhasználók számára"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opciók (JSON)
              </label>
              <textarea
                value={JSON.stringify(formData.options, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value)
                    setFormData(prev => ({ ...prev, options: parsed }))
                  } catch {
                    // Invalid JSON, let user continue typing
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                rows={6}
                placeholder='{"answers": ["Igen", "Nem"], "scale": [1, 5]}'
              />
              <p className="mt-1 text-xs text-gray-500">
                JSON formátumban adja meg a válaszlehetőségeket
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pontozás (JSON)
              </label>
              <textarea
                value={JSON.stringify(formData.scoring, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value)
                    setFormData(prev => ({ ...prev, scoring: parsed }))
                  } catch {
                    // Invalid JSON, let user continue typing
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                rows={6}
                placeholder='{"weights": [0, 1], "category": "attention"}'
              />
              <p className="mt-1 text-xs text-gray-500">
                JSON formátumban adja meg a pontozási szabályokat
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onCancel}
                disabled={saving}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Mégse
              </button>
              <button
                type="submit"
                disabled={saving || !formData.key.trim()}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Mentés...' : (question ? 'Frissítés' : 'Létrehozás')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
