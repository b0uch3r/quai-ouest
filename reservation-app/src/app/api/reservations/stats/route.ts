import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import type { ReservationStats, ReservationStatus, ServiceType } from '@/types'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { data: reservations, error } = await supabase
    .from('reservations')
    .select('status, service, guests_count, amount_cents, reservation_date')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const all = reservations || []

  const byStatus = {} as Record<ReservationStatus, number>
  const byService = {} as Record<ServiceType, number>
  const byMonth = new Map<string, { count: number; revenue_cents: number }>()
  let totalRevenue = 0
  let totalGuests = 0
  let noShowCount = 0
  const clientIds = new Set<string>()

  for (const r of all) {
    // By status
    byStatus[r.status as ReservationStatus] = (byStatus[r.status as ReservationStatus] || 0) + 1
    // By service
    byService[r.service as ServiceType] = (byService[r.service as ServiceType] || 0) + 1
    // Revenue
    totalRevenue += r.amount_cents || 0
    totalGuests += r.guests_count
    if (r.status === 'no_show') noShowCount++
    // By month
    const month = r.reservation_date.slice(0, 7) // YYYY-MM
    const m = byMonth.get(month) || { count: 0, revenue_cents: 0 }
    m.count++
    m.revenue_cents += r.amount_cents || 0
    byMonth.set(month, m)
  }

  const { count: clientCount } = await supabase
    .from('clients')
    .select('id', { count: 'exact', head: true })

  const stats: ReservationStats = {
    total_reservations: all.length,
    total_clients: clientCount || 0,
    total_revenue_cents: totalRevenue,
    by_status: byStatus,
    by_service: byService,
    by_month: Array.from(byMonth.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({ month, ...data })),
    avg_guests: all.length ? Math.round((totalGuests / all.length) * 10) / 10 : 0,
    no_show_rate: all.length ? Math.round((noShowCount / all.length) * 1000) / 10 : 0,
  }

  return NextResponse.json(stats)
}
