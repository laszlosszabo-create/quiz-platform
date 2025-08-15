import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/types/database'

// Environment check
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in environment variables')
  console.error('Required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Create Supabase client with service role
const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Constants
const QUIZ_SLUG = 'adhd-quick-check'
const DEFAULT_LANG = 'hu'

async function seedDatabase() {
  console.log('🌱 Starting ADHD Quiz seed process...')
  
  try {
    // Step 1: Clean existing data (idempotent)
    await cleanExistingQuiz()
    
    // Step 2: Create quiz
    const quiz = await createQuiz()
    console.log(`✅ Quiz created: ${quiz.id}`)
    
    // Step 3: Create translations
    await createTranslations(quiz.id)
    console.log('✅ Translations created (HU + EN)')
    
    // Step 4: Create questions
    await createQuestions(quiz.id)
    console.log('✅ Questions created (8 questions)')
    
    // Step 5: Create scoring rules
    await createScoringRules(quiz.id)
    console.log('✅ Scoring rules created')
    
    // Step 6: Create AI prompts
    await createPrompts(quiz.id)
    console.log('✅ AI prompts created (HU + EN)')
    
    // Step 7: Create product (skip for minimal setup)
    // await createProduct(quiz.id)
    console.log('⏭️ Product creation skipped (not in minimal setup)')
    
    // Step 8: Summary
    console.log('\n🎉 Seed completed successfully!')
    console.log(`📍 Quiz URLs:`)
    console.log(`   HU: http://localhost:3000/hu/${QUIZ_SLUG}`)
    console.log(`   EN: http://localhost:3000/en/${QUIZ_SLUG}`)
    console.log(`📊 Admin: http://localhost:3000/admin/quizzes`)
    
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

async function cleanExistingQuiz() {
  console.log('🧹 Cleaning existing quiz data...')
  
  // First test if quizzes table exists by doing a simple select
  console.log('🔍 Testing quizzes table access...')
  
  const { data: existingQuizzes, error: accessError } = await supabase
    .from('quizzes')
    .select('id')
    .eq('slug', QUIZ_SLUG)
  
  if (accessError) {
    console.error('❌ Cannot access quizzes table:', accessError)
    console.log('💡 This suggests the database tables have not been created yet.')
    console.log('📋 Make sure migrations have been applied to the remote database.')
    console.log('🔧 Try running: supabase db push')
    process.exit(1)
  }

  console.log('✅ Quizzes table accessible!')

  if (existingQuizzes && existingQuizzes.length > 0) {
    const existingQuiz = existingQuizzes[0]
    
    // Delete products first (they reference quiz_id)
    const { error: productsError } = await supabase
      .from('products')
      .delete()
      .eq('quiz_id', existingQuiz.id)
    
    if (productsError) {
      console.log('⚠️ Products deletion error (may not exist):', productsError.message)
    } else {
      console.log('🗑️ Products cleaned')
    }
    
    // Delete quiz (cascade will handle related data)
    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', existingQuiz.id)
    
    if (error) throw error
    console.log('🗑️ Existing quiz cleaned')
  } else {
    console.log('✅ No existing quiz to clean')
  }
}

async function createQuiz() {
  const { data, error } = await supabase
    .from('quizzes')
    .insert({
      slug: QUIZ_SLUG,
      status: 'active',
      default_lang: DEFAULT_LANG,
      feature_flags: {
        email_gate_position: 'end',
        ai_result_enabled: true,
        layout_version: 1
      },
      theme: {
        primary_color: '#3B82F6',
        secondary_color: '#10B981',
        logo_url: '/logo-placeholder.svg',
        hero_image_url: '/hero-placeholder.jpg',
        calendly_url: 'https://calendly.com/demo-account'
      }
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

async function createTranslations(quizId: string) {
  const translations = [
    // Landing Page - HU
    { quiz_id: quizId, lang: 'hu', field_key: 'landing_headline', value: 'ADHD Gyorsteszt - Ismerd meg magad!' },
    { quiz_id: quizId, lang: 'hu', field_key: 'landing_sub', value: 'Egy 5 perces teszt, amely segít feltérképezni az ADHD tüneteit. Tudományosan megalapozott kérdések, személyre szabott eredmény.' },
    { quiz_id: quizId, lang: 'hu', field_key: 'landing_description', value: 'Tudományosan megalapozott ADHD teszt 5 perc alatt. Ismerd meg jobban magad és kapj személyre szabott visszajelzést a tüneteidről.' },
    { quiz_id: quizId, lang: 'hu', field_key: 'landing_cta_text', value: 'Teszt indítása' },
    { quiz_id: quizId, lang: 'hu', field_key: 'social_proof_1', value: '5,000+ kitöltő' },
    { quiz_id: quizId, lang: 'hu', field_key: 'social_proof_2', value: '98% elégedettség' },
    { quiz_id: quizId, lang: 'hu', field_key: 'social_proof_3', value: 'Tudományos alapok' },
    { quiz_id: quizId, lang: 'hu', field_key: 'cta_text', value: 'Teszt indítása' },
    { quiz_id: quizId, lang: 'hu', field_key: 'meta_title', value: 'ADHD Gyorsteszt - Ingyenes Online Felmérés' },
    { quiz_id: quizId, lang: 'hu', field_key: 'meta_description', value: 'Tudományosan megalapozott ADHD teszt 5 perc alatt. Személyre szabott eredmény és javaslatok.' },
    
    // Email Gate - HU
    { quiz_id: quizId, lang: 'hu', field_key: 'email_gate_headline', value: 'Kapd meg személyre szabott eredményedet!' },
    { quiz_id: quizId, lang: 'hu', field_key: 'email_gate_description', value: 'Add meg az email címedet és a nevedet, hogy elküldhessük a részletes elemzést és hasznos tippeket.' },
    { quiz_id: quizId, lang: 'hu', field_key: 'email_field_placeholder', value: 'Email címed' },
    { quiz_id: quizId, lang: 'hu', field_key: 'name_field_placeholder', value: 'Neved' },
    { quiz_id: quizId, lang: 'hu', field_key: 'email_gate_submit_button', value: 'Eredmény megjelenítése' },
    { quiz_id: quizId, lang: 'hu', field_key: 'email_gate_privacy_text', value: 'Adataidat biztonságban tartjuk és nem adjuk át harmadik félnek.' },
    
    // Landing Page - EN
    { quiz_id: quizId, lang: 'en', field_key: 'landing_headline', value: 'ADHD Quick Assessment - Know Yourself Better!' },
    { quiz_id: quizId, lang: 'en', field_key: 'landing_sub', value: 'A 5-minute test that helps map ADHD symptoms. Scientifically based questions with personalized results.' },
    { quiz_id: quizId, lang: 'en', field_key: 'landing_description', value: 'Scientifically based ADHD test in 5 minutes. Get to know yourself better and receive personalized feedback about your symptoms.' },
    { quiz_id: quizId, lang: 'en', field_key: 'landing_cta_text', value: 'Start Assessment' },
    { quiz_id: quizId, lang: 'en', field_key: 'social_proof_1', value: '5,000+ completed' },
    { quiz_id: quizId, lang: 'en', field_key: 'social_proof_2', value: '98% satisfaction' },
    { quiz_id: quizId, lang: 'en', field_key: 'social_proof_3', value: 'Scientific foundation' },
    { quiz_id: quizId, lang: 'en', field_key: 'cta_text', value: 'Start Assessment' },
    { quiz_id: quizId, lang: 'en', field_key: 'meta_title', value: 'ADHD Quick Test - Free Online Assessment' },
    { quiz_id: quizId, lang: 'en', field_key: 'meta_description', value: 'Scientifically based ADHD test in 5 minutes. Personalized results and recommendations.' },
    
    // Email Gate - EN
    { quiz_id: quizId, lang: 'en', field_key: 'email_gate_headline', value: 'Get your personalized results!' },
    { quiz_id: quizId, lang: 'en', field_key: 'email_gate_description', value: 'Enter your email and name to receive detailed analysis and helpful tips.' },
    { quiz_id: quizId, lang: 'en', field_key: 'email_field_placeholder', value: 'Your email' },
    { quiz_id: quizId, lang: 'en', field_key: 'name_field_placeholder', value: 'Your name' },
    { quiz_id: quizId, lang: 'en', field_key: 'email_gate_submit_button', value: 'Show Results' },
    { quiz_id: quizId, lang: 'en', field_key: 'email_gate_privacy_text', value: 'We keep your data secure and do not share it with third parties.' },
    
    // Questions - HU
    { quiz_id: quizId, lang: 'hu', field_key: 'question:attention_span:text', value: 'Mennyire nehéz koncentrálnod hosszabb feladatok során?' },
    { quiz_id: quizId, lang: 'hu', field_key: 'question:attention_span:help', value: 'Gondolj olyan helyzetekre, amikor 30+ percig kellett egy dologra figyelned' },
    { quiz_id: quizId, lang: 'hu', field_key: 'question:hyperactivity:text', value: 'Gyakran érzed magad nyugtalannak vagy "pörögősnek"?' },
    { quiz_id: quizId, lang: 'hu', field_key: 'question:hyperactivity:help', value: 'Belső nyugtalanság, mozgásigény, nehéz egy helyben maradni' },
    { quiz_id: quizId, lang: 'hu', field_key: 'question:impulsivity:text', value: 'Mi jellemző rád döntéshozatal során?' },
    { quiz_id: quizId, lang: 'hu', field_key: 'question:impulsivity:help', value: 'Gondolj a mindennapi kis és nagy döntéseidre' },
    { quiz_id: quizId, lang: 'hu', field_key: 'question:organization:text', value: 'Mennyire szervezett vagy a mindennapi életben?' },
    { quiz_id: quizId, lang: 'hu', field_key: 'question:organization:help', value: 'Tárgyak rendben tartása, tervezés, határidők betartása' },
    { quiz_id: quizId, lang: 'hu', field_key: 'question:time_management:text', value: 'Hogyan állsz az időbeosztással?' },
    { quiz_id: quizId, lang: 'hu', field_key: 'question:time_management:help', value: 'Időérzék, pontosság, tervezés' },
    { quiz_id: quizId, lang: 'hu', field_key: 'question:emotional_regulation:text', value: 'Mennyire tudod kezelni az érzelmeidet?' },
    { quiz_id: quizId, lang: 'hu', field_key: 'question:emotional_regulation:help', value: 'Düh, frusztráció, stressz kezelése' },
    { quiz_id: quizId, lang: 'hu', field_key: 'question:social_situations:text', value: 'Mi jellemző rád társaságban?' },
    { quiz_id: quizId, lang: 'hu', field_key: 'question:social_situations:help', value: 'Beszélgetések, társas helyzetek kezelése' },
    { quiz_id: quizId, lang: 'hu', field_key: 'question:daily_functioning:text', value: 'Mennyire befolyásolják a tünetek a mindennapi életedet?' },
    { quiz_id: quizId, lang: 'hu', field_key: 'question:daily_functioning:help', value: 'Munka, tanulás, kapcsolatok, hobbik' },
    
    // Questions - EN
    { quiz_id: quizId, lang: 'en', field_key: 'question:attention_span:text', value: 'How difficult is it for you to concentrate during longer tasks?' },
    { quiz_id: quizId, lang: 'en', field_key: 'question:attention_span:help', value: 'Think about situations requiring 30+ minutes of focused attention' },
    { quiz_id: quizId, lang: 'en', field_key: 'question:hyperactivity:text', value: 'Do you often feel restless or "wired"?' },
    { quiz_id: quizId, lang: 'en', field_key: 'question:hyperactivity:help', value: 'Inner restlessness, need to move, difficulty staying still' },
    { quiz_id: quizId, lang: 'en', field_key: 'question:impulsivity:text', value: 'What characterizes your decision-making?' },
    { quiz_id: quizId, lang: 'en', field_key: 'question:impulsivity:help', value: 'Think about your daily small and big decisions' },
    { quiz_id: quizId, lang: 'en', field_key: 'question:organization:text', value: 'How organized are you in daily life?' },
    { quiz_id: quizId, lang: 'en', field_key: 'question:organization:help', value: 'Keeping things tidy, planning, meeting deadlines' },
    { quiz_id: quizId, lang: 'en', field_key: 'question:time_management:text', value: 'How do you handle time management?' },
    { quiz_id: quizId, lang: 'en', field_key: 'question:time_management:help', value: 'Time awareness, punctuality, planning' },
    { quiz_id: quizId, lang: 'en', field_key: 'question:emotional_regulation:text', value: 'How well can you manage your emotions?' },
    { quiz_id: quizId, lang: 'en', field_key: 'question:emotional_regulation:help', value: 'Handling anger, frustration, stress' },
    { quiz_id: quizId, lang: 'en', field_key: 'question:social_situations:text', value: 'What characterizes you in social settings?' },
    { quiz_id: quizId, lang: 'en', field_key: 'question:social_situations:help', value: 'Conversations, handling social situations' },
    { quiz_id: quizId, lang: 'en', field_key: 'question:daily_functioning:text', value: 'How much do symptoms affect your daily life?' },
    { quiz_id: quizId, lang: 'en', field_key: 'question:daily_functioning:help', value: 'Work, study, relationships, hobbies' },
    
    // Answer Options - HU
    { quiz_id: quizId, lang: 'hu', field_key: 'option:scale_1:label', value: '1 - Egyáltalán nem' },
    { quiz_id: quizId, lang: 'hu', field_key: 'option:scale_2:label', value: '2 - Ritkán' },
    { quiz_id: quizId, lang: 'hu', field_key: 'option:scale_3:label', value: '3 - Néha' },
    { quiz_id: quizId, lang: 'hu', field_key: 'option:scale_4:label', value: '4 - Gyakran' },
    { quiz_id: quizId, lang: 'hu', field_key: 'option:scale_5:label', value: '5 - Majdnem mindig' },
    
    { quiz_id: quizId, lang: 'hu', field_key: 'option:hyper_low:label', value: 'Ritkán érzem magam nyugtalannak' },
    { quiz_id: quizId, lang: 'hu', field_key: 'option:hyper_mild:label', value: 'Néha pörgős vagyok' },
    { quiz_id: quizId, lang: 'hu', field_key: 'option:hyper_moderate:label', value: 'Gyakran nehéz megnyugodnom' },
    { quiz_id: quizId, lang: 'hu', field_key: 'option:hyper_high:label', value: 'Állandóan belső feszültséget érzek' },
    
    { quiz_id: quizId, lang: 'hu', field_key: 'option:impulse_planned:label', value: 'Mindig átgondolom a döntéseimet' },
    { quiz_id: quizId, lang: 'hu', field_key: 'option:impulse_balanced:label', value: 'Általában megfontolt vagyok' },
    { quiz_id: quizId, lang: 'hu', field_key: 'option:impulse_quick:label', value: 'Gyakran gyorsan döntök' },
    { quiz_id: quizId, lang: 'hu', field_key: 'option:impulse_hasty:label', value: 'Sokat csinálok meggondolatlanul' },
    
    { quiz_id: quizId, lang: 'hu', field_key: 'option:time_excellent:label', value: 'Mindig pontosan tervezek' },
    { quiz_id: quizId, lang: 'hu', field_key: 'option:time_good:label', value: 'Általában jól beosztom az időt' },
    { quiz_id: quizId, lang: 'hu', field_key: 'option:time_struggling:label', value: 'Gyakran késésben vagyok' },
    { quiz_id: quizId, lang: 'hu', field_key: 'option:time_chaotic:label', value: 'Az időbeosztás állandó küzdelem' },
    
    { quiz_id: quizId, lang: 'hu', field_key: 'option:social_comfortable:label', value: 'Könnyen beilleszkedem bárhol' },
    { quiz_id: quizId, lang: 'hu', field_key: 'option:social_adaptive:label', value: 'Általában jól kezelem a helyzeteket' },
    { quiz_id: quizId, lang: 'hu', field_key: 'option:social_challenging:label', value: 'Néha nehéz társaságban' },
    { quiz_id: quizId, lang: 'hu', field_key: 'option:social_difficult:label', value: 'Gyakran kínosan érzem magam' },
    
    // Answer Options - EN
    { quiz_id: quizId, lang: 'en', field_key: 'option:scale_1:label', value: '1 - Not at all' },
    { quiz_id: quizId, lang: 'en', field_key: 'option:scale_2:label', value: '2 - Rarely' },
    { quiz_id: quizId, lang: 'en', field_key: 'option:scale_3:label', value: '3 - Sometimes' },
    { quiz_id: quizId, lang: 'en', field_key: 'option:scale_4:label', value: '4 - Often' },
    { quiz_id: quizId, lang: 'en', field_key: 'option:scale_5:label', value: '5 - Almost always' },
    
    { quiz_id: quizId, lang: 'en', field_key: 'option:hyper_low:label', value: 'I rarely feel restless' },
    { quiz_id: quizId, lang: 'en', field_key: 'option:hyper_mild:label', value: 'Sometimes I feel wired' },
    { quiz_id: quizId, lang: 'en', field_key: 'option:hyper_moderate:label', value: 'Often hard to calm down' },
    { quiz_id: quizId, lang: 'en', field_key: 'option:hyper_high:label', value: 'Constantly feel inner tension' },
    
    { quiz_id: quizId, lang: 'en', field_key: 'option:impulse_planned:label', value: 'I always think through my decisions' },
    { quiz_id: quizId, lang: 'en', field_key: 'option:impulse_balanced:label', value: 'Generally I\'m thoughtful' },
    { quiz_id: quizId, lang: 'en', field_key: 'option:impulse_quick:label', value: 'I often decide quickly' },
    { quiz_id: quizId, lang: 'en', field_key: 'option:impulse_hasty:label', value: 'I do many things impulsively' },
    
    { quiz_id: quizId, lang: 'en', field_key: 'option:time_excellent:label', value: 'I always plan precisely' },
    { quiz_id: quizId, lang: 'en', field_key: 'option:time_good:label', value: 'Generally good at time management' },
    { quiz_id: quizId, lang: 'en', field_key: 'option:time_struggling:label', value: 'Often running late' },
    { quiz_id: quizId, lang: 'en', field_key: 'option:time_chaotic:label', value: 'Time management is constant struggle' },
    
    { quiz_id: quizId, lang: 'en', field_key: 'option:social_comfortable:label', value: 'I easily fit in anywhere' },
    { quiz_id: quizId, lang: 'en', field_key: 'option:social_adaptive:label', value: 'Generally handle situations well' },
    { quiz_id: quizId, lang: 'en', field_key: 'option:social_challenging:label', value: 'Sometimes difficult in company' },
    { quiz_id: quizId, lang: 'en', field_key: 'option:social_difficult:label', value: 'Often feel awkward' },
    
    // Results - HU
    { quiz_id: quizId, lang: 'hu', field_key: 'result_static_low_title', value: 'Alacsony kockázat' },
    { quiz_id: quizId, lang: 'hu', field_key: 'result_static_low_description', value: 'Az eredményeid alapján kevés ADHD-specifikus tünet jellemez. Ez nem zárja ki teljesen a diagnózist, de jelenleg az életminőséged nem jelentősen érintett.' },
    { quiz_id: quizId, lang: 'hu', field_key: 'result_static_low_recommendations', value: 'Ha mégis úgy érzed, hogy vannak nehézségeid, érdemes szakemberrel beszélned a részletekről.' },
    
    { quiz_id: quizId, lang: 'hu', field_key: 'result_static_medium_title', value: 'Közepes kockázat' },
    { quiz_id: quizId, lang: 'hu', field_key: 'result_static_medium_description', value: 'Több ADHD-specifikus tünet is felismerhető nálad. Érdemes lehet szakorvosi konzultáció és részletesebb felmérés.' },
    { quiz_id: quizId, lang: 'hu', field_key: 'result_static_medium_recommendations', value: 'Javasoljuk, hogy beszélj háziorvosoddal vagy keress fel egy ADHD-specialistát a további lépések megbeszéléséhez.' },
    
    { quiz_id: quizId, lang: 'hu', field_key: 'result_static_high_title', value: 'Magas kockázat' },
    { quiz_id: quizId, lang: 'hu', field_key: 'result_static_high_description', value: 'Az eredmények jelentős ADHD tünetegyüttest mutatnak, amely valószínűleg befolyásolja a mindennapi életedet.' },
    { quiz_id: quizId, lang: 'hu', field_key: 'result_static_high_recommendations', value: 'Határozottan javasoljuk szakorvosi vizsgálatot és lehetséges kezelési opciók megbeszélését.' },
    
    // Results - EN
    { quiz_id: quizId, lang: 'en', field_key: 'result_static_low_title', value: 'Low Risk' },
    { quiz_id: quizId, lang: 'en', field_key: 'result_static_low_description', value: 'Based on your results, few ADHD-specific symptoms characterize you. This doesn\'t completely rule out a diagnosis, but currently your quality of life isn\'t significantly affected.' },
    { quiz_id: quizId, lang: 'en', field_key: 'result_static_low_recommendations', value: 'If you still feel you have difficulties, it\'s worth discussing details with a professional.' },
    
    { quiz_id: quizId, lang: 'en', field_key: 'result_static_medium_title', value: 'Moderate Risk' },
    { quiz_id: quizId, lang: 'en', field_key: 'result_static_medium_description', value: 'Several ADHD-specific symptoms are recognizable in you. Medical consultation and detailed assessment might be worthwhile.' },
    { quiz_id: quizId, lang: 'en', field_key: 'result_static_medium_recommendations', value: 'We recommend talking to your GP or consulting an ADHD specialist about next steps.' },
    
    { quiz_id: quizId, lang: 'en', field_key: 'result_static_high_title', value: 'High Risk' },
    { quiz_id: quizId, lang: 'en', field_key: 'result_static_high_description', value: 'Results show significant ADHD symptom cluster that likely affects your daily life.' },
    { quiz_id: quizId, lang: 'en', field_key: 'result_static_high_recommendations', value: 'We strongly recommend medical examination and discussion of possible treatment options.' },
    
    // Email Templates - HU
    { quiz_id: quizId, lang: 'hu', field_key: 'email:welcome_subject', value: 'ADHD Gyorsteszt Eredményed Megérkezett' },
    { quiz_id: quizId, lang: 'hu', field_key: 'email:welcome_body', value: 'Köszönjük, hogy kitöltötted az ADHD gyorstesztünket! Az eredményeidet itt találod: {{result_url}}. Ha kérdéseid vannak, írj nekünk: hello@quizplatform.com' },
    
    // Email Templates - EN  
    { quiz_id: quizId, lang: 'en', field_key: 'email:welcome_subject', value: 'Your ADHD Quick Test Results Have Arrived' },
    { quiz_id: quizId, lang: 'en', field_key: 'email:welcome_body', value: 'Thank you for completing our ADHD quick test! You can find your results here: {{result_url}}. If you have questions, contact us: hello@quizplatform.com' }
  ]
  
  // Insert in batches of 50 to avoid hitting limits
  const batchSize = 50
  for (let i = 0; i < translations.length; i += batchSize) {
    const batch = translations.slice(i, i + batchSize)
    const { error } = await supabase
      .from('quiz_translations')
      .insert(batch)
    
    if (error) throw error
  }
}

async function createQuestions(quizId: string) {
  const questions = [
    {
      quiz_id: quizId,
      order: 1,
      type: 'scale' as const,
      key: 'attention_span',
      help_text: null,
      options: [
        { key: 'scale_1', score: 1 },
        { key: 'scale_2', score: 2 },
        { key: 'scale_3', score: 3 },
        { key: 'scale_4', score: 4 },
        { key: 'scale_5', score: 5 }
      ],
      scoring: { type: 'direct', weight: 1 }
    },
    {
      quiz_id: quizId,
      order: 2,
      type: 'single' as const,
      key: 'hyperactivity',
      help_text: null,
      options: [
        { key: 'hyper_low', score: 1 },
        { key: 'hyper_mild', score: 2 },
        { key: 'hyper_moderate', score: 3 },
        { key: 'hyper_high', score: 4 }
      ],
      scoring: { type: 'direct', weight: 1 }
    },
    {
      quiz_id: quizId,
      order: 3,
      type: 'single' as const,
      key: 'impulsivity',
      help_text: null,
      options: [
        { key: 'impulse_planned', score: 1 },
        { key: 'impulse_balanced', score: 2 },
        { key: 'impulse_quick', score: 3 },
        { key: 'impulse_hasty', score: 4 }
      ],
      scoring: { type: 'direct', weight: 1 }
    },
    {
      quiz_id: quizId,
      order: 4,
      type: 'scale' as const,
      key: 'organization',
      help_text: null,
      options: [
        { key: 'scale_1', score: 5 }, // Reverse scored
        { key: 'scale_2', score: 4 },
        { key: 'scale_3', score: 3 },
        { key: 'scale_4', score: 2 },
        { key: 'scale_5', score: 1 }
      ],
      scoring: { type: 'reverse', weight: 1 }
    },
    {
      quiz_id: quizId,
      order: 5,
      type: 'single' as const,
      key: 'time_management',
      help_text: null,
      options: [
        { key: 'time_excellent', score: 1 },
        { key: 'time_good', score: 2 },
        { key: 'time_struggling', score: 3 },
        { key: 'time_chaotic', score: 4 }
      ],
      scoring: { type: 'direct', weight: 1 }
    },
    {
      quiz_id: quizId,
      order: 6,
      type: 'scale' as const,
      key: 'emotional_regulation',
      help_text: null,
      options: [
        { key: 'scale_1', score: 5 }, // Reverse scored
        { key: 'scale_2', score: 4 },
        { key: 'scale_3', score: 3 },
        { key: 'scale_4', score: 2 },
        { key: 'scale_5', score: 1 }
      ],
      scoring: { type: 'reverse', weight: 1 }
    },
    {
      quiz_id: quizId,
      order: 7,
      type: 'single' as const,
      key: 'social_situations',
      help_text: null,
      options: [
        { key: 'social_comfortable', score: 1 },
        { key: 'social_adaptive', score: 2 },
        { key: 'social_challenging', score: 3 },
        { key: 'social_difficult', score: 4 }
      ],
      scoring: { type: 'direct', weight: 1 }
    },
    {
      quiz_id: quizId,
      order: 8,
      type: 'scale' as const,
      key: 'daily_functioning',
      help_text: null,
      options: [
        { key: 'scale_1', score: 1 },
        { key: 'scale_2', score: 2 },
        { key: 'scale_3', score: 3 },
        { key: 'scale_4', score: 4 },
        { key: 'scale_5', score: 5 }
      ],
      scoring: { type: 'direct', weight: 1 }
    }
  ]
  
  const { error } = await supabase
    .from('quiz_questions')
    .insert(questions)
  
  if (error) throw error
}

async function createScoringRules(quizId: string) {
  const { error } = await supabase
    .from('quiz_scoring_rules')
    .insert({
      quiz_id: quizId,
      rule_type: 'sum',
      weights: {},
      thresholds: {
        low: { min: 8, max: 15, label: 'low' },
        medium: { min: 16, max: 24, label: 'medium' },
        high: { min: 25, max: 33, label: 'high' }
      }
    })
  
  if (error) throw error
}

async function createPrompts(quizId: string) {
  const prompts = [
    {
      quiz_id: quizId,
      lang: 'hu',
      ai_prompt: `Te egy tapasztalt klinikai pszichológus vagy, aki ADHD diagnosztikával és kezeléssel foglalkozik. A felhasználó kitöltött egy ADHD tünetek felmérésére szolgáló kérdőívet.

Az eredmények alapján adj személyre szabott, empatikus és szakmailag megalapozott visszajelzést. Hangsúlyozd, hogy ez nem orvosi diagnózis, csak egy kezdeti felmérés.

Használj barátságos, de szakszerű hangnemet. Tartalmazza a válaszod:
1. Az eredmények rövid összefoglalását
2. A főbb területeket, ahol tünetek mutatkoznak
3. Gyakorlati tanácsokat a mindennapi élethez  
4. Ajánlást szakorvosi konzultációra, ha indokolt

A felhasználó eredményei: {attention_score} pont figyelmi nehézségek, {hyperactivity_score} pont hiperaktivitás, {impulsivity_score} pont impulzivitás.

Válaszolj HTML formátumban, használj <h3> címeket és <p> bekezdéseket.`,
      fallback_results: [
        { score_range: [0, 10], html: '<h3>Alacsony kockázat</h3><p>Az eredmények alapján kevés ADHD tünet mutatkozik. Folytassa jelenlegi életvitelét és forduljon orvoshoz, ha tünetek változnak.</p>' },
        { score_range: [11, 20], html: '<h3>Közepes kockázat</h3><p>Néhány ADHD tünet jelen van. Érdemes megfigyelni a tüneteket és szakorvosi konzultációt fontolni.</p>' },
        { score_range: [21, 72], html: '<h3>Magas kockázat</h3><p>Számos ADHD tünet mutatkozik. Javasoljuk szakorvosi vizsgálatot a pontos diagnózis érdekében.</p>' }
      ]
    },
    {
      quiz_id: quizId,
      lang: 'en',
      ai_prompt: `You are an experienced clinical psychologist specializing in ADHD diagnostics and treatment. The user has completed a questionnaire designed to assess ADHD symptoms.

Based on the results, provide personalized, empathetic, and professionally grounded feedback. Emphasize that this is not a medical diagnosis, just an initial assessment.

Use a friendly but professional tone. Include in your response:
1. Brief summary of results
2. Main areas where symptoms are present
3. Practical advice for daily life
4. Recommendation for medical consultation if appropriate

User results: {attention_score} points attention difficulties, {hyperactivity_score} points hyperactivity, {impulsivity_score} points impulsivity.

Respond in HTML format using <h3> headers and <p> paragraphs.`,
      fallback_results: [
        { score_range: [0, 10], html: '<h3>Low Risk</h3><p>Based on the results, few ADHD symptoms are present. Continue your current lifestyle and consult a doctor if symptoms change.</p>' },
        { score_range: [11, 20], html: '<h3>Moderate Risk</h3><p>Some ADHD symptoms are present. Consider monitoring symptoms and consulting a healthcare professional.</p>' },
        { score_range: [21, 72], html: '<h3>High Risk</h3><p>Multiple ADHD symptoms are present. We recommend professional medical evaluation for accurate diagnosis.</p>' }
      ]
    }
  ]
  
  const { error } = await supabase
    .from('quiz_ai_prompts')
    .insert(prompts)
  
  if (error) throw error
}

async function createProduct(quizId: string) {
  const { error } = await supabase
    .from('products')
    .insert({
      quiz_id: quizId,
      active: true,
      price_cents: 300000, // 3000 HUF
      currency: 'HUF',
      stripe_price_id: null, // Will be set by admin
      delivery_type: 'static_pdf',
      asset_url: 'https://demo.quiz-platform.com/reports/adhd-detailed-report.pdf',
      translations: {
        hu: {
          name: 'Részletes ADHD Jelentés',
          short_description: 'Személyre szabott elemzés és gyakorlati javaslatok',
          long_description: 'Komplex értékelés az eredményeid alapján, gyakorlati tippek a mindennapi élethez, és szakértői ajánlások a további lépésekhez.',
          features: ['Részletes tünet elemzés', 'Személyre szabott javaslatok', 'Szakértői iránymutatás'],
          cta_text: 'Jelentés megvásárlása - 3000 Ft'
        },
        en: {
          name: 'Detailed ADHD Report',
          short_description: 'Personalized analysis with practical recommendations',
          long_description: 'Comprehensive evaluation based on your results, practical tips for daily life, and expert recommendations for next steps.',
          features: ['Detailed symptom analysis', 'Personalized recommendations', 'Expert guidance'],
          cta_text: 'Purchase Report - €30'
        }
      }
    })
  
  if (error) throw error
}

// Run the seed
seedDatabase()
