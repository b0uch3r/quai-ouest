'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpDown, Eye, Loader2, Trash2 } from 'lucide-react'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { StatusSelect } from '@/components/ui/StatusSelect'
import { Pagination } from '@/components/ui/Pagination'
import { formatDate, formatCurrency, getInitials } from '@/lib/utils'
import type { Reservation, ReservationFilters, ReservationStatus } from '@/types'
import { SERVICE_LABELS } from '@/types'

interface ReservationTableProps {
  reservations: Reservation[]
  total: number
  filters: ReservationFilters
  onFiltersChange: (filters: Partial<ReservationFilters>) => void
  onStatusChange?: (id: string, status: ReservationStatus) => Promise<void>
  onDelete?: (id: string) => Promise<void>
}

export function ReservationTable({
  reservations,
  total,
  filters,
  onFiltersChange,
  onStatusChange,
  onDelete,
}: ReservationTableProps) {
  const totalPages = Math.ceil(total / filters.limit)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Reservation | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function handleStatusChange(id: string, status: ReservationStatus) {
    if (!onStatusChange || updatingId) return
    setUpdatingId(id)
    try {
      await onStatusChange(id, status)
    } finally {
      setUpdatingId(null)
    }
  }

  function StatusActions({ reservation }: { reservation: Reservation }) {
    if (!onStatusChange) return null
    const { id, status } = reservation
    const isUpdating = updatingId === id

    return (
      <div className="flex items-center gap-2">
        <StatusSelect
          value={status}
          compact
          disabled={isUpdating}
          onChange={(nextStatus) => {
            if (nextStatus !== status) {
              void handleStatusChange(id, nextStatus)
            }
          }}
        />
        {isUpdating && <Loader2 className="w-4 h-4 animate-spin text-granit" />}
      </div>
    )
  }

  async function handleDelete() {
    if (!onDelete || !deleteTarget || deleting) return
    setDeleting(true)
    try {
      await onDelete(deleteTarget.id)
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  function toggleSort(field: string) {
    if (filters.sort === field) {
      onFiltersChange({ order: filters.order === 'asc' ? 'desc' : 'asc' })
    } else {
      onFiltersChange({ sort: field, order: 'desc' })
    }
  }

  function SortHeader({ field, children }: { field: string; children: React.ReactNode }) {
    return (
      <button
        onClick={() => toggleSort(field)}
        className="flex items-center gap-1 text-xs font-medium text-granit uppercase tracking-wider hover:text-ardoise dark:hover:text-blanc-ecume"
      >
        {children}
        <ArrowUpDown className="w-3 h-3" />
      </button>
    )
  }

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
              <th className="text-left p-4"><SortHeader field="reservation_date">Date</SortHeader></th>
              <th className="text-left p-4"><span className="text-xs font-medium text-granit uppercase tracking-wider">Client</span></th>
              <th className="text-left p-4"><span className="text-xs font-medium text-granit uppercase tracking-wider">Service</span></th>
              <th className="text-left p-4"><SortHeader field="guests_count">Couverts</SortHeader></th>
              <th className="text-left p-4"><span className="text-xs font-medium text-granit uppercase tracking-wider">Statut</span></th>
              <th className="text-left p-4"><SortHeader field="amount_cents">Montant</SortHeader></th>
              {onStatusChange && <th className="text-left p-4"><span className="text-xs font-medium text-granit uppercase tracking-wider">Statut rapide</span></th>}
              {onDelete && <th className="text-right p-4"></th>}
              <th className="text-right p-4"></th>
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
                    <StatusActions reservation={r} />
                  </td>
                )}
                {onDelete && (
                  <td className="p-4 text-right">
                    <button
                      onClick={(e) => { e.preventDefault(); setDeleteTarget(r) }}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                )}
                <td className="p-4 text-right">
                  <Link
                    href={`/dashboard/reservations/${r.id}`}
                    className="inline-flex items-center gap-1 text-sm text-cognac hover:underline"
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
            <div className="flex items-center gap-2">
              <StatusActions reservation={r} />
              {onDelete && (
                <button
                  onClick={() => setDeleteTarget(r)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <Link
                href={`/dashboard/reservations/${r.id}`}
                className="ml-auto inline-flex items-center gap-1 text-xs text-cognac hover:underline"
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

      {/* Delete confirmation modal */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Supprimer la réservation"
        message={
          deleteTarget
            ? `Attention : la réservation de ${deleteTarget.client?.full_name || 'Anonyme'} du ${formatDate(deleteTarget.reservation_date)} va être supprimée définitivement. Cette action est irréversible.`
            : ''
        }
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />
    </div>
  )
}
