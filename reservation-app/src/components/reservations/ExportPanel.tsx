'use client'

import { useState } from 'react'
import { Download, FileText, FileSpreadsheet } from 'lucide-react'
import type { ReservationFilters } from '@/types'

interface ExportPanelProps {
  filters: ReservationFilters
}

export function ExportPanel({ filters }: ExportPanelProps) {
  const [exporting, setExporting] = useState(false)

  async function handleExport(format: 'csv' | 'pdf') {
    setExporting(true)
    try {
      const params = new URLSearchParams()
      params.set('format', format)
      if (filters.date_from) params.set('date_from', filters.date_from)
      if (filters.date_to) params.set('date_to', filters.date_to)
      if (filters.status?.length) params.set('status', filters.status.join(','))

      const response = await fetch(`/api/reservations/export?${params}`)
      if (!response.ok) throw new Error('Erreur export')

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `reservations-${new Date().toISOString().split('T')[0]}.${format}`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      alert('Erreur lors de l\'export')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="card p-5">
      <h3 className="text-sm font-medium flex items-center gap-2 mb-3">
        <Download className="w-4 h-4 text-cognac" />
        Exporter les réservations
      </h3>
      <p className="text-xs text-granit mb-4">
        Les filtres actifs seront appliqués à l'export.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => handleExport('csv')}
          disabled={exporting}
          className="btn-secondary"
        >
          <FileSpreadsheet className="w-4 h-4" />
          CSV
        </button>
        <button
          onClick={() => handleExport('pdf')}
          disabled={exporting}
          className="btn-primary"
        >
          <FileText className="w-4 h-4" />
          PDF
        </button>
      </div>
    </div>
  )
}
