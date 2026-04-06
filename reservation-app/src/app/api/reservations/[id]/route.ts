import { NextRequest, NextResponse } from 'next/server'
import { noteSchema, reservationUpdateSchema } from '@/lib/validations'
import { createClient, createServiceClient } from '@/lib/supabase-server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('reservations')
    .select('*, client:clients(*), notes:reservation_notes(*, author:staff_profiles(full_name))')
    .eq('id', id)
    .single()

  if (error) {
    return NextResponse.json({ error: 'Reservation introuvable' }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = reservationUpdateSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const updates: Record<string, unknown> = {
    ...parsed.data,
    updated_at: new Date().toISOString(),
  }

  if (parsed.data.status) {
    updates.cancelled_at = parsed.data.status === 'cancelled' ? new Date().toISOString() : null
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('reservations')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Reservation update error:', error.message)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
  }

  const { data: profile } = await authClient
    .from('staff_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['owner', 'manager'].includes(profile.role)) {
    return NextResponse.json({ error: 'Permissions insuffisantes' }, { status: 403 })
  }

  const supabase = createServiceClient()

  await supabase
    .from('reservation_notes')
    .delete()
    .eq('reservation_id', id)

  const { error } = await supabase
    .from('reservations')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Reservation delete error:', error.message)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = noteSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('reservation_notes')
    .insert({
      reservation_id: id,
      author_id: user.id,
      content: parsed.data.content,
    })
    .select('*, author:staff_profiles(full_name)')
    .single()

  if (error) {
    console.error('Note insert error:', error.message)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
