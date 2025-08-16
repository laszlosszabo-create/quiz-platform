const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

// Simple test to isolate the exact problem
async function testSupabaseDirectInsert() {
  try {
    console.log('Testing direct Supabase insert...');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // First, clean up any existing prompts
    const { error: deleteError } = await supabase
      .from('quiz_ai_prompts')
      .delete()
      .eq('quiz_id', '474c52bb-c907-40c4-8cb1-993cfcdf2f38');

    console.log('Cleanup result:', deleteError ? 'Error: ' + deleteError.message : 'OK');

    // Test the exact insert that the API should do
    const { data, error } = await supabase
      .from('quiz_ai_prompts')
      .insert({ 
        quiz_id: '474c52bb-c907-40c4-8cb1-993cfcdf2f38', 
        lang: 'hu', 
        ai_prompt: 'Direct insert test prompt',
        fallback_results: []
      })
      .select()
      .maybeSingle();

    console.log('Insert result:');
    console.log('- Error:', error ? JSON.stringify(error, null, 2) : 'None');
    console.log('- Data:', data ? JSON.stringify(data, null, 2) : 'None');

    if (!error && data) {
      console.log('✅ Direct insert works! ID:', data.id);
    } else {
      console.log('❌ Direct insert failed');
    }

  } catch (err) {
    console.error('Exception:', err.message);
  }
}

testSupabaseDirectInsert();
