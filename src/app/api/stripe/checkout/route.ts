import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase-admin'
import Stripe from 'stripe'

// Validation schema - updated for Module 4 spec
const checkoutSchema = z.object({
  product_id: z.string().min(1), // Stripe product ID, not UUID
  session_id: z.string().uuid(),
  lang: z.string().min(2).max(5)
})

// Lazy Stripe client to avoid build-time key requirement
function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
  return new Stripe(key, { apiVersion: '2024-06-20' })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = checkoutSchema.parse(body)
    
    const supabase = supabaseAdmin

    // Get product data
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', validatedData.product_id)
      .eq('active', true)
      .single()

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found or inactive' },
        { status: 404 }
      )
    }

    // Get session data
    const { data: session, error: sessionError } = await supabase
      .from('quiz_sessions')
      .select('quiz_id, client_token')
      .eq('id', validatedData.session_id)
      .single()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Get quiz details for success/cancel URLs
    const { data: quiz } = await supabase
      .from('quizzes')
      .select('slug, name')
      .eq('id', session.quiz_id)
      .single()

    // Try to get email from quiz_leads if available
    const { data: lead } = await supabase
      .from('quiz_leads')
      .select('email')
      .eq('quiz_id', session.quiz_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    const customerEmail = lead?.email

    // Build base URL for redirects - handle both development and production
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    
    // Fallback to request origin if no BASE_URL is set
    if (!baseUrl) {
      const origin = request.headers.get('origin')
      const host = request.headers.get('host')
      
      if (origin) {
        baseUrl = origin
      } else if (host) {
        // Determine protocol based on host
        const protocol = host.includes('localhost') ? 'http' : 'https'
        baseUrl = `${protocol}://${host}`
      }
    }
    
    // For localhost development, ensure HTTP
    if (!baseUrl || baseUrl.includes('localhost')) {
      baseUrl = 'http://localhost:3000'  // Development fallback
    }

    console.log('Stripe checkout redirect base URL:', baseUrl)

    // Create Stripe checkout session
  const checkoutSession = await getStripe().checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'huf', // Hungarian Forint
            product_data: {
              name: product.name,
              description: product.description || undefined,
            },
            unit_amount: Math.round(product.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/${validatedData.lang}/product/${validatedData.product_id}/result?session_id=${validatedData.session_id}&payment=success&stripe_session={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/${validatedData.lang}/product/${validatedData.product_id}/result?session_id=${validatedData.session_id}&payment=cancelled`,
      customer_email: customerEmail || undefined,
      metadata: {
        product_id: validatedData.product_id,
        session_id: validatedData.session_id,
        quiz_id: session.quiz_id,
        lang: validatedData.lang,
        client_token: session.client_token,
      },
      locale: validatedData.lang === 'hu' ? 'hu' : 'en'
    })

    // Track checkout start event
    const origin = request.headers.get('origin') || baseUrl
    await fetch(`${origin}/api/tracking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'checkout_start',
        quiz_id: session.quiz_id,
        session_id: validatedData.session_id,
        timestamp: new Date().toISOString(),
        metadata: {
          product_id: validatedData.product_id,
          price: product.price,
          lang: validatedData.lang,
          stripe_checkout_session_id: checkoutSession.id
        }
      })
    }).catch(err => console.error('Tracking failed:', err))

    return NextResponse.json({
      checkout_url: checkoutSession.url,
      checkout_session_id: checkoutSession.id
    })

  } catch (error) {
    console.error('Checkout creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
