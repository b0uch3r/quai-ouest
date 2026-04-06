import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase-server'

async function getAuthorizedManager() {
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    return { error: NextResponse.json({ error: 'Non autorise' }, { status: 401 }) }
  }

  const { data: profile } = await authClient
    .from('staff_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['owner', 'manager'].includes(profile.role)) {
    return { error: NextResponse.json({ error: 'Permissions insuffisantes' }, { status: 403 }) }
  }

  return { authClient }
}

export async function POST(request: NextRequest) {
  const authorization = await getAuthorizedManager()
  if (authorization.error) return authorization.error

  const body = await request.json()
  const { date_from: dateFrom, date_to: dateTo } = body

  if (!dateFrom || !dateTo) {
    return NextResponse.json({ error: 'Les dates de debut et fin sont requises' }, { status: 400 })
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(dateFrom) || !dateRegex.test(dateTo)) {
    return NextResponse.json({ error: 'Format de date invalide' }, { status: 400 })
  }

  if (dateFrom > dateTo) {
    return NextResponse.json(
      { error: 'La date de debut doit etre anterieure a la date de fin' },
      { status: 400 }
    )
  }

  const authClient = authorization.authClient
  const { count, error: countError } = await authClient
    .from('reservations')
    .select('id', { count: 'exact', head: true })
    .gte('reservation_date', dateFrom)
    .lte('reservation_date', dateTo)

  if (countError) {
    console.error('Count error:', countError.message)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }

  if (!count || count === 0) {
    return NextResponse.json(
      { error: 'Aucune reservation trouvee pour cette periode' },
      { status: 404 }
    )
  }

  const { data: toDelete } = await authClient
    .from('reservations')
    .select('id')
    .gte('reservation_date', dateFrom)
    .lte('reservation_date', dateTo)

  const supabase = createServiceClient()

  if (toDelete && toDelete.length > 0) {
    const ids = toDelete.map((reservation) => reservation.id)
    await supabase
      .from('reservation_notes')
      .delete()
      .in('reservation_id', ids)
  }

  const { error: deleteError } = await supabase
    .from('reservations')
    .delete()
    .gte('reservation_date', dateFrom)
    .lte('reservation_date', dateTo)

  if (deleteError) {
    console.error('Period delete error:', deleteError.message)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }

  return NextResponse.json({ success: true, deleted: count })
}

export async function GET(request: NextRequest) {
  const authorization = await getAuthorizedManager()
  if (authorization.error) return authorization.error

  const params = request.nextUrl.searchParams
  const dateFrom = params.get('date_from')
  const dateTo = params.get('date_to')

  if (!dateFrom || !dateTo) {
    return NextResponse.json({ count: 0 })
  }

  const { count, error } = await authorization.authClient
    .from('reservations')
    .select('id', { count: 'exact', head: true })
    .gte('reservation_date', dateFrom)
    .lte('reservation_date', dateTo)

  if (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }

  return NextResponse.json({ count: count || 0 })
}
