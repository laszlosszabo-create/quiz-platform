import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import Stripe from 'stripe'

// Validation schema
const checkoutSchema = z.object({
  product_id: z.string().uuid(),
  session_id: z.string().uuid(),
  lang: z.string().min(2).max(5)
})

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = checkoutSchema.parse(body)

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

    // Get session data to get lead info
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('lead_id, quiz_id')
      .eq('id', validatedData.session_id)
      .single()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    let customerEmail = undefined
    if (session.lead_id) {
      const { data: lead } = await supabase
        .from('leads')
        .select('email')
        .eq('id', session.lead_id)
        .single()
      
      customerEmail = lead?.email
    }

    // Get product translations
    const productTranslations = product.translations as Record<string, any> || {}
    const productName = productTranslations[validatedData.lang]?.name || 
                       productTranslations['hu']?.name || 
                       'Premium Report'

    try {
      // Create Stripe Checkout Session
      const checkoutSession = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: product.currency.toLowerCase(),
              product_data: {
                name: productName,
                description: productTranslations[validatedData.lang]?.description || 
                           productTranslations['hu']?.description || 
                           'Premium quiz analysis report'
              },
              unit_amount: product.price_cents,
            },
            quantity: 1,
          },
        ],
        success_url: `${request.nextUrl.origin}/${validatedData.lang}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${request.nextUrl.origin}/${validatedData.lang}/${encodeURIComponent(request.nextUrl.pathname.split('/')[2])}/result?session=${validatedData.session_id}`,
        metadata: {
          product_id: validatedData.product_id,
          session_id: validatedData.session_id,
          quiz_id: session.quiz_id,
          lead_id: session.lead_id || '',
          lang: validatedData.lang
        },
        customer_email: customerEmail,
        locale: validatedData.lang === 'hu' ? 'hu' : 'en'
      })

      return NextResponse.json({
        checkout_url: checkoutSession.url,
        checkout_session_id: checkoutSession.id
      })

    } catch (stripeError) {
      console.error('Stripe checkout error:', stripeError)
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Checkout API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
