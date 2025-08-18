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
  const [aiNotice, setAiNotice] = useState<string | null>(null)

  // Calculate scores and get result
  useEffect(() => {
    calculateScores()
    
    // Check if AI is enabled and we need to generate AI result
    if (featureFlags.ai_result_enabled !== false && !session.result_snapshot) {
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

    // Determine category based on thresholds
    const scoringRule = scoringRules[0]
    const thresholds = scoringRule?.thresholds as any || { low: 10, medium: 20, high: 999 }
    
    let category: 'low' | 'medium' | 'high' = 'low'
    if (totalScore > thresholds.high) {
      category = 'high'
    } else if (totalScore > thresholds.medium) {
      category = 'medium'
    }

    // Get static description from translations
    const translations = getTranslations(
      allTranslations,
      lang,
      [`result_static_${category}`, `result_${category}_description`],
      quiz.default_lang
    )

    const description = translations[`result_static_${category}`] || 
                       translations[`result_${category}_description`] || 
                       `Your score is ${totalScore} (${category} category)`

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

  const handleCheckoutStart = () => {
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
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setShowCheckout(false)
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

  // Get theme values
  const primaryColor = theme.primary_color || '#3B82F6'
  const calendlyUrl = theme.calendly_url

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-4 py-6 border-b">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">
            {resultTranslations.result_headline || 'Your Results'}
          </h1>
          <p className="text-gray-600 mt-2">
            {resultTranslations.result_sub || 'Here are your personalized quiz results.'}
          </p>
        </div>
      </header>

      <main className="px-4 py-8">
        {aiNotice && (
          <div className="max-w-4xl mx-auto mb-6">
            <Alert className="bg-amber-50 border-amber-200 text-amber-900">
              <AlertDescription>{aiNotice}</AlertDescription>
            </Alert>
          </div>
        )}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Score Section */}
          {scoreResult && (
            <section className="bg-gray-50 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Your Score: {scoreResult.totalScore}
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Category: <span className="font-semibold capitalize">{scoreResult.category}</span>
              </p>
              <div className="prose max-w-none">
                <p className="text-gray-700">{scoreResult.description}</p>
              </div>
            </section>
          )}

          {/* AI Result Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Personalized Analysis
            </h2>
            
            {isLoadingAI && (
              <div className="bg-blue-50 rounded-lg p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-blue-600">
                  {resultTranslations.result_ai_loading || 'Generating your personalized analysis...'}
                </p>
              </div>
            )}
            
            {aiResult && (
              <div className="bg-white border rounded-lg p-8">
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: aiResult.replace(/\n/g, '<br />') }} />
                </div>
              </div>
            )}
            
            {!isLoadingAI && !aiResult && scoreResult && (
              <div className="bg-white border rounded-lg p-8">
                <div className="prose max-w-none">
                  <p className="text-gray-700">{scoreResult.description}</p>
                </div>
              </div>
            )}
          </section>

          {/* Product Section */}
          {product && (
            <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8" onMouseEnter={handleProductView}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {resultTranslations.result_product_headline || 'Get Your Detailed Report'}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {productName}
                  </h3>
                  {productDescription && (
                    <p className="text-gray-700 mb-4">
                      {productDescription}
                    </p>
                  )}
                  <div className="text-2xl font-bold text-gray-900 mb-4">
                    {Math.round(product.price_cents / 100)} {product.currency}
                  </div>
                </div>
                
                <div className="text-center">
                  <button
                    onClick={handleCheckoutStart}
                    disabled={showCheckout}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {showCheckout 
                      ? 'Redirecting...' 
                      : resultTranslations.result_product_cta || 'Get Premium Report'
                    }
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Booking Section */}
          {calendlyUrl && (
            <section className="bg-green-50 rounded-lg p-8" onMouseEnter={handleBookingView}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {resultTranslations.result_booking_headline || 'Book a Consultation'}
              </h2>
              
              <div className="text-center">
                <p className="text-gray-700 mb-6">
                  Want to discuss your results with an expert? Book a free consultation call.
                </p>
                
                <a
                  href={calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors"
                >
                  {resultTranslations.result_booking_cta || 'Book Free Call'}
                </a>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
