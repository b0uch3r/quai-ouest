import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { z } from 'zod'

// Rate limiting simple en mémoire (reset au redéploiement)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 5 // max 5 soumissions
const RATE_WINDOW = 60 * 60 * 1000 // par heure

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW })
    return false
  }
  entry.count++
  return entry.count > RATE_LIMIT
}

const publicReservationSchema = z.object({
  nom: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  telephone: z.string().optional().default(''),
  date: z.string().min(1, 'Date requise'),
  personnes: z.string().min(1, 'Nombre de personnes requis'),
  service: z.string().optional().default(''),
  message: z.string().optional().default(''),
  // Honeypot anti-spam
  _gotcha: z.string().max(0).optional(),
})

// Endpoint public — remplace Formspree
// Appelé directement par le formulaire du site principal
export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Trop de demandes. Réessayez dans une heure.' },
      { status: 429 }
    )
  }

  const body = await request.json()

  // Honeypot check
  if (body._gotcha) {
    // Bot detected — return 200 silently
    return NextResponse.json({ ok: true })
  }

  const parsed = publicReservationSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Données invalides', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { nom, email, telephone, date, personnes, service, message } = parsed.data
  const supabase = createServiceClient()

  // Parse guests count: "2 personnes" → 2, "6+ personnes" → 6
  const guestsCount = parseInt(personnes) || 2

  // Parse service: "Soir (vendredi & samedi)" → "soir", "Midi" → "midi"
  const serviceType = service.toLowerCase().startsWith('soir') ? 'soir' : 'midi'

  // Upsert client
  let clientId: string | null = null
  const { data: existingClient } = await supabase
    .from('clients')
    .select('id')
    .eq('email', email)
    .single()

  if (existingClient) {
    clientId = existingClient.id
    await supabase.rpc('increment_visits', { p_client_id: clientId })
  } else {
    const { data: newClient } = await supabase
      .from('clients')
      .insert({
        full_name: nom,
        email,
        phone: telephone || null,
        total_visits: 1,
        last_visit_at: new Date().toISOString(),
        consent_given_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (newClient) clientId = newClient.id
  }

  // Insert reservation
  const { error } = await supabase
    .from('reservations')
    .insert({
      client_id: clientId,
      reservation_date: date,
      service: serviceType,
      guests_count: guestsCount,
      status: 'pending',
      special_requests: message || null,
      source: 'website',
    })

  if (error) {
    console.error('Reservation insert error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}

// CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
