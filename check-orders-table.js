require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkOrdersTable() {
  try {
    console.log('Checking orders table structure...');
    
    // Check if table exists and get schema info
    const { data, error } = await supabase
      .rpc('sql', {
        query: `
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns 
          WHERE table_name = 'orders' 
          ORDER BY ordinal_position;
        `
      });
    
    if (error) {
      console.error('Error checking schema:', error);
      
      // Try alternate approach
      console.log('Trying direct select...');
      const { data: testData, error: testError } = await supabase
        .from('orders')
        .select('*')
        .limit(1);
      
      if (testError) {
        console.error('Direct select error:', testError);
      } else {
        console.log('Direct select works, sample data:', testData);
      }
      
    } else {
      console.log('Orders table columns:');
      data.forEach((col, index) => {
        console.log(`${index + 1}. ${col.column_name} (${col.data_type}) - nullable: ${col.is_nullable}`);
      });
    }
    
    // Try a test insert with minimal data
    console.log('\nTrying test insert...');
    const testOrderData = {
      quiz_id: 'b1128c0b-f06a-4d17-9c2f-59969c134f93',
      lead_id: 'test-session-final',
      product_id: 'e6aeb984-bfa7-43f3-99b1-4451a83f9ef3',
      amount_cents: 15000,
      currency: 'huf',
      stripe_payment_intent: 'pi_test_' + Date.now(),
      status: 'paid'
    };
    
    const { data: insertResult, error: insertError } = await supabase
      .from('orders')
      .insert(testOrderData)
      .select();
    
    if (insertError) {
      console.error('Insert error:', insertError);
    } else {
      console.log('Insert successful:', insertResult);
    }
    
  } catch (err) {
    console.error('Exception:', err);
  }
}

checkOrdersTable();
