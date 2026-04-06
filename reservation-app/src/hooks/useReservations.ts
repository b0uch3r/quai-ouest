'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Reservation, ReservationFilters, PaginatedResponse, ReservationStatus } from '@/types'

const DEFAULT_FILTERS: ReservationFilters = {
  page: 1,
  limit: 20,
  sort: 'reservation_date',
  order: 'desc',
}

async function getResponseError(response: Response) {
  const payload = (await response.json().catch(() => null)) as { error?: string } | null
  return payload?.error || 'Erreur serveur'
}

function buildReservationQueryParams(filters: ReservationFilters) {
  const params = new URLSearchParams({
    page: String(filters.page),
    limit: String(filters.limit),
    sort: filters.sort,
    order: filters.order,
  })

  if (filters.status?.length) params.set('status', filters.status.join(','))
  if (filters.date_from) params.set('date_from', filters.date_from)
  if (filters.date_to) params.set('date_to', filters.date_to)
  if (filters.service) params.set('service', filters.service)
  if (filters.q) params.set('q', filters.q)

  return params
}

export function useReservations(initialFilters?: Partial<ReservationFilters>) {
  const [filters, setFilters] = useState<ReservationFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  })
  const [data, setData] = useState<PaginatedResponse<Reservation>>({
    data: [],
    total: 0,
    page: 1,
    limit: 20,
    total_pages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReservations = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = buildReservationQueryParams(filters)
      const response = await fetch(`/api/reservations?${params.toString()}`, {
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error(await getResponseError(response))
      }

      const payload = (await response.json()) as PaginatedResponse<Reservation>
      let filteredReservations = payload.data || []

      if (filters.client_name) {
        const search = filters.client_name.toLowerCase()
        filteredReservations = filteredReservations.filter((reservation) =>
          reservation.client?.full_name?.toLowerCase().includes(search)
        )
      }

      setData({
        ...payload,
        data: filteredReservations,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    void fetchReservations()
  }, [fetchReservations])

  function updateFilters(partial: Partial<ReservationFilters>) {
    setFilters((prev) => ({ ...prev, ...partial }))
  }

  const updateStatus = useCallback(async (id: string, status: ReservationStatus) => {
    const response = await fetch(`/api/reservations/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) {
      throw new Error(await getResponseError(response))
    }

    const updatedReservation = (await response.json()) as Reservation

    setData((prev) => ({
      ...prev,
      data: prev.data.map((reservation) =>
        reservation.id === id ? { ...reservation, ...updatedReservation } : reservation
      ),
    }))
  }, [])

  const deleteReservation = useCallback(async (id: string) => {
    const response = await fetch(`/api/reservations/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(await getResponseError(response))
    }

    setData((prev) => ({
      ...prev,
      data: prev.data.filter((reservation) => reservation.id !== id),
      total: Math.max(prev.total - 1, 0),
    }))
  }, [])

  const deleteByPeriod = useCallback(async (dateFrom: string, dateTo: string) => {
    const response = await fetch('/api/reservations/delete-period', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date_from: dateFrom,
        date_to: dateTo,
      }),
    })

    if (!response.ok) {
      throw new Error(await getResponseError(response))
    }

    const payload = (await response.json()) as { deleted?: number }
    await fetchReservations()
    return payload.deleted || 0
  }, [fetchReservations])

  const countByPeriod = useCallback(async (dateFrom: string, dateTo: string) => {
    const params = new URLSearchParams({
      date_from: dateFrom,
      date_to: dateTo,
    })

    const response = await fetch(`/api/reservations/delete-period?${params.toString()}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(await getResponseError(response))
    }

    const payload = (await response.json()) as { count?: number }
    return payload.count || 0
  }, [])

  return {
    ...data,
    filters,
    updateFilters,
    loading,
    error,
    refetch: fetchReservations,
    updateStatus,
    deleteReservation,
    deleteByPeriod,
    countByPeriod,
  }
}
