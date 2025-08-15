import { NextResponse } from 'next/server'
import { getSupabaseInfo, getSupabaseAdmin } from '@/lib/supabase-config'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const results: any = {
    config: {},
    connectionTest: {},
    rlsTest: {},
    dataTest: {},
    directTest: {},
    jwtTest: {}
  }

  try {
    // 1. Configuration info
    const info = getSupabaseInfo()
    results.config = {
      environment: info.environment,
      url: info.url,
      isLocal: info.isLocal,
      envVars: {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 
          process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20) + '...' : 'MISSING'
      }
    }

    // 2. Connection test with header inspection
    // Create a fresh admin client instance to avoid caching issues
    const config = getSupabaseInfo()
    console.log('🔍 Debug config:', {
      url: config.url,
      serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20) + '...',
      isLocal: config.isLocal
    })
    
    const freshAdmin = createClient<any>(
      config.url,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        },
        global: {
          headers: {
            'User-Agent': 'quiz-platform/debug'
          }
        }
      }
    )
    
    console.log('🔍 Fresh admin client created')
    
    // Patch the fetch to inspect what headers are being sent
    const originalFetch = global.fetch
    let requestHeaders: any = {}
    let requestUrl = ''
    
    global.fetch = async (input: any, init?: any) => {
      requestUrl = typeof input === 'string' ? input : input.url
      requestHeaders = init?.headers || {}
      console.log('🔍 Fetch intercepted:', { url: requestUrl, headers: requestHeaders })
      return originalFetch(input, init)
    }
    
    // Test basic connection with a simple query
    const { data: healthCheck, error: healthError } = await freshAdmin
      .from('quizzes')
      .select('count', { count: 'exact', head: true })
    
    // Restore original fetch
    global.fetch = originalFetch
    
    results.connectionTest = {
      success: !healthError,
      error: healthError?.message,
      errorCode: healthError?.code,
      count: healthCheck,
      requestDebug: {
        url: requestUrl,
        headers: requestHeaders,
        hasApikey: !!requestHeaders.apikey,
        hasAuth: !!requestHeaders.authorization || !!requestHeaders.Authorization,
        authValue: requestHeaders.authorization || requestHeaders.Authorization,
        apikeyValue: requestHeaders.apikey
      }
    }

    // 3. RLS bypass test - try to access with service role
    const { data: rlsBypass, error: rlsError } = await freshAdmin
      .from('quizzes')
      .select('id, slug, status')
      .limit(5)
    
    results.rlsTest = {
      success: !rlsError,
      error: rlsError?.message,
      errorCode: rlsError?.code,
      rowCount: rlsBypass?.length || 0,
      sampleData: rlsBypass?.slice(0, 2)
    }

    // 4. Specific quiz test
    const { data: quizTest, error: quizError } = await freshAdmin
      .from('quizzes')
      .select('id, slug, status')
      .eq('slug', 'adhd-quick-check')
      .single()
    
    results.dataTest = {
      success: !quizError,
      error: quizError?.message,
      errorCode: quizError?.code,
      found: !!quizTest,
      quiz: quizTest
    }

    // 5. Direct HTTP test (bypass Supabase client)
    const directTest = await fetch(`${info.url}/rest/v1/quizzes?select=id,slug&slug=eq.adhd-quick-check`, {
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
        'Content-Type': 'application/json'
      }
    })
    
    const directData = await directTest.json()
    results.directTest = {
      success: directTest.ok,
      status: directTest.status,
      data: directData
    }

    // 6. JWT token analysis
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (serviceKey) {
      try {
        // Decode JWT header and payload (without verification)
        const [header, payload] = serviceKey.split('.')
        const decodedHeader = JSON.parse(Buffer.from(header, 'base64').toString())
        const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString())
        
        results.jwtTest = {
          valid: true,
          header: decodedHeader,
          payload: {
            iss: decodedPayload.iss,
            role: decodedPayload.role,
            exp: decodedPayload.exp,
            iat: decodedPayload.iat
          },
          isExpired: decodedPayload.exp ? Date.now() / 1000 > decodedPayload.exp : false
        }
      } catch (jwtError) {
        results.jwtTest = {
          valid: false,
          error: jwtError instanceof Error ? jwtError.message : 'JWT decode failed'
        }
      }
    }

    return NextResponse.json(results, { status: 200 })
    
  } catch (error) {
    results.config.error = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(results, { status: 500 })
  }
}
