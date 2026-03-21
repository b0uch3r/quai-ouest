import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase-server'
import { rateLimit } from '@/lib/rate-limit'
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

// Endpoint public — remplace Formspree
// Appelé directement par le formulaire du site principal
export async function POST(request: NextRequest) {
  // Rate limiting distribué (Upstash Redis)
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const { success } = await rateLimit(ip)
  if (!success) {
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

// CORS preflight — restreint à l'origine autorisée uniquement
const ALLOWED_ORIGIN = 'https://b0uch3r.github.io'

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
