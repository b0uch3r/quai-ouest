/**
 * Orchestrateur du workflow de réservation
 *
 * Coordonne les 3 agents :
 * 1. Capture — Extraction et validation des données
 * 2. Action Client — Envoi de l'email de confirmation
 * 3. Action Admin — Insertion en base + log de notification
 *
 * Garanties :
 * - La réservation est TOUJOURS créée en base (même si l'email échoue)
 * - Un log de notification est créé pour chaque tentative d'email
 * - En cas d'échec email, une alerte est visible dans le dashboard
 */

import {
  sendReservationNotifications,
  type ReservationNotificationSummary,
} from './reservation-notifications'
import { type ServiceType } from '@/types'

// ============================================
// Types du workflow
// ============================================

export interface WorkflowInput {
  // Données brutes du formulaire (déjà validées par Zod)
  nom: string
  email: string
  telephone: string
  date: string
  personnes: string
  service: string
  message: string
}

export interface WorkflowResult {
  success: boolean
  reservationId: string | null
  clientId: string | null
  clientName: string
  email: {
    sent: boolean
    messageId?: string
    error?: string
  }
  log: string
  durationMs: number
}

interface SupabaseClient {
  from: (table: string) => any
  rpc: (fn: string, params: Record<string, unknown>) => any
}

// ============================================
// Agent 1 : Capture — Normalisation des données
// ============================================

interface NormalizedData {
  clientName: string
  clientEmail: string
  clientPhone: string | null
  reservationDate: string
  guestsCount: number
  serviceType: ServiceType
  specialRequests: string | null
}

function captureAndNormalize(input: WorkflowInput): NormalizedData {
  const guestsCount = parseInt(input.personnes) || 2
  const serviceType: ServiceType = input.service.toLowerCase().startsWith('soir') ? 'soir' : 'midi'

  return {
    clientName: input.nom.trim(),
    clientEmail: input.email.trim().toLowerCase(),
    clientPhone: input.telephone?.trim() || null,
    reservationDate: input.date,
    guestsCount,
    serviceType,
    specialRequests: input.message?.trim() || null,
  }
}

// ============================================
// Agent 2 : Administrateur de Données — Insertion DB
// ============================================

interface DbInsertResult {
  clientId: string
  reservationId: string
  isNewClient: boolean
}

