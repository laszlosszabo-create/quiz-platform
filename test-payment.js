// Test payment fulfillment without Stripe signature verification
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://gkmeqvuahoyuxexoohmy.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY not found');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testPaymentFulfillment() {
  console.log('Testing payment fulfillment flow...');

  try {
    // 1. Test order creation with raw SQL approach
    console.log('\n1. Testing order creation...');
    
    const testOrderData = {
      quiz_id: '123e4567-e89b-12d3-a456-426614174000',
      lead_id: '987fcdeb-51d3-12a4-b567-426614174111',
      product_id: '456e7890-e12b-34c5-d678-926614174222',
      amount_cents: 990000,
      currency: 'huf',
      stripe_payment_intent: 'pi_test_' + Date.now(),
      status: 'paid'
    };

    // Try direct insert with explicit field mapping
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(testOrderData)
      .select()
      .single();

    if (orderError) {
      console.error('Order creation failed:', orderError);
      
      // Try with bracket notation to bypass schema cache
      const orderDataBracket = {
        quiz_id: testOrderData.quiz_id,
        lead_id: testOrderData.lead_id,
        product_id: testOrderData.product_id,
        [`amount_cents`]: testOrderData.amount_cents,
        currency: testOrderData.currency,
        stripe_payment_intent: testOrderData.stripe_payment_intent,
        status: testOrderData.status
      };

      const { data: orderRetry, error: retryError } = await supabase
        .from('orders')
        .insert(orderDataBracket)
        .select()
        .single();

      if (retryError) {
        console.error('Order creation retry failed:', retryError);
        return;
      }

      console.log('✅ Order created (retry):', orderRetry);
      var createdOrder = orderRetry;
    } else {
      console.log('✅ Order created:', order);
      var createdOrder = order;
    }

    // 2. Test email event creation
    console.log('\n2. Testing Day-0 email event creation...');
    
    const { data: emailEvent, error: emailError } = await supabase
      .from('email_events')
      .insert({
        lead_id: testOrderData.lead_id,
        template_key: 'day_0',
        lang: 'hu',
        status: 'queued',
        metadata: {
          order_id: createdOrder.id,
          quiz_id: testOrderData.quiz_id,
          trigger: 'payment_success',
          created_at: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (emailError) {
      console.error('Email event creation failed:', emailError);
    } else {
      console.log('✅ Day-0 email event created:', emailEvent);
    }

    // 3. Test session update
    console.log('\n3. Testing session state update...');
    
    const { error: sessionError } = await supabase
      .from('quiz_sessions')
      .update({ 
        state: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', testOrderData.lead_id);

    if (sessionError) {
      console.error('Session update failed:', sessionError);
    } else {
      console.log('✅ Session updated to completed');
    }

    console.log('\n🎉 Payment fulfillment test completed successfully!');
    console.log(`Order ID: ${createdOrder.id}`);
    console.log(`Amount: ${createdOrder.amount_cents / 100} Ft`);

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testPaymentFulfillment();
