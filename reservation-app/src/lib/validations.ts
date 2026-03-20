import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Mot de passe trop court (8 caractères min.)'),
})

export const reservationUpdateSchema = z.object({
  status: z
    .enum(['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no_show'])
    .optional(),
  table_number: z.string().nullable().optional(),
  staff_notes: z.string().nullable().optional(),
  amount_cents: z.number().int().min(0).nullable().optional(),
  guests_count: z.number().int().min(1).max(20).optional(),
})

export const noteSchema = z.object({
  content: z.string().min(1, 'Le contenu ne peut pas être vide').max(2000),
})

export const clientUpdateSchema = z.object({
  full_name: z.string().min(1).optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
})

export const exportSchema = z.object({
  format: z.enum(['csv', 'pdf']),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  status: z.string().optional(),
})
