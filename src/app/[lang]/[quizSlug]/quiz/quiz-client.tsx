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
        onEmailSubmitted={handleEmailSubmitted}
      />
    )
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Quiz Completed!
          </h2>
          <p className="text-gray-600">
            Redirecting to your results...
          </p>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Loading...
          </h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header with progress */}
      <header className="px-4 py-6 border-b">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <span className="text-sm text-gray-600">
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </header>

      {/* Question content */}
      <main className="px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <QuestionComponent
            question={currentQuestion}
            questionTranslations={questionTranslations}
            optionTranslations={optionTranslations}
            onAnswer={handleAnswer}
            currentAnswer={answers.find(a => a.questionKey === currentQuestion.key)?.value}
          />
        </div>
      </main>
    </div>
  )
}
