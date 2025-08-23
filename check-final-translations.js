const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkTranslations() {
  console.log('🔍 Checking final translation sync status...\n');
  
  const { data, error } = await supabase
    .from('quiz_translations')
    .select('*')
    .eq('quiz_id', 'c54e0ded-edc8-4c43-8e16-ecb6e33f5291')
    .eq('lang', 'hu')
    .in('field_key', ['landing_stat_1_number', 'landing_stat_3_number', 'trust_count_label', 'trust_rating_label'])
    .order('field_key');
    
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  console.log('📊 Current translations in database:');
  data.forEach(t => {
    console.log(`  ${t.field_key}: "${t.value}"`);
  });
  
  // Check if we have the expected values
  const landing1 = data.find(t => t.field_key === 'landing_stat_1_number');
  const landing3 = data.find(t => t.field_key === 'landing_stat_3_number');
  
  console.log('\n✅ Sync verification:');
  console.log(`  landing_stat_1_number: ${landing1?.value || 'NOT FOUND'}`);
  console.log(`  landing_stat_3_number: ${landing3?.value || 'NOT FOUND'}`);
  
  if (landing1?.value === '12 000+ kitöltés' && landing3?.value === '★★★★★ 4.8/5') {
    console.log('\n🎉 SUCCESS: Translation sync completed successfully!');
    console.log('   Admin and landing page now show the same values.');
  } else {
    console.log('\n⚠️  Some values may not be synced properly.');
  }
}

checkTranslations();
