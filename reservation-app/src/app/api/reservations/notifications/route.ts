import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

/**
 * GET /api/reservations/notifications
 *
 * Liste les logs de notification pour le dashboard staff.
 * Permet de voir les emails envoyés, échoués, ou simulés.
 *
 * Query params:
 *   - status: 'sent' | 'failed' | 'simulated' (optionnel)
 *   - limit: nombre (défaut: 50, max: 200)
 *   - page: nombre (défaut: 1)
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient()

  // Vérifier l'authentification staff
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200)
  const page = Math.max(parseInt(searchParams.get('page') || '1'), 1)
  const offset = (page - 1) * limit

  // Requête avec jointure sur reservations → clients
  let query = supabase
    .from('notification_log')
    .select(`
      id,
      reservation_id,
      recipient_email,
      notification_type,
      status,
      provider_message_id,
      error_message,
      duration_ms,
      created_at,
      reservations!inner (
        reservation_date,
        service,
        guests_count,
        clients (
          full_name
        )
      )
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status && ['sent', 'failed', 'simulated'].includes(status)) {
    query = query.eq('status', status)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('[NOTIFICATIONS] Erreur requête:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }

  // Stats résumées
  const { data: stats } = await supabase
    .from('notification_log')
    .select('status')

  const summary = {
    total: stats?.length || 0,
    sent: stats?.filter(s => s.status === 'sent').length || 0,
    failed: stats?.filter(s => s.status === 'failed').length || 0,
    simulated: stats?.filter(s => s.status === 'simulated').length || 0,
  }

  return NextResponse.json({
    data,
    total: count || 0,
    page,
    limit,
    total_pages: Math.ceil((count || 0) / limit),
    summary,
  })
}
