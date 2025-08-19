import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import { getSupabaseAdmin } from '@/lib/supabase-config'

// Configure marked for email-safe HTML
marked.setOptions({
  breaks: true,
  gfm: true
})

// Create DOM for server-side DOMPurify
const window = new JSDOM('').window
const purify = DOMPurify(window as any)

// Validation schemas
const getTemplatesSchema = z.object({
  quiz_id: z.string().uuid(),
  product_id: z.string().optional()
})

const createTemplateSchema = z.object({
  quiz_id: z.string().uuid(),
  product_id: z.string().optional(),
  template_type: z.enum(['result', 'purchase', 'reminder', 'custom']),
  lang: z.string().min(2).max(5).default('hu'),
  template_name: z.string().min(1),
  subject_template: z.string().min(1),
  body_markdown: z.string().min(1),
  body_html: z.string().optional(),
  variables: z.record(z.string()).optional().default({}),
  is_active: z.boolean().default(true)
})

const updateTemplateSchema = createTemplateSchema.extend({
  id: z.string().uuid()
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const quizId = searchParams.get('quiz_id')
    const productId = searchParams.get('product_id')

    if (!quizId) {
      return NextResponse.json(
        { error: 'quiz_id parameter is required' },
        { status: 400 }
      )
    }

    const validatedData = getTemplatesSchema.parse({ 
      quiz_id: quizId,
      product_id: productId || undefined
    })

    const supabase = getSupabaseAdmin()

    // Get email templates
    let query = supabase
      .from('email_templates')
      .select('*')
      .eq('quiz_id', validatedData.quiz_id)

    if (validatedData.product_id) {
      query = query.eq('product_id', validatedData.product_id)
    }

    const { data: templates, error } = await query
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch email templates' },
        { status: 500 }
      )
    }

    return NextResponse.json({ templates })

  } catch (error) {
    console.error('Email templates API error:', error)
    
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
    const validatedData = createTemplateSchema.parse(body)

    const supabase = getSupabaseAdmin()

    // Convert markdown to basic HTML (simple implementation for now)
    const bodyHtml = convertMarkdownToHtml(validatedData.body_markdown)

    const { data, error } = await supabase
      .from('email_templates')
      .insert({
        quiz_id: validatedData.quiz_id,
        product_id: validatedData.product_id,
        template_type: validatedData.template_type,
        lang: validatedData.lang,
        template_name: validatedData.template_name,
        subject_template: validatedData.subject_template,
        body_markdown: validatedData.body_markdown,
        body_html: bodyHtml,
        variables: validatedData.variables,
        is_active: validatedData.is_active,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to create email template' },
        { status: 500 }
      )
    }

    return NextResponse.json({ template: data })

  } catch (error) {
    console.error('Email template creation error:', error)
    
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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = updateTemplateSchema.parse(body)

    const supabase = getSupabaseAdmin()

    // Convert markdown to HTML
    const bodyHtml = convertMarkdownToHtml(validatedData.body_markdown)

    const { data, error } = await supabase
      .from('email_templates')
      .update({
        template_type: validatedData.template_type,
        lang: validatedData.lang,
        template_name: validatedData.template_name,
        subject_template: validatedData.subject_template,
        body_markdown: validatedData.body_markdown,
        body_html: bodyHtml,
        variables: validatedData.variables,
        is_active: validatedData.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', validatedData.id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to update email template' },
        { status: 500 }
      )
    }

    return NextResponse.json({ template: data })

  } catch (error) {
    console.error('Email template update error:', error)
    
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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const templateId = searchParams.get('id')

    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID is required' },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdmin()

    const { error } = await supabase
      .from('email_templates')
      .delete()
      .eq('id', templateId)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to delete email template' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Email template deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Advanced Markdown to HTML converter for email templates
function convertMarkdownToHtml(markdown: string): string {
  try {
    // Convert markdown to HTML using marked
    let html = marked(markdown) as string

    // Add email-safe inline styles
    html = html.replace(/<h1>/g, '<h1 style="font-size: 24px; font-weight: bold; margin: 20px 0 15px 0; color: #333; line-height: 1.2;">')
    html = html.replace(/<h2>/g, '<h2 style="font-size: 20px; font-weight: bold; margin: 18px 0 12px 0; color: #333; line-height: 1.2;">')
    html = html.replace(/<h3>/g, '<h3 style="font-size: 18px; font-weight: bold; margin: 15px 0 10px 0; color: #333; line-height: 1.2;">')
    html = html.replace(/<p>/g, '<p style="margin: 10px 0; line-height: 1.6; color: #333; font-size: 14px;">')
    html = html.replace(/<ul>/g, '<ul style="margin: 10px 0; padding-left: 20px; color: #333;">')
    html = html.replace(/<ol>/g, '<ol style="margin: 10px 0; padding-left: 20px; color: #333;">')
    html = html.replace(/<li>/g, '<li style="margin: 5px 0; line-height: 1.4;">')
    html = html.replace(/<a /g, '<a style="color: #0066cc; text-decoration: underline;" ')
    html = html.replace(/<strong>/g, '<strong style="font-weight: bold;">')
    html = html.replace(/<em>/g, '<em style="font-style: italic;">')
    html = html.replace(/<blockquote>/g, '<blockquote style="margin: 15px 0; padding: 10px 15px; border-left: 4px solid #ddd; background-color: #f9f9f9; font-style: italic;">')
    html = html.replace(/<code>/g, '<code style="background-color: #f1f1f1; padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 13px;">')
    html = html.replace(/<pre>/g, '<pre style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; overflow-x: auto; margin: 15px 0;">')
    
    // Sanitize HTML to prevent XSS
    html = purify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre'],
      ALLOWED_ATTR: ['href', 'target', 'style'],
      KEEP_CONTENT: true
    })

    return html
  } catch (error) {
    console.error('Markdown conversion error:', error)
    // Fallback to simple text formatting
    return markdown.replace(/\n/g, '<br style="margin: 5px 0;">')
  }
}
