import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import type { ReservationStats, ReservationStatus, ServiceType } from '@/types'

function normalizeStats(payload: unknown): ReservationStats | null {
  if (!payload || typeof payload !== 'object') return null

  const stats = payload as Partial<ReservationStats>

  return {
    total_reservations: Number(stats.total_reservations || 0),
    today_reservations: Number(stats.today_reservations || 0),
    total_clients: Number(stats.total_clients || 0),
    total_revenue_cents: Number(stats.total_revenue_cents || 0),
    by_status: (stats.by_status || {}) as Record<ReservationStatus, number>,
    by_service: (stats.by_service || {}) as Record<ServiceType, number>,
    by_month: Array.isArray(stats.by_month) ? stats.by_month : [],
    avg_guests: Number(stats.avg_guests || 0),
    no_show_rate: Number(stats.no_show_rate || 0),
  }
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorise' }, { status: 401 })

  const { data: rpcStats, error: rpcError } = await supabase.rpc('get_reservation_stats')
  const normalizedStats = normalizeStats(rpcStats)

  if (!rpcError && normalizedStats) {
    return NextResponse.json(normalizedStats)
  }

  if (rpcError) {
    console.warn('[stats] RPC fallback:', rpcError.message)
  }

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
  let todayReservations = 0
  const todayStr = new Date().toISOString().slice(0, 10)

  for (const reservation of all) {
    byStatus[reservation.status as ReservationStatus] =
      (byStatus[reservation.status as ReservationStatus] || 0) + 1
    byService[reservation.service as ServiceType] =
      (byService[reservation.service as ServiceType] || 0) + 1

    totalRevenue += reservation.amount_cents || 0
    totalGuests += reservation.guests_count

    if (reservation.status === 'no_show') noShowCount++
    if (reservation.reservation_date === todayStr) todayReservations++

    const month = reservation.reservation_date.slice(0, 7)
    const monthStats = byMonth.get(month) || { count: 0, revenue_cents: 0 }
    monthStats.count++
    monthStats.revenue_cents += reservation.amount_cents || 0
    byMonth.set(month, monthStats)
  }

  const { count: clientCount } = await supabase
    .from('clients')
    .select('id', { count: 'exact', head: true })
    .is('deletion_requested_at', null)

  const stats: ReservationStats = {
    total_reservations: all.length,
    today_reservations: todayReservations,
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
