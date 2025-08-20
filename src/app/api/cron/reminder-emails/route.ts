import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-config'
import { emailTrigger } from '@/lib/email-automation'

// This endpoint should be called by a cron job (e.g., every hour)
// to check for users who completed quizzes but didn't purchase
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    
    // Find quiz sessions completed in the last 24-48 hours without purchases
    const reminderWindow = new Date()
    reminderWindow.setHours(reminderWindow.getHours() - 24) // 24 hours ago
    
    const maxWindow = new Date()
    maxWindow.setHours(maxWindow.getHours() - 48) // 48 hours ago (don't spam)
    
    const { data: sessionsForReminder, error } = await supabase
      .from('quiz_sessions')
      .select(`
        id,
        quiz_id,
        user_email,
        user_name,
        completed_at,
        result_snapshot
      `)
      .eq('status', 'completed')
      .not('user_email', 'is', null)
      .gte('completed_at', maxWindow.toISOString())
      .lte('completed_at', reminderWindow.toISOString())
      .is('reminder_sent_at', null) // Haven't sent reminder yet
    
    if (error) {
      console.error('Error fetching sessions for reminder:', error)
      return NextResponse.json({ error: 'Database query failed' }, { status: 500 })
    }

    if (!sessionsForReminder || sessionsForReminder.length === 0) {
      return NextResponse.json({ 
        message: 'No sessions found for reminder emails',
        count: 0
      })
    }

    let triggeredCount = 0

    for (const session of sessionsForReminder) {
      try {
        // Check if user has made any purchase for this quiz
        const { data: hasPurchase } = await supabase
          .from('orders')
          .select('id')
          .eq('lead_id', session.id)
          .eq('status', 'paid')
          .limit(1)
          .single()

        // Skip if user already purchased
        if (hasPurchase) {
          console.log(`Skipping reminder for session ${session.id} - user already purchased`)
          continue
        }

        // Trigger reminder email
        await emailTrigger.triggerReminder(
          session.quiz_id,
          session.user_email,
          {
            completion_date: session.completed_at,
            quiz_result: session.result_snapshot
          },
          session.user_name
        )

        // Mark reminder as sent
        await supabase
          .from('quiz_sessions')
          .update({ reminder_sent_at: new Date().toISOString() })
          .eq('id', session.id)

        triggeredCount++
        console.log(`Reminder email triggered for session: ${session.id}`)

      } catch (sessionError) {
        console.error(`Error processing reminder for session ${session.id}:`, sessionError)
        // Continue with other sessions
      }
    }

    return NextResponse.json({
      message: 'Reminder emails processed',
      totalChecked: sessionsForReminder.length,
      triggered: triggeredCount
    })

  } catch (error) {
    console.error('Reminder email cron error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
