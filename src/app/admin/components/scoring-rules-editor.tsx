'use client'

import { useState, useEffect } from 'react'
import { QuizScoringRule, ScoringRuleType } from '@/types/database'
import type { AdminUser } from '@/lib/admin-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Trash2, Save, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

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
  quizId: string
  adminUser: AdminUser
}

export default function ScoringRulesEditor({ quizId, adminUser }: ScoringRulesEditorProps) {
  const [scoringRules, setScoringRules] = useState<ExtendedScoringRule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Load existing scoring rules
  useEffect(() => {
    loadScoringRules()
  }, [quizId])

  const loadScoringRules = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/scoring-rules?quiz_id=${quizId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch scoring rules')
      }
      
      const result = await response.json()
      const data = result.data || []

      // Convert database format to extended format
      const extendedRules: ExtendedScoringRule[] = data.map((rule: any) => ({
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
      quiz_id: quizId,
      rule_type: 'weighted' as ScoringRuleType,
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
    
    try {
      // If it's an existing rule (not a new one), delete from database
      if (!rule.id.startsWith('new-')) {
        const response = await fetch(`/api/admin/scoring-rules?id=${rule.id}`, {
          method: 'DELETE'
        })

        if (!response.ok) {
          throw new Error('Failed to delete scoring rule')
        }

        // Create audit log
        await createAuditLogEntry('delete_scoring_rule', rule.id, {
          category: rule.category,
          quiz_id: quizId
        })
      }

      // Remove from local state
      const updated = scoringRules.filter((_, i) => i !== index)
      setScoringRules(updated)
      
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
          quiz_id: quizId,
          rule_type: 'weighted' as ScoringRuleType,
          weights: {
            category: rule.category,
            weight: rule.weight,
            min_score: rule.min_score,
            max_score: rule.max_score,
            threshold: rule.threshold,
            result_template: rule.result_template,
            description: rule.description
          }
        }

        if (rule.id.startsWith('new-')) {
          // Insert new rule
          const response = await fetch('/api/admin/scoring-rules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ruleData)
          })

          if (!response.ok) {
            throw new Error('Failed to create scoring rule')
          }

          const result = await response.json()
          const data = result.data

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
            quiz_id: quizId
          })
        } else {
          // Update existing rule
          const response = await fetch('/api/admin/scoring-rules', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...ruleData, id: rule.id })
          })

          if (!response.ok) {
            throw new Error('Failed to update scoring rule')
          }

          // Create audit log
          await createAuditLogEntry('update_scoring_rule', rule.id, {
            category: rule.category,
            quiz_id: quizId
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
          user_id: adminUser.id,
          user_email: adminUser.email,
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
    return <div className="p-4">Pontozási szabályok betöltése...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Pontozási Szabályok</h3>
          <p className="text-sm text-gray-600">
            Kategória-alapú scoring rendszer és eredmény küszöbértékek
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={addScoringRule} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Új szabály
          </Button>
          <Button 
            onClick={saveScoringRules} 
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

      <div className="space-y-4">
        {scoringRules.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500 mb-4">Még nincsenek pontozási szabályok</p>
              <Button onClick={addScoringRule} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Első szabály hozzáadása
              </Button>
            </CardContent>
          </Card>
        ) : (
          scoringRules.map((rule, index) => (
            <Card key={rule.id}>
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">
                    Szabály #{index + 1}
                    {rule.category && ` - ${rule.category}`}
                  </CardTitle>
                  <Button
                    onClick={() => removeScoringRule(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <Label htmlFor={`category-${index}`}>Kategória *</Label>
                    <Input
                      id={`category-${index}`}
                      value={rule.category || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateScoringRule(index, 'category', e.target.value)}
                      placeholder="pl. Introvert, Extrovert"
                    />
                  </div>

                  {/* Weight */}
                  <div>
                    <Label htmlFor={`weight-${index}`}>Súlyozás</Label>
                    <Input
                      id={`weight-${index}`}
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={rule.weight || 1.0}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateScoringRule(index, 'weight', parseFloat(e.target.value) || 0)}
                    />
                  </div>

                  {/* Min Score */}
                  <div>
                    <Label htmlFor={`min-score-${index}`}>Min Pontszám</Label>
                    <Input
                      id={`min-score-${index}`}
                      type="number"
                      min="0"
                      value={rule.min_score || 0}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateScoringRule(index, 'min_score', parseInt(e.target.value) || 0)}
                    />
                  </div>

                  {/* Max Score */}
                  <div>
                    <Label htmlFor={`max-score-${index}`}>Max Pontszám</Label>
                    <Input
                      id={`max-score-${index}`}
                      type="number"
                      min="0"
                      value={rule.max_score || 100}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateScoringRule(index, 'max_score', parseInt(e.target.value) || 0)}
                    />
                  </div>

                  {/* Threshold */}
                  <div className="md:col-span-2">
                    <Label htmlFor={`threshold-${index}`}>Küszöbérték</Label>
                    <Input
                      id={`threshold-${index}`}
                      type="number"
                      min={rule.min_score || 0}
                      max={rule.max_score || 100}
                      value={rule.threshold || 50}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateScoringRule(index, 'threshold', parseInt(e.target.value) || 0)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Eredmény megjelenítésének küszöbe ({rule.min_score || 0} - {rule.max_score || 100} között)
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor={`description-${index}`}>Leírás</Label>
                  <Input
                    id={`description-${index}`}
                    value={rule.description || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateScoringRule(index, 'description', e.target.value)}
                    placeholder="Szabály rövid leírása (opcionális)"
                  />
                </div>

                {/* Result Template */}
                <div>
                  <Label htmlFor={`template-${index}`}>Eredmény Template *</Label>
                  <Textarea
                    id={`template-${index}`}
                    value={rule.result_template || ''}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateScoringRule(index, 'result_template', e.target.value)}
                    placeholder="Az eredmény szövege, amit a felhasználó lát..."
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Használható változók: {'{score}'}, {'{category}'}, {'{percentage}'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {scoringRules.length > 0 && (
        <div className="text-sm text-gray-500">
          <p><strong>Súlyozás:</strong> 1.0 = normál, &gt;1.0 = nagyobb súly, &lt;1.0 = kisebb súly</p>
          <p><strong>Küszöbérték:</strong> Ezen pontszám felett jelenik meg ez az eredmény</p>
          <p><strong>Template változók:</strong> {'{score}'} = pontszám, {'{category}'} = kategória, {'{percentage}'} = százalék</p>
        </div>
      )}
    </div>
  )
}
