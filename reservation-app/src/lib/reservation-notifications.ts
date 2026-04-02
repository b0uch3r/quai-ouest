type ReservationService = 'midi' | 'soir'

export type EmailDeliveryStatus = 'sent' | 'skipped' | 'failed'

export interface EmailDeliveryResult {
  status: EmailDeliveryStatus
  recipient?: string
  providerId?: string
  reason?: string
}

export interface ReservationNotificationContext {
  reservationId: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  reservationDate: string
  guestsCount: number
  service: ReservationService
  message?: string
  createdAt: string
}

export interface ReservationNotificationSummary {
  staff: EmailDeliveryResult
  client: EmailDeliveryResult
}

const RESEND_API_URL = 'https://api.resend.com/emails'

function isEmailConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY &&
      process.env.RESEND_FROM_EMAIL &&
      process.env.CONTACT_EMAIL_TO
  )
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatReservationDate(date: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Paris',
  }).format(new Date(`${date}T12:00:00`))
}

function formatServiceLabel(service: ReservationService) {
  return service === 'soir' ? 'soir' : 'midi'
}

async function sendResendEmail(payload: {
  to: string
  subject: string
  html: string
  text: string
  replyTo?: string
}) {
  if (!isEmailConfigured()) {
    return {
      status: 'skipped' as const,
      reason: 'Email disabled: missing RESEND_API_KEY, RESEND_FROM_EMAIL or CONTACT_EMAIL_TO',
    }
  }

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      reply_to: payload.replyTo,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '')
    return {
      status: 'failed' as const,
      reason: `Resend ${response.status}: ${errorBody.slice(0, 180) || 'unknown error'}`,
    }
  }

  const data = (await response.json().catch(() => null)) as { id?: string } | null
  return {
    status: 'sent' as const,
    providerId: data?.id,
  }
}

