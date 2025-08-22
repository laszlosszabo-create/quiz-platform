import React from 'react'
import QuizPage from './quiz/quiz-client'
import { getSupabaseAdmin } from '@/lib/supabase-config'

const QUIZ_SLUG = 'adhd-quick-check'

export default async function Page({ params }: any) {
  const resolvedParams = await params
  const { lang } = resolvedParams || { lang: 'hu' }

  const supabase = getSupabaseAdmin()
  const { data: quiz } = await supabase
    .from('quizzes')
    .select('*')
    .eq('slug', QUIZ_SLUG)
    .eq('status', 'active')
    .single()

  if (!quiz) return <div>Quiz nem található</div>

  const { data: questions } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('quiz_id', quiz.id)
    .order('order')

  const { data: allTranslations } = await supabase
    .from('quiz_translations')
    .select('*')
    .eq('quiz_id', quiz.id)

  const featureFlags = quiz?.layout_version ? quiz.layout_version : {}
  const theme = quiz?.theme || {}

  return (
    // Pass server-fetched data to the client component to avoid extra API calls
    <QuizPage
      lang={lang}
      quiz={quiz}
      questions={questions || []}
      allTranslations={allTranslations || []}
      featureFlags={featureFlags}
      theme={theme}
    />
  )
}
