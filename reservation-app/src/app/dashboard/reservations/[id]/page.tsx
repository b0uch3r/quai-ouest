'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  User,
  Calendar,
  Clock,
  Users,
  MapPin,
  MessageSquare,
  Phone,
  Mail,
  Send,
} from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { StatusSelect } from '@/components/ui/StatusSelect'
import { formatDate, formatDateTime, formatCurrency } from '@/lib/utils'
import type { Reservation, ReservationNote, ReservationStatus } from '@/types'
import { SERVICE_LABELS } from '@/types'

async function getResponseError(response: Response) {
  const payload = (await response.json().catch(() => null)) as { error?: string } | null
  return payload?.error || 'Erreur serveur'
}

export default function ReservationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [notes, setNotes] = useState<ReservationNote[]>([])
  const [newNote, setNewNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(`/api/reservations/${id}`, { cache: 'no-store' })
        if (!response.ok) {
          setReservation(null)
          setNotes([])
          return
        }

        const data = (await response.json()) as Reservation & { notes?: ReservationNote[] }
        setReservation(data)
        setNotes([...(data.notes || [])].sort((left, right) => left.created_at.localeCompare(right.created_at)))
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [id])

  async function updateStatus(status: ReservationStatus) {
    setSaving(true)
    try {
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
      if (reservation) {
        setReservation({
          ...reservation,
          ...updatedReservation,
        })
      }
    } catch (error) {
      console.error('Reservation status update failed:', error)
    } finally {
      setSaving(false)
    }
  }

  async function addNote() {
    if (!newNote.trim()) return
    setSaving(true)
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newNote.trim() }),
      })

      if (!response.ok) {
        throw new Error(await getResponseError(response))
      }

      const note = (await response.json()) as ReservationNote
      setNotes((prev) => [...prev, note])
      setNewNote('')
    } catch (error) {
      console.error('Reservation note creation failed:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-cognac/30 border-t-cognac rounded-full animate-spin" />
      </div>
    )
  }

  if (!reservation) {
    return (
      <div className="text-center py-20">
        <p className="text-granit">Réservation introuvable</p>
        <Link href="/dashboard" className="text-cognac hover:underline text-sm mt-2 inline-block">
          Retour au tableau de bord
        </Link>
      </div>
    )
  }

  const r = reservation
  const client = r.client

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back + title */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-sable/50 dark:hover:bg-granit/20">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-display font-bold text-bleu-baie dark:text-blanc-ecume">
            Réservation du {formatDate(r.reservation_date)}
          </h1>
          <p className="text-xs text-granit mt-0.5">ID: {r.id.slice(0, 8)}</p>
        </div>
        <StatusBadge status={r.status} className="text-sm px-3 py-1" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Reservation details */}
          <div className="card p-5 space-y-4">
            <h2 className="font-medium text-sm text-granit uppercase tracking-wider">Détails</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-cognac" />
                <div>
                  <p className="text-xs text-granit">Date</p>
                  <p className="text-sm font-medium">{formatDate(r.reservation_date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-cognac" />
                <div>
                  <p className="text-xs text-granit">Service</p>
                  <p className="text-sm font-medium">{SERVICE_LABELS[r.service]}{r.time_slot ? ` - ${r.time_slot}` : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-cognac" />
                <div>
                  <p className="text-xs text-granit">Couverts</p>
                  <p className="text-sm font-medium">{r.guests_count} personne{r.guests_count > 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-cognac" />
                <div>
                  <p className="text-xs text-granit">Table</p>
                  <p className="text-sm font-medium">{r.table_number || 'Non assignée'}</p>
                </div>
              </div>
            </div>

            {r.special_requests && (
              <div className="pt-3 border-t border-sable dark:border-granit/30">
                <p className="text-xs text-granit mb-1">Demandes spéciales</p>
                <p className="text-sm bg-sable/30 dark:bg-granit/20 rounded-lg p-3">{r.special_requests}</p>
              </div>
            )}

            {r.amount_cents !== null && (
              <div className="pt-3 border-t border-sable dark:border-granit/30">
                <p className="text-xs text-granit mb-1">Montant</p>
                <p className="text-lg font-bold text-bleu-baie dark:text-blanc-ecume">{formatCurrency(r.amount_cents)}</p>
              </div>
            )}
          </div>

          {/* Status actions */}
          <div className="card p-5">
            <h2 className="font-medium text-sm text-granit uppercase tracking-wider mb-3">Changer le statut</h2>
            <div className="flex items-center gap-3">
              <StatusSelect
                value={r.status}
                disabled={saving}
                onChange={(status) => {
                  if (status !== r.status) {
                    void updateStatus(status)
                  }
                }}
              />
              {saving && (
                <div className="w-5 h-5 border-2 border-cognac/30 border-t-cognac rounded-full animate-spin" />
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="card p-5">
            <h2 className="font-medium text-sm text-granit uppercase tracking-wider mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Notes ({notes.length})
            </h2>

            {notes.length > 0 && (
              <div className="space-y-3 mb-4">
                {notes.map((note) => (
                  <div key={note.id} className="bg-sable/30 dark:bg-granit/20 rounded-lg p-3">
                    <p className="text-sm">{note.content}</p>
                    <p className="text-xs text-granit mt-2">
                      {note.author?.full_name || 'Staff'} — {formatDateTime(note.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addNote()}
                placeholder="Ajouter une note..."
                className="input flex-1"
              />
              <button onClick={addNote} disabled={saving || !newNote.trim()} className="btn-primary">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Client sidebar */}
        <div className="space-y-6">
          <div className="card p-5">
            <h2 className="font-medium text-sm text-granit uppercase tracking-wider mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Client
            </h2>

            {client ? (
              <div className="space-y-3">
                <p className="font-medium">{client.full_name}</p>
                {client.email && (
                  <a
                    href={`mailto:${client.email}`}
                    className="flex items-center gap-2 text-sm text-cognac hover:underline"
                  >
                    <Mail className="w-4 h-4" />
                    {client.email}
                  </a>
                )}
                {client.phone && (
                  <a
                    href={`tel:${client.phone}`}
                    className="flex items-center gap-2 text-sm text-cognac hover:underline"
                  >
                    <Phone className="w-4 h-4" />
                    {client.phone}
                  </a>
                )}
                <div className="pt-3 border-t border-sable dark:border-granit/30">
                  <p className="text-xs text-granit">Visites totales</p>
                  <p className="text-lg font-bold">{client.total_visits}</p>
                </div>
                {client.notes && (
                  <div>
                    <p className="text-xs text-granit">Notes client</p>
                    <p className="text-sm mt-1">{client.notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-granit">Aucun client associé</p>
            )}
          </div>

          {/* Meta */}
          <div className="card p-5">
            <h2 className="font-medium text-sm text-granit uppercase tracking-wider mb-3">Informations</h2>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-xs text-granit">Source</dt>
                <dd className="capitalize">{r.source}</dd>
              </div>
              <div>
                <dt className="text-xs text-granit">Créée le</dt>
                <dd>{formatDateTime(r.created_at)}</dd>
              </div>
              <div>
                <dt className="text-xs text-granit">Dernière MAJ</dt>
                <dd>{formatDateTime(r.updated_at)}</dd>
              </div>
              {r.cancelled_at && (
                <div>
                  <dt className="text-xs text-granit">Annulée le</dt>
                  <dd className="text-red-500">{formatDateTime(r.cancelled_at)}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
