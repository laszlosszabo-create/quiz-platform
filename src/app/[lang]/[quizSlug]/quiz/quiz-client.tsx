'use client'

import { useState, useEffect } from 'react'
import { Quiz, QuizQuestion, QuizTranslation } from '@/types/database'
import { getTranslations, getQuestionTranslations, getOptionTranslations } from '@/lib/translations'
import { tracker } from '@/lib/tracking'
import { generateClientToken } from '@/lib/session'
import { QuestionComponent } from './question-component'
import { EmailGate } from './email-gate'

interface QuizClientProps {
  quiz: Quiz
  questions: QuizQuestion[]
  allTranslations: QuizTranslation[]
  featureFlags: Record<string, any>
  theme: Record<string, any>
  lang: string
}

interface Answer {
  questionKey: string
  value: string | string[]
}

export function QuizClient({
  quiz,
  questions,
  allTranslations,
  featureFlags,
  theme,
  lang
}: QuizClientProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [sessionId, setSessionId] = useState<string>('')
  const [showEmailGate, setShowEmailGate] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [clientToken] = useState(() => generateClientToken())

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1

  // Track quiz start on mount
  useEffect(() => {
    const startQuiz = async () => {
      // Create a session
      const sessionResponse = await fetch('/api/quiz/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizSlug: quiz.slug,
          lang
        })
      })

      if (sessionResponse.ok) {
        const { session_id } = await sessionResponse.json()
        setSessionId(session_id)
        
        // Track quiz start
        await tracker.trackQuizStart(quiz.id, session_id)
      }
    }

    startQuiz()
  }, [quiz.id, lang, clientToken])

  // Auto-save answers every 2 questions
  useEffect(() => {
    if (sessionId && answers.length > 0 && answers.length % 2 === 0) {
      saveAnswers()
    }
  }, [answers, sessionId])

  const saveAnswers = async () => {
    if (!sessionId) return

    try {
      await fetch('/api/quiz/session', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          answers: answers.reduce((acc, answer) => {
            acc[answer.questionKey] = answer.value
            return acc
          }, {} as Record<string, any>)
        })
      })
    } catch (error) {
      console.warn('Failed to save answers:', error)
    }
  }

  const handleAnswer = async (value: string | string[]) => {
    if (!currentQuestion || !sessionId) return

    // Update answers
    const newAnswers = [
      ...answers.filter(a => a.questionKey !== currentQuestion.key),
      { questionKey: currentQuestion.key, value }
    ]
    setAnswers(newAnswers)

    // Track answer selection
    await tracker.trackAnswerSelect(
      quiz.id,
      sessionId,
      currentQuestion.key,
      Array.isArray(value) ? value.join(',') : value
    )

    // Check if we should show email gate
    const emailGatePosition = featureFlags.email_gate_position || 'end'
    
    if (emailGatePosition === 'start' && currentQuestionIndex === 0 && !showEmailGate) {
      setShowEmailGate(true)
      return
    }

    // Move to next question or complete
    if (isLastQuestion) {
      // Check if we should show email gate at the end
      if (emailGatePosition === 'end') {
        setShowEmailGate(true)
      } else {
        await completeQuiz(newAnswers)
      }
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handleEmailSubmitted = async (leadId: string) => {
    if (!sessionId) return

    // Track email submission
    await tracker.trackEmailSubmitted(quiz.id, sessionId, leadId)
    
    setShowEmailGate(false)

    // Complete the quiz
    await completeQuiz(answers)
  }

  const completeQuiz = async (finalAnswers: Answer[]) => {
    if (!sessionId) return

    try {
      // Save final answers and complete session
      await fetch('/api/quiz/session', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          answers: finalAnswers.reduce((acc, answer) => {
            acc[answer.questionKey] = answer.value
            return acc
          }, {} as Record<string, any>),
          state: 'completed'
        })
      })

      // Track quiz completion
      await tracker.trackQuizComplete(quiz.id, sessionId, 0) // TODO: Calculate actual score

      setIsCompleted(true)

      // Redirect to result page
      window.location.href = `/${lang}/${quiz.slug}/result?session=${sessionId}`
    } catch (error) {
      console.error('Failed to complete quiz:', error)
    }
  }

  // Get translations for current question
  const questionTranslations = currentQuestion 
    ? getQuestionTranslations(allTranslations, lang, currentQuestion.key, quiz.default_lang)
    : { text: '', help: '' }

  // Get option translations for current question
  const optionKeys = currentQuestion?.options 
    ? (currentQuestion.options as any[]).map(opt => opt.key)
    : []
  const optionTranslations = currentQuestion
    ? getOptionTranslations(allTranslations, lang, optionKeys, quiz.default_lang)
    : {}

  const progressPercentage = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)

  if (showEmailGate) {
    return (
      <EmailGate
        quiz={quiz}
        allTranslations={allTranslations}
        lang={lang}
        sessionId={sessionId}
        onEmailSubmitted={handleEmailSubmitted}
      />
    )
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Teszt befejezve!
          </h2>
          <p className="text-gray-600 mb-8">
            Köszönjük a válaszaidat. Átirányítunk az eredményeidhez...
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-spin">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Teszt betöltése...
          </h2>
          <p className="text-gray-600">
            Kérjük várj, amíg előkészítjük a kérdéseket.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Modern Header with Progress */}
      <header className="px-4 py-8 bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          {/* Quiz branding and navigation */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">ADHD Gyorsteszt</h1>
                <p className="text-sm text-gray-600">Tudományosan megalapozott értékelés</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {currentQuestionIndex + 1} / {totalQuestions}
              </div>
              <div className="text-xs text-gray-600">
                {progressPercentage}% befejezve
              </div>
            </div>
          </div>
          
          {/* Modern Progress Bar */}
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm relative"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-white/20 rounded-full"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Kezdés</span>
              <span>Befejezés</span>
            </div>
          </div>
        </div>
      </header>

      {/* Question content with modern layout */}
      <main className="px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl shadow-blue-100/50 border border-white/60 backdrop-blur-sm overflow-hidden">
            <div className="p-8 md:p-12">
              <QuestionComponent
                question={currentQuestion}
                questionTranslations={questionTranslations}
                optionTranslations={optionTranslations}
                onAnswer={handleAnswer}
                currentAnswer={answers.find(a => a.questionKey === currentQuestion.key)?.value}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={totalQuestions}
              />
            </div>
          </div>
          
          {/* Trust indicators */}
          <div className="flex justify-center items-center space-x-8 mt-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>100% bizalmas</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Tudományos alapú</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>~2 perc</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
