// Types principaux de l'application

export type ReservationStatus =
  | 'pending'
  | 'confirmed'
  | 'seated'
  | 'completed'
  | 'cancelled'
  | 'no_show'

export type ServiceType = 'midi' | 'soir'

export type ReservationSource = 'website' | 'phone' | 'walk_in' | 'thefork'

export type StaffRole = 'owner' | 'manager' | 'staff'

export interface Client {
  id: string
  full_name: string
  email: string | null
  phone: string | null
  notes: string | null
  total_visits: number
  last_visit_at: string | null
  created_at: string
  consent_given_at: string | null
}

export interface Reservation {
  id: string
  client_id: string | null
  client?: Client
  reservation_date: string
  service: ServiceType
  time_slot: string | null
  guests_count: number
  status: ReservationStatus
  special_requests: string | null
  table_number: string | null
  amount_cents: number | null
  source: ReservationSource
  staff_notes: string | null
  formspree_id: string | null
  created_at: string
  updated_at: string
  cancelled_at: string | null
}

export interface ReservationNote {
  id: string
  reservation_id: string
  author_id: string | null
  content: string
  created_at: string
  author?: { full_name: string }
}

export interface ReservationFilters {
  page: number
  limit: number
  status?: ReservationStatus[]
  date_from?: string
  date_to?: string
  service?: ServiceType
  client_name?: string
  sort: string
  order: 'asc' | 'desc'
  q?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  total_pages: number
}

export interface ReservationStats {
  total_reservations: number
  today_reservations: number
  total_clients: number
  total_revenue_cents: number
  by_status: Record<ReservationStatus, number>
  by_service: Record<ServiceType, number>
  by_month: { month: string; count: number; revenue_cents: number }[]
  avg_guests: number
  no_show_rate: number
}

export const RESERVATION_STATUS_OPTIONS: ReservationStatus[] = [
  'pending',
  'confirmed',
  'seated',
  'completed',
  'cancelled',
  'no_show',
]

export const STATUS_LABELS: Record<ReservationStatus, string> = {
  pending: 'En attente',
  confirmed: 'Réservée',
  seated: 'À table',
  completed: 'Terminée',
  cancelled: 'Annulée',
  no_show: 'No-show',
}

export const STATUS_COLORS: Record<ReservationStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  seated: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  no_show: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
}

export const SERVICE_LABELS: Record<ServiceType, string> = {
  midi: 'Midi',
  soir: 'Soir',
}
