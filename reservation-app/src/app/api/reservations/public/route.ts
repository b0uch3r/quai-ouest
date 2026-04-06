import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { executeReservationWorkflow } from '@/lib/reservation-workflow'
import { rateLimit } from '@/lib/rate-limit'
import { createServiceClient } from '@/lib/supabase-server'

const ALLOWED_ORIGIN = 'https://b0uch3r.github.io'
const RESTAURANT_TIMEZONE = 'Europe/Paris'
const GUEST_OPTIONS = ['1', '2', '3', '4', '5', '6', '7+'] as const
const SERVICE_OPTIONS = ['midi', 'soir'] as const

function getCorsHeaders(request: NextRequest) {
  const origin = request.headers.get('origin')

  return {
    'Access-Control-Allow-Origin': origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : '',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

function getTodayInRestaurantTimezone() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: RESTAURANT_TIMEZONE,
  }).format(new Date())
}

function parseIsoDateParts(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return { year, month, day }
}

function isValidIsoDate(value: string) {
  const { year, month, day } = parseIsoDateParts(value)

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return false
  }

  const parsed = new Date(Date.UTC(year, month - 1, day, 12))

  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  )
}

function getDayOfWeek(value: string) {
  const { year, month, day } = parseIsoDateParts(value)
  return new Date(Date.UTC(year, month - 1, day, 12)).getUTCDay()
}

const publicReservationSchema = z.object({
  nom: z.string().min(2, 'Nom requis').max(100, 'Nom trop long'),
  email: z.string().email('Email invalide').max(254, 'Email trop long'),
  telephone: z.string().max(20, 'Telephone trop long').optional().default(''),
  date: z.string()
    .min(1, 'Date requise')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (AAAA-MM-JJ)')
    .refine(isValidIsoDate, 'Date invalide')
    .refine((date) => date >= getTodayInRestaurantTimezone(), 'Date invalide ou passee'),
  personnes: z.enum(GUEST_OPTIONS, {
    message: 'Nombre de personnes requis',
  }),
  service: z.enum(SERVICE_OPTIONS, {
    message: 'Service requis',
  }),
  message: z.string().max(1000, 'Message trop long').optional().default(''),
  _gotcha: z.string().max(0).optional(),
}).superRefine((data, ctx) => {
  const day = getDayOfWeek(data.date)

  if (day === 1 || day === 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['date'],
      message: 'Le restaurant est ferme le lundi et le mardi',
    })
    return
  }

  if (data.service === 'soir' && ![4, 5, 6].includes(day)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['service'],
      message: 'Le service du soir est disponible uniquement du jeudi au samedi',
    })
  }
})

export async function POST(request: NextRequest) {
  const cors = getCorsHeaders(request)

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  const { success } = await rateLimit(ip)

  if (!success) {
    return NextResponse.json(
      { error: 'Trop de demandes. Reessayez dans une heure.' },
      { status: 429, headers: cors }
    )
  }

  const body = await request.json()

  if (body._gotcha) {
    return NextResponse.json({ ok: true }, { headers: cors })
  }

  const parsed = publicReservationSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Donnees invalides', details: parsed.error.flatten().fieldErrors },
      { status: 400, headers: cors }
    )
  }

  const { nom, email, telephone, date, personnes, service, message } = parsed.data
  const supabase = createServiceClient()

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
    console.error('[PUBLIC] Workflow echoue:', result.log)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500, headers: cors })
  }

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
