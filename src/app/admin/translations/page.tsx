'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Download, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  Globe, 
  BarChart3,
  FileText,
  Languages
} from 'lucide-react'

interface Quiz {
  id: string
  title: string
  status: 'draft' | 'active' | 'archived'
  translations: Record<string, Record<string, string>>
}

interface TranslationStats {
  totalQuizzes: number
  totalFields: number
  translatedFields: {
    hu: number
    en: number
  }
  completionRate: {
    hu: number
    en: number
  }
  missingTranslations: {
    language: string
    quizId: string
    quizTitle: string
    field: string
  }[]
}

export default function TranslationsManagementPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [stats, setStats] = useState<TranslationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedLanguage, setSelectedLanguage] = useState<'hu' | 'en'>('hu')

  // Required translation fields for validation (prioritás szerint)
  const requiredFields = [
    // Magas prioritás - alapok
    'landing_headline', 'landing_hero_title', 'landing_hero_sub', 'landing_cta_primary',
    'meta_title', 'meta_description',
    
    // Közepes prioritás - konverzió
    'landing_trust_item_1_title', 'landing_trust_item_1_desc',
    'landing_trust_item_2_title', 'landing_trust_item_2_desc', 
    'landing_trust_item_3_title', 'landing_trust_item_3_desc',
    'landing_how_1_title', 'landing_how_1_desc',
    'landing_how_2_title', 'landing_how_2_desc',
    'landing_how_3_title', 'landing_how_3_desc',
    'landing_stats_title', 'landing_stats_desc',
    
    // Legacy - kompatibilitás
    'landing_sub', 'landing_description', 'cta_text',
    'email_gate_title', 'email_gate_button', 'result_title', 'result_description'
  ]

  useEffect(() => {
    loadTranslationData()
  }, [])

  const loadTranslationData = async () => {
    try {
      setLoading(true)
      // Load all quizzes with translations
      const response = await fetch('/api/admin/quizzes')
      if (!response.ok) throw new Error('Failed to load quizzes')
      
      const data = await response.json()
      setQuizzes(data.quizzes || [])
      
      // Calculate statistics
      const calculatedStats = calculateTranslationStats(data.quizzes || [])
      setStats(calculatedStats)
      
    } catch (error) {
      console.error('Error loading translation data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateTranslationStats = (quizzes: Quiz[]): TranslationStats => {
    let totalFields = 0
    let translatedFields = { hu: 0, en: 0 }
    const missingTranslations: TranslationStats['missingTranslations'] = []

    quizzes.forEach(quiz => {
      requiredFields.forEach(field => {
        totalFields += 2 // hu + en
        
        const huValue = quiz.translations?.hu?.[field]
        const enValue = quiz.translations?.en?.[field]
        
        if (huValue && huValue.trim()) {
          translatedFields.hu++
        } else {
          missingTranslations.push({
            language: 'hu',
            quizId: quiz.id,
            quizTitle: quiz.title,
            field
          })
        }
        
        if (enValue && enValue.trim()) {
          translatedFields.en++
        } else {
          missingTranslations.push({
            language: 'en', 
            quizId: quiz.id,
            quizTitle: quiz.title,
            field
          })
        }
      })
    })

    const totalFieldsPerLang = (totalFields / 2)
    
    return {
      totalQuizzes: quizzes.length,
      totalFields: totalFieldsPerLang,
      translatedFields,
      completionRate: {
        hu: totalFieldsPerLang > 0 ? Math.round((translatedFields.hu / totalFieldsPerLang) * 100) : 0,
        en: totalFieldsPerLang > 0 ? Math.round((translatedFields.en / totalFieldsPerLang) * 100) : 0
      },
      missingTranslations
    }
  }

  const exportTranslations = async (format: 'csv' | 'json') => {
    try {
      const response = await fetch(`/api/admin/translations/export?format=${format}`)
      if (!response.ok) throw new Error('Export failed')
      
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `translations_${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export error:', error)
      alert('Exportálás sikertelen: ' + error)
    }
  }

  const getMissingTranslationsForLanguage = (lang: 'hu' | 'en') => {
    return stats?.missingTranslations.filter(item => item.language === lang) || []
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">🌐 Fordítások kezelése</h1>
          <p className="text-gray-600 mt-2">
            Összes kvíz fordításainak áttekintése és tömeges műveletek
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => exportTranslations('csv')}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            CSV Export
          </Button>
          <Button 
            variant="outline"
            onClick={() => exportTranslations('json')}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            JSON Export
          </Button>
        </div>
      </div>

      {/* Statistics Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Összes kvíz</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalQuizzes}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalFields} fordítandó mező kvízenként
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">🇭🇺 Magyar fordítások</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completionRate.hu}%</div>
              <Progress value={stats.completionRate.hu} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {stats.translatedFields.hu} / {stats.totalFields} kész
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">🇬🇧 Angol fordítások</CardTitle>
              <Globe className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completionRate.en}%</div>
              <Progress value={stats.completionRate.en} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {stats.translatedFields.en} / {stats.totalFields} kész
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Missing Translations */}
      <Tabs defaultValue="hu" className="w-full">
        <TabsList>
          <TabsTrigger value="hu" className="flex items-center gap-2">
            🇭🇺 Magyar hiányosságok
            <Badge variant="destructive">
              {getMissingTranslationsForLanguage('hu').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="en" className="flex items-center gap-2">
            🇬🇧 Angol hiányosságok  
            <Badge variant="destructive">
              {getMissingTranslationsForLanguage('en').length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hu" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Hiányzó magyar fordítások
              </CardTitle>
              <CardDescription>
                Azon mezők ahol még nincs magyar fordítás
              </CardDescription>
            </CardHeader>
            <CardContent>
              {getMissingTranslationsForLanguage('hu').length === 0 ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Minden magyar fordítás kész! 🎉
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-2">
                  {getMissingTranslationsForLanguage('hu').map((item, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-3 border rounded-lg bg-orange-50 border-orange-200"
                    >
                      <div>
                        <div className="font-medium">{item.quizTitle}</div>
                        <div className="text-sm text-gray-600">Mező: {item.field}</div>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => window.open(`/admin/quiz-editor?id=${item.quizId}`, '_blank')}
                      >
                        <Languages className="h-4 w-4 mr-1" />
                        Szerkesztés
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="en" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Hiányzó angol fordítások
              </CardTitle>
              <CardDescription>
                Azon mezők ahol még nincs angol fordítás
              </CardDescription>
            </CardHeader>
            <CardContent>
              {getMissingTranslationsForLanguage('en').length === 0 ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Minden angol fordítás kész! 🎉
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-2">
                  {getMissingTranslationsForLanguage('en').map((item, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between p-3 border rounded-lg bg-orange-50 border-orange-200"
                    >
                      <div>
                        <div className="font-medium">{item.quizTitle}</div>
                        <div className="text-sm text-gray-600">Mező: {item.field}</div>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => window.open(`/admin/quiz-editor?id=${item.quizId}`, '_blank')}
                      >
                        <Languages className="h-4 w-4 mr-1" />
                        Szerkesztés
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quiz List */}
      <Card>
        <CardHeader>
          <CardTitle>Kvíz fordítások áttekintése</CardTitle>
          <CardDescription>
            Kattints bármelyik kvízre a fordítások szerkesztéséhez
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {quizzes.map(quiz => {
              const huMissing = getMissingTranslationsForLanguage('hu')
                .filter(item => item.quizId === quiz.id).length
              const enMissing = getMissingTranslationsForLanguage('en')
                .filter(item => item.quizId === quiz.id).length
              
              const huComplete = Math.round(((requiredFields.length - huMissing) / requiredFields.length) * 100)
              const enComplete = Math.round(((requiredFields.length - enMissing) / requiredFields.length) * 100)
              
              return (
                <div 
                  key={quiz.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => window.open(`/admin/quiz-editor?id=${quiz.id}`, '_blank')}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{quiz.title}</h3>
                      <Badge variant={quiz.status === 'active' ? 'default' : 'secondary'}>
                        {quiz.status}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">🇭🇺 Magyar:</span>
                        <Progress value={huComplete} className="w-20 h-2" />
                        <span className="text-sm font-medium">{huComplete}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">🇬🇧 Angol:</span>
                        <Progress value={enComplete} className="w-20 h-2" />
                        <span className="text-sm font-medium">{enComplete}%</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Languages className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
