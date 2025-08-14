import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quizId = params.id
    const { slug_suffix = '' } = await request.json()
    
    // Verify admin authentication (simplified for MVP)
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get original quiz with all related data
    const originalQuiz = await getQuizWithRelations(quizId)
    if (!originalQuiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }
    
    // Generate new slug
    const newSlug = await generateUniqueSlug(originalQuiz.slug, slug_suffix)
    
    // Start transaction-like duplication
    const duplicatedQuiz = await duplicateQuiz(originalQuiz, newSlug)
    
    // Log audit event
    await supabase
      .from('audit_logs')
      .insert({
        action: 'DUPLICATE_QUIZ',
        resource_type: 'quiz',
        resource_id: quizId,
        metadata: {
          original_quiz_id: quizId,
          duplicated_quiz_id: duplicatedQuiz.id,
          new_slug: newSlug,
          admin_user: 'system' // TODO: Get from auth
        }
      })
    
    return NextResponse.json({
      success: true,
      original_id: quizId,
      duplicated_id: duplicatedQuiz.id,
      new_slug: newSlug,
      message: 'Quiz successfully duplicated'
    })
    
  } catch (error) {
    console.error('Quiz duplication error:', error)
    return NextResponse.json(
      { error: 'Failed to duplicate quiz' },
      { status: 500 }
    )
  }
}

async function getQuizWithRelations(quizId: string) {
  const { data: quiz, error } = await supabase
    .from('quizzes')
    .select(`
      *,
      quiz_translations (*),
      quiz_questions (*),
      quiz_scoring_rules (*),
      quiz_prompts (*),
      products (*)
    `)
    .eq('id', quizId)
    .single()
  
  if (error) throw error
  return quiz
}

async function generateUniqueSlug(originalSlug: string, suffix: string): Promise<string> {
  let newSlug = suffix ? `${originalSlug}-${suffix}` : `${originalSlug}-copy`
  let counter = 1
  
  while (true) {
    const { data } = await supabase
      .from('quizzes')
      .select('id')
      .eq('slug', newSlug)
      .single()
    
    if (!data) {
      return newSlug
    }
    
    // Slug exists, try with counter
    newSlug = suffix 
      ? `${originalSlug}-${suffix}-${counter}`
      : `${originalSlug}-copy-${counter}`
    counter++
    
    // Prevent infinite loop
    if (counter > 100) {
      throw new Error('Unable to generate unique slug')
    }
  }
}

async function duplicateQuiz(originalQuiz: any, newSlug: string) {
  // 1. Create new quiz
  const { data: newQuiz, error: quizError } = await supabase
    .from('quizzes')
    .insert({
      slug: newSlug,
      status: 'draft', // New quizzes start as draft
      default_lang: originalQuiz.default_lang,
      feature_flags: originalQuiz.feature_flags,
      theme: originalQuiz.theme
    })
    .select()
    .single()
  
  if (quizError) throw quizError
  
  // 2. Duplicate translations with new quiz_id
  if (originalQuiz.quiz_translations?.length) {
    const newTranslations = originalQuiz.quiz_translations.map((t: any) => ({
      quiz_id: newQuiz.id,
      lang: t.lang,
      field_key: t.field_key,
      value: t.value
    }))
    
    const { error: translationsError } = await supabase
      .from('quiz_translations')
      .insert(newTranslations)
    
    if (translationsError) throw translationsError
  }
  
  // 3. Duplicate questions with new keys
  if (originalQuiz.quiz_questions?.length) {
    const keyMapping = new Map<string, string>()
    
    const newQuestions = originalQuiz.quiz_questions.map((q: any) => {
      const newKey = `${q.key}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
      keyMapping.set(q.key, newKey)
      
      return {
        quiz_id: newQuiz.id,
        order: q.order,
        type: q.type,
        key: newKey,
        help_text: q.help_text,
        options: q.options,
        scoring: q.scoring
      }
    })
    
    const { error: questionsError } = await supabase
      .from('quiz_questions')
      .insert(newQuestions)
    
    if (questionsError) throw questionsError
    
    // Update translation field_keys for questions
    await updateQuestionTranslationKeys(newQuiz.id, keyMapping)
  }
  
  // 4. Duplicate scoring rules
  if (originalQuiz.quiz_scoring_rules?.length) {
    const newScoringRules = originalQuiz.quiz_scoring_rules.map((r: any) => ({
      quiz_id: newQuiz.id,
      rule_type: r.rule_type,
      weights: r.weights,
      thresholds: r.thresholds
    }))
    
    const { error: scoringError } = await supabase
      .from('quiz_scoring_rules')
      .insert(newScoringRules)
    
    if (scoringError) throw scoringError
  }
  
  // 5. Duplicate prompts
  if (originalQuiz.quiz_prompts?.length) {
    const newPrompts = originalQuiz.quiz_prompts.map((p: any) => ({
      quiz_id: newQuiz.id,
      lang: p.lang,
      system_prompt: p.system_prompt,
      user_prompt_template: p.user_prompt_template,
      variables: p.variables
    }))
    
    const { error: promptsError } = await supabase
      .from('quiz_prompts')
      .insert(newPrompts)
    
    if (promptsError) throw promptsError
  }
  
  // 6. Duplicate products (inactive by default)
  if (originalQuiz.products?.length) {
    const newProducts = originalQuiz.products.map((p: any) => ({
      quiz_id: newQuiz.id,
      active: false, // Duplicated products start inactive
      price_cents: p.price_cents,
      currency: p.currency,
      stripe_price_id: null, // Clear Stripe ID - admin needs to set new one
      delivery_type: p.delivery_type,
      asset_url: p.asset_url,
      translations: p.translations
    }))
    
    const { error: productsError } = await supabase
      .from('products')
      .insert(newProducts)
    
    if (productsError) throw productsError
  }
  
  return newQuiz
}

async function updateQuestionTranslationKeys(
  newQuizId: string, 
  keyMapping: Map<string, string>
) {
  // Get all question-related translations
  const { data: translations } = await supabase
    .from('quiz_translations')
    .select('*')
    .eq('quiz_id', newQuizId)
    .like('field_key', 'question:%')
  
  if (!translations?.length) return
  
  const updates = []
  
  for (const translation of translations) {
    const fieldKey = translation.field_key
    
    // Extract old key from field_key pattern: question:OLD_KEY:text
    const match = fieldKey.match(/^question:([^:]+):(.+)$/)
    if (match) {
      const [, oldKey, suffix] = match
      const newKey = keyMapping.get(oldKey)
      
      if (newKey) {
        const newFieldKey = `question:${newKey}:${suffix}`
        updates.push({
          id: translation.id,
          field_key: newFieldKey
        })
      }
    }
  }
  
  // Batch update translations
  if (updates.length > 0) {
    for (const update of updates) {
      await supabase
        .from('quiz_translations')
        .update({ field_key: update.field_key })
        .eq('id', update.id)
    }
  }
}
