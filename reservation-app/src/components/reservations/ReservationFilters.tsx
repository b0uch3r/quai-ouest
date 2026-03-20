'use client'

import { Search, Filter, X } from 'lucide-react'
import { useState } from 'react'
import type { ReservationFilters as Filters, ReservationStatus, ServiceType } from '@/types'
import { STATUS_LABELS, SERVICE_LABELS } from '@/types'
import { cn } from '@/lib/utils'

interface ReservationFiltersProps {
  filters: Filters
  onChange: (filters: Partial<Filters>) => void
}

export function ReservationFilters({ filters, onChange }: ReservationFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const activeFilterCount = [
    filters.status?.length,
    filters.date_from,
    filters.date_to,
    filters.service,
    filters.client_name,
  ].filter(Boolean).length

  function clearFilters() {
    onChange({
      status: undefined,
      date_from: undefined,
      date_to: undefined,
      service: undefined,
      client_name: undefined,
      q: undefined,
      page: 1,
    })
  }

  return (
    <div className="space-y-3">
      {/* Search bar + filter toggle */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-granit" />
          <input
            type="text"
            placeholder="Rechercher (nom, notes, demandes...)"
            value={filters.q || ''}
            onChange={(e) => onChange({ q: e.target.value || undefined, page: 1 })}
            className="input pl-10"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'btn-secondary relative',
            activeFilterCount > 0 && 'border-cognac text-cognac'
          )}
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filtres</span>
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-cognac text-white text-xs flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Expandable filters */}
      {showFilters && (
        <div className="card p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-granit mb-1">Statut</label>
            <select
              className="input"
              value={filters.status?.[0] || ''}
              onChange={(e) =>
                onChange({
                  status: e.target.value ? [e.target.value as ReservationStatus] : undefined,
                  page: 1,
                })
              }
            >
              <option value="">Tous</option>
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-granit mb-1">Service</label>
            <select
              className="input"
              value={filters.service || ''}
              onChange={(e) =>
                onChange({
                  service: (e.target.value as ServiceType) || undefined,
                  page: 1,
                })
              }
            >
              <option value="">Tous</option>
              {Object.entries(SERVICE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-granit mb-1">Du</label>
            <input
              type="date"
              className="input"
              value={filters.date_from || ''}
              onChange={(e) => onChange({ date_from: e.target.value || undefined, page: 1 })}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-granit mb-1">Au</label>
            <input
              type="date"
              className="input"
              value={filters.date_to || ''}
              onChange={(e) => onChange({ date_to: e.target.value || undefined, page: 1 })}
            />
          </div>

          {activeFilterCount > 0 && (
            <div className="sm:col-span-2 lg:col-span-4">
              <button onClick={clearFilters} className="text-sm text-cognac hover:underline flex items-center gap-1">
                <X className="w-3 h-3" />
                Effacer les filtres
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
