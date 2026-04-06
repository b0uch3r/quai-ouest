import { NextRequest, NextResponse } from 'next/server'
import { buildReservationsPdf, type ReservationExportRow } from '@/lib/reservation-export'
import { createClient } from '@/lib/supabase-server'
import { exportSchema } from '@/lib/validations'

type ExportQueryRecord = {
  reservation_date: string
  service: 'midi' | 'soir'
  time_slot: string | null
  guests_count: number
  status: ReservationExportRow['status']
  amount_cents: number | null
  special_requests: string | null
  staff_notes: string | null
  client:
    | {
        full_name: string
        email: string | null
        phone: string | null
      }
    | Array<{
        full_name: string
        email: string | null
        phone: string | null
      }>
    | null
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
  }

  const params = request.nextUrl.searchParams
  const parsed = exportSchema.safeParse({
    format: params.get('format') || 'csv',
    date_from: params.get('date_from') || undefined,
    date_to: params.get('date_to') || undefined,
    status: params.get('status') || undefined,
  })

  if (!parsed.success) {
    return NextResponse.json({ error: 'Parametres invalides' }, { status: 400 })
  }

  let query = supabase
    .from('reservations')
    .select('reservation_date, service, time_slot, guests_count, status, amount_cents, special_requests, staff_notes, client:clients(full_name, email, phone)')
    .order('reservation_date', { ascending: false })

  if (parsed.data.date_from) {
    query = query.gte('reservation_date', parsed.data.date_from)
  }

  if (parsed.data.date_to) {
    query = query.lte('reservation_date', parsed.data.date_to)
  }

  if (parsed.data.status) {
    query = query.in('status', parsed.data.status.split(','))
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const reservations = normalizeReservationsForExport(data)

  if (parsed.data.format === 'csv') {
    const csv = buildReservationsCsv(reservations)

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="reservations-${buildDateStamp()}.csv"`,
      },
    })
  }

  const pdfBytes = await buildReservationsPdf({
    reservations,
    filters: {
      date_from: parsed.data.date_from,
      date_to: parsed.data.date_to,
      status: parsed.data.status,
    },
  })

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="reservations-${buildDateStamp()}.pdf"`,
    },
  })
}

function normalizeReservationsForExport(data: unknown): ReservationExportRow[] {
  if (!Array.isArray(data)) {
    return []
  }

  return data.map((entry) => {
    const record = entry as ExportQueryRecord
    const client = Array.isArray(record.client) ? record.client[0] : record.client

    return {
      reservation_date: record.reservation_date,
      service: record.service,
      time_slot: record.time_slot,
      guests_count: record.guests_count,
      status: record.status,
      amount_cents: record.amount_cents,
      special_requests: record.special_requests,
      staff_notes: record.staff_notes,
      client: client
        ? {
            full_name: client.full_name,
            email: client.email,
            phone: client.phone,
          }
        : null,
    }
  })
}

function buildReservationsCsv(reservations: ReservationExportRow[]) {
  const headers = [
    'Date',
    'Service',
    'Client',
    'Email',
    'Telephone',
    'Couverts',
    'Statut',
    'Montant (EUR)',
    'Demandes speciales',
    'Notes staff',
  ]

  const rows = reservations.map((reservation) =>
    [
      reservation.reservation_date,
      reservation.service,
      reservation.client?.full_name || '',
      reservation.client?.email || '',
      reservation.client?.phone || '',
      reservation.guests_count,
      reservation.status,
      reservation.amount_cents !== null ? (reservation.amount_cents / 100).toFixed(2) : '',
      reservation.special_requests || '',
      reservation.staff_notes || '',
    ]
      .map(escapeCsvValue)
      .join(','),
  )

  return [headers.join(','), ...rows].join('\n')
}

function escapeCsvValue(value: string | number) {
  return `"${String(value).replace(/"/g, '""')}"`
}

function buildDateStamp() {
  return new Date().toISOString().split('T')[0]
}
