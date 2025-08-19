import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseAdmin } from '@/lib/supabase-config'

// Validation schemas
const getConfigsSchema = z.object({
  product_id: z.string().uuid()
})

const createConfigSchema = z.object({
  product_id: z.string().uuid(),
  key: z.string().min(1),
  value: z.record(z.any())
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('product_id')
    
    if (!productId) {
      return NextResponse.json(
        { error: 'product_id parameter is required' },
        { status: 400 }
      )
    }

    const validatedData = getConfigsSchema.parse({ product_id: productId })

    const supabase = getSupabaseAdmin()

    // Get product configs
    const { data: configs, error } = await supabase
      .from('product_configs')
      .select('*')
      .eq('product_id', validatedData.product_id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch product configs' },
        { status: 500 }
      )
    }

    return NextResponse.json({ configs })

  } catch (error) {
    console.error('Product configs API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request parameters', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createConfigSchema.parse(body)

    const supabase = getSupabaseAdmin()

    // Upsert product config (insert or update if exists)
    const { data, error } = await supabase
      .from('product_configs')
      .upsert({
        product_id: validatedData.product_id,
        key: validatedData.key,
        value: validatedData.value,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'product_id,key'
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save product config' },
        { status: 500 }
      )
    }

    return NextResponse.json({ config: data })

  } catch (error) {
    console.error('Product config save error:', error)
    
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
