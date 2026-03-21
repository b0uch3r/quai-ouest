import { Resend } from 'resend'

// Lazy init — évite l'erreur "Missing API key" au build time
let _resend: Resend | null = null
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'reservations@lequaiouest.fr'
const RESTAURANT_NAME = 'Le Quai Ouest'
const RESTAURANT_PHONE = '02 99 XX XX XX'
const RESTAURANT_ADDRESS = 'Port de plaisance, 35000 Saint-Malo'

export interface ReservationEmailData {
  clientName: string
  clientEmail: string
  reservationDate: string // YYYY-MM-DD
  service: 'midi' | 'soir'
  guestsCount: number
  specialRequests: string | null
  reservationId: string
}

function formatDateFr(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function getServiceLabel(service: 'midi' | 'soir'): string {
  return service === 'midi' ? 'Midi (12h00 - 14h00)' : 'Soir (19h00 - 22h00)'
}

function buildConfirmationHtml(data: ReservationEmailData): string {
  const dateFormatted = formatDateFr(data.reservationDate)
  const serviceLabel = getServiceLabel(data.service)

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f8f6f0;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f6f0;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background-color:#1a3a4a;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#d4a843;font-size:28px;font-family:Georgia,'Times New Roman',serif;font-weight:700;letter-spacing:1px;">
                ${RESTAURANT_NAME}
              </h1>
              <p style="margin:8px 0 0;color:#f8f6f0;font-size:14px;opacity:0.8;">
                Bistrot de fruits de mer &middot; Saint-Malo
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 8px;color:#1a3a4a;font-size:22px;font-family:Georgia,'Times New Roman',serif;">
                Merci, ${data.clientName} !
              </h2>
              <p style="margin:0 0 24px;color:#6b7b8d;font-size:15px;line-height:1.6;">
                Votre demande de r&eacute;servation a bien &eacute;t&eacute; enregistr&eacute;e.
                Notre &eacute;quipe la confirmera dans les plus brefs d&eacute;lais.
              </p>

              <!-- Reservation Details Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f6f0;border-radius:8px;border:1px solid #e8dcc8;">
                <tr>
                  <td style="padding:24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e8dcc8;">
                          <span style="color:#6b7b8d;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Date</span><br>
                          <span style="color:#1a3a4a;font-size:16px;font-weight:600;">${dateFormatted}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e8dcc8;">
                          <span style="color:#6b7b8d;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Service</span><br>
                          <span style="color:#1a3a4a;font-size:16px;font-weight:600;">${serviceLabel}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;${data.specialRequests ? 'border-bottom:1px solid #e8dcc8;' : ''}">
                          <span style="color:#6b7b8d;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Couverts</span><br>
                          <span style="color:#1a3a4a;font-size:16px;font-weight:600;">${data.guestsCount} personne${data.guestsCount > 1 ? 's' : ''}</span>
                        </td>
                      </tr>
                      ${data.specialRequests ? `
                      <tr>
                        <td style="padding:8px 0;">
                          <span style="color:#6b7b8d;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Demande sp&eacute;ciale</span><br>
                          <span style="color:#1a3a4a;font-size:14px;font-style:italic;">&laquo; ${data.specialRequests} &raquo;</span>
                        </td>
                      </tr>` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Status Badge -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
                <tr>
                  <td align="center">
                    <span style="display:inline-block;background-color:#fef3c7;color:#92400e;padding:8px 20px;border-radius:20px;font-size:13px;font-weight:600;">
                      En attente de confirmation
                    </span>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0;color:#6b7b8d;font-size:14px;line-height:1.6;text-align:center;">
                Vous recevrez un e-mail de confirmation d&egrave;s que votre r&eacute;servation sera valid&eacute;e par notre &eacute;quipe.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#2d3a45;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 4px;color:#d4a843;font-size:14px;font-weight:600;">
                ${RESTAURANT_NAME}
              </p>
              <p style="margin:0 0 4px;color:#6b7b8d;font-size:12px;">
                ${RESTAURANT_ADDRESS}
              </p>
              <p style="margin:0;color:#6b7b8d;font-size:12px;">
                T&eacute;l : ${RESTAURANT_PHONE}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function buildConfirmationText(data: ReservationEmailData): string {
  const dateFormatted = formatDateFr(data.reservationDate)
  const serviceLabel = getServiceLabel(data.service)

  return `${RESTAURANT_NAME} — Confirmation de réservation

Merci, ${data.clientName} !

Votre demande de réservation a bien été enregistrée.

Récapitulatif :
- Date : ${dateFormatted}
- Service : ${serviceLabel}
- Couverts : ${data.guestsCount} personne${data.guestsCount > 1 ? 's' : ''}${data.specialRequests ? `\n- Demande spéciale : « ${data.specialRequests} »` : ''}

Statut : En attente de confirmation
Vous recevrez un e-mail dès que votre réservation sera validée.

---
${RESTAURANT_NAME}
${RESTAURANT_ADDRESS}
Tél : ${RESTAURANT_PHONE}`
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
  timestamp: string
}

export async function sendConfirmationEmail(data: ReservationEmailData): Promise<EmailResult> {
  const timestamp = new Date().toISOString()

  const resend = getResend()
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY non configurée — email simulé')
    return {
      success: true,
      messageId: `simulated-${Date.now()}`,
      timestamp,
    }
  }

  try {
    const { data: result, error } = await resend.emails.send({
      from: `${RESTAURANT_NAME} <${FROM_EMAIL}>`,
      to: [data.clientEmail],
      subject: `Réservation enregistrée — ${formatDateFr(data.reservationDate)}`,
      html: buildConfirmationHtml(data),
      text: buildConfirmationText(data),
      tags: [
        { name: 'type', value: 'reservation-confirmation' },
        { name: 'reservation_id', value: data.reservationId },
      ],
    })

    if (error) {
      console.error('[EMAIL] Erreur Resend:', error)
      return { success: false, error: error.message, timestamp }
    }

    return { success: true, messageId: result?.id, timestamp }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    console.error('[EMAIL] Exception:', message)
    return { success: false, error: message, timestamp }
  }
}
