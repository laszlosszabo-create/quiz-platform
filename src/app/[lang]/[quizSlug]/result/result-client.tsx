'use client'

import { useEffect, useState } from 'react'
import { Quiz, Session, QuizQuestion, QuizScoringRule, QuizPrompt, Product, QuizTranslation } from '@/types/database'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { getTranslations } from '@/lib/translations'
import { tracker } from '@/lib/tracking'

interface ResultClientProps {
  quiz: Quiz
  session: Session
  questions: QuizQuestion[]
  scoringRules: QuizScoringRule[]
  aiPrompts: QuizPrompt[]
  product: Product | null
  allTranslations: QuizTranslation[]
  featureFlags: Record<string, any>
  theme: Record<string, any>
  lang: string
}

interface ScoreResult {
  totalScore: number
  category: 'low' | 'medium' | 'high'
  description: string
}

export function ResultClient({
  quiz,
  session,
  questions,
  scoringRules,
  aiPrompts,
  product,
  allTranslations,
  featureFlags,
  theme,
  lang
}: ResultClientProps) {
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null)
  const [aiResult, setAiResult] = useState<string | null>(null)
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [aiNotice, setAiNotice] = useState<string | null>(null)

  // Calculate scores and get result
  useEffect(() => {
    calculateScores()
    
    // Check analysis type setting and generate AI result if needed
    const analysisType = featureFlags.result_analysis_type || 'both' // 'score', 'ai', or 'both'
    
    if ((analysisType === 'ai' || analysisType === 'both') && !session.result_snapshot) {
      generateAIResult()
    } else if (session.result_snapshot) {
      // Use existing AI result
      const snapshot = session.result_snapshot as any
      if (snapshot.ai_result) {
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

    // NEW: Dynamic category determination based on scoring rules from database
    let category: 'low' | 'medium' | 'high' = 'low'
    let description = `Your score is ${totalScore}`
    
    if (scoringRules && scoringRules.length > 0) {
      // Use the first scoring rule (admin-configured)
      const rule = scoringRules[0]
      const weights = rule.weights as any || {}
      
      // Determine category based on admin-configured thresholds
      const threshold = weights.threshold || 50
      const minScore = weights.min_score || 0
      const maxScore = weights.max_score || 100
      
      // Calculate score percentage for more flexible categorization
      const scorePercentage = ((totalScore - minScore) / (maxScore - minScore)) * 100
      
      if (scorePercentage >= threshold) {
        category = 'high'
      } else if (scorePercentage >= threshold * 0.6) { // 60% of threshold for medium
        category = 'medium'
      } else {
        category = 'low'
      }
      
      // Use admin-configured result template if available
      if (weights.result_template) {
        description = weights.result_template
          .replace('{score}', totalScore.toString())
          .replace('{category}', weights.category || category)
          .replace('{percentage}', Math.round(scorePercentage).toString())
      }
    } else {
      // Fallback to hardcoded logic if no scoring rules configured
      console.warn('No scoring rules found, using fallback logic')
      const fallbackThresholds = { low: 10, medium: 20, high: 999 }
      
      if (totalScore > fallbackThresholds.high) {
        category = 'high'
      } else if (totalScore > fallbackThresholds.medium) {
        category = 'medium'
      }
    }

    // Get static description from translations as fallback
    if (!scoringRules || scoringRules.length === 0) {
      const translations = getTranslations(
        allTranslations,
        lang,
        [`result_static_${category}`, `result_${category}_description`],
        quiz.default_lang
      )

      description = translations[`result_static_${category}`] || 
                   translations[`result_${category}_description`] || 
                   description
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
        const { ai_result } = await response.json()
        setAiResult(ai_result)
      } else {
        if (response.status === 400) {
          setAiNotice('Az AI eredmény generálása nem elérhető ehhez a nyelvhez, mert nincs konfigurált AI prompt. A statikus eredmény kerül megjelenítésre.')
        } else {
          setAiNotice('Az AI eredmény generálása sikertelen. A statikus eredmény kerül megjelenítésre.')
        }
      }
    } catch (error) {
      setAiNotice('Az AI eredmény generálása nem érhető el. A statikus eredmény kerül megjelenítésre.')
    } finally {
      setIsLoadingAI(false)
    }
  }

  const handleProductView = () => {
    if (product) {
      tracker.trackProductView(quiz.id, session.id, product.id)
    }
  }

  const handleProductPurchase = () => {
    if (product) {
      tracker.trackCheckoutStart(quiz.id, session.id, product.id)
      setShowCheckout(true)
      
      // Redirect to Stripe Checkout
      startCheckout()
    }
  }

  const handleBookingView = () => {
    tracker.trackBookingView(quiz.id, session.id)
  }

  const startCheckout = async () => {
    if (!product) return

    setIsProcessingPayment(true)
    
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: product.id,
          session_id: session.id,
          lang,
        }),
      })

      if (response.ok) {
        const { checkout_url } = await response.json()
        window.location.href = checkout_url
      } else {
        console.error('Checkout creation failed')
        setShowCheckout(false)
        setIsProcessingPayment(false)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setShowCheckout(false)
      setIsProcessingPayment(false)
    }
  }

  // Get result translations
  const resultTranslations = getTranslations(
    allTranslations,
    lang,
    [
      'result_headline',
      'result_sub',
      'result_ai_loading',
      'result_product_headline',
      'result_product_cta',
      'result_booking_headline',
      'result_booking_cta'
    ],
    quiz.default_lang
  )

  // Get product translations
  const productTranslations = product?.translations as Record<string, any> || {}
  const productName = productTranslations[lang]?.name || productTranslations[quiz.default_lang]?.name || 'Premium Report'
  const productDescription = productTranslations[lang]?.description || productTranslations[quiz.default_lang]?.description

  // Get theme values and analysis type
  const primaryColor = theme.primary_color || '#3B82F6'
  const calendlyUrl = theme.calendly_url
  const analysisType = featureFlags.result_analysis_type || 'both' // 'score', 'ai', or 'both'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Modern Hero Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {resultTranslations.result_headline || '🎉 Az Eredményed Kész!'}
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {resultTranslations.result_sub || 'Személyre szabott elemzés és megoldások, amelyek valóban működnek'}
          </p>
          {scoreResult && (
            <div className="mt-8 inline-flex items-center bg-white/20 rounded-full px-6 py-3 backdrop-blur-sm">
              <span className="text-2xl font-bold mr-2">{scoreResult.totalScore}</span>
              <span className="text-blue-100">pontot értél el</span>
            </div>
          )}
        </div>
      </header>

      <main className="px-4 py-8 relative">
        {aiNotice && (
          <div className="max-w-4xl mx-auto mb-6">
            <Alert className="bg-amber-50 border-amber-200 text-amber-900 rounded-2xl shadow-sm">
              <AlertDescription>{aiNotice}</AlertDescription>
            </Alert>
          </div>
        )}

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Score Section - Modern Card Design (csak ha engedélyezve) */}
          {(analysisType === 'score' || analysisType === 'both') && scoreResult && (
            <section className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {analysisType === 'both' ? 'Pont Alapú Elemzés' : 'Az Eredményed Kategória'}
                    </h2>
                    <div className="flex items-center gap-4">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                        scoreResult.category === 'high' ? 'bg-red-100 text-red-800' :
                        scoreResult.category === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {scoreResult.category === 'high' ? '🔴 Magas kockázat' :
                         scoreResult.category === 'medium' ? '🟡 Közepes kockázat' :
                         '🟢 Alacsony kockázat'}
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900">{scoreResult.totalScore}</div>
                    <div className="text-sm text-gray-500">összpontszám</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-2xl p-6">
                  <p className="text-gray-700 text-lg leading-relaxed">{scoreResult.description}</p>
                </div>
              </div>
            </section>
          )}

          {/* AI Result Section - Premium Design (csak ha engedélyezve) */}
          {(analysisType === 'ai' || analysisType === 'both') && (
            <section className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    🧠
                  </span>
                  {analysisType === 'both' ? 'AI Alapú Elemzés' : 'Személyre Szabott AI Elemzés'}
                </h2>
                <p className="text-blue-100 mt-2">Speciálisan az Ön válaszai alapján generált részletes értékelés</p>
              </div>
              
              <div className="p-8">
                {isLoadingAI && (
                  <div className="text-center py-12">
                    <div className="relative">
                      <div className="w-16 h-16 mx-auto mb-6 relative">
                        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        AI Elemzés Generálása...
                      </h3>
                      <p className="text-gray-600">
                        {resultTranslations.result_ai_loading || 'Személyre szabott elemzést készítünk az Ön válaszai alapján...'}
                      </p>
                      <div className="mt-6 flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {aiResult && (
                  <div className="prose prose-lg max-w-none">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-l-4 border-blue-500">
                      <div dangerouslySetInnerHTML={{ __html: aiResult.replace(/\n/g, '<br />') }} />
                    </div>
                  </div>
                )}
                
                {!isLoadingAI && !aiResult && scoreResult && analysisType === 'ai' && (
                  <div className="prose prose-lg max-w-none">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-l-4 border-blue-500">
                      <p className="text-gray-700 text-lg leading-relaxed">{scoreResult.description}</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Product Section - High Converting Design */}
          {product && (
            <section 
              className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl shadow-2xl text-white relative overflow-hidden transform hover:scale-[1.02] transition-all duration-300" 
              onMouseEnter={handleProductView}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-white/5 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_2px,transparent_2px)] bg-[length:30px_30px]"></div>
              </div>
              
              <div className="relative p-8 md:p-12">
                {/* Urgency Badge */}
                <div className="inline-flex items-center bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-pulse">
                  🔥 Limitált Idős Ajánlat
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                      {resultTranslations.result_product_headline || '📊 Teljes Részletes Jelentés'}
                    </h2>
                    
                    <h3 className="text-2xl font-semibold mb-4 text-green-100">
                      {productName}
                    </h3>
                    
                    {productDescription && (
                      <p className="text-green-100 text-lg mb-6 leading-relaxed">
                        {productDescription}
                      </p>
                    )}

                    {/* Benefits List */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">✓</div>
                        <span className="text-green-100">Részletes személyre szabott elemzés</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">✓</div>
                        <span className="text-green-100">Praktikus megoldási javaslatok</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">✓</div>
                        <span className="text-green-100">Azonnali letöltés PDF formátumban</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">✓</div>
                        <span className="text-green-100">30 napos pénzvisszafizetési garancia</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    {/* Price Display */}
                    <div className="bg-white/10 rounded-2xl p-6 mb-6 backdrop-blur-sm">
                      <div className="text-sm text-green-100 mb-2">Egyedi ár ma:</div>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-5xl font-bold text-white">
                          {Math.round(product.price_cents / 100)}
                        </span>
                        <div className="text-left">
                          <div className="text-lg text-green-100">{product.currency}</div>
                          <div className="text-sm text-green-200 line-through">
                            {Math.round(product.price_cents / 100 * 1.5)} {product.currency}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-green-100 mt-2">🔒 Biztonságos fizetés</div>
                    </div>

                    {/* CTA Button */}
                    <button
                      onClick={handleProductPurchase}
                      disabled={showCheckout}
                      className="w-full bg-white hover:bg-gray-50 disabled:bg-gray-200 text-green-600 font-bold text-xl px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl disabled:scale-100"
                    >
                      {showCheckout 
                        ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                            Átirányítás...
                          </div>
                        )
                        : (
                          <div className="flex items-center justify-center gap-2">
                            🚀 {resultTranslations.result_product_cta || 'Jelentés Azonnali Letöltése'}
                          </div>
                        )
                      }
                    </button>

                    {/* Trust Elements */}
                    <div className="mt-4 flex items-center justify-center gap-4 text-sm text-green-100">
                      <span>🔐 SSL titkosítás</span>
                      <span>•</span>
                      <span>💳 Stripe fizetés</span>
                      <span>•</span>
                      <span>↩️ 30 nap garancia</span>
                    </div>
                  </div>
                </div>

                {/* Social Proof */}
                <div className="mt-8 pt-8 border-t border-white/20">
                  <div className="text-center">
                    <p className="text-green-100 mb-4">⭐ 4.9/5 értékelés 1,200+ elégedett ügyféltől</p>
                    <div className="flex items-center justify-center gap-2 text-sm text-green-200">
                      <span>👥 247 másik személy vásárolta meg ma</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Booking Section - Modern Design */}
          {calendlyUrl && (
            <section 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-xl text-white relative overflow-hidden" 
              onMouseEnter={handleBookingView}
            >
              <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 rounded-full -translate-x-20 -translate-y-20"></div>
              <div className="relative p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
                    📞
                  </div>
                  <h2 className="text-3xl font-bold mb-4">
                    {resultTranslations.result_booking_headline || 'Ingyenes Szakértői Konzultáció'}
                  </h2>
                  
                  <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                    Szeretné megbeszélni az eredményeit egy szakértővel? Foglaljon egy ingyenes konzultációs hívást.
                  </p>
                  
                  <a
                    href={calendlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-4 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
                  >
                    📅 {resultTranslations.result_booking_cta || 'Ingyenes Hívás Foglalása'}
                  </a>

                  <div className="mt-6 flex items-center justify-center gap-4 text-sm text-blue-100">
                    <span>⏱️ 30 perc</span>
                    <span>•</span>
                    <span>💬 Személyre szabott</span>
                    <span>•</span>
                    <span>🆓 Teljesen ingyenes</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Trust and Security Section */}
          <section className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">🔒 Biztonság és Garancia</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl mb-2">🔐</div>
                <h4 className="font-semibold text-gray-900">SSL Titkosítás</h4>
                <p className="text-sm text-gray-600">Minden adatát biztonságban tartjuk</p>
              </div>
              <div>
                <div className="text-3xl mb-2">💳</div>
                <h4 className="font-semibold text-gray-900">Biztonságos Fizetés</h4>
                <p className="text-sm text-gray-600">Stripe által védett tranzakciók</p>
              </div>
              <div>
                <div className="text-3xl mb-2">↩️</div>
                <h4 className="font-semibold text-gray-900">30 Napos Garancia</h4>
                <p className="text-sm text-gray-600">Nem tetszik? Pénzét visszakapja</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
