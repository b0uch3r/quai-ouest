'use client'

import { CalendarDays, Users, TrendingUp, AlertCircle } from 'lucide-react'
import { StatsCard } from '@/components/ui/StatsCard'
import { ReservationFilters } from '@/components/reservations/ReservationFilters'
import { ReservationTable } from '@/components/reservations/ReservationTable'
import { ExportPanel } from '@/components/reservations/ExportPanel'
import { useReservations } from '@/hooks/useReservations'
import { formatCurrency } from '@/lib/utils'

export default function DashboardPage() {
  const {
    data: reservations,
    total,
    filters,
    updateFilters,
    loading,
    error,
  } = useReservations()

  // Quick stats from loaded data
  const todayStr = new Date().toISOString().split('T')[0]
  const todayCount = reservations.filter((r) => r.reservation_date === todayStr).length
  const pendingCount = reservations.filter((r) => r.status === 'pending').length
  const totalRevenue = reservations.reduce((sum, r) => sum + (r.amount_cents || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-bleu-baie dark:text-blanc-ecume">
          Tableau de bord
        </h1>
        <p className="text-sm text-granit mt-1">Vue d'ensemble des réservations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Réservations totales"
          value={total}
          icon={CalendarDays}
        />
        <StatsCard
          label="Aujourd'hui"
          value={todayCount}
          icon={Users}
        />
        <StatsCard
          label="En attente"
          value={pendingCount}
          icon={AlertCircle}
        />
        <StatsCard
          label="Chiffre d'affaires"
          value={formatCurrency(totalRevenue)}
          icon={TrendingUp}
        />
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
        />
      )}

      {/* Export */}
      <ExportPanel filters={filters} />
    </div>
  )
}
