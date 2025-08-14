'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '../../../lib/supabase'
import { QuizQuestion, QuestionType } from '@/types/database'
import type { AdminUser } from '@/lib/admin-auth'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

interface QuestionsEditorProps {
  quizId: string
  adminUser: AdminUser
}

interface QuestionFormData {
  key: string
  type: QuestionType
  help_text?: string
  options?: any
  scoring?: any
}

export default function QuestionsEditor({ quizId, adminUser }: QuestionsEditorProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Use useMemo to prevent client recreation on every render
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    loadQuestions()
  }, [quizId])

  const loadQuestions = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('order', { ascending: true })

      if (error) throw error
      setQuestions(data || [])
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
          user_id: adminUser.id,
          user_email: adminUser.email,
          action,
          resource_type: 'quiz_question',
          resource_id: resourceId,
          details: {
            quiz_id: quizId,
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
        quiz_id: quizId,
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
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
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
          <h2 className="text-2xl font-bold">Kérdések szerkesztése</h2>
          <p className="text-gray-600">
            {questions.length} kérdés ({validationError || 'Érvényes mennyiség'})
          </p>
        </div>
        <button
          onClick={() => setIsAddingNew(true)}
          disabled={questions.length >= 20 || saving}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Új kérdés
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {validationError && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          {validationError}
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
                      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab hover:cursor-grabbing text-gray-400"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium">{question.key}</div>
                            <div className="text-sm text-gray-500">
                              {question.type} • Sorrend: {question.order}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingQuestion(question)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Szerkesztés
                          </button>
                          <button
                            onClick={() => deleteQuestion(question.id)}
                            disabled={saving}
                            className="text-red-600 hover:text-red-800 disabled:opacity-50"
                          >
                            Törlés
                          </button>
                        </div>
                      </div>
                      
                      {question.help_text && (
                        <div className="mt-2 text-sm text-gray-600">
                          Segítség: {question.help_text}
                        </div>
                      )}
                      
                      {question.options && (
                        <div className="mt-2 text-sm">
                          <span className="text-gray-500">Opciók: </span>
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {JSON.stringify(question.options)}
                          </span>
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

interface QuestionFormProps {
  question?: QuizQuestion | null
  onSave: (formData: QuestionFormData, questionId?: string) => void
  onCancel: () => void
  saving: boolean
}

function QuestionForm({ question, onSave, onCancel, saving }: QuestionFormProps) {
  const [formData, setFormData] = useState<QuestionFormData>({
    key: question?.key || '',
    type: question?.type || 'single',
    help_text: question?.help_text || '',
    options: question?.options || {},
    scoring: question?.scoring || {}
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.key.trim()) return
    onSave(formData, question?.id)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {question ? 'Kérdés szerkesztése' : 'Új kérdés'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kérdés kulcs *
            </label>
            <input
              type="text"
              value={formData.key}
              onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="pl. attention_span"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Típus *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as QuestionType }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="single">Egyszeres választás</option>
              <option value="multi">Többszörös választás</option>
              <option value="scale">Skála</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Segítő szöveg
            </label>
            <textarea
              value={formData.help_text}
              onChange={(e) => setFormData(prev => ({ ...prev, help_text: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Opcionális segítő szöveg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
              rows={5}
              placeholder='{"answers": ["Igen", "Nem"], "scale": [1, 5]}'
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
              rows={5}
              placeholder='{"weights": [0, 1], "category": "attention"}'
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
            >
              Mégse
            </button>
            <button
              type="submit"
              disabled={saving || !formData.key.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Mentés...' : 'Mentés'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
