// API endpoint for processing email queue (Day 0 immediate delivery)
import { NextRequest, NextResponse } from 'next/server'
import { processQueuedEmails, retryFailedEmails } from '@/lib/email-delivery'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action = 'process', limit = 10, maxRetries = 3 } = body
    
    console.log(`Email delivery API called: action=${action}`)
    
    switch (action) {
      case 'process':
        // Process queued emails (Day 0 immediate delivery)
        const processResult = await processQueuedEmails(limit)
        
        return NextResponse.json({
          success: true,
          action: 'process',
          result: processResult,
          message: `Processed ${processResult.processed} emails: ${processResult.sent} sent, ${processResult.failed} failed`
        })
        
      case 'retry':
        // Retry failed emails
        const retryResult = await retryFailedEmails(maxRetries)
        
        return NextResponse.json({
          success: true,
          action: 'retry',
          result: retryResult,
          message: `Retried ${retryResult.retried} emails: ${retryResult.sent} sent`
        })
        
      case 'stats':
        // Get email queue statistics
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        )
        
        const [queuedResult, sentResult, failedResult] = await Promise.all([
          supabase.from('email_events').select('count').eq('status', 'queued'),
          supabase.from('email_events').select('count').eq('status', 'sent'),
          supabase.from('email_events').select('count').eq('status', 'failed')
        ])
        
        return NextResponse.json({
          success: true,
          action: 'stats',
          stats: {
            queued: queuedResult.count || 0,
            sent: sentResult.count || 0,
            failed: failedResult.count || 0
          }
        })
        
      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}. Use 'process', 'retry', or 'stats'`
        }, { status: 400 })
    }
    
  } catch (error: any) {
    console.error('Email delivery API error:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.stack
    }, { status: 500 })
  }
}

// GET endpoint for quick stats
export async function GET() {
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    const { data: events, error } = await supabase
      .from('email_events')
      .select('status, template_key, lang, created_at')
      .order('created_at', { ascending: false })
      .limit(100)
    
    if (error) {
      throw new Error(`Failed to fetch email events: ${error.message}`)
    }
    
    // Calculate statistics
    const stats = {
      total: events?.length || 0,
      queued: events?.filter(e => e.status === 'queued').length || 0,
      sent: events?.filter(e => e.status === 'sent').length || 0,
      failed: events?.filter(e => e.status === 'failed').length || 0,
      by_template: {} as Record<string, number>,
      by_language: {} as Record<string, number>,
      recent_events: events?.slice(0, 10) || []
    }
    
    // Group by template and language
    events?.forEach(event => {
      stats.by_template[event.template_key] = (stats.by_template[event.template_key] || 0) + 1
      stats.by_language[event.lang] = (stats.by_language[event.lang] || 0) + 1
    })
    
    return NextResponse.json({
      success: true,
      stats,
      message: `Email delivery statistics retrieved`
    })
    
  } catch (error: any) {
    console.error('Email stats API error:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
