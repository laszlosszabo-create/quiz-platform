import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// Create admin Supabase client for webhook operations
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('STRIPE_WEBHOOK_SECRET is not set')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
})

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent)
        break
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const metadata = session.metadata
  if (!metadata) {
    console.error('No metadata found in checkout session')
    return
  }

  const {
    product_id,  // Ez a mi internal product ID-nk
    session_id,
    quiz_id,
    lang,
    client_token
  } = metadata

  // Find product by our internal product ID
  const { data: product, error: productError } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('id', product_id)
    .single()

  if (productError || !product) {
    console.error('Product not found for product ID:', product_id, productError)
    throw new Error('Product not found')
  }

  // Check if order already exists (idempotency)
  const { data: existingOrder } = await supabaseAdmin
    .from('orders')
    .select('id')
    .eq('stripe_payment_intent', session.payment_intent as string)
    .single()

  if (existingOrder) {
    console.log('Order already exists for payment intent:', session.payment_intent)
    return
  }

  // Create new order using RPC function to bypass schema cache issues
  try {
    const { data: order, error: orderError } = await supabaseAdmin.rpc('insert_order_bypass_cache', {
      p_quiz_id: quiz_id,
      p_lead_id: session_id,
      p_product_id: product.id,
      p_amount_cents: session.amount_total || 0,
      p_currency: (session.currency || 'huf').toLowerCase(),
      p_stripe_payment_intent: session.payment_intent as string,
      p_status: 'paid'
    })

    if (orderError) {
      console.error('Failed to create order via RPC:', orderError)
      throw new Error('Order creation failed')
    }

    console.log('Order created successfully via RPC:', order)
    
    // Trigger Day-0 email fulfillment
    await triggerEmailFulfillment(order.id, quiz_id, session_id, lang)
    return order

  } catch (error) {
    console.error('Order creation error:', error)
    throw new Error('Order creation failed')
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id)
  // Additional payment success logic if needed
}

async function triggerEmailFulfillment(
  orderId: string,
  quizId: string,
  sessionId: string,
  lang: string
) {
  try {
    // Insert Day-0 email event using RPC function (immediate delivery)
    const { data: emailEvent, error: emailEventError } = await supabaseAdmin.rpc('insert_email_event', {
      p_lead_id: sessionId,
      p_template_key: 'day_0',
      p_lang: lang,
      p_status: 'queued', // Immediate delivery
      p_metadata: {
        order_id: orderId,
        quiz_id: quizId,
        trigger: 'payment_success',
        day_number: 0,
        created_at: new Date().toISOString()
      }
    })

    if (emailEventError) {
      console.error('Failed to create Day-0 email event via RPC:', emailEventError)
      throw new Error('Email event creation failed')
    }

    console.log('Day-0 email event created via RPC for order:', orderId)

    // Schedule follow-up emails (Day 2 and Day 5)
    const { scheduleFollowUpEmails } = await import('@/lib/email-scheduler')
    await scheduleFollowUpEmails(sessionId, orderId, quizId, lang)

    // Update session state to completed
    await supabaseAdmin
      .from('quiz_sessions')
      .update({ 
        state: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)

  } catch (error) {
    console.error('Email fulfillment failed:', error)
    throw error
  }
}
