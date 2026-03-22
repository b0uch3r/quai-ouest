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
    const now = new Date().toISOString()
    const updates: Record<string, unknown> = {
      status,
      updated_at: now,
      cancelled_at: status === 'cancelled' ? now : null,
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
              updated_at: now,
              cancelled_at: updates.cancelled_at as string | null,
            }
          : r
      ),
    }))
  }, [])

  const deleteReservation = useCallback(async (id: string) => {
    const supabase = createClient()
    // Delete associated notes first
    await supabase
      .from('reservation_notes')
      .delete()
      .eq('reservation_id', id)
    // Delete the reservation
    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id)
    if (error) throw error
    // Remove from local state
    setData((prev) => ({
      ...prev,
      data: prev.data.filter((r) => r.id !== id),
      total: prev.total - 1,
    }))
  }, [])

  const deleteByPeriod = useCallback(async (dateFrom: string, dateTo: string) => {
    const supabase = createClient()
    // Get IDs to delete notes first
    const { data: toDelete } = await supabase
      .from('reservations')
      .select('id')
      .gte('reservation_date', dateFrom)
      .lte('reservation_date', dateTo)

    if (toDelete && toDelete.length > 0) {
      const ids = toDelete.map((r) => r.id)
      await supabase
        .from('reservation_notes')
        .delete()
        .in('reservation_id', ids)
    }

    const { error } = await supabase
      .from('reservations')
      .delete()
      .gte('reservation_date', dateFrom)
      .lte('reservation_date', dateTo)
    if (error) throw error
    const deletedCount = toDelete?.length || 0
    // Refresh data
    await fetchReservations()
    return deletedCount
  }, [fetchReservations])

  const countByPeriod = useCallback(async (dateFrom: string, dateTo: string) => {
    const supabase = createClient()
    const { count, error } = await supabase
      .from('reservations')
      .select('id', { count: 'exact', head: true })
      .gte('reservation_date', dateFrom)
      .lte('reservation_date', dateTo)
    if (error) throw error
    return count || 0
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
