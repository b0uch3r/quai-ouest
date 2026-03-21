'use client'

import { useState, useCallback } from 'react'
import { CalendarX2, Loader2 } from 'lucide-react'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { cn } from '@/lib/utils'

type PeriodType = 'day' | 'week' | 'month'

interface DeleteByPeriodProps {
  onDelete: (dateFrom: string, dateTo: string) => Promise<number>
  onCount: (dateFrom: string, dateTo: string) => Promise<number>
  onSuccess: (count: number) => void
  onError: (message: string) => void
}

function getDateRange(type: PeriodType, date: string): { from: string; to: string } {
  const d = new Date(date + 'T00:00:00')
  switch (type) {
    case 'day':
      return { from: date, to: date }
    case 'week': {
      // Monday to Sunday of the selected date's week
      const day = d.getDay()
      const monday = new Date(d)
      monday.setDate(d.getDate() - (day === 0 ? 6 : day - 1))
      const sunday = new Date(monday)
      sunday.setDate(monday.getDate() + 6)
      return {
        from: monday.toISOString().split('T')[0],
        to: sunday.toISOString().split('T')[0],
      }
    }
    case 'month': {
      const firstDay = new Date(d.getFullYear(), d.getMonth(), 1)
      const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0)
      return {
        from: firstDay.toISOString().split('T')[0],
        to: lastDay.toISOString().split('T')[0],
      }
    }
  }
}

const PERIOD_LABELS: Record<PeriodType, string> = {
  day: 'Journée précise',
  week: 'Semaine (lun → dim)',
  month: 'Mois complet',
}

export function DeleteByPeriod({ onDelete, onCount, onSuccess, onError }: DeleteByPeriodProps) {
  const [expanded, setExpanded] = useState(false)
  const [periodType, setPeriodType] = useState<PeriodType>('day')
  const [selectedDate, setSelectedDate] = useState('')
  const [counting, setCounting] = useState(false)
  const [matchCount, setMatchCount] = useState<number | null>(null)
  const [dateRange, setDateRange] = useState<{ from: string; to: string } | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handlePreview = useCallback(async () => {
    if (!selectedDate) return
    setCounting(true)
    setMatchCount(null)
    try {
      const range = getDateRange(periodType, selectedDate)
      setDateRange(range)
      const count = await onCount(range.from, range.to)
      setMatchCount(count)
    } catch {
      onError('Erreur lors du comptage des réservations')
    } finally {
      setCounting(false)
    }
  }, [selectedDate, periodType, onCount, onError])

  async function handleConfirmDelete() {
    if (!dateRange || deleting) return
    setDeleting(true)
    try {
      const count = await onDelete(dateRange.from, dateRange.to)
      setShowConfirm(false)
      setMatchCount(null)
      setSelectedDate('')
      setDateRange(null)
      onSuccess(count)
    } catch {
      onError('Erreur lors de la suppression des réservations')
      setShowConfirm(false)
    } finally {
      setDeleting(false)
    }
  }

  const formatDisplayRange = () => {
    if (!dateRange) return ''
    if (dateRange.from === dateRange.to) return dateRange.from
    return `du ${dateRange.from} au ${dateRange.to}`
  }

  return (
    <div className="card overflow-hidden">
      {/* Toggle header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-sable/20 dark:hover:bg-granit/10 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <CalendarX2 className="w-4.5 h-4.5 text-red-600 dark:text-red-400" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-ardoise dark:text-blanc-ecume">
              Suppression par période
            </p>
            <p className="text-xs text-granit">
              Supprimer les réservations d'une journée, semaine ou mois
            </p>
          </div>
        </div>
        <svg
          className={cn(
            'w-5 h-5 text-granit transition-transform duration-200',
            expanded && 'rotate-180'
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded panel */}
      {expanded && (
        <div className="border-t border-sable dark:border-granit/30 p-4 space-y-4">
          {/* Period type selector */}
          <div>
            <label className="block text-xs font-medium text-granit mb-1.5">Type de période</label>
            <div className="flex gap-2">
              {(Object.entries(PERIOD_LABELS) as [PeriodType, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => {
                    setPeriodType(key)
                    setMatchCount(null)
                    setDateRange(null)
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                    periodType === key
                      ? 'bg-cognac text-white'
                      : 'bg-sable/50 text-ardoise hover:bg-sable dark:bg-granit/20 dark:text-blanc-ecume dark:hover:bg-granit/30'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Date picker */}
          <div>
            <label className="block text-xs font-medium text-granit mb-1.5">
              {periodType === 'day' ? 'Date' : periodType === 'week' ? 'Sélectionner un jour de la semaine' : 'Sélectionner un jour du mois'}
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                className="input max-w-xs"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value)
                  setMatchCount(null)
                  setDateRange(null)
                }}
              />
              <button
                onClick={handlePreview}
                disabled={!selectedDate || counting}
                className="btn-secondary"
              >
                {counting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Rechercher'
                )}
              </button>
            </div>
          </div>

          {/* Preview result */}
          {matchCount !== null && dateRange && (
            <div
              className={cn(
                'rounded-lg p-3 text-sm',
                matchCount > 0
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800'
                  : 'bg-gray-50 dark:bg-gray-900/20 text-granit border border-gray-200 dark:border-gray-700'
              )}
            >
              {matchCount > 0 ? (
                <div className="flex items-center justify-between">
                  <span>
                    <strong>{matchCount}</strong> réservation{matchCount > 1 ? 's' : ''} trouvée{matchCount > 1 ? 's' : ''} ({formatDisplayRange()})
                  </span>
                  <button
                    onClick={() => setShowConfirm(true)}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                      'bg-red-600 text-white hover:bg-red-700'
                    )}
                  >
                    <CalendarX2 className="w-3.5 h-3.5" />
                    Supprimer
                  </button>
                </div>
              ) : (
                <span>Aucune réservation trouvée pour cette période.</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Confirm modal */}
      <ConfirmModal
        open={showConfirm}
        title="Suppression par période"
        message={`Attention : ${matchCount} réservation${(matchCount || 0) > 1 ? 's' : ''} ${formatDisplayRange()} ${(matchCount || 0) > 1 ? 'vont être supprimées' : 'va être supprimée'} définitivement. Cette action est irréversible.`}
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => !deleting && setShowConfirm(false)}
      />
    </div>
  )
}
