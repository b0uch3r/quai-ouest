'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowUpDown, Eye, Check, X, Loader2, Utensils } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Pagination } from '@/components/ui/Pagination'
import { formatDate, formatCurrency, getInitials, cn } from '@/lib/utils'
import type { Reservation, ReservationFilters, ReservationStatus } from '@/types'
import { SERVICE_LABELS, STATUS_LABELS } from '@/types'

const BTN_BASE = 'inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors'

function StatusActions({
  reservation,
  updatingId,
  onStatusChange,
}: {
  reservation: Reservation
  updatingId: string | null
  onStatusChange: (id: string, status: ReservationStatus) => void
}) {
  const { id, status } = reservation
  const isUpdating = updatingId === id
  const clientName = reservation.client?.full_name || 'cette réservation'

  if (isUpdating) {
    return <Loader2 className="w-4 h-4 animate-spin text-granit" aria-label="Mise à jour en cours" />
  }

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {(status === 'pending' || status === 'cancelled') && (
        <button
          onClick={(e) => { e.preventDefault(); onStatusChange(id, 'confirmed') }}
          className={cn(BTN_BASE, 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-800/60')}
          aria-label={`Confirmer ${clientName}`}
        >
          <Check className="w-3 h-3" />
          Confirmer
        </button>
      )}
      {status === 'confirmed' && (
        <button
          onClick={(e) => { e.preventDefault(); onStatusChange(id, 'seated') }}
          className={cn(BTN_BASE, 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:hover:bg-purple-800/60')}
          aria-label={`Passer en cours ${clientName}`}
        >
          <Utensils className="w-3 h-3" />
          En cours
        </button>
      )}
      {(status === 'pending' || status === 'confirmed' || status === 'seated') && (
        <button
          onClick={(e) => { e.preventDefault(); onStatusChange(id, 'cancelled') }}
          className={cn(BTN_BASE, 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300 dark:hover:bg-red-800/60')}
          aria-label={`Annuler ${clientName}`}
        >
          <X className="w-3 h-3" />
          Annuler
        </button>
      )}
    </div>
  )
}

function SortHeader({
  field,
  activeSort,
  children,
  onSort,
}: {
  field: string
  activeSort: string
  children: React.ReactNode
  onSort: (field: string) => void
}) {
  return (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-1 text-xs font-medium text-granit uppercase tracking-wider hover:text-ardoise dark:hover:text-blanc-ecume"
      aria-label={`Trier par ${typeof children === 'string' ? children : field}`}
    >
      {children}
      <ArrowUpDown className="w-3 h-3" />
    </button>
  )
}

interface ReservationTableProps {
  reservations: Reservation[]
  total: number
  filters: ReservationFilters
  onFiltersChange: (filters: Partial<ReservationFilters>) => void
  onStatusChange?: (id: string, status: ReservationStatus) => Promise<void>
}

export function ReservationTable({
  reservations,
  total,
  filters,
  onFiltersChange,
  onStatusChange,
}: ReservationTableProps) {
  const totalPages = Math.ceil(total / filters.limit)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleStatusChange = useCallback(async (id: string, status: ReservationStatus) => {
    if (!onStatusChange || updatingId) return
    setUpdatingId(id)
    try {
      await onStatusChange(id, status)
    } finally {
      setUpdatingId(null)
    }
  }, [onStatusChange, updatingId])

  const toggleSort = useCallback((field: string) => {
    if (filters.sort === field) {
      onFiltersChange({ order: filters.order === 'asc' ? 'desc' : 'asc' })
    } else {
      onFiltersChange({ sort: field, order: 'desc' })
    }
  }, [filters.sort, filters.order, onFiltersChange])

  if (reservations.length === 0) {
    return (
      <div className="card p-12 text-center">
        <p className="text-granit">Aucune réservation trouvée</p>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-sable dark:border-granit/30">
              <th className="text-left p-4" scope="col"><SortHeader field="reservation_date" activeSort={filters.sort} onSort={toggleSort}>Date</SortHeader></th>
              <th className="text-left p-4" scope="col"><span className="text-xs font-medium text-granit uppercase tracking-wider">Client</span></th>
              <th className="text-left p-4" scope="col"><span className="text-xs font-medium text-granit uppercase tracking-wider">Service</span></th>
              <th className="text-left p-4" scope="col"><SortHeader field="guests_count" activeSort={filters.sort} onSort={toggleSort}>Couverts</SortHeader></th>
              <th className="text-left p-4" scope="col"><span className="text-xs font-medium text-granit uppercase tracking-wider">Statut</span></th>
              <th className="text-left p-4" scope="col"><SortHeader field="amount_cents" activeSort={filters.sort} onSort={toggleSort}>Montant</SortHeader></th>
              {onStatusChange && <th className="text-left p-4" scope="col"><span className="text-xs font-medium text-granit uppercase tracking-wider">Actions</span></th>}
              <th className="text-right p-4" scope="col"><span className="sr-only">Détails</span></th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr
                key={r.id}
                className="border-b border-sable/50 dark:border-granit/20 hover:bg-sable/20 dark:hover:bg-granit/10 transition-colors"
              >
                <td className="p-4 text-sm font-medium">{formatDate(r.reservation_date)}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-bleu-baie/10 dark:bg-bleu-baie/30 flex items-center justify-center text-xs font-medium text-bleu-baie dark:text-blanc-ecume">
                      {r.client ? getInitials(r.client.full_name) : '?'}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{r.client?.full_name || 'Anonyme'}</p>
                      {r.client?.email && (
                        <p className="text-xs text-granit">{r.client.email}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm">{SERVICE_LABELS[r.service]}</td>
                <td className="p-4 text-sm">{r.guests_count}</td>
                <td className="p-4"><StatusBadge status={r.status} /></td>
                <td className="p-4 text-sm">{formatCurrency(r.amount_cents)}</td>
                {onStatusChange && (
                  <td className="p-4">
                    <StatusActions reservation={r} updatingId={updatingId} onStatusChange={handleStatusChange} />
                  </td>
                )}
                <td className="p-4 text-right">
                  <Link
                    href={`/dashboard/reservations/${r.id}`}
                    className="inline-flex items-center gap-1 text-sm text-cognac hover:underline"
                    aria-label={`Voir détails ${r.client?.full_name || 'réservation'}`}
                  >
                    <Eye className="w-4 h-4" />
                    Voir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-sable dark:divide-granit/30">
        {reservations.map((r) => (
          <div key={r.id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-sm">{r.client?.full_name || 'Anonyme'}</p>
              <StatusBadge status={r.status} />
            </div>
            <div className="flex items-center gap-4 text-xs text-granit mb-3">
              <span>{formatDate(r.reservation_date)}</span>
              <span>{SERVICE_LABELS[r.service]}</span>
              <span>{r.guests_count} pers.</span>
              {r.amount_cents && <span className="ml-auto font-medium text-ardoise dark:text-blanc-ecume">{formatCurrency(r.amount_cents)}</span>}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {onStatusChange && (
                <StatusActions reservation={r} updatingId={updatingId} onStatusChange={handleStatusChange} />
              )}
              <Link
                href={`/dashboard/reservations/${r.id}`}
                className="ml-auto inline-flex items-center gap-1 text-xs text-cognac hover:underline"
                aria-label={`Voir détails ${r.client?.full_name || 'réservation'}`}
              >
                <Eye className="w-3 h-3" />
                Voir
              </Link>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        page={filters.page}
        totalPages={totalPages}
        onPageChange={(page) => onFiltersChange({ page })}
      />
    </div>
  )
}
