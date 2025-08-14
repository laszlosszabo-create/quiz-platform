import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import { getTranslations } from '@/lib/translations'
import { ResultClient } from './result-client'

interface ResultPageProps {
  params: {
    lang: string
    quizSlug: string
  }
  searchParams: {
    session?: string
  }
}

export async function generateMetadata({ params }: ResultPageProps): Promise<Metadata> {
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

  const title = `${translations.landing_headline || 'Quiz'} - Results`

  return {
    title,
    description: 'Your personalized quiz results and recommendations.',
  }
}

export default async function ResultPage({ params, searchParams }: ResultPageProps) {
  const { lang, quizSlug } = params
  const { session: sessionId } = searchParams

  // Validate language
  const supportedLangs = ['hu', 'en']
  if (!supportedLangs.includes(lang)) {
    notFound()
  }

  if (!sessionId) {
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

  // Get session data
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('quiz_id', quiz.id)
    .eq('state', 'completed')
    .single()

  if (sessionError || !session) {
    notFound()
  }

  // Get quiz questions for scoring context
  const { data: questions } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('quiz_id', quiz.id)
    .order('order')

  // Get scoring rules
  const { data: scoringRules } = await supabase
    .from('quiz_scoring_rules')
    .select('*')
    .eq('quiz_id', quiz.id)

  // Get AI prompts
  const { data: aiPrompts } = await supabase
    .from('quiz_prompts')
    .select('*')
    .eq('quiz_id', quiz.id)
    .eq('lang', lang)

  // Get product for this quiz
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('quiz_id', quiz.id)
    .eq('active', true)
    .single()

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
    <ResultClient
      quiz={quiz}
      session={session}
      questions={questions || []}
      scoringRules={scoringRules || []}
      aiPrompts={aiPrompts || []}
      product={product}
      allTranslations={allTranslations || []}
      featureFlags={featureFlags}
      theme={theme}
      lang={lang}
    />
  )
}
