'use client'

import { useCallback, useEffect, useState } from 'react'
import { CalendarDays, Users, TrendingUp, AlertCircle } from 'lucide-react'
import { StatsCard } from '@/components/ui/StatsCard'
import { ReservationFilters } from '@/components/reservations/ReservationFilters'
import { ReservationTable } from '@/components/reservations/ReservationTable'
import { ExportPanel } from '@/components/reservations/ExportPanel'
import { DeleteByPeriod } from '@/components/reservations/DeleteByPeriod'
import { useReservations } from '@/hooks/useReservations'
import { useToast } from '@/components/ui/Toast'
import { formatCurrency } from '@/lib/utils'
import type { ReservationStats, ReservationStatus } from '@/types'

export default function DashboardPage() {
  const {
    data: reservations,
    total,
    filters,
    updateFilters,
    loading,
    error,
    updateStatus,
    deleteReservation,
    deleteByPeriod,
    countByPeriod,
  } = useReservations()

  const { showToast } = useToast()
  const [stats, setStats] = useState<ReservationStats | null>(null)

  const loadStats = useCallback(async () => {
    try {
      const response = await fetch('/api/reservations/stats', { cache: 'no-store' })
      if (!response.ok) return

      const nextStats = await response.json() as ReservationStats
      setStats(nextStats)
    } catch {
      // Keep the dashboard responsive with local fallback values.
    }
  }, [])

  useEffect(() => {
    void loadStats()
  }, [loadStats])

  const todayStr = new Date().toISOString().split('T')[0]
  const localTodayCount = reservations.filter((r) => r.reservation_date === todayStr).length
  const localPendingCount = reservations.filter((r) => r.status === 'pending').length
  const localRevenue = reservations.reduce((sum, r) => sum + (r.amount_cents || 0), 0)

  const totalReservations = stats?.total_reservations ?? total
  const todayCount = stats?.today_reservations ?? localTodayCount
  const pendingCount = stats?.by_status?.pending ?? localPendingCount
  const totalRevenue = stats?.total_revenue_cents ?? localRevenue

  const handleStatusChange = useCallback(async (id: string, status: ReservationStatus) => {
    await updateStatus(id, status)
    void loadStats()
  }, [loadStats, updateStatus])

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteReservation(id)
      void loadStats()
      showToast('success', '1 reservation supprimee avec succes')
    } catch {
      showToast('error', 'Erreur lors de la suppression de la reservation')
      throw new Error('Delete failed')
    }
  }, [deleteReservation, loadStats, showToast])

  const handleDeleteByPeriod = useCallback(async (dateFrom: string, dateTo: string) => {
    const deletedCount = await deleteByPeriod(dateFrom, dateTo)
    void loadStats()
    return deletedCount
  }, [deleteByPeriod, loadStats])

  const handlePeriodSuccess = useCallback((count: number) => {
    showToast('success', `${count} reservation${count > 1 ? 's' : ''} supprimee${count > 1 ? 's' : ''} avec succes`)
  }, [showToast])

  const handlePeriodError = useCallback((message: string) => {
    showToast('error', message)
  }, [showToast])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-bleu-baie dark:text-blanc-ecume">
          Tableau de bord
        </h1>
        <p className="text-sm text-granit mt-1">Vue d'ensemble des reservations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Reservations totales"
          value={totalReservations}
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

      {/* Delete by period */}
      <DeleteByPeriod
        onDelete={handleDeleteByPeriod}
        onCount={countByPeriod}
        onSuccess={handlePeriodSuccess}
        onError={handlePeriodError}
      />

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
          onDelete={handleDelete}
        />
      )}

      {/* Export */}
      <ExportPanel filters={filters} />
    </div>
  )
}
