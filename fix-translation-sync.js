const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function syncTranslations() {
  const quizId = 'c54e0ded-edc8-4c43-8e16-ecb6e33f5291';
  
  console.log('🔍 Getting current translations...');
  
  const { data: current, error } = await supabase
    .from('quiz_translations')
    .select('*')
    .eq('quiz_id', quizId)
    .eq('lang', 'hu');
    
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log(`Found ${current.length} current translations`);
  
  // Map old keys to new landing keys
  const keyMapping = {
    'trust_count_label': 'landing_stat_1_number',  // 12 000+ kitöltés -> landing_stat_1_number
    'trust_rating_label': 'landing_stat_3_number', // ★★★★★ 4.8/5 -> landing_stat_3_number
  };
  
  const updates = [];
  
  for (const [oldKey, newKey] of Object.entries(keyMapping)) {
    const oldRow = current.find(r => r.field_key === oldKey);
    if (oldRow) {
      console.log(`Mapping ${oldKey} ("${oldRow.value}") -> ${newKey}`);
      updates.push({
        quiz_id: quizId,
        lang: 'hu',
        field_key: newKey,
        value: oldRow.value,
        updated_at: new Date().toISOString()
      });
    }
  }
  
  if (updates.length > 0) {
    console.log('🔄 Upserting mapped values...');
    const { error: upsertError } = await supabase
      .from('quiz_translations')
      .upsert(updates, { onConflict: 'quiz_id,lang,field_key' });
      
    if (upsertError) {
      console.error('Upsert error:', upsertError);
      return;
    }
    
    console.log('✅ Values synced successfully');
  }
  
  console.log('Done!');
}

syncTranslations().catch(console.error);
