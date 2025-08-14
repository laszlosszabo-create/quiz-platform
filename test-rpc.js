// Test with custom RPC functions to bypass schema cache
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://gkmeqvuahoyuxexoohmy.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY not found');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRPCFunctions() {
  console.log('Testing RPC functions for order creation...');

  try {
    // 1. Test order creation via RPC
    console.log('\n1. Creating order via RPC function...');
    
    const { data: order, error: orderError } = await supabase.rpc('insert_order_bypass_cache', {
      p_quiz_id: '123e4567-e89b-12d3-a456-426614174000',
      p_lead_id: '987fcdeb-51d3-12a4-b567-426614174111',
      p_product_id: '456e7890-e12b-34c5-d678-926614174222',
      p_amount_cents: 990000,
      p_currency: 'huf',
      p_stripe_payment_intent: 'pi_rpc_test_' + Date.now(),
      p_status: 'paid'
    });

    if (orderError) {
      console.error('❌ RPC order creation failed:', orderError);
      return;
    }

    console.log('✅ Order created via RPC:', order);

    // 2. Test email event creation via RPC
    console.log('\n2. Creating Day-0 email event via RPC...');
    
    const { data: emailEvent, error: emailError } = await supabase.rpc('insert_email_event', {
      p_lead_id: '987fcdeb-51d3-12a4-b567-426614174111',
      p_template_key: 'day_0',
      p_lang: 'hu',
      p_status: 'queued',
      p_metadata: {
        order_id: order.id,
        quiz_id: '123e4567-e89b-12d3-a456-426614174000',
        trigger: 'payment_success',
        created_at: new Date().toISOString()
      }
    });

    if (emailError) {
      console.error('❌ RPC email event creation failed:', emailError);
    } else {
      console.log('✅ Email event created via RPC:', emailEvent);
    }

    // 3. Test session update (this should still work)
    console.log('\n3. Updating session state...');
    
    const { error: sessionError } = await supabase
      .from('quiz_sessions')
      .update({ 
        state: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', '987fcdeb-51d3-12a4-b567-426614174111');

    if (sessionError) {
      console.error('❌ Session update failed:', sessionError);
    } else {
      console.log('✅ Session updated to completed');
    }

    console.log('\n🎉 Payment fulfillment test completed successfully!');
    console.log(`Order ID: ${order.id}`);
    console.log(`Amount: ${order.amount_cents / 100} Ft`);

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testRPCFunctions();
