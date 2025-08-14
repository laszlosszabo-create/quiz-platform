// API endpoint for email scheduling operations
import { NextRequest, NextResponse } from 'next/server'
import { processScheduledEmails, cleanupExpiredEmails, getSchedulingStats } from '@/lib/email-scheduler'
import { processQueuedEmails } from '@/lib/email-delivery'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action = 'process' } = body
    
    console.log(`Email scheduler API called: action=${action}`)
    
    switch (action) {
      case 'process':
        // Process scheduled emails (convert scheduled -> queued)
        const processResult = await processScheduledEmails()
        
        // Then process the newly queued emails for delivery
        const deliveryResult = await processQueuedEmails(processResult.activated)
        
        return NextResponse.json({
          success: true,
          action: 'process',
          scheduled_result: processResult,
          delivery_result: deliveryResult,
          message: `Activated ${processResult.activated} scheduled emails and sent ${deliveryResult.sent}`
        })
        
      case 'cleanup':
        // Clean up expired scheduled emails
        const daysOld = body.days_old || 30
        const deletedCount = await cleanupExpiredEmails(daysOld)
        
        return NextResponse.json({
          success: true,
          action: 'cleanup',
          deleted_count: deletedCount,
          message: `Cleaned up ${deletedCount} expired emails older than ${daysOld} days`
        })
        
      case 'stats':
        // Get scheduling statistics
        const stats = await getSchedulingStats()
        
        return NextResponse.json({
          success: true,
          action: 'stats',
          stats,
          message: 'Scheduling statistics retrieved'
        })
        
      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}. Use 'process', 'cleanup', or 'stats'`
        }, { status: 400 })
    }
    
  } catch (error: any) {
    console.error('Email scheduler API error:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.stack
    }, { status: 500 })
  }
}

// GET endpoint for quick scheduling stats
export async function GET() {
  try {
    const stats = await getSchedulingStats()
    
    return NextResponse.json({
      success: true,
      stats,
      message: 'Email scheduling statistics',
      timestamp: new Date().toISOString()
    })
    
  } catch (error: any) {
    console.error('Email scheduler stats error:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
