const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function auditTranslationDiscrepancies() {
  console.log('🔍 Auditing all translation discrepancies...\n');
  
  // Get all translations for the quiz
  const { data: allTranslations, error } = await supabase
    .from('quiz_translations')
    .select('*')
    .eq('quiz_id', 'c54e0ded-edc8-4c43-8e16-ecb6e33f5291')
    .eq('lang', 'hu')
    .order('field_key');
    
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  // Known landing page translation keys from the page.tsx
  const landingPageKeys = [
    'landing_stat_1_number',
    'landing_stat_2_time', 
    'landing_stat_3_number',
    'landing_stat_4_method',
    'hero_badge_text',
    'hero_title',
    'hero_subtitle',
    'hero_time_text',
    'hero_questions_text',
    'hero_primary_button',
    'hero_secondary_button',
    'hero_free_text'
  ];
  
  console.log('📊 All translations in database:');
  allTranslations.forEach((t, i) => {
    const isLandingKey = landingPageKeys.includes(t.field_key);
    const marker = isLandingKey ? '🎯' : '  ';
    console.log(`${marker} ${i+1}. ${t.field_key}: "${t.value}"`);
  });
  
  console.log('\n🎯 Landing page specific keys found in DB:');
  const foundLandingKeys = allTranslations.filter(t => landingPageKeys.includes(t.field_key));
  foundLandingKeys.forEach(t => {
    console.log(`  ✅ ${t.field_key}: "${t.value}"`);
  });
  
  console.log('\n🔍 Potentially problematic patterns:');
  
  // Look for keys that might be duplicates with different names
  const potentialDuplicates = [];
  
  // Group by similar content
  const contentGroups = {};
  allTranslations.forEach(t => {
    const content = t.value.toLowerCase().trim();
    if (!contentGroups[content]) {
      contentGroups[content] = [];
    }
    contentGroups[content].push(t);
  });
  
  Object.entries(contentGroups).forEach(([content, translations]) => {
    if (translations.length > 1) {
      console.log(`  ⚠️  Multiple keys for "${content}":`);
      translations.forEach(t => {
        console.log(`     - ${t.field_key}`);
      });
    }
  });
  
  console.log('\n📝 Summary:');
  console.log(`  Total translations: ${allTranslations.length}`);
  console.log(`  Landing page keys: ${foundLandingKeys.length}/${landingPageKeys.length}`);
  console.log(`  Potential duplicates: ${Object.values(contentGroups).filter(g => g.length > 1).length}`);
}

auditTranslationDiscrepancies();
