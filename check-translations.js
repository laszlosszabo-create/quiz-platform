const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function investigateTranslations() {
  const quizId = 'c54e0ded-edc8-4c43-8e16-ecb6e33f5291';
  
  console.log('🔍 Investigating translations...');
  
  // Check translations for questions
  const { data: translations } = await supabase
    .from('translations')
    .select('*')
    .eq('quiz_id', quizId)
    .eq('lang', 'hu');
    
  console.log('\n📝 Translations found:', translations?.length || 0);
  
  if (translations && translations.length > 0) {
    console.log('First 3 translations:');
    translations.slice(0, 3).forEach(t => {
      console.log(`- Key: ${t.key}, Type: ${t.type}, Value: ${t.value}`);
    });
    
    // Look for question translations specifically
    const questionTranslations = translations.filter(t => 
      t.type === 'question' || t.key.includes('question') || t.key.includes('_text')
    );
    
    console.log('\n❓ Question-related translations:', questionTranslations.length);
    questionTranslations.forEach(t => {
      console.log(`- ${t.key}: "${t.value}"`);
    });
  }
  
  // Check what keys questions have and their options
  const { data: questions } = await supabase
    .from('quiz_questions')
    .select('key, type, options')
    .eq('quiz_id', quizId)
    .order('order');
    
  console.log('\n🔑 Question keys and options:');
  questions?.forEach((q, idx) => {
    console.log(`\n${idx + 1}. Key: ${q.key}, Type: ${q.type}`);
    if (q.options && Array.isArray(q.options)) {
      console.log('   Options:', q.options);
    }
  });
}

investigateTranslations().catch(console.error);