function buildStaffEmail(context: ReservationNotificationContext) {
  const dateLabel = formatReservationDate(context.reservationDate)
  const serviceLabel = formatServiceLabel(context.service)
  const note = context.message?.trim() || 'Aucun message complémentaire.'

  const subject = `Nouvelle réservation ${dateLabel} - ${context.clientName}`
  const text = [
    'Nouvelle demande de réservation',
    `Client : ${context.clientName}`,
    `Email : ${context.clientEmail}`,
    `Téléphone : ${context.clientPhone || 'non renseigné'}`,
    `Date : ${dateLabel}`,
    `Service : ${serviceLabel}`,
    `Couverts : ${context.guestsCount}`,
    `Message : ${note}`,
    `Référence : ${context.reservationId}`,
  ].join('\n')

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937">
      <h2 style="margin:0 0 12px;color:#2c5f7c">Nouvelle demande de réservation</h2>
      <p style="margin:0 0 16px">Une nouvelle demande est arrivée depuis le site vitrine.</p>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:640px">
        <tr><td style="padding:6px 0;font-weight:700">Client</td><td style="padding:6px 0">${escapeHtml(context.clientName)}</td></tr>
        <tr><td style="padding:6px 0;font-weight:700">Email</td><td style="padding:6px 0">${escapeHtml(context.clientEmail)}</td></tr>
        <tr><td style="padding:6px 0;font-weight:700">Téléphone</td><td style="padding:6px 0">${escapeHtml(context.clientPhone || 'Non renseigné')}</td></tr>
        <tr><td style="padding:6px 0;font-weight:700">Date</td><td style="padding:6px 0">${escapeHtml(dateLabel)}</td></tr>
        <tr><td style="padding:6px 0;font-weight:700">Service</td><td style="padding:6px 0">${escapeHtml(serviceLabel)}</td></tr>
        <tr><td style="padding:6px 0;font-weight:700">Couverts</td><td style="padding:6px 0">${context.guestsCount}</td></tr>
        <tr><td style="padding:6px 0;font-weight:700">Message</td><td style="padding:6px 0">${escapeHtml(note)}</td></tr>
        <tr><td style="padding:6px 0;font-weight:700">Référence</td><td style="padding:6px 0">${escapeHtml(context.reservationId)}</td></tr>
      </table>
      <p style="margin:20px 0 0;color:#6b7280;font-size:12px">Créée le ${escapeHtml(
        new Intl.DateTimeFormat('fr-FR', {
          dateStyle: 'full',
          timeStyle: 'short',
          timeZone: 'Europe/Paris',
        }).format(new Date(context.createdAt))
      )}</p>
    </div>
  `

  return { subject, text, html }
}

function buildClientEmail(context: ReservationNotificationContext) {
  const dateLabel = formatReservationDate(context.reservationDate)
  const serviceLabel = formatServiceLabel(context.service)
  const note = context.message?.trim()

  const subject = `Votre demande de réservation au Quai Ouest`
  const text = [
    `Bonjour ${context.clientName},`,
    '',
    `Nous avons bien reçu votre demande pour le ${dateLabel} (${serviceLabel}) pour ${context.guestsCount} personnes.`,
    'Notre équipe la consulte et revient vers vous rapidement pour confirmer la disponibilité.',
    '',
    note ? `Votre message : ${note}` : '',
    '',
    'Quai Ouest',
    '02 98 29 08 09',
  ]
    .filter(Boolean)
    .join('\n')

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2937">
      <h2 style="margin:0 0 12px;color:#2c5f7c">Votre demande a bien été envoyée</h2>
      <p style="margin:0 0 12px">Bonjour ${escapeHtml(context.clientName)}, nous avons bien reçu votre demande de réservation.</p>
      <div style="background:#f7f5f0;border:1px solid #e5e1d7;border-radius:12px;padding:16px;margin:16px 0;max-width:640px">
        <p style="margin:0 0 6px"><strong>Date :</strong> ${escapeHtml(dateLabel)}</p>
        <p style="margin:0 0 6px"><strong>Service :</strong> ${escapeHtml(serviceLabel)}</p>
        <p style="margin:0 0 6px"><strong>Couverts :</strong> ${context.guestsCount}</p>
        <p style="margin:0">${escapeHtml(note || 'Aucun message complémentaire.')}</p>
      </div>
      <p style="margin:0 0 12px">Notre équipe vous recontacte rapidement pour confirmer la disponibilité.</p>
      <p style="margin:0"><strong>Quai Ouest</strong><br>02 98 29 08 09</p>
    </div>
  `

  return { subject, text, html }
}

export async function sendReservationNotifications(context: ReservationNotificationContext): Promise<ReservationNotificationSummary> {
  const emailEnabled = isEmailConfigured()
  if (!emailEnabled) {
    return {
      staff: { status: 'skipped', reason: 'Email disabled: missing configuration' },
      client: { status: 'skipped', reason: 'Email disabled: missing configuration' },
    }
  }

  const staffMail = buildStaffEmail(context)
  const clientMail = buildClientEmail(context)

  const [staffResult, clientResult] = await Promise.all([
    sendResendEmail({
      to: process.env.CONTACT_EMAIL_TO!,
      subject: staffMail.subject,
      html: staffMail.html,
      text: staffMail.text,
      replyTo: context.clientEmail,
    }),
    sendResendEmail({
      to: context.clientEmail,
      subject: clientMail.subject,
      html: clientMail.html,
      text: clientMail.text,
      replyTo: process.env.CONTACT_EMAIL_TO,
    }),
  ])

  return {
    staff: {
      status: staffResult.status,
      recipient: process.env.CONTACT_EMAIL_TO,
      providerId: staffResult.providerId,
      reason: staffResult.reason,
    },
    client: {
      status: clientResult.status,
      recipient: context.clientEmail,
      providerId: clientResult.providerId,
      reason: clientResult.reason,
    },
  }
}
