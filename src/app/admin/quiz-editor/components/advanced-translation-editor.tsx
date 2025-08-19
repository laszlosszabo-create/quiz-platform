'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Plus, Edit, Trash2, Save, X, Languages, Globe, AlertCircle, Filter, Eye, EyeOff } from 'lucide-react'
// import { toast } from '@/hooks/use-toast'

interface Translation {
  id: string
  field_key: string
  lang: string
  value: string
  created_at: string
  updated_at: string
}

interface TranslationGroup {
  key: string
  translations: {
    [lang: string]: Translation
  }
}

export default function AdvancedTranslationEditor({ quizId }: { quizId: string }) {
  const [translations, setTranslations] = useState<Translation[]>([])
  const [groupedTranslations, setGroupedTranslations] = useState<TranslationGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [showOnlyMissing, setShowOnlyMissing] = useState(false)
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editingValues, setEditingValues] = useState<{ [lang: string]: string }>({})
  const [newKey, setNewKey] = useState('')
  const [newTranslations, setNewTranslations] = useState<{ [lang: string]: string }>({})
  const [showAddForm, setShowAddForm] = useState(false)

  const supportedLanguages = ['hu', 'en']
  const languageNames = { hu: 'Magyar 🇭🇺', en: 'English 🇺🇸' }

  // Translation categories for filtering
  const translationCategories = [
    { value: 'all', label: '🌟 Összes fordítás', count: 0 },
    { value: 'quiz', label: '❓ Quiz oldal', keywords: ['question', 'quiz', 'start', 'next', 'previous', 'submit', 'result'], count: 0 },
    { value: 'result', label: '📊 Eredmény oldal', keywords: ['result', 'score', 'analysis', 'points', 'category'], count: 0 },
    { value: 'product', label: '💰 Termék oldal', keywords: ['product', 'purchase', 'price', 'buy', 'download', 'access'], count: 0 },
    { value: 'dp_result', label: '🎁 DP Eredmény oldal', keywords: ['purchase_success', 'download_materials', 'book_consultation', 'premium_access', 'booking'], count: 0 },
    { value: 'admin', label: '⚙️ Admin felület', keywords: ['admin', 'config', 'save', 'delete', 'edit', 'settings', 'theme', 'feature'], count: 0 },
    { value: 'email', label: '📧 Email sablonok', keywords: ['email', 'subject', 'body', 'greeting', 'footer'], count: 0 },
    { value: 'error', label: '⚠️ Hibaüzenetek', keywords: ['error', 'failed', 'invalid', 'missing', 'required'], count: 0 },
    { value: 'ui', label: '🎨 UI elemek', keywords: ['button', 'label', 'placeholder', 'title', 'description'], count: 0 }
  ]

  useEffect(() => {
    loadTranslations()
  }, [quizId])

  useEffect(() => {
    // Group translations by key
    const grouped = translations.reduce((acc, translation) => {
      const existingGroup = acc.find(g => g.key === translation.field_key)
      if (existingGroup) {
        existingGroup.translations[translation.lang] = translation
      } else {
        acc.push({
          key: translation.field_key,
          translations: {
            [translation.lang]: translation
          }
        })
      }
      return acc
    }, [] as TranslationGroup[])

    // Apply filters
    let filtered = grouped

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(group => 
        group.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Object.values(group.translations).some(t => 
          t.value.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Category filter
    if (categoryFilter !== 'all') {
      const category = translationCategories.find(cat => cat.value === categoryFilter)
      if (category && category.keywords) {
        filtered = filtered.filter(group =>
          category.keywords!.some(keyword =>
            group.key.toLowerCase().includes(keyword.toLowerCase())
          )
        )
      }
    }

    // Missing translations filter
    if (showOnlyMissing) {
      filtered = filtered.filter(group =>
        supportedLanguages.some(lang => !group.translations[lang])
      )
    }

    // Update category counts
    translationCategories.forEach(category => {
      if (category.value === 'all') {
        category.count = grouped.length
      } else if (category.keywords) {
        category.count = grouped.filter(group =>
          category.keywords!.some(keyword =>
            group.key.toLowerCase().includes(keyword.toLowerCase())
          )
        ).length
      }
    })

    setGroupedTranslations(filtered.sort((a, b) => a.key.localeCompare(b.key)))
  }, [translations, searchTerm, categoryFilter, showOnlyMissing])

  const loadTranslations = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/translations?quiz_id=${quizId}`)
      if (response.ok) {
        const data = await response.json()
        setTranslations(data.translations || [])
      } else {
        alert("❌ Fordítások betöltése sikertelen.")
      }
    } catch (error) {
      console.error('Error loading translations:', error)
      alert("❌ Fordítások betöltése sikertelen.")
    } finally {
      setLoading(false)
    }
  }

  const startEditing = (group: TranslationGroup) => {
    setEditingKey(group.key)
    const values: { [lang: string]: string } = {}
    supportedLanguages.forEach(lang => {
      values[lang] = group.translations[lang]?.value || ''
    })
    setEditingValues(values)
  }

  const cancelEditing = () => {
    setEditingKey(null)
    setEditingValues({})
  }

  const saveTranslation = async (key: string) => {
    try {
      const updates = []
      for (const lang of supportedLanguages) {
        if (editingValues[lang] && editingValues[lang].trim()) {
          updates.push({
            quiz_id: quizId,
            field_key: key,
            lang,
            value: editingValues[lang].trim()
          })
        }
      }

      if (updates.length === 0) {
        alert("⚠️ Legalább egy fordítás megadása kötelező.")
        return
      }

      const response = await fetch('/api/admin/translations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ translations: updates })
      })

      if (response.ok) {
        alert(`✅ ${key} fordítás frissítve.`)
        loadTranslations()
        setEditingKey(null)
        setEditingValues({})
      } else {
        alert("❌ Fordítás mentése sikertelen.")
      }
    } catch (error) {
      console.error('Error saving translation:', error)
      alert("❌ Fordítás mentése sikertelen.")
    }
  }

  const addNewTranslation = async () => {
    if (!newKey.trim()) {
      alert("⚠️ Kulcs megadása kötelező.")
      return
    }

    // Check if key already exists
    if (groupedTranslations.some(g => g.key === newKey.trim())) {
      alert("⚠️ Ez a kulcs már létezik.")
      return
    }

    try {
      const translations = []
      for (const lang of supportedLanguages) {
        if (newTranslations[lang] && newTranslations[lang].trim()) {
          translations.push({
            quiz_id: quizId,
            field_key: newKey.trim(),
            lang,
            value: newTranslations[lang].trim()
          })
        }
      }

      if (translations.length === 0) {
        alert("⚠️ Legalább egy fordítás megadása kötelező.")
        return
      }

      const response = await fetch('/api/admin/translations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ translations })
      })

      if (response.ok) {
        alert(`✅ ${newKey} fordítás létrehozva.`)
        loadTranslations()
        setNewKey('')
        setNewTranslations({})
        setShowAddForm(false)
      } else {
        alert("❌ Fordítás hozzáadása sikertelen.")
      }
    } catch (error) {
      console.error('Error adding translation:', error)
      alert("❌ Fordítás hozzáadása sikertelen.")
    }
  }

  const deleteTranslation = async (key: string) => {
    if (!confirm(`🗑️ Biztosan törölni szeretnéd a "${key}" fordítást minden nyelvből?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/translations?quiz_id=${quizId}&field_key=${key}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert(`✅ ${key} fordítás törölve.`)
        loadTranslations()
      } else {
        alert("❌ Fordítás törlése sikertelen.")
      }
    } catch (error) {
      console.error('Error deleting translation:', error)
      alert("❌ Fordítás törlése sikertelen.")
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-3">🌐 Fordítások betöltése...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Languages className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-blue-900">
                  Fejlett Fordítás-szerkesztő
                </CardTitle>
                <CardDescription className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="border-blue-300">
                    {translations.length} fordítás
                  </Badge>
                  <Badge variant="outline" className="border-green-300">
                    {groupedTranslations.length} megjelenítve
                  </Badge>
                  <Badge variant="outline" className="border-purple-300">
                    {supportedLanguages.length} nyelv
                  </Badge>
                </CardDescription>
              </div>
            </div>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Új fordítás
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="🔍 Keresés kulcs vagy érték alapján..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Category Filter */}
            <div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Kategória szűrő" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {translationCategories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{category.label}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {category.count}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Missing Translations Toggle */}
            <div>
              <Button
                variant={showOnlyMissing ? "default" : "outline"}
                onClick={() => setShowOnlyMissing(!showOnlyMissing)}
                className={`w-full ${showOnlyMissing ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
              >
                {showOnlyMissing ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                {showOnlyMissing ? '🔍 Csak hiányzóak' : '👁️ Hiányzó fordítások'}
              </Button>
            </div>
          </div>
          
          {/* Active filters indicator */}
          {(categoryFilter !== 'all' || showOnlyMissing) && (
            <div className="flex items-center space-x-2 mt-3 pt-3 border-t">
              <span className="text-sm text-gray-600">Aktív szűrők:</span>
              {categoryFilter !== 'all' && (
                <Badge 
                  variant="secondary" 
                  className="cursor-pointer"
                  onClick={() => setCategoryFilter('all')}
                >
                  {translationCategories.find(c => c.value === categoryFilter)?.label}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
              {showOnlyMissing && (
                <Badge 
                  variant="secondary" 
                  className="cursor-pointer bg-orange-100 text-orange-700"
                  onClick={() => setShowOnlyMissing(false)}
                >
                  Hiányzó fordítások
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCategoryFilter('all')
                  setShowOnlyMissing(false)
                  setSearchTerm('')
                }}
                className="text-xs"
              >
                Összes szűrő törlése
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add New Translation Form */}
      {showAddForm && (
        <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-green-600" />
                <CardTitle className="text-green-700">Új Fordítás Hozzáadása</CardTitle>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setShowAddForm(false)
                  setNewKey('')
                  setNewTranslations({})
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-key">📝 Fordítás Kulcs</Label>
                <Input
                  id="new-key"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="pl. welcome_message, button_text, error_message"
                  className="font-mono"
                />
              </div>
              
              <Tabs defaultValue="hu" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  {supportedLanguages.map(lang => (
                    <TabsTrigger 
                      key={lang} 
                      value={lang} 
                      className="flex items-center space-x-2"
                    >
                      <Globe className="h-3 w-3" />
                      <span>{languageNames[lang as keyof typeof languageNames]}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {supportedLanguages.map(lang => (
                  <TabsContent key={lang} value={lang}>
                    <Textarea
                      value={newTranslations[lang] || ''}
                      onChange={(e) => setNewTranslations({
                        ...newTranslations,
                        [lang]: e.target.value
                      })}
                      placeholder={`Fordítás ${languageNames[lang as keyof typeof languageNames]} nyelven...`}
                      rows={3}
                      className="resize-none"
                    />
                  </TabsContent>
                ))}
              </Tabs>
              
              <div className="flex space-x-2 pt-2">
                <Button onClick={addNewTranslation} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  💾 Mentés
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowAddForm(false)
                    setNewKey('')
                    setNewTranslations({})
                  }}
                >
                  ❌ Mégse
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Translations List */}
      <div className="space-y-4">
        {groupedTranslations.map(group => {
          const hasAllLanguages = supportedLanguages.every(lang => group.translations[lang])
          const missingLanguages = supportedLanguages.filter(lang => !group.translations[lang])
          
          return (
            <Card key={group.key} className={hasAllLanguages ? '' : 'border-orange-200 bg-orange-50'}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base font-mono flex items-center space-x-2">
                      <span>{group.key}</span>
                      {!hasAllLanguages && (
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-2 mt-1">
                      <span>Nyelvek:</span>
                      {supportedLanguages.map(lang => (
                        <Badge 
                          key={lang}
                          variant={group.translations[lang] ? "default" : "secondary"}
                          className={`text-xs ${
                            group.translations[lang] 
                              ? 'bg-green-100 text-green-700 border-green-300' 
                              : 'bg-red-100 text-red-700 border-red-300'
                          }`}
                        >
                          {languageNames[lang as keyof typeof languageNames]}
                        </Badge>
                      ))}
                      {missingLanguages.length > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {missingLanguages.length} hiányzik
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    {editingKey === group.key ? (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => saveTranslation(group.key)}
                          className="flex items-center space-x-1 bg-green-600 hover:bg-green-700"
                        >
                          <Save className="h-3 w-3" />
                          <span>💾</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={cancelEditing}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => startEditing(group)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          ✏️
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => deleteTranslation(group.key)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          🗑️
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {editingKey === group.key ? (
                  <Tabs defaultValue="hu" className="w-full">
                    <TabsList className="mb-4 grid w-full grid-cols-2">
                      {supportedLanguages.map(lang => (
                        <TabsTrigger 
                          key={lang} 
                          value={lang} 
                          className="flex items-center space-x-2"
                        >
                          <Globe className="h-3 w-3" />
                          <span>{languageNames[lang as keyof typeof languageNames]}</span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {supportedLanguages.map(lang => (
                      <TabsContent key={lang} value={lang}>
                        <Textarea
                          value={editingValues[lang] || ''}
                          onChange={(e) => setEditingValues({
                            ...editingValues,
                            [lang]: e.target.value
                          })}
                          placeholder={`Fordítás ${languageNames[lang as keyof typeof languageNames]} nyelven...`}
                          rows={4}
                          className="resize-none"
                        />
                      </TabsContent>
                    ))}
                  </Tabs>
                ) : (
                  <div className="grid gap-4">
                    {supportedLanguages.map(lang => {
                      const translation = group.translations[lang]
                      return (
                        <div key={lang} className="flex items-start space-x-3 p-3 rounded-lg border bg-gray-50">
                          <Badge 
                            variant="outline" 
                            className={`mt-1 ${
                              translation 
                                ? 'border-green-300 bg-green-100 text-green-700' 
                                : 'border-red-300 bg-red-100 text-red-700'
                            }`}
                          >
                            {languageNames[lang as keyof typeof languageNames]}
                          </Badge>
                          <div className="flex-1">
                            {translation ? (
                              <p className="text-sm leading-relaxed">{translation.value}</p>
                            ) : (
                              <p className="text-sm text-red-400 italic">❌ Nincs fordítás</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}

        {groupedTranslations.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="text-center py-12">
              <Languages className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || categoryFilter !== 'all' || showOnlyMissing
                  ? '🔍 Nincs találat' 
                  : '📝 Még nincsenek fordítások'
                }
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || categoryFilter !== 'all' || showOnlyMissing
                  ? 'Próbálj meg más szűrési feltételeket használni vagy töröld a szűrőket.'
                  : 'Hozd létre az első fordítást a quiz számára.'
                }
              </p>
              {searchTerm || categoryFilter !== 'all' || showOnlyMissing ? (
                <Button 
                  onClick={() => {
                    setCategoryFilter('all')
                    setShowOnlyMissing(false)
                    setSearchTerm('')
                  }}
                  variant="outline"
                >
                  🗑️ Szűrők törlése
                </Button>
              ) : (
                <Button 
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  🌟 Első fordítás hozzáadása
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