async function insertIntoDatabase(
  supabase: SupabaseClient,
  data: NormalizedData
): Promise<DbInsertResult> {
  // Upsert client
  let clientId: string
  let isNewClient = false

  const { data: existingClient } = await supabase
    .from('clients')
    .select('id')
    .eq('email', data.clientEmail)
    .single()

  if (existingClient) {
    clientId = existingClient.id
    await supabase.rpc('increment_visits', { p_client_id: clientId })
  } else {
    isNewClient = true
    const { data: newClient, error: clientError } = await supabase
      .from('clients')
      .insert({
        full_name: data.clientName,
        email: data.clientEmail,
        phone: data.clientPhone,
        total_visits: 1,
        last_visit_at: new Date().toISOString(),
        consent_given_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (clientError || !newClient) {
      throw new Error(`Échec insertion client: ${clientError?.message || 'unknown'}`)
    }
    clientId = newClient.id
  }

  // Insert reservation
  const { data: reservation, error: resError } = await supabase
    .from('reservations')
    .insert({
      client_id: clientId,
      reservation_date: data.reservationDate,
      service: data.serviceType,
      guests_count: data.guestsCount,
      status: 'pending',
      special_requests: data.specialRequests,
      source: 'website',
    })
    .select('id')
    .single()

  if (resError || !reservation) {
    throw new Error(`Échec insertion réservation: ${resError?.message || 'unknown'}`)
  }

  return { clientId, reservationId: reservation.id, isNewClient }
}

// ============================================
// Agent 3 : Liaison Client — Notifications
// ============================================

async function sendNotifications(
  data: NormalizedData,
  reservationId: string
): Promise<ReservationNotificationSummary> {
  return sendReservationNotifications({
    reservationId,
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    clientPhone: data.clientPhone || undefined,
    reservationDate: data.reservationDate,
    service: data.serviceType as 'midi' | 'soir',
    guestsCount: data.guestsCount,
    message: data.specialRequests || undefined,
    createdAt: new Date().toISOString(),
  })
}

// ============================================
// Log de notification — Traçabilité dashboard
// ============================================

async function logNotification(
  supabase: SupabaseClient,
  params: {
    reservationId: string
    clientEmail: string
    type: 'confirmation_email'
    status: 'sent' | 'failed' | 'simulated'
    messageId?: string
    errorMessage?: string
    durationMs: number
  }
): Promise<void> {
  try {
    await supabase.from('notification_log').insert({
      reservation_id: params.reservationId,
      recipient_email: params.clientEmail,
      notification_type: params.type,
      status: params.status,
      provider_message_id: params.messageId || null,
      error_message: params.errorMessage || null,
      duration_ms: params.durationMs,
    })
  } catch (err) {
    // Le log ne doit jamais bloquer le workflow
    console.error('[WORKFLOW] Échec écriture notification_log:', err)
  }
}

// ============================================
// Orchestrateur principal
// ============================================

export async function executeReservationWorkflow(
  supabase: SupabaseClient,
  input: WorkflowInput
): Promise<WorkflowResult> {
  const startTime = Date.now()

  // ── Étape 1 : Capture & normalisation ──
  const normalized = captureAndNormalize(input)

  // ── Étape 2 : Insertion en base (PRIORITAIRE — ne doit jamais échouer) ──
  let dbResult: DbInsertResult
  try {
    dbResult = await insertIntoDatabase(supabase, normalized)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur DB inconnue'
    console.error('[WORKFLOW] Échec DB:', message)
    return {
      success: false,
      reservationId: null,
      clientId: null,
      clientName: normalized.clientName,
      email: { sent: false, error: 'Réservation non créée — email non envoyé' },
      log: `[ERREUR] DB échouée pour ${normalized.clientName}: ${message}`,
      durationMs: Date.now() - startTime,
    }
  }

  // ── Étape 3 : Envoi des notifications (NON BLOQUANT — ne doit pas empêcher la réservation) ──
  const emailStartTime = Date.now()
  const notificationResult = await sendNotifications(normalized, dbResult.reservationId)
  const emailDurationMs = Date.now() - emailStartTime
  const clientStatus = notificationResult.client.status
  const clientProviderId = notificationResult.client.providerId
  const clientReason = notificationResult.client.reason

  // ── Étape 4 : Log de notification pour le dashboard ──
  const notifStatus =
    clientStatus === 'sent'
      ? 'sent'
      : clientStatus === 'skipped'
        ? 'simulated'
        : 'failed'

  await logNotification(supabase, {
    reservationId: dbResult.reservationId,
    clientEmail: normalized.clientEmail,
    type: 'confirmation_email',
    status: notifStatus as 'sent' | 'failed' | 'simulated',
    messageId: clientProviderId,
    errorMessage: clientReason,
    durationMs: emailDurationMs,
  })

  // ── Log final ──
  const totalDuration = Date.now() - startTime
  const clientDelivered = clientStatus === 'sent' || clientStatus === 'skipped'
  const staffDelivered = notificationResult.staff.status === 'sent' || notificationResult.staff.status === 'skipped'
  const logMessage = clientDelivered && staffDelivered
    ? `Notifications client/staff traitées pour [${normalized.clientName}] (${totalDuration}ms)`
    : `[ALERTE] Réservation créée pour [${normalized.clientName}] mais notifications incomplètes: client=${clientStatus}${clientReason ? ` (${clientReason})` : ''}, staff=${notificationResult.staff.status}${notificationResult.staff.reason ? ` (${notificationResult.staff.reason})` : ''} (${totalDuration}ms)`

  console.log(`[WORKFLOW] ${logMessage}`)

  return {
    success: true,
    reservationId: dbResult.reservationId,
    clientId: dbResult.clientId,
    clientName: normalized.clientName,
    email: {
      sent: clientDelivered,
      messageId: clientProviderId,
      error: clientReason,
    },
    log: logMessage,
    durationMs: totalDuration,
  }
}
