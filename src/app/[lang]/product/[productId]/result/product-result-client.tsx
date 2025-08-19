'use client'

import { useEffect, useState } from 'react'
import { Quiz, Session, QuizQuestion, QuizScoringRule, QuizPrompt, Product, QuizTranslation } from '@/types/database'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getTranslations } from '@/lib/translations'
import { tracker } from '@/lib/tracking'
import { Calendar, CheckCircle, Download, Star, Clock, Gift } from 'lucide-react'

interface ProductResultClientProps {
  product: Product
  session: Session
  quiz: Quiz
  questions: QuizQuestion[]
  scoringRules: QuizScoringRule[]
  aiPrompts: QuizPrompt[]
  allTranslations: QuizTranslation[]
  featureFlags: Record<string, any>
  theme: Record<string, any>
  resultContent?: Record<string, any>
  lang: string
  payment?: string
  stripeSession?: string
}

interface ScoreResult {
  totalScore: number
  category: 'low' | 'medium' | 'high'
  description: string
}

export function ProductResultClient({
  product,
  session,
  quiz,
  questions,
  scoringRules,
  aiPrompts,
  allTranslations,
  featureFlags,
  theme,
  resultContent,
  lang,
  payment,
  stripeSession
}: ProductResultClientProps) {
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null)
  const [aiResult, setAiResult] = useState<string | null>(null)
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null)
  const [aiNotice, setAiNotice] = useState<string | null>(null)
  const [showBooking, setShowBooking] = useState(false)

  // Get translations
  const translations = getTranslations(
    allTranslations,
    lang,
    [
      'result_title',
      'purchase_success_title',
      'purchase_success_message',
      'your_analysis',
      'book_consultation',
      'download_materials',
      'access_granted'
    ],
    quiz.default_lang
  )

  // Handle payment success
  useEffect(() => {
    if (payment === 'success' && stripeSession) {
      setPaymentSuccess(translations.purchase_success_message || 'Sikeres vásárlás! Köszönjük a bizalmat.')
      
      // Track purchase success
      tracker.trackPurchaseSucceeded(
        quiz.id,
        session.id,
        stripeSession,
        product.price
      ).catch(err => console.error('Purchase tracking failed:', err))
      
      // Clean up URL parameters
      const cleanUrl = window.location.pathname
      window.history.replaceState({}, '', cleanUrl)
    } else if (payment === 'cancelled') {
      setPaymentSuccess('Fizetés megszakítva.')
    }
  }, [payment, stripeSession, product, quiz, session, tracker, translations])

  // Calculate scores and get result
  useEffect(() => {
    calculateScores()
    
    // Check analysis type setting and generate AI result if needed
    const analysisType = featureFlags.result_analysis_type || 'both' // 'score', 'ai', or 'both'
    
    if (analysisType === 'ai' || analysisType === 'both') {
      const snapshot = session.result_snapshot as any
      const hasAiResult = snapshot?.ai_result
      
      if (!hasAiResult) {
        generateAIResult()
      } else {
        setAiResult(snapshot.ai_result)
      }
    }
  }, [])

  const calculateScores = () => {
    const answers = session.answers as Record<string, any> || {}
    let totalScore = 0

    // Calculate total score based on answers
    questions.forEach(question => {
      const answer = answers[question.key]
      if (!answer) return

      const options = question.options as any[] || []
      
      if (question.type === 'single') {
        const option = options.find(opt => opt.key === answer)
        if (option?.score) {
          totalScore += option.score
        }
      } else if (question.type === 'multi' && Array.isArray(answer)) {
        answer.forEach(answerKey => {
          const option = options.find(opt => opt.key === answerKey)
          if (option?.score) {
            totalScore += option.score
          }
        })
      } else if (question.type === 'scale') {
        totalScore += parseInt(answer) || 0
      }
    })

    // Dynamic category determination based on scoring rules
    let category: 'low' | 'medium' | 'high' = 'low'
    let description = `Your score is ${totalScore}`
    
    if (scoringRules && scoringRules.length > 0) {
      const rule = scoringRules[0]
      const ranges = (rule as any).score_ranges as any[]
      
      if (ranges) {
        for (const range of ranges) {
          if (totalScore >= range.min && totalScore <= range.max) {
            category = range.category
            description = range.description
            break
          }
        }
      }
    }

    setScoreResult({
      totalScore,
      category,
      description
    })
  }

  const generateAIResult = async () => {
    setIsLoadingAI(true)
    
    try {
      const response = await fetch('/api/ai/generate-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: session.id,
          quiz_id: quiz.id,
          lang,
        }),
      })

      if (response.ok) {
        const { ai_result, cached } = await response.json()
        setAiResult(ai_result)
        
        // Update local session state to prevent re-generation
        if (!cached) {
          const currentSnapshot = session.result_snapshot as Record<string, any> || {}
          session.result_snapshot = {
            ...currentSnapshot,
            ai_result,
            generated_at: new Date().toISOString()
          } as any
        }
      } else {
        if (response.status === 400) {
          setAiNotice('Az AI eredmény generálása nem elérhető ehhez a nyelvhez.')
        } else {
          setAiNotice('Az AI eredmény generálása sikertelen.')
        }
      }
    } catch (error) {
      setAiNotice('Az AI eredmény generálása nem érhető el.')
    } finally {
      setIsLoadingAI(false)
    }
  }

  const handleBookingClick = () => {
    setShowBooking(true)
    tracker.trackBookingView(quiz.id, session.id).catch(console.error)
  }

  const analysisType = featureFlags.result_analysis_type || 'both'
  const primaryColor = theme.primary_color || '#3B82F6'
  const secondaryColor = theme.secondary_color || '#F3F4F6'

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Modern Hero Section */}
      <header className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-16 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <CheckCircle className="w-16 h-16 text-green-300" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
            {resultContent?.result_title || translations.purchase_success_title || 'Sikeres Vásárlás!'}
          </h1>
          
          <p className="text-xl md:text-2xl text-purple-100 mb-2 max-w-2xl mx-auto">
            {resultContent?.result_description || product.name}
          </p>
          
          <Badge className="bg-green-500/20 text-green-100 border-green-300/30 px-4 py-2 text-lg">
            <Gift className="w-5 h-5 mr-2" />
            {translations.access_granted || 'Hozzáférés Aktiválva'}
          </Badge>
        </div>
      </header>

      <main className="px-4 py-12 relative">
        {/* Success Alert */}
        {paymentSuccess && (
          <div className="max-w-4xl mx-auto mb-8">
            <Alert className="bg-green-50 border-2 border-green-200 text-green-900 rounded-2xl shadow-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-lg font-medium">
                {paymentSuccess}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* AI Notice */}
        {aiNotice && (
          <div className="max-w-4xl mx-auto mb-8">
            <Alert className="bg-amber-50 border-2 border-amber-200 text-amber-900 rounded-2xl shadow-lg">
              <AlertDescription>{aiNotice}</AlertDescription>
            </Alert>
          </div>
        )}

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Action Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Download Materials */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  {translations.download_materials || 'Anyagok Letöltése'}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">Töltsd le a személyre szabott anyagaidat</p>
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
                  Letöltés
                </Button>
              </CardContent>
            </Card>

            {/* Book Consultation */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-100 hover:from-purple-100 hover:to-pink-200">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  {translations.book_consultation || 'Konzultáció Foglalás'}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">Foglalj időpontot személyre szabott konzultációra</p>
                <Button 
                  onClick={handleBookingClick}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Időpont Foglalás
                </Button>
              </CardContent>
            </Card>

            {/* Premium Access */}
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-100 hover:from-amber-100 hover:to-orange-200">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-800">
                  Premium Hozzáférés
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">Exkluzív tartalmak és szolgáltatások</p>
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-xl">
                  Megnyitás
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Analysis Section */}
          {(analysisType === 'score' || analysisType === 'both') && scoreResult && (
            <Card className="bg-white rounded-3xl shadow-xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8">
                <CardTitle className="text-2xl font-bold">
                  {translations.your_analysis || 'Az Ön Eredménye'}
                </CardTitle>
                <CardDescription className="text-purple-100 text-lg">
                  Részletes elemzés a quiz eredményei alapján
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-4xl font-bold text-indigo-600 mb-2">
                      {scoreResult.totalScore} pont
                    </div>
                    <Badge className={`px-4 py-2 text-sm font-semibold rounded-full ${
                      scoreResult.category === 'high' ? 'bg-red-100 text-red-800' :
                      scoreResult.category === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {scoreResult.category.toUpperCase()} kategória
                    </Badge>
                  </div>
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold text-white ${
                    scoreResult.category === 'high' ? 'bg-red-500' :
                    scoreResult.category === 'medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}>
                    {scoreResult.totalScore}
                  </div>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {scoreResult.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Product-Specific Result Content */}
          {resultContent?.result_text && (
            <Card className="bg-white rounded-3xl shadow-xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-8">
                <CardTitle className="text-2xl font-bold">
                  🎯 Termék-specifikus Eredmény
                </CardTitle>
                <CardDescription className="text-emerald-100 text-lg">
                  Személyre szabott tartalom az Ön termékéhez
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {resultContent.custom_result_html ? (
                  <div 
                    className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: resultContent.custom_result_html }}
                  />
                ) : (
                  <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                    {resultContent.result_text}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* AI Analysis Section */}
          {(analysisType === 'ai' || analysisType === 'both') && (
            <Card className="bg-white rounded-3xl shadow-xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-8">
                <CardTitle className="text-2xl font-bold">
                  AI Személyre Szabott Elemzés
                </CardTitle>
                <CardDescription className="text-purple-100 text-lg">
                  Mesterséges intelligencia által készített részletes értékelés
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {isLoadingAI ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                    <p className="text-gray-600 text-lg">AI elemzés generálása folyamatban...</p>
                  </div>
                ) : aiResult ? (
                  <div 
                    className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: aiResult }}
                  />
                ) : aiNotice ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 text-lg">{aiNotice}</p>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}

          {/* Booking Section */}
          {showBooking && product.booking_url && (
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl shadow-xl border-0 overflow-hidden">
              <CardHeader className="p-8">
                <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                  Időpont Foglalás
                </CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  Válasszon időpontot a személyre szabott konzultációra
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <iframe
                    src={product.booking_url}
                    className="w-full h-96 border-0 rounded-xl"
                    title="Booking Calendar"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
