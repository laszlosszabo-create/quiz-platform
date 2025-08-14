import { NextRequest, NextResponse } from 'next/server'
import { createAuditLog } from '../../../../lib/audit-log'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { user_id, user_email, action, resource_type, resource_id, details } = body

    if (!user_id || !user_email || !action || !resource_type || !resource_id) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, user_email, action, resource_type, resource_id' },
        { status: 400 }
      )
    }

    const result = await createAuditLog({
      user_id,
      user_email,
      action,
      resource_type,
      resource_id,
      details
    })

    if (result.error) {
      return NextResponse.json(
        { error: 'Failed to create audit log' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in audit log API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
