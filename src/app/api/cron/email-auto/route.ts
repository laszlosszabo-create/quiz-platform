import { NextRequest, NextResponse } from 'next/server'

// Simple cron endpoint to trigger email queue processing
// This will be called by external services like Vercel Cron, cPanel Cron, or monitoring services
export async function GET(request: NextRequest) {
  try {
    // Verify cron auth token to prevent unauthorized access
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
      request.headers.get('origin') || 
      (request.headers.get('host')?.includes('localhost') ? 'http://localhost:3000' : `https://${request.headers.get('host')}`)

    console.log('Email cron triggered, processing queue...')

    // Call the email queue processor
    const response = await fetch(`${baseUrl}/api/cron/process-email-queue?safe=true&rate=10&backfill=true&retry=true`, {
      method: 'GET',
      headers: {
        'User-Agent': 'EmailCron/1.0'
      }
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Email queue processing failed:', error)
      return NextResponse.json({ 
        error: 'Email queue processing failed',
        details: error,
        status: response.status
      }, { status: 500 })
    }

    const result = await response.json()
    console.log('Email queue processing completed:', result)

    return NextResponse.json({
      success: true,
      message: 'Email queue processed successfully',
      timestamp: new Date().toISOString(),
      result
    })

  } catch (error) {
    console.error('Email cron error:', error)
    return NextResponse.json({
      error: 'Email cron processing failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// Also support POST for webhook-style calls
export async function POST(request: NextRequest) {
  return GET(request)
}
