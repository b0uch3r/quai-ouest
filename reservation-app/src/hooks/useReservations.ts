'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase-browser'
import type { Reservation, ReservationFilters, PaginatedResponse, ReservationStatus } from '@/types'

const DEFAULT_FILTERS: ReservationFilters = {
  page: 1,
  limit: 20,
  sort: 'reservation_date',
  order: 'desc',
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
      const supabase = createClient()
      let query = supabase
        .from('reservations')
        .select('*, client:clients(*)', { count: 'exact' })

      // Apply filters
      if (filters.status?.length) {
        query = query.in('status', filters.status)
      }
      if (filters.date_from) {
        query = query.gte('reservation_date', filters.date_from)
      }
      if (filters.date_to) {
        query = query.lte('reservation_date', filters.date_to)
      }
      if (filters.service) {
        query = query.eq('service', filters.service)
      }
      if (filters.q) {
        query = query.or(
          `special_requests.ilike.%${filters.q}%,staff_notes.ilike.%${filters.q}%`
        )
      }

      // Sort
      query = query.order(filters.sort, { ascending: filters.order === 'asc' })

      // Paginate
      const from = (filters.page - 1) * filters.limit
      const to = from + filters.limit - 1
      query = query.range(from, to)

      const { data: rows, count, error: queryError } = await query

      if (queryError) throw queryError

      // Client name filter (post-query because it's a joined field)
      let filtered = rows || []
      if (filters.client_name) {
        const search = filters.client_name.toLowerCase()
        filtered = filtered.filter((r: Reservation) =>
          r.client?.full_name?.toLowerCase().includes(search)
        )
      }

      setData({
        data: filtered,
        total: count || 0,
        page: filters.page,
        limit: filters.limit,
        total_pages: Math.ceil((count || 0) / filters.limit),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchReservations()
  }, [fetchReservations])

  function updateFilters(partial: Partial<ReservationFilters>) {
    setFilters((prev) => ({ ...prev, ...partial }))
  }

  const updateStatus = useCallback(async (id: string, status: ReservationStatus) => {
    const supabase = createClient()
    const updates: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    }
    if (status === 'cancelled') {
      updates.cancelled_at = new Date().toISOString()
    }
    const { error } = await supabase
      .from('reservations')
      .update(updates)
      .eq('id', id)
    if (error) throw error
    setData((prev) => ({
      ...prev,
      data: prev.data.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              updated_at: updates.updated_at as string,
              ...(status === 'cancelled' ? { cancelled_at: updates.cancelled_at as string } : {}),
            }
          : r
      ),
    }))
  }, [])

  return { ...data, filters, updateFilters, loading, error, refetch: fetchReservations, updateStatus }
}
