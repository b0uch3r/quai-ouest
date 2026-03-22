import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

const DATE_ONLY_RE = /^(\d{4})-(\d{2})-(\d{2})$/

const frenchDateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const frenchTimeFormatter = new Intl.DateTimeFormat('fr-FR', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

function parseDateValue(value: string) {
  const dateOnlyMatch = DATE_ONLY_RE.exec(value)

  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch
    return new Date(Number(year), Number(month) - 1, Number(day))
  }

  return new Date(value)
}

function normalizeIntlSpacing(value: string) {
  return value.replace(/\u202f/g, ' ').replace(/\u00a0/g, ' ')
}

function formatFrenchDate(date: Date) {
  return normalizeIntlSpacing(frenchDateFormatter.format(date))
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  return formatFrenchDate(parseDateValue(date))
}

export function formatDateTime(date: string) {
  const parsedDate = parseDateValue(date)
  return `${formatFrenchDate(parsedDate)} à ${normalizeIntlSpacing(frenchTimeFormatter.format(parsedDate))}`
}

export function formatCurrency(cents: number | null) {
  if (cents === null || cents === undefined) return '—'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100)
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
