 'use client'

import React, { useState, useEffect } from 'react'
import { Quiz, QuizQuestion, QuizTranslation } from '@/types/database'
import { getQuestionTranslations, getOptionTranslations } from '@/lib/translations'
import { QuestionComponent } from './question-component'
import { EmailGate } from './email-gate'

interface QuizClientProps {
  lang: string
  quiz?: Quiz | null
  questions?: QuizQuestion[]
  allTranslations?: QuizTranslation[]
  featureFlags?: Record<string, any>
  theme?: Record<string, any>
}

export default function QuizPage({ lang, quiz: quizProp, questions: questionsProp, allTranslations: allTranslationsProp }: QuizClientProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(quizProp || null)
  const [questions, setQuestions] = useState<QuizQuestion[]>(questionsProp || [])
  const [allTranslations, setAllTranslations] = useState<QuizTranslation[]>(allTranslationsProp || [])

  useEffect(() => {
    // If we already received server props, skip client fetch
    if (quizProp && questionsProp && allTranslationsProp) return

    let mounted = true
    const load = async () => {
      try {
        const res = await fetch(`/api/public/quizzes/adhd-quick-check?lang=${lang}`)
        if (!res.ok) return
        const json = await res.json()
        if (!mounted) return
        setQuiz(json.quiz)
        setQuestions(json.questions)
        setAllTranslations(json.allTranslations)
      } catch (e) {
        console.error('Failed to load quiz data', e)
      }
    }
    load()
    return () => { mounted = false }
  }, [lang, quizProp, questionsProp, allTranslationsProp])

  if (!quiz) return <div>Betöltés...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-3xl mx-auto p-2">
        <div className="bg-white rounded-2xl shadow-xl border border-white/60 overflow-hidden" style={{height: '100vh'}}>
          <div className="p-2 sm:p-3 md:p-4 h-full flex flex-col">
            {/* derive title from translations; fall back to slug */}
            <h1 className="text-lg font-semibold mb-2">{(() => {
              const t = allTranslations.find((tr:any) => tr.field_key === 'quiz:title' && tr.lang === lang)
              return t?.value || (quiz.slug || 'Quiz')
            })()}</h1>

            <div className="flex-1">
              <QuestionComponent
                question={questions[0]}
                questionTranslations={getQuestionTranslations(allTranslations, lang, questions[0]?.key, quiz.default_lang)}
                optionTranslations={getOptionTranslations(allTranslations, lang, Array.isArray(questions[0]?.options) ? (questions[0].options as any[]).map((o:any)=>o.key) : [], quiz.default_lang)}
                onAnswer={() => {}}
                currentAnswer={undefined}
                questionNumber={1}
                totalQuestions={questions.length}
              />
            </div>

            <footer className="p-2">
              <EmailGate quizId={quiz.id} />
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}
