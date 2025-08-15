'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../../../../lib/supabase'
import { QuizScoringRule, ScoringRuleType } from '@/types/database'

interface ExtendedScoringRule extends QuizScoringRule {
  category?: string
  min_score?: number
  max_score?: number
  weight?: number
  threshold?: number
  result_template?: string
  description?: string
}

interface ScoringRulesEditorProps {
  quizData: any
  onDataChange: (field: string, value: any) => void
}

export default function ScoringRulesEditor({ quizData, onDataChange }: ScoringRulesEditorProps) {
  const [scoringRules, setScoringRules] = useState<ExtendedScoringRule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const supabase = createClient()

  // Load existing scoring rules
  useEffect(() => {
    if (quizData?.id) {
      loadScoringRules()
    }
  }, [quizData?.id])

  const loadScoringRules = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('quiz_scoring_rules')
        .select('*')
        .eq('quiz_id', quizData.id)

      if (error) throw error

      // Convert database format to extended format
      const extendedRules: ExtendedScoringRule[] = (data || []).map((rule: any) => ({
        ...rule,
        category: rule.weights?.category || '',
        min_score: rule.weights?.min_score || 0,
        max_score: rule.weights?.max_score || 100,
        weight: rule.weights?.weight || 1.0,
        threshold: rule.weights?.threshold || 50,
        result_template: rule.weights?.result_template || '',
        description: rule.weights?.description || ''
      }))

      setScoringRules(extendedRules)
      onDataChange('_scoring_rules_count', extendedRules.length)
    } catch (err) {
      console.error('Failed to load scoring rules:', err)
      setError('Nem sikerült betölteni a pontozási szabályokat')
    } finally {
      setIsLoading(false)
    }
  }

  // Add new scoring rule
  const addScoringRule = () => {
    const newRule: ExtendedScoringRule = {
      id: `new-${Date.now()}`,
      quiz_id: quizData.id,
      rule_type: 'weighted' as ScoringRuleType,
      weights: {},
      thresholds: {},
      category: '',
      min_score: 0,
      max_score: 100,
      weight: 1.0,
      threshold: 50,
      result_template: '',
      description: ''
    }
    setScoringRules([...scoringRules, newRule])
  }

  // Update scoring rule
  const updateScoringRule = (index: number, field: keyof ExtendedScoringRule, value: any) => {
    const updated = [...scoringRules]
    updated[index] = { ...updated[index], [field]: value }
    setScoringRules(updated)
  }

  // Remove scoring rule
  const removeScoringRule = async (index: number) => {
    const rule = scoringRules[index]
    
    if (!confirm('Biztosan törölni szeretnéd ezt a pontozási szabályt?')) return

    try {
      // If it's an existing rule (not a new one), delete from database
      if (!rule.id.startsWith('new-')) {
        const { error } = await supabase
          .from('quiz_scoring_rules')
          .delete()
          .eq('id', rule.id)

        if (error) throw error

        // Create audit log
        await createAuditLogEntry('delete_scoring_rule', rule.id, {
          category: rule.category,
          quiz_id: quizData.id
        })
      }

      // Remove from local state
      const updated = scoringRules.filter((_, i) => i !== index)
      setScoringRules(updated)
      onDataChange('_scoring_rules_count', updated.length)
      
      setSuccessMessage('Pontozási szabály törölve')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Failed to delete scoring rule:', err)
      setError('Nem sikerült törölni a pontozási szabályt')
    }
  }

  // Save all scoring rules
  const saveScoringRules = async () => {
    try {
      setIsSaving(true)
      setError('')

      // Validate rules
      const validationErrors = validateScoringRules()
      if (validationErrors.length > 0) {
        setError(validationErrors.join(', '))
        return
      }

      for (const rule of scoringRules) {
        const ruleData = {
          quiz_id: quizData.id,
          rule_type: 'weighted' as ScoringRuleType,
          weights: {
            category: rule.category,
            weight: rule.weight,
            min_score: rule.min_score,
            max_score: rule.max_score,
            threshold: rule.threshold,
            result_template: rule.result_template,
            description: rule.description
          },
          thresholds: {}
        }

        if (rule.id.startsWith('new-')) {
          // Insert new rule
          const { data, error } = await supabase
            .from('quiz_scoring_rules')
            .insert(ruleData)
            .select()
            .single()

          if (error) throw error

          // Update local state with real ID
          const ruleIndex = scoringRules.findIndex(r => r.id === rule.id)
          if (ruleIndex >= 0) {
            const updated = [...scoringRules]
            updated[ruleIndex] = { ...updated[ruleIndex], id: data.id }
            setScoringRules(updated)
          }

          // Create audit log
          await createAuditLogEntry('create_scoring_rule', data.id, {
            category: rule.category,
            quiz_id: quizData.id
          })
        } else {
          // Update existing rule
          const { error } = await supabase
            .from('quiz_scoring_rules')
            .update(ruleData)
            .eq('id', rule.id)

          if (error) throw error

          // Create audit log
          await createAuditLogEntry('update_scoring_rule', rule.id, {
            category: rule.category,
            quiz_id: quizData.id
          })
        }
      }

      setSuccessMessage('Pontozási szabályok mentve!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Failed to save scoring rules:', err)
      setError('Nem sikerült menteni a pontozási szabályokat')
    } finally {
      setIsSaving(false)
    }
  }

  // Validate scoring rules
  const validateScoringRules = (): string[] => {
    const errors: string[] = []
    
    // Check for duplicate categories
    const categories = scoringRules.map(r => r.category).filter(c => c)
    const duplicates = categories.filter((c, i) => categories.indexOf(c) !== i)
    if (duplicates.length > 0) {
      errors.push(`Duplikált kategóriák: ${duplicates.join(', ')}`)
    }

    // Check for empty required fields
    scoringRules.forEach((rule, index) => {
      if (!rule.category) {
        errors.push(`${index + 1}. szabály: kategória kötelező`)
      }
      if (!rule.result_template) {
        errors.push(`${index + 1}. szabály: eredmény template kötelező`)
      }
      if (rule.min_score !== undefined && rule.max_score !== undefined && rule.min_score >= rule.max_score) {
        errors.push(`${index + 1}. szabály: min pontszám nem lehet nagyobb vagy egyenlő a max pontszámnál`)
      }
      if (rule.threshold !== undefined && rule.min_score !== undefined && rule.max_score !== undefined) {
        if (rule.threshold < rule.min_score || rule.threshold > rule.max_score) {
          errors.push(`${index + 1}. szabály: küszöb értéknek a min és max pontszám között kell lennie`)
        }
      }
    })

    return errors
  }

  // Create audit log entry
  const createAuditLogEntry = async (action: string, resourceId: string, details?: any) => {
    try {
      await fetch('/api/admin/audit-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'system', // Will be updated when auth is available
          user_email: 'system@quiz.app',
          action,
          resource_type: 'quiz_scoring_rule',
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Pontozási Szabályok</h3>
          <p className="text-sm text-gray-500">
            Kategória-alapú scoring rendszer és eredmény küszöbértékek ({scoringRules.length} szabály)
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addScoringRule}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
          >
            + Új szabály
          </button>
          {scoringRules.length > 0 && (
            <button
              onClick={saveScoringRules}
              disabled={isSaving}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
            >
              💾 {isSaving ? 'Mentés...' : 'Mentés'}
            </button>
          )}
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

      <div className="space-y-4">
        {scoringRules.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-gray-400 text-6xl mb-4">⚖️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nincsenek pontozási szabályok</h3>
            <p className="text-gray-500 mb-4">Hozd létre az első pontozási szabályt a quiz eredményeihez.</p>
            <button
              onClick={addScoringRule}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Első szabály hozzáadása
            </button>
          </div>
        ) : (
          scoringRules.map((rule, index) => (
            <div key={rule.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-base font-medium text-gray-900">
                  Szabály #{index + 1}
                  {rule.category && ` - ${rule.category}`}
                </h4>
                <button
                  onClick={() => removeScoringRule(index)}
                  className="text-red-600 hover:text-red-800 px-3 py-1 rounded text-sm"
                >
                  🗑️ Törlés
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategória *
                    </label>
                    <input
                      type="text"
                      value={rule.category || ''}
                      onChange={(e) => updateScoringRule(index, 'category', e.target.value)}
                      placeholder="pl. Introvert, Extrovert"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Weight */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Súlyozás
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={rule.weight || 1.0}
                      onChange={(e) => updateScoringRule(index, 'weight', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">1.0 = normál, &gt;1.0 = nagyobb súly</p>
                  </div>

                  {/* Min Score */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Pontszám
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={rule.min_score || 0}
                      onChange={(e) => updateScoringRule(index, 'min_score', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Max Score */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Pontszám
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={rule.max_score || 100}
                      onChange={(e) => updateScoringRule(index, 'max_score', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Threshold */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Küszöbérték
                    </label>
                    <input
                      type="number"
                      min={rule.min_score || 0}
                      max={rule.max_score || 100}
                      value={rule.threshold || 50}
                      onChange={(e) => updateScoringRule(index, 'threshold', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Eredmény megjelenítésének küszöbe ({rule.min_score || 0} - {rule.max_score || 100} között)
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Leírás
                  </label>
                  <input
                    type="text"
                    value={rule.description || ''}
                    onChange={(e) => updateScoringRule(index, 'description', e.target.value)}
                    placeholder="Szabály rövid leírása (opcionális)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Result Template */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Eredmény Template *
                  </label>
                  <textarea
                    value={rule.result_template || ''}
                    onChange={(e) => updateScoringRule(index, 'result_template', e.target.value)}
                    placeholder="Az eredmény szövege, amit a felhasználó lát..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Használható változók: {'{score}'}, {'{category}'}, {'{percentage}'}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {scoringRules.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">📚 Scoring rendszer súgó:</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Súlyozás:</strong> 1.0 = normál, &gt;1.0 = nagyobb súly, &lt;1.0 = kisebb súly</p>
            <p><strong>Küszöbérték:</strong> Ezen pontszám felett jelenik meg ez az eredmény</p>
            <p><strong>Template változók:</strong> {'{score}'} = pontszám, {'{category}'} = kategória, {'{percentage}'} = százalék</p>
          </div>
        </div>
      )}
    </div>
  )
}
