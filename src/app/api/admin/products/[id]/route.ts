import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseAdmin } from '@/lib/supabase-config'

// Product validation schema - matching actual database schema
const updateProductSchema = z.object({
  quiz_id: z.string().uuid().optional(),
  active: z.boolean().optional(),
  price_cents: z.number().int().positive().optional(), // Stripe unit_amount format
  currency: z.enum(['HUF', 'EUR', 'USD']).optional(),
  stripe_price_id: z.string().nullable().optional(),
  delivery_type: z.enum(['static_pdf', 'ai_generated', 'link']).optional(),
  asset_url: z.string().url().nullable().optional(),
  translations: z.object({
    hu: z.object({
      name: z.string().min(1),
      description: z.string().optional()
    }).optional(),
    en: z.object({
      name: z.string().min(1),
      description: z.string().optional()
    }).optional()
  }).optional()
}).refine(data => Object.keys(data).length > 0, {
  message: "At least one field must be provided for update"
}).refine((data) => {
  // HUF validation: must be divisible by 100 (whole forints)
  if (data.currency === 'HUF' && data.price_cents && data.price_cents % 100 !== 0) {
    return false
  }
  return true
}, {
  message: "HUF prices must be in whole forints (price_cents divisible by 100)",
  path: ["price_cents"]
})

// Get specific product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { getSupabaseAdmin } = await import('@/lib/supabase-config')
    const supabase = getSupabaseAdmin()
    const { id } = await params
    
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        id,
        quiz_id,
        name,
        description,
        active,
        price,
        currency,
        stripe_price_id,
        delivery_type,
        asset_url,
        translations,
        created_at,
        updated_at,
        quizzes!inner(id, slug, status)
      `)
  .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      }
      
      console.error('Product fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch product' },
        { status: 500 }
      )
    }

    return NextResponse.json(product)

  } catch (error) {
    console.error('Product API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update specific product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { getSupabaseAdmin } = await import('@/lib/supabase-config')
    const supabase = getSupabaseAdmin()
    const { id } = await params
    
    const body = await request.json()
    console.log('Updating product:', id, body)

    const validatedData = updateProductSchema.parse(body)

    // Get existing product for audit trail
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('*')
  .eq('id', id)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      }
      
      console.error('Product fetch error:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch product' },
        { status: 500 }
      )
    }

    // Validate Stripe price_id if being updated
    if (validatedData.stripe_price_id) {
      // TODO: Add Stripe API validation here
      console.log('TODO: Validate Stripe price_id:', validatedData.stripe_price_id)
    }

    // Update product
    const { data: product, error: updateError } = await supabase
      .from('products')
      .update(validatedData)
  .eq('id', id)
      .select(`
        id,
        quiz_id,
        name,
        description,
        active,
        price,
        currency,
        stripe_price_id,
        delivery_type,
        asset_url,
        translations,
        created_at,
        updated_at
      `)
      .single()

    if (updateError) {
      console.error('Product update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 500 }
      )
    }

    // Log audit trail
    try {
      const { createAuditLog } = await import('@/lib/audit-log')
      await createAuditLog({
        user_id: 'admin-user', // TODO: Get from session
        user_email: 'admin@quiz.com', // TODO: Get from session
        action: 'UPDATE',
        resource_type: 'products',
        resource_id: product.id,
        details: { 
          before: existingProduct,
          after: product,
          changes: validatedData
        }
      })
    } catch (auditError) {
      console.warn('Audit log failed:', auditError)
    }

    return NextResponse.json(product)

  } catch (error) {
    console.error('Product update error:', error)
    
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

// Delete specific product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { getSupabaseAdmin } = await import('@/lib/supabase-config')
    const supabase = getSupabaseAdmin()
    const { id } = await params

    // Get existing product for audit trail
    const { data: existingProduct, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      }
      
      console.error('Product fetch error:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch product' },
        { status: 500 }
      )
    }

    // Check if product is referenced in orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id')
  .eq('product_id', id)
      .limit(1)

    if (ordersError) {
      console.error('Orders check error:', ordersError)
      return NextResponse.json(
        { error: 'Failed to check product references' },
        { status: 500 }
      )
    }

    if (orders.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete product with existing orders. Consider deactivating instead.' },
        { status: 409 }
      )
    }

    // Delete product
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
  .eq('id', id)

    if (deleteError) {
      console.error('Product deletion error:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 500 }
      )
    }

    // Log audit trail
    try {
      const { createAuditLog } = await import('@/lib/audit-log')
      await createAuditLog({
        user_id: 'admin-user', // TODO: Get from session
        user_email: 'admin@quiz.com', // TODO: Get from session
        action: 'DELETE',
        resource_type: 'products',
  resource_id: id,
        details: { deleted: existingProduct }
      })
    } catch (auditError) {
      console.warn('Audit log failed:', auditError)
    }

    return NextResponse.json({ message: 'Product deleted successfully' })

  } catch (error) {
    console.error('Product deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
