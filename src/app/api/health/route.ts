import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log('[HEALTH] Request received at:', new Date().toISOString())
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    port: process.env.PORT || '3000'
  })
}
