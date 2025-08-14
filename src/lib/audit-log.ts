import { supabaseAdmin } from './supabase-admin'

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
  const supabase = supabaseAdmin

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

    if (error) throw error

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
  const supabase = supabaseAdmin

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
