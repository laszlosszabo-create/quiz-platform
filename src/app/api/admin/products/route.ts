import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseAdmin } from '@/lib/supabase-config'

// Product validation schemas - FINAL CORRECT SCHEMA
const baseProductSchema = z.object({
  quiz_id: z.string().uuid(),
  name: z.string().min(1), // Required field
  description: z.string().optional().nullable(),
  active: z.boolean().default(true),
  price: z.number().positive(), // Required price field
  currency: z.enum(['HUF', 'EUR', 'USD']).default('HUF'),
  stripe_product_id: z.string().optional().nullable(),
  stripe_price_id: z.string().optional().nullable(),
  booking_url: z.string().url().optional().nullable(),
  metadata: z.record(z.any()).default({})
})

const createProductSchema = baseProductSchema.refine((data) => {
  // HUF validation: should be whole forints (no decimal places for simplicity)
  if (data.currency === 'HUF' && data.price % 1 !== 0) {
    return false
  }
  return true
}, {
  message: "HUF prices should be whole forints",
  path: ["price"]
})

const updateProductSchema = baseProductSchema.partial()

// Stripe price validation function
async function validateStripePrice(stripe_price_id: string): Promise<boolean> {
  if (!stripe_price_id) return true // Optional field
  
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    const price = await stripe.prices.retrieve(stripe_price_id)
    return price.active
  } catch (error) {
    console.error('Stripe price validation error:', error)
    return false
  }
}

// Note: Use canonical audit log helper from '@/lib/audit-log' at call sites below.

// Get all products with optional filters
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    
    const { searchParams } = new URL(request.url)
    const quiz_id = searchParams.get('quiz_id')
    const active = searchParams.get('active')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('products')
      .select(`
        id,
        quiz_id,
        name,
        description,
        active,
        price,
        currency,
        stripe_product_id,
        stripe_price_id,
        booking_url,
        metadata,
        created_at,
        updated_at,
        quizzes!inner(id, slug, status)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (quiz_id) {
      query = query.eq('quiz_id', quiz_id)
    }

    if (active !== null) {
      query = query.eq('active', active === 'true')
    }

    const { data: products, error, count } = await query

    if (error) {
      console.error('Products fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      products,
      total: count,
      limit,
      offset
    })

  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Create new product
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    
    const body = await request.json()
    console.log('Creating product:', body)

    const validatedData = createProductSchema.parse(body)

    // Validate Stripe price if provided
    if (validatedData.stripe_price_id) {
      const isValidStripePrice = await validateStripePrice(validatedData.stripe_price_id)
      if (!isValidStripePrice) {
        return NextResponse.json(
          { error: 'Invalid or inactive Stripe price ID' },
          { status: 400 }
        )
      }
    }

    // Check if quiz exists and user has access
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('id, slug')
      .eq('id', validatedData.quiz_id)
      .single()

    if (quizError || !quiz) {
      return NextResponse.json(
        { error: 'Quiz not found or access denied' },
        { status: 404 }
      )
    }

    // Validate Stripe price_id if provided
    if (validatedData.stripe_price_id) {
      // TODO: Add Stripe API validation here
      console.log('TODO: Validate Stripe price_id:', validatedData.stripe_price_id)
    }

    // Create product
    const { data: product, error: createError } = await supabase
      .from('products')
      .insert(validatedData)
      .select(`
        id,
        quiz_id,
        name,
        description,
        active,
        price,
        currency,
        stripe_product_id,
        stripe_price_id,
        booking_url,
        metadata,
        created_at,
        updated_at
      `)
      .single()

    if (createError) {
      console.error('Product creation error:', createError)
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      )
    }

    // Log audit trail
    try {
      const { createAuditLog } = await import('@/lib/audit-log')
      await createAuditLog({
        user_id: 'admin-user', // TODO: Get from session
        user_email: 'admin@quiz.com', // TODO: Get from session
        action: 'CREATE',
        resource_type: 'products',
        resource_id: product.id,
        details: { created: product }
      })
    } catch (auditError) {
      console.warn('Audit log failed:', auditError)
    }

    return NextResponse.json(product, { status: 201 })

  } catch (error) {
    console.error('Product creation error:', error)
    
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
