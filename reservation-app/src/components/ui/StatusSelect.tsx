'use client'

import { cn } from '@/lib/utils'
import {
  RESERVATION_STATUS_OPTIONS,
  STATUS_LABELS,
  type ReservationStatus,
} from '@/types'

interface StatusSelectProps {
  value: ReservationStatus
  onChange: (status: ReservationStatus) => void
  disabled?: boolean
  className?: string
  compact?: boolean
}

const STATUS_SELECT_COLORS: Record<ReservationStatus, string> = {
  pending: 'border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800/60 dark:bg-yellow-900/20 dark:text-yellow-200',
  confirmed: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800/60 dark:bg-blue-900/20 dark:text-blue-200',
  seated: 'border-purple-200 bg-purple-50 text-purple-900 dark:border-purple-800/60 dark:bg-purple-900/20 dark:text-purple-200',
  completed: 'border-green-200 bg-green-50 text-green-900 dark:border-green-800/60 dark:bg-green-900/20 dark:text-green-200',
  cancelled: 'border-red-200 bg-red-50 text-red-900 dark:border-red-800/60 dark:bg-red-900/20 dark:text-red-200',
  no_show: 'border-slate-200 bg-slate-50 text-slate-900 dark:border-slate-700 dark:bg-slate-900/20 dark:text-slate-200',
}

export function StatusSelect({
  value,
  onChange,
  disabled = false,
  className,
  compact = false,
}: StatusSelectProps) {
  return (
    <select
      aria-label="Changer le statut"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as ReservationStatus)}
      className={cn(
        'input font-medium disabled:cursor-not-allowed disabled:opacity-70',
        compact ? 'w-auto min-w-[10.5rem] py-1.5 pr-8 text-xs' : 'max-w-xs',
        STATUS_SELECT_COLORS[value],
        className
      )}
    >
      {RESERVATION_STATUS_OPTIONS.map((status) => (
        <option key={status} value={status}>
          {STATUS_LABELS[status]}
        </option>
      ))}
    </select>
  )
}
