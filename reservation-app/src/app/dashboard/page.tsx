'use client'

import { useState, useEffect, useCallback } from 'react'
import { CalendarDays, Users, TrendingUp, AlertCircle, Clock, Calendar, Inbox } from 'lucide-react'
import { StatsCard } from '@/components/ui/StatsCard'
import { useToast } from '@/components/ui/Toast'
import { ReservationFilters } from '@/components/reservations/ReservationFilters'
import { ReservationTable } from '@/components/reservations/ReservationTable'
import { ExportPanel } from '@/components/reservations/ExportPanel'
import { useReservations } from '@/hooks/useReservations'
import { formatCurrency, cn } from '@/lib/utils'
import { STATUS_LABELS } from '@/types'
import type { ReservationStats, ReservationStatus } from '@/types'

const todayStr = new Date().toISOString().split('T')[0]

function getWeekRange() {
  const now = new Date()
  const day = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1))
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return {
    from: monday.toISOString().split('T')[0],
    to: sunday.toISOString().split('T')[0],
  }
}

type QuickFilter = 'all' | 'today' | 'week' | 'pending'

export default function DashboardPage() {
  const {
    data: reservations,
    total,
    filters,
    updateFilters,
    loading,
    error,
    updateStatus,
  } = useReservations()

  const { toast } = useToast()
  const [stats, setStats] = useState<ReservationStats | null>(null)
  const [activeQuick, setActiveQuick] = useState<QuickFilter>('all')

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/reservations/stats')
      if (res.ok) setStats(await res.json())
    } catch {
      // Stats are non-critical
    }
  }, [])

  useEffect(() => { fetchStats() }, [fetchStats])

  const handleStatusChange = useCallback(async (id: string, newStatus: ReservationStatus) => {
    try {
      await updateStatus(id, newStatus)
      const label = STATUS_LABELS[newStatus]
      const reservation = reservations.find((r) => r.id === id)
      const name = reservation?.client?.full_name || 'Réservation'
      toast(`${name} : ${label}`)
      fetchStats()
    } catch {
      toast('Erreur lors de la mise à jour', 'error')
    }
  }, [updateStatus, fetchStats, toast, reservations])

  function applyQuickFilter(filter: QuickFilter) {
    setActiveQuick(filter)
    const week = getWeekRange()
    switch (filter) {
      case 'today':
        updateFilters({ date_from: todayStr, date_to: todayStr, status: undefined, page: 1 })
        break
      case 'week':
        updateFilters({ date_from: week.from, date_to: week.to, status: undefined, page: 1 })
        break
      case 'pending':
        updateFilters({ status: ['pending'], date_from: undefined, date_to: undefined, page: 1 })
        break
      default:
        updateFilters({ status: undefined, date_from: undefined, date_to: undefined, page: 1 })
    }
  }

  const todayCount = reservations.filter((r) => r.reservation_date === todayStr).length

  const quickFilters: { key: QuickFilter; label: string; icon: React.ElementType }[] = [
    { key: 'all', label: 'Tout', icon: CalendarDays },
    { key: 'today', label: "Aujourd'hui", icon: Clock },
    { key: 'week', label: 'Cette semaine', icon: Calendar },
    { key: 'pending', label: 'En attente', icon: Inbox },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-bleu-baie dark:text-blanc-ecume">
          Tableau de bord
        </h1>
        <p className="text-sm text-granit mt-1">Vue d&apos;ensemble des réservations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Réservations totales"
          value={stats?.total_reservations ?? total}
          icon={CalendarDays}
        />
        <StatsCard
          label="Aujourd'hui"
          value={todayCount}
          icon={Users}
        />
        <StatsCard
          label="En attente"
          value={stats?.by_status?.pending ?? 0}
          icon={AlertCircle}
        />
        <StatsCard
          label="Chiffre d'affaires"
          value={formatCurrency(stats?.total_revenue_cents ?? 0)}
          icon={TrendingUp}
        />
      </div>

      {/* Quick filters */}
      <div className="flex gap-2 flex-wrap">
        {quickFilters.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => applyQuickFilter(key)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
              activeQuick === key
                ? 'bg-cognac text-white'
                : 'bg-sable/50 dark:bg-granit/20 text-ardoise dark:text-blanc-ecume hover:bg-sable dark:hover:bg-granit/30'
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <ReservationFilters filters={filters} onChange={updateFilters} />

      {/* Error state */}
      {error && (
        <div className="card p-4 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="card p-12 text-center">
          <div className="inline-block w-6 h-6 border-2 border-cognac/30 border-t-cognac rounded-full animate-spin" />
          <p className="text-sm text-granit mt-3">Chargement...</p>
        </div>
      ) : (
        <ReservationTable
          reservations={reservations}
          total={total}
          filters={filters}
          onFiltersChange={updateFilters}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Export */}
      <ExportPanel filters={filters} />
    </div>
  )
}
