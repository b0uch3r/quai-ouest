import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { exportSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const params = request.nextUrl.searchParams
  const parsed = exportSchema.safeParse({
    format: params.get('format') || 'csv',
    date_from: params.get('date_from') || undefined,
    date_to: params.get('date_to') || undefined,
    status: params.get('status') || undefined,
  })

  if (!parsed.success) {
    return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 })
  }

  let query = supabase
    .from('reservations')
    .select('*, client:clients(full_name, email, phone)')
    .order('reservation_date', { ascending: false })

  if (parsed.data.date_from) query = query.gte('reservation_date', parsed.data.date_from)
  if (parsed.data.date_to) query = query.lte('reservation_date', parsed.data.date_to)
  if (parsed.data.status) query = query.in('status', parsed.data.status.split(','))

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (parsed.data.format === 'csv') {
    const headers = ['Date', 'Service', 'Client', 'Email', 'Téléphone', 'Couverts', 'Statut', 'Montant (€)', 'Demandes spéciales', 'Notes staff']
    const rows = (data || []).map((r: Record<string, unknown>) => {
      const client = r.client as Record<string, string> | null
      return [
        r.reservation_date,
        r.service,
        client?.full_name || '',
        client?.email || '',
        client?.phone || '',
        r.guests_count,
        r.status,
        r.amount_cents ? ((r.amount_cents as number) / 100).toFixed(2) : '',
        (r.special_requests as string || '').replace(/"/g, '""'),
        (r.staff_notes as string || '').replace(/"/g, '""'),
      ].map((v) => `"${v}"`).join(',')
    })

    const csv = [headers.join(','), ...rows].join('\n')
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="reservations.csv"`,
      },
    })
  }

  // For PDF, return JSON data — client-side jsPDF handles rendering
  return NextResponse.json({ data })
}
