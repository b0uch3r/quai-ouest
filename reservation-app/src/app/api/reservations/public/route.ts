import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { rateLimit } from '@/lib/rate-limit'
import { executeReservationWorkflow } from '@/lib/reservation-workflow'
import { z } from 'zod'

const publicReservationSchema = z.object({
  nom: z.string().min(2, 'Nom requis').max(100, 'Nom trop long'),
  email: z.string().email('Email invalide').max(254, 'Email trop long'),
  telephone: z.string().max(20, 'Téléphone trop long').optional().default(''),
  date: z.string()
    .min(1, 'Date requise')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (AAAA-MM-JJ)')
    .refine((d) => {
      const parsed = new Date(d + 'T12:00:00')
      return !isNaN(parsed.getTime()) && parsed >= new Date(new Date().toDateString())
    }, 'Date invalide ou passée'),
  personnes: z.string().min(1, 'Nombre de personnes requis').max(5),
  service: z.string().max(10).optional().default(''),
  message: z.string().max(1000, 'Message trop long').optional().default(''),
  // Honeypot anti-spam
  _gotcha: z.string().max(0).optional(),
})

// CORS — restreint à l'origine autorisée uniquement
const ALLOWED_ORIGIN = 'https://b0uch3r.github.io'

function getCorsHeaders(request: NextRequest) {
  const origin = request.headers.get('origin')
  return {
    'Access-Control-Allow-Origin': origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : '',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

// Endpoint public — remplace Formspree
// Appelé directement par le formulaire du site principal
// Workflow complet : Capture → Email → Dashboard
export async function POST(request: NextRequest) {
  const cors = getCorsHeaders(request)

  // Rate limiting distribué (Upstash Redis)
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const { success } = await rateLimit(ip)
  if (!success) {
    return NextResponse.json(
      { error: 'Trop de demandes. Réessayez dans une heure.' },
      { status: 429, headers: cors }
    )
  }

  const body = await request.json()

  // Honeypot check
  if (body._gotcha) {
    // Bot detected — return 200 silently
    return NextResponse.json({ ok: true }, { headers: cors })
  }

  const parsed = publicReservationSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Données invalides', details: parsed.error.flatten().fieldErrors },
      { status: 400, headers: cors }
    )
  }

  const { nom, email, telephone, date, personnes, service, message } = parsed.data
  const supabase = createServiceClient()

  // ── Exécution du workflow complet ──
  // 1. Insertion en base (client + réservation)
  // 2. Envoi email de confirmation au client
  // 3. Log de notification pour le dashboard
  const result = await executeReservationWorkflow(supabase, {
    nom,
    email,
    telephone,
    date,
    personnes,
    service,
    message,
  })

  if (!result.success) {
    console.error('[PUBLIC] Workflow échoué:', result.log)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500, headers: cors })
  }

  // Log structuré pour monitoring
  console.log(`[PUBLIC] ${result.log}`)

  return NextResponse.json(
    {
      ok: true,
      reservation_id: result.reservationId,
      email_sent: result.email.sent,
    },
    { status: 201, headers: cors }
  )
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  const corsOrigin = origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : ''

  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  })
}
