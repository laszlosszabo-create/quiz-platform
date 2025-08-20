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

// Advanced Markdown to HTML converter for email templates with professional design
function convertMarkdownToHtml(markdown: string): string {
  try {
    // Convert markdown to HTML using marked
    let html = marked(markdown) as string

    // Wrap in professional email template structure
    html = `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f9fa; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                  <h1 style="color: #ffffff; font-size: 28px; font-weight: 600; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                    🎯 Quiz Platform
                  </h1>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  ${html}
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 25px 30px; text-align: center; border-top: 1px solid #e9ecef;">
                  <p style="margin: 0; color: #6c757d; font-size: 12px; line-height: 1.4;">
                    © 2025 Quiz Platform | Professzionális quiz megoldások<br>
                    <a href="#" style="color: #667eea; text-decoration: none;">Adatvédelmi szabályzat</a> | 
                    <a href="#" style="color: #667eea; text-decoration: none;">Kapcsolat</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `

    // Add enhanced inline styles for email clients
    html = html.replace(/<h1>/g, '<h1 style="font-size: 26px; font-weight: 700; margin: 0 0 20px 0; color: #2d3748; line-height: 1.3;">')
    html = html.replace(/<h2>/g, '<h2 style="font-size: 22px; font-weight: 600; margin: 25px 0 15px 0; color: #4a5568; line-height: 1.3; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">')
    html = html.replace(/<h3>/g, '<h3 style="font-size: 18px; font-weight: 600; margin: 20px 0 10px 0; color: #667eea; line-height: 1.3;">')
    html = html.replace(/<p>/g, '<p style="margin: 15px 0; line-height: 1.7; color: #4a5568; font-size: 16px;">')
    html = html.replace(/<ul>/g, '<ul style="margin: 15px 0; padding-left: 25px; color: #4a5568;">')
    html = html.replace(/<ol>/g, '<ol style="margin: 15px 0; padding-left: 25px; color: #4a5568;">')
    html = html.replace(/<li>/g, '<li style="margin: 8px 0; line-height: 1.6; font-size: 15px;">')
    html = html.replace(/<a /g, '<a style="color: #667eea; text-decoration: none; font-weight: 500; background: linear-gradient(135deg, #667eea, #764ba2); background-size: 100%; background-repeat: repeat; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" ')
    html = html.replace(/<strong>/g, '<strong style="font-weight: 700; color: #2d3748;">')
    html = html.replace(/<em>/g, '<em style="font-style: italic; color: #718096;">')
    
    // Style special elements
    html = html.replace(/<blockquote>/g, '<blockquote style="margin: 20px 0; padding: 15px 20px; border-left: 4px solid #667eea; background-color: #f7fafc; font-style: italic; border-radius: 0 8px 8px 0;">')
    html = html.replace(/<code>/g, '<code style="background-color: #edf2f7; padding: 4px 8px; border-radius: 6px; font-family: \'Monaco\', \'Menlo\', \'Ubuntu Mono\', monospace; font-size: 14px; color: #d69e2e;">')
    
    // Convert CTA buttons
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
      if (text.includes('🔍') || text.includes('📊') || text.includes('📞') || text.includes('📥')) {
        return `<a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 10px 5px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">${text}</a>`
      }
      return `<a href="${url}" style="color: #667eea; text-decoration: none; font-weight: 500;">${text}</a>`
    })
    
    // Style emojis and icons
    html = html.replace(/(📊|📞|📥|🔍|🎯|⚠️|✅|⏰|🧠|💡|🎉)/g, '<span style="font-size: 18px; margin-right: 8px;">$1</span>')
    
    // Sanitize HTML to prevent XSS
    html = purify.sanitize(html, {
      ALLOWED_TAGS: ['table', 'tr', 'td', 'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre', 'span'],
      ALLOWED_ATTR: ['href', 'target', 'style', 'width', 'cellpadding', 'cellspacing', 'border', 'align'],
      KEEP_CONTENT: true
    })

    return html
  } catch (error) {
    console.error('Markdown conversion error:', error)
    // Fallback to simple text formatting
    return markdown.replace(/\n/g, '<br style="margin: 5px 0;">')
  }
}
