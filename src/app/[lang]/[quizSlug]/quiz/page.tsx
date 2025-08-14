import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { getTranslations } from '@/lib/translations'
import { QuizClient } from './quiz-client'

interface QuizPageProps {
  params: {
    lang: string
    quizSlug: string
  }
}

export async function generateMetadata({ params }: QuizPageProps): Promise<Metadata> {
  const { lang, quizSlug } = params
  
  // Get quiz data
  const { data: quiz } = await supabase
    .from('quizzes')
    .select('id, default_lang')
    .eq('slug', quizSlug)
    .eq('status', 'active')
    .single()

  if (!quiz) {
    return {
      title: 'Quiz Not Found',
    }
  }

  // Get all translations for this quiz
  const { data: allTranslations } = await supabase
    .from('quiz_translations')
    .select('*')
    .eq('quiz_id', quiz.id)

  // Get translated title
  const translations = getTranslations(
    allTranslations || [],
    lang,
    ['landing_headline'],
    quiz.default_lang
  )

  const title = `${translations.landing_headline || 'Quiz'} - Questions`

  return {
    title,
    description: 'Answer the questions to get your personalized results.',
  }
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { lang, quizSlug } = params

  // Validate language
  const supportedLangs = ['hu', 'en']
  if (!supportedLangs.includes(lang)) {
    notFound()
  }

  // Get quiz data
  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .select('*')
    .eq('slug', quizSlug)
    .eq('status', 'active')
    .single()

  if (quizError || !quiz) {
    notFound()
  }

  // Get quiz questions
  const { data: questions, error: questionsError } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('quiz_id', quiz.id)
    .order('order')

  if (questionsError || !questions || questions.length === 0) {
    notFound()
  }

  // Get all translations for this quiz
  const { data: allTranslations } = await supabase
    .from('quiz_translations')
    .select('*')
    .eq('quiz_id', quiz.id)

  // Get feature flags
  const featureFlags = quiz.feature_flags as Record<string, any> || {}
  
  // Get theme configuration
  const theme = quiz.theme as Record<string, any> || {}

  return (
    <QuizClient
      quiz={quiz}
      questions={questions}
      allTranslations={allTranslations || []}
      featureFlags={featureFlags}
      theme={theme}
      lang={lang}
    />
  )
}
