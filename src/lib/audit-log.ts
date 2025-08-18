import { getSupabaseAdmin } from './supabase-config'

export interface AuditLogEntry {
  id?: string
  user_id: string
  user_email: string
  action: string
  resource_type: string
  resource_id: string
  details?: any
  created_at?: string
}

export async function createAuditLog(entry: Omit<AuditLogEntry, 'id' | 'created_at'>) {
  const supabase = getSupabaseAdmin()

  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .insert({
        user_id: entry.user_id,
        user_email: entry.user_email,
        action: entry.action,
        resource_type: entry.resource_type,
        resource_id: entry.resource_id,
        details: entry.details,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      // Fallback path for legacy schemas (e.g., event_name/data columns)
      const code = (error as any)?.code
      const message = (error as any)?.message || ''
      const needsLegacy = code === 'PGRST204' || message.includes('schema cache') || code === '23502'
      if (needsLegacy) {
        try {
          const legacyPayload: any = {
            event_name: entry.action, // legacy NOT NULL column
            data: {
              user_id: entry.user_id,
              user_email: entry.user_email,
              resource_type: entry.resource_type,
              resource_id: entry.resource_id,
              details: entry.details || {}
            },
            created_at: new Date().toISOString()
          }
          const { data: legacyData, error: legacyError } = await supabase
            .from('audit_logs')
            .insert(legacyPayload)
            .select()
            .maybeSingle()
          if (legacyError) throw legacyError
          return { data: legacyData, error: null }
        } catch (fallbackErr) {
          console.error('Audit log legacy fallback failed:', fallbackErr)
          throw error
        }
      }
      throw error
    }

    return { data, error: null }
  } catch (error) {
    console.error('Error creating audit log:', error)
    return { data: null, error }
  }
}

export async function getAuditLogs(
  resourceType?: string,
  resourceId?: string,
  limit: number = 50
) {
  const supabase = getSupabaseAdmin()

  try {
    let query = supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (resourceType) {
      query = query.eq('resource_type', resourceType)
    }

    if (resourceId) {
      query = query.eq('resource_id', resourceId)
    }

    const { data, error } = await query

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return { data: null, error }
  }
}
