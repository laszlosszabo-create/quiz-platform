import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getSupabaseAdmin } from '@/lib/supabase-config'
import { getTranslations } from '@/lib/translations'
import { LandingPageClient } from './landing-page-client'

interface LandingPageProps {
  params: Promise<{
    lang: string
    quizSlug: string
  }>
}

// Required translation keys for landing page
const LANDING_TRANSLATION_KEYS = [
  'landing_headline',
  'landing_sub', 
  'landing_cta_text',
  'cta_text',
  'landing_description',
  'social_proof_1',
  'social_proof_2',
  'social_proof_3'
]

export async function generateMetadata({ params }: LandingPageProps): Promise<Metadata> {
  const { lang, quizSlug } = await params
  
  // Get quiz data
  const supabase = getSupabaseAdmin()
  const { data: quiz } = await supabase
    .from('quizzes')
    .select('id, default_lang, theme')
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

  // Get translated title and description
  const translations = getTranslations(
    allTranslations || [],
    lang,
    ['landing_headline', 'landing_description'],
    quiz.default_lang
  )

  const title = translations.landing_headline || 'Quiz'
  const description = translations.landing_description || 'Take this quiz to discover insights about yourself.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  }
}

export default async function LandingPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; quizSlug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { lang, quizSlug } = await params
  const resolvedSearchParams = await searchParams

  // Validate language
  const supportedLangs = ['hu', 'en']
  if (!supportedLangs.includes(lang)) {
    notFound()
  }

  // Get quiz data
  const supabase = getSupabaseAdmin()
  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .select('*')
    .eq('slug', quizSlug)
    .eq('status', 'active')
    .single()

  if (quizError || !quiz) {
    notFound()
  }

  // Get all translations for this quiz
  const { data: allTranslations } = await supabase
    .from('quiz_translations')
    .select('*')
    .eq('quiz_id', quiz.id)

  // Get translations for landing page
  const translations = getTranslations(
    allTranslations || [],
    lang,
    LANDING_TRANSLATION_KEYS,
    quiz.default_lang
  )

  // Get feature flags
  const featureFlags = quiz.feature_flags as Record<string, any> || {}
  
  // Get theme configuration
  const theme = quiz.theme as Record<string, any> || {}

  return (
    <LandingPageClient
      quiz={quiz}
      translations={translations}
      featureFlags={featureFlags}
      theme={theme}
      lang={lang}
    />
  )
}
