import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({ 
      success: true, 
      message: 'API working',
      timestamp: new Date().toISOString(),
      env_check: {
        supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT_SET',
        service_key: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT_SET',
        node_env: process.env.NODE_ENV
      }
    })
  } catch (err) {
    return NextResponse.json({ 
      success: false, 
      error: 'Unexpected error',
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 })
  }
}
