import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const params = request.nextUrl.searchParams
  const page = parseInt(params.get('page') || '1')
  const limit = Math.min(parseInt(params.get('limit') || '20'), 100)
  const sort = params.get('sort') || 'reservation_date'
  const order = params.get('order') || 'desc'
  const status = params.get('status')
  const dateFrom = params.get('date_from')
  const dateTo = params.get('date_to')
  const service = params.get('service')
  const q = params.get('q')

  // Whitelist sortable columns
  const allowedSorts = ['reservation_date', 'guests_count', 'amount_cents', 'created_at', 'status']
  const safeSort = allowedSorts.includes(sort) ? sort : 'reservation_date'

  let query = supabase
    .from('reservations')
    .select('*, client:clients(*)', { count: 'exact' })

  if (status) {
    query = query.in('status', status.split(','))
  }
  if (dateFrom) {
    query = query.gte('reservation_date', dateFrom)
  }
  if (dateTo) {
    query = query.lte('reservation_date', dateTo)
  }
  if (service) {
    query = query.eq('service', service)
  }
  if (q) {
    // Sanitize : échapper les caractères spéciaux SQL/ilike pour éviter l'injection wildcard
    const sanitizedQ = q.replace(/[%_\\]/g, '\\$&').slice(0, 100)
    query = query.or(
      `special_requests.ilike.%${sanitizedQ}%,staff_notes.ilike.%${sanitizedQ}%`
    )
  }

  query = query.order(safeSort, { ascending: order === 'asc' })

  const from = (page - 1) * limit
  query = query.range(from, from + limit - 1)

  const { data, count, error } = await query

  if (error) {
    console.error('Reservations list error:', error.message)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }

  return NextResponse.json({
    data,
    total: count || 0,
    page,
    limit,
    total_pages: Math.ceil((count || 0) / limit),
  })
}
