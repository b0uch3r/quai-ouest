import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  // Verify role is owner or manager
  const { data: profile } = await supabase
    .from('staff_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['owner', 'manager'].includes(profile.role)) {
    return NextResponse.json({ error: 'Permissions insuffisantes' }, { status: 403 })
  }

  const body = await request.json()
  const { date_from, date_to } = body

  if (!date_from || !date_to) {
    return NextResponse.json({ error: 'Les dates de début et fin sont requises' }, { status: 400 })
  }

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(date_from) || !dateRegex.test(date_to)) {
    return NextResponse.json({ error: 'Format de date invalide' }, { status: 400 })
  }

  if (date_from > date_to) {
    return NextResponse.json({ error: 'La date de début doit être antérieure à la date de fin' }, { status: 400 })
  }

  // First count how many will be deleted
  const { count, error: countError } = await supabase
    .from('reservations')
    .select('id', { count: 'exact', head: true })
    .gte('reservation_date', date_from)
    .lte('reservation_date', date_to)

  if (countError) {
    console.error('Count error:', countError.message)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }

  if (!count || count === 0) {
    return NextResponse.json({ error: 'Aucune réservation trouvée pour cette période' }, { status: 404 })
  }

  // Get IDs of reservations to delete (for cleaning up notes)
  const { data: toDelete } = await supabase
    .from('reservations')
    .select('id')
    .gte('reservation_date', date_from)
    .lte('reservation_date', date_to)

  if (toDelete && toDelete.length > 0) {
    const ids = toDelete.map((r) => r.id)
    // Delete associated notes
    await supabase
      .from('reservation_notes')
      .delete()
      .in('reservation_id', ids)
  }

  // Delete reservations in the period
  const { error: deleteError } = await supabase
    .from('reservations')
    .delete()
    .gte('reservation_date', date_from)
    .lte('reservation_date', date_to)

  if (deleteError) {
    console.error('Period delete error:', deleteError.message)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }

  return NextResponse.json({ success: true, deleted: count })
}

// GET: Count reservations in a period (for preview before deletion)
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const params = request.nextUrl.searchParams
  const dateFrom = params.get('date_from')
  const dateTo = params.get('date_to')

  if (!dateFrom || !dateTo) {
    return NextResponse.json({ count: 0 })
  }

  const { count, error } = await supabase
    .from('reservations')
    .select('id', { count: 'exact', head: true })
    .gte('reservation_date', dateFrom)
    .lte('reservation_date', dateTo)

  if (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }

  return NextResponse.json({ count: count || 0 })
}
