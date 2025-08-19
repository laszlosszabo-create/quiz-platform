import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseAdmin } from '@/lib/supabase-config'

// Validation schemas
const getAnalyticsSchema = z.object({
  quiz_id: z.string().uuid(),
  template_id: z.string().uuid().optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  group_by: z.enum(['day', 'week', 'month', 'template', 'event']).default('day')
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const quizId = searchParams.get('quiz_id')
    const templateId = searchParams.get('template_id')
    const dateFrom = searchParams.get('date_from')
    const dateTo = searchParams.get('date_to')
    const groupBy = searchParams.get('group_by')

    if (!quizId) {
      return NextResponse.json(
        { error: 'quiz_id parameter is required' },
        { status: 400 }
      )
    }

    const validatedData = getAnalyticsSchema.parse({ 
      quiz_id: quizId,
      template_id: templateId || undefined,
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
      group_by: groupBy || 'day'
    })

    const supabase = getSupabaseAdmin()

    // Get email analytics data
    let query = supabase
      .from('email_analytics')
      .select(`
        *,
        email_templates (
          id,
          template_name,
          template_type
        )
      `)
      .eq('quiz_id', validatedData.quiz_id)

    if (validatedData.template_id) {
      query = query.eq('template_id', validatedData.template_id)
    }

    if (validatedData.date_from) {
      query = query.gte('event_date', validatedData.date_from)
    }

    if (validatedData.date_to) {
      query = query.lte('event_date', validatedData.date_to)
    }

    const { data: analytics, error } = await query
      .order('event_date', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch email analytics' },
        { status: 500 }
      )
    }

    // Process analytics data based on groupBy parameter
    const processedData = processAnalyticsData(analytics, validatedData.group_by)

    // Get summary statistics
    const summary = await getAnalyticsSummary(supabase, validatedData)

    return NextResponse.json({ 
      analytics: processedData,
      summary,
      groupBy: validatedData.group_by
    })

  } catch (error) {
    console.error('Email analytics API error:', error)
    
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

// Helper function to process analytics data based on grouping
function processAnalyticsData(analytics: any[], groupBy: string) {
  const groups: { [key: string]: any } = {}

  analytics.forEach(item => {
    let groupKey: string

    switch (groupBy) {
      case 'day':
        groupKey = item.event_date.split('T')[0] // YYYY-MM-DD format
        break
      case 'week':
        const date = new Date(item.event_date)
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay()))
        groupKey = weekStart.toISOString().split('T')[0]
        break
      case 'month':
        groupKey = item.event_date.substring(0, 7) // YYYY-MM format
        break
      case 'template':
        groupKey = item.template_id || 'unknown'
        break
      case 'event':
        groupKey = item.event_type
        break
      default:
        groupKey = item.event_date.split('T')[0]
    }

    if (!groups[groupKey]) {
      groups[groupKey] = {
        group: groupKey,
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        failed: 0,
        items: []
      }
    }

    // Count events
    if (item.event_type === 'sent') groups[groupKey].sent++
    else if (item.event_type === 'delivered') groups[groupKey].delivered++
    else if (item.event_type === 'opened') groups[groupKey].opened++
    else if (item.event_type === 'clicked') groups[groupKey].clicked++
    else if (item.event_type === 'bounced') groups[groupKey].bounced++
    else if (item.event_type === 'failed') groups[groupKey].failed++

    groups[groupKey].items.push(item)
  })

  // Convert to array and calculate rates
  return Object.values(groups).map((group: any) => ({
    ...group,
    deliveryRate: group.sent > 0 ? ((group.delivered / group.sent) * 100).toFixed(2) : '0.00',
    openRate: group.delivered > 0 ? ((group.opened / group.delivered) * 100).toFixed(2) : '0.00',
    clickRate: group.opened > 0 ? ((group.clicked / group.opened) * 100).toFixed(2) : '0.00',
    bounceRate: group.sent > 0 ? ((group.bounced / group.sent) * 100).toFixed(2) : '0.00'
  }))
}

// Helper function to get summary statistics
async function getAnalyticsSummary(supabase: any, validatedData: any) {
  let query = supabase
    .from('email_analytics')
    .select('event_type')
    .eq('quiz_id', validatedData.quiz_id)

  if (validatedData.template_id) {
    query = query.eq('template_id', validatedData.template_id)
  }

  if (validatedData.date_from) {
    query = query.gte('event_date', validatedData.date_from)
  }

  if (validatedData.date_to) {
    query = query.lte('event_date', validatedData.date_to)
  }

  const { data: summaryData, error } = await query

  if (error) {
    console.error('Summary query error:', error)
    return null
  }

  const summary = {
    total: summaryData.length,
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    bounced: 0,
    failed: 0,
    deliveryRate: '0.00',
    openRate: '0.00',
    clickRate: '0.00',
    bounceRate: '0.00'
  }

  summaryData.forEach((item: { event_type: string }) => {
    if (item.event_type === 'sent') summary.sent++
    else if (item.event_type === 'delivered') summary.delivered++
    else if (item.event_type === 'opened') summary.opened++
    else if (item.event_type === 'clicked') summary.clicked++
    else if (item.event_type === 'bounced') summary.bounced++
    else if (item.event_type === 'failed') summary.failed++
  })

  // Calculate rates
  summary.deliveryRate = summary.sent > 0 ? ((summary.delivered / summary.sent) * 100).toFixed(2) : '0.00'
  summary.openRate = summary.delivered > 0 ? ((summary.opened / summary.delivered) * 100).toFixed(2) : '0.00'
  summary.clickRate = summary.opened > 0 ? ((summary.clicked / summary.opened) * 100).toFixed(2) : '0.00'
  summary.bounceRate = summary.sent > 0 ? ((summary.bounced / summary.sent) * 100).toFixed(2) : '0.00'

  return summary
}
