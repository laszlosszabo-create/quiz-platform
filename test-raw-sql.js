// Direct SQL test to bypass PostgREST schema cache
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://gkmeqvuahoyuxexoohmy.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY not found');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRawSQLInsert() {
  console.log('Testing direct SQL insert...');

  try {
    // Use supabase-js RPC call for raw SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      query: `
        INSERT INTO orders (
          id, quiz_id, lead_id, product_id, amount_cents, currency, 
          stripe_payment_intent, status, created_at, updated_at
        ) VALUES (
          gen_random_uuid(), 
          '123e4567-e89b-12d3-a456-426614174000'::uuid,
          '987fcdeb-51d3-12a4-b567-426614174111'::uuid,
          '456e7890-e12b-34c5-d678-926614174222'::uuid,
          990000,
          'huf',
          'pi_test_${Date.now()}',
          'paid'::order_status,
          NOW(),
          NOW()
        ) RETURNING *;
      `
    });

    if (error) {
      console.error('Raw SQL insert failed:', error);
      
      // Try alternative: direct HTTP call to PostgREST
      console.log('\nTrying direct HTTP to PostgREST...');
      
      const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
      
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey
        },
        body: JSON.stringify({
          query: `
            INSERT INTO orders (
              id, quiz_id, lead_id, product_id, amount_cents, currency, 
              stripe_payment_intent, status, created_at, updated_at
            ) VALUES (
              gen_random_uuid(), 
              '123e4567-e89b-12d3-a456-426614174000'::uuid,
              '987fcdeb-51d3-12a4-b567-426614174111'::uuid,
              '456e7890-e12b-34c5-d678-926614174222'::uuid,
              990000,
              'huf',
              'pi_test_direct_${Date.now()}',
              'paid'::order_status,
              NOW(),
              NOW()
            ) RETURNING *;
          `
        })
      });

      const result = await response.text();
      console.log('Direct HTTP response:', response.status, result);
      
      if (!response.ok) {
        console.error('Direct HTTP failed as well');
        return;
      }

      console.log('✅ Direct HTTP SQL insert succeeded!');
      const orderData = JSON.parse(result);
      console.log('Order:', orderData);

    } else {
      console.log('✅ Raw SQL insert succeeded!');
      console.log('Order:', data);
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testRawSQLInsert();
