import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getSupabaseAdmin } from '@/lib/supabase-config'
import { getTranslations } from '@/lib/translations'
import { ProductResultClient } from './product-result-client'

interface ProductResultPageProps {
  params: Promise<{
    lang: string
    productId: string
  }>
  searchParams: Promise<{
    session_id?: string
    payment?: string
    stripe_session?: string
  }>
}

export async function generateMetadata({ params }: ProductResultPageProps): Promise<Metadata> {
  const { lang, productId } = await params
  
  // Get product data
  const supabase = getSupabaseAdmin()
  const { data: product } = await supabase
    .from('products')
    .select('name, description')
    .eq('id', productId)
    .eq('active', true)
    .single()

  const title = `${product?.name || 'Digital Product'} - Purchase Success`

  return {
    title,
    description: product?.description || 'Thank you for your purchase! Access your digital product.',
  }
}

export default async function ProductResultPage({ params, searchParams }: ProductResultPageProps) {
  const { lang, productId } = await params
  const { session_id: sessionId, payment, stripe_session: stripeSession } = await searchParams

  // Validate language
  const supportedLangs = ['hu', 'en']
  if (!supportedLangs.includes(lang)) {
    notFound()
  }

  if (!sessionId) {
    notFound()
  }

  // Get Supabase admin client
  const supabase = getSupabaseAdmin()

  // Get product data
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .eq('active', true)
    .single()

  if (productError || !product) {
    notFound()
  }

  // Get session data
  const { data: session, error: sessionError } = await supabase
    .from('quiz_sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('quiz_id', product.quiz_id)
    .eq('state', 'completed')
    .single()

  if (sessionError || !session) {
    notFound()
  }

  // Get quiz data
  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .select('*')
    .eq('id', product.quiz_id)
    .eq('status', 'active')
    .single()

  if (quizError || !quiz) {
    notFound()
  }

  // Get product-specific configurations
  const { data: productConfigs } = await supabase
    .from('product_configs')
    .select('*')
    .eq('product_id', productId)

  // Get quiz questions for scoring context
  const { data: questions } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('quiz_id', product.quiz_id)
    .order('order')

  // Get scoring rules
  const { data: scoringRules } = await supabase
    .from('quiz_scoring_rules')
    .select('*')
    .eq('quiz_id', product.quiz_id)

  // Get product-specific AI prompts from product_configs
  const aiPromptsConfig = productConfigs?.find(config => config.key === 'ai_prompts')?.value as Record<string, any>
  
  // Get product-specific AI prompts from dedicated table
  const { data: productAiPrompts } = await supabase
    .from('product_ai_prompts')
    .select('*')
    .eq('product_id', productId)
    .eq('lang', lang)

  // Fallback to quiz AI prompts if no product-specific ones
  const { data: fallbackAiPrompts } = await supabase
    .from('quiz_ai_prompts')
    .select('*')
    .eq('quiz_id', product.quiz_id)
    .eq('lang', lang)

  // Priority: product_configs ai_prompts > product_ai_prompts table > quiz ai_prompts
  let aiPrompts = fallbackAiPrompts
  if (productAiPrompts?.length) {
    aiPrompts = productAiPrompts
  }
  if (aiPromptsConfig && (aiPromptsConfig.system_prompt || aiPromptsConfig.result_prompt)) {
    // Convert product_configs ai_prompts format to match database format
    aiPrompts = [{
      id: `config-${productId}`,
      product_id: productId,
      lang: lang,
      system_prompt: aiPromptsConfig.system_prompt || '',
      ai_prompt: aiPromptsConfig.result_prompt || aiPromptsConfig.user_prompt || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }]
  }

  // Get all translations for this quiz
  const { data: allTranslations } = await supabase
    .from('quiz_translations')
    .select('*')
    .eq('quiz_id', product.quiz_id)

  // Get product-specific feature flags or use quiz defaults
  const productFeatureFlags = productConfigs?.find(config => config.key === 'feature_flags')?.value as Record<string, any> || {}
  const quizFeatureFlags = quiz.feature_flags as Record<string, any> || {}
  const featureFlags = { ...quizFeatureFlags, ...productFeatureFlags }
  
  // Get product theme or use quiz default
  const productTheme = productConfigs?.find(config => config.key === 'theme')?.value as Record<string, any> || {}
  const quizTheme = quiz.theme as Record<string, any> || {}
  const theme = { ...quizTheme, ...productTheme }

  // Get product-specific result content configuration
  const resultContent = productConfigs?.find(config => config.key === 'result_content')?.value as Record<string, any> || {}

  return (
    <ProductResultClient
      product={product}
      session={session}
      quiz={quiz}
      questions={questions || []}
      scoringRules={scoringRules || []}
      aiPrompts={aiPrompts || []}
      allTranslations={allTranslations || []}
      featureFlags={featureFlags}
      theme={theme}
      resultContent={resultContent}
      lang={lang}
      payment={payment}
      stripeSession={stripeSession}
    />
  )
}
