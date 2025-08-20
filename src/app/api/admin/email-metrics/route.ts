import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-config'

export async function GET(request: NextRequest) {
  const supabase = getSupabaseAdmin()
  const url = new URL(request.url)
  const hours = parseInt(url.searchParams.get('hours') || '24', 10)
  const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()

  try {
    // Queue size by status (open = pending+processing; sent; failed; cancelled)
    const statuses = ['pending', 'processing', 'sent', 'failed', 'cancelled'] as const
    const sizeByStatus: Record<string, number> = {}
    for (const s of statuses) {
      const { count } = await supabase.from('email_queue').select('id', { count: 'exact', head: true }).eq('status', s)
      sizeByStatus[s] = count || 0
    }

    // Success rate in window
  // Note: Some environments may not have updated_at; use sent_at for sent and created_at for failed
  const { count: sentCount } = await supabase.from('email_queue').select('id', { count: 'exact', head: true }).eq('status', 'sent').gte('sent_at', since)
  const { count: failedCount } = await supabase.from('email_queue').select('id', { count: 'exact', head: true }).eq('status', 'failed').gte('created_at', since)
    const successRate = (sentCount || 0) + (failedCount || 0) > 0 ? ((sentCount || 0) / (((sentCount || 0) + (failedCount || 0)))) : 0

    // Avg delivery time for window (sent_at - scheduled_at)
    const { data: sentRows } = await supabase
      .from('email_queue')
      .select('scheduled_at, sent_at')
      .eq('status', 'sent')
      .gte('sent_at', since)
      .limit(500)
    let avgDeliveryMs = 0
    if (sentRows && sentRows.length) {
      const diffs = sentRows.map(r => (r.sent_at && r.scheduled_at) ? (new Date(r.sent_at).getTime() - new Date(r.scheduled_at).getTime()) : 0).filter(n => n > 0)
      avgDeliveryMs = diffs.length ? Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length) : 0
    }

    // Top failure reasons in window
    const { data: failedRows } = await supabase
      .from('email_queue')
      .select('error_message')
      .eq('status', 'failed')
  .gte('created_at', since)
      .limit(1000)

    const topErrors: Record<string, number> = {}
    for (const r of failedRows || []) {
      const key = (r.error_message || 'unknown').slice(0, 120)
      topErrors[key] = (topErrors[key] || 0) + 1
    }

    return NextResponse.json({
      window_hours: hours,
      queue: {
        open: (sizeByStatus['pending'] || 0) + (sizeByStatus['processing'] || 0),
        sent: sizeByStatus['sent'] || 0,
        failed: sizeByStatus['failed'] || 0,
        cancelled: sizeByStatus['cancelled'] || 0,
        by_status: sizeByStatus
      },
      success_rate: successRate,
      avg_delivery_ms: avgDeliveryMs,
      top_errors: Object.entries(topErrors).sort((a, b) => b[1] - a[1]).slice(0, 10)
    })
  } catch (error) {
    console.error('Email metrics error:', error)
    return NextResponse.json({ error: 'Failed to compute metrics' }, { status: 500 })
  }
}
