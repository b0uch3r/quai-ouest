import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'
import type { ReservationStatus, ServiceType } from '@/types'

interface ExportClient {
  full_name: string
  email: string | null
  phone: string | null
}

export interface ReservationExportRow {
  reservation_date: string
  service: ServiceType
  time_slot: string | null
  guests_count: number
  status: ReservationStatus
  amount_cents: number | null
  special_requests: string | null
  staff_notes: string | null
  client: ExportClient | null
}

interface ReservationExportFilters {
  date_from?: string
  date_to?: string
  status?: string
}

interface BuildReservationsPdfOptions {
  reservations: ReservationExportRow[]
  filters: ReservationExportFilters
}

const PAGE_WIDTH = 595.28
const PAGE_HEIGHT = 841.89
const PAGE_MARGIN = 40
const BLOCK_SPACING = 12
const LINE_SPACING = 12
const TITLE_SIZE = 20
const SUBTITLE_SIZE = 9
const BODY_SIZE = 10
const SMALL_SIZE = 9
const COLORS = {
  text: rgb(0.11, 0.14, 0.16),
  muted: rgb(0.39, 0.43, 0.47),
  accent: rgb(0.53, 0.34, 0.16),
  border: rgb(0.86, 0.84, 0.8),
  panel: rgb(0.97, 0.95, 0.92),
}

const SERVICE_LABELS: Record<ServiceType, string> = {
  midi: 'Midi',
  soir: 'Soir',
}

const STATUS_LABELS: Record<ReservationStatus, string> = {
  pending: 'En attente',
  confirmed: 'Reservee',
  seated: 'A table',
  completed: 'Terminee',
  cancelled: 'Annulee',
  no_show: 'No-show',
}

export async function buildReservationsPdf({
  reservations,
  filters,
}: BuildReservationsPdfOptions) {
  const pdfDoc = await PDFDocument.create()
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  pdfDoc.setTitle('Export reservations Quai Ouest')
  pdfDoc.setAuthor('Quai Ouest')
  pdfDoc.setSubject('Export PDF des reservations')
  pdfDoc.setCreator('Quai Ouest Reservation App')
  pdfDoc.setProducer('pdf-lib')
  pdfDoc.setCreationDate(new Date())

  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  let cursorY = drawDocumentHeader(page, regularFont, boldFont, reservations, filters)

  for (const reservation of reservations) {
    const block = buildReservationLines(reservation, regularFont)
    const blockHeight = block.lines.length * LINE_SPACING + 26

    if (cursorY - blockHeight < PAGE_MARGIN) {
      page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
      cursorY = drawContinuationHeader(page, regularFont, boldFont)
    }

    cursorY = drawReservationBlock(page, cursorY, block, regularFont, boldFont)
  }

  const pages = pdfDoc.getPages()
  pages.forEach((currentPage, index) => {
    currentPage.drawText(`Page ${index + 1}/${pages.length}`, {
      x: PAGE_WIDTH - PAGE_MARGIN - 52,
      y: 18,
      size: 8,
      font: regularFont,
      color: COLORS.muted,
    })
  })

  return pdfDoc.save()
}

function drawDocumentHeader(
  page: PDFPage,
  regularFont: PDFFont,
  boldFont: PDFFont,
  reservations: ReservationExportRow[],
  filters: ReservationExportFilters,
) {
  let y = PAGE_HEIGHT - PAGE_MARGIN

  page.drawText('Export des reservations', {
    x: PAGE_MARGIN,
    y,
    size: TITLE_SIZE,
    font: boldFont,
    color: COLORS.text,
  })

  y -= 18
  page.drawText(`Genere le ${formatTimestamp(new Date())}`, {
    x: PAGE_MARGIN,
    y,
    size: SUBTITLE_SIZE,
    font: regularFont,
    color: COLORS.muted,
  })

  y -= 24
  page.drawRectangle({
    x: PAGE_MARGIN,
    y: y - 58,
    width: PAGE_WIDTH - PAGE_MARGIN * 2,
    height: 58,
    color: COLORS.panel,
    borderColor: COLORS.border,
    borderWidth: 1,
  })

  const totalGuests = reservations.reduce((sum, reservation) => sum + reservation.guests_count, 0)
  const totalRevenue = reservations.reduce((sum, reservation) => sum + (reservation.amount_cents ?? 0), 0)
  const summaryLines = [
    `${reservations.length} reservation${reservations.length > 1 ? 's' : ''}`,
    `${totalGuests} couvert${totalGuests > 1 ? 's' : ''}`,
    totalRevenue > 0 ? `${formatAmount(totalRevenue)} de CA renseigne` : 'Aucun CA renseigne',
  ]

  page.drawText(summaryLines.join('  |  '), {
    x: PAGE_MARGIN + 12,
    y: y - 20,
    size: BODY_SIZE,
    font: boldFont,
    color: COLORS.text,
  })

  const filterSummary = describeFilters(filters)
  page.drawText(filterSummary, {
    x: PAGE_MARGIN + 12,
    y: y - 38,
    size: SMALL_SIZE,
    font: regularFont,
    color: COLORS.muted,
  })

  y -= 82
  page.drawLine({
    start: { x: PAGE_MARGIN, y },
    end: { x: PAGE_WIDTH - PAGE_MARGIN, y },
    thickness: 1,
    color: COLORS.border,
  })

  return y - 22
}

function drawContinuationHeader(page: PDFPage, regularFont: PDFFont, boldFont: PDFFont) {
  const headerY = PAGE_HEIGHT - PAGE_MARGIN

  page.drawText('Export des reservations', {
    x: PAGE_MARGIN,
    y: headerY,
    size: 13,
    font: boldFont,
    color: COLORS.text,
  })

  page.drawText('Suite', {
    x: PAGE_WIDTH - PAGE_MARGIN - 22,
    y: headerY,
    size: SMALL_SIZE,
    font: regularFont,
    color: COLORS.muted,
  })

  page.drawLine({
    start: { x: PAGE_MARGIN, y: headerY - 10 },
    end: { x: PAGE_WIDTH - PAGE_MARGIN, y: headerY - 10 },
    thickness: 1,
    color: COLORS.border,
  })

  return headerY - 28
}

function drawReservationBlock(
  page: PDFPage,
  cursorY: number,
  block: ReturnType<typeof buildReservationLines>,
  regularFont: PDFFont,
  boldFont: PDFFont,
) {
  page.drawText(block.title, {
    x: PAGE_MARGIN,
    y: cursorY,
    size: 11,
    font: boldFont,
    color: COLORS.accent,
  })

  let y = cursorY - 16
  for (const line of block.lines) {
    page.drawText(line, {
      x: PAGE_MARGIN,
      y,
      size: BODY_SIZE,
      font: regularFont,
      color: COLORS.text,
    })
    y -= LINE_SPACING
  }

  page.drawLine({
    start: { x: PAGE_MARGIN, y: y + 2 },
    end: { x: PAGE_WIDTH - PAGE_MARGIN, y: y + 2 },
    thickness: 1,
    color: COLORS.border,
  })

  return y - BLOCK_SPACING
}

function buildReservationLines(reservation: ReservationExportRow, font: PDFFont) {
  const titleParts = [formatShortDate(reservation.reservation_date), SERVICE_LABELS[reservation.service]]
  if (reservation.time_slot) {
    titleParts.push(reservation.time_slot)
  }

  const clientName = sanitizePdfText(reservation.client?.full_name || 'Anonyme')
  const metadata = [
    `Client : ${clientName}`,
    `Couverts : ${reservation.guests_count}`,
    `Statut : ${STATUS_LABELS[reservation.status]}`,
    `Montant : ${formatAmount(reservation.amount_cents)}`,
  ]

  const contactBits: string[] = []
  if (reservation.client?.email) {
    contactBits.push(`Email : ${sanitizePdfText(reservation.client.email)}`)
  }
  if (reservation.client?.phone) {
    contactBits.push(`Telephone : ${sanitizePdfText(reservation.client.phone)}`)
  }

  const freeTextBits: string[] = []
  if (reservation.special_requests) {
    freeTextBits.push(`Demandes speciales : ${sanitizePdfText(reservation.special_requests)}`)
  }
  if (reservation.staff_notes) {
    freeTextBits.push(`Notes staff : ${sanitizePdfText(reservation.staff_notes)}`)
  }

  const lines = [
    ...wrapText(metadata.join('  |  '), font, BODY_SIZE, PAGE_WIDTH - PAGE_MARGIN * 2),
    ...wrapText(contactBits.join('  |  '), font, BODY_SIZE, PAGE_WIDTH - PAGE_MARGIN * 2),
    ...freeTextBits.flatMap((text) => wrapText(text, font, BODY_SIZE, PAGE_WIDTH - PAGE_MARGIN * 2)),
  ].filter(Boolean)

  return {
    title: sanitizePdfText(titleParts.join('  |  ')),
    lines,
  }
}

function describeFilters(filters: ReservationExportFilters) {
  const parts = ['Filtres :']

  if (filters.date_from || filters.date_to) {
    const from = filters.date_from ? formatShortDate(filters.date_from) : 'debut'
    const to = filters.date_to ? formatShortDate(filters.date_to) : 'fin'
    parts.push(`periode ${from} -> ${to}`)
  } else {
    parts.push('toutes les dates')
  }

  if (filters.status) {
    parts.push(`statuts ${sanitizePdfText(filters.status.split(',').join(', '))}`)
  } else {
    parts.push('tous les statuts')
  }

  return parts.join('  |  ')
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number) {
  const safeText = sanitizePdfText(text).trim()
  if (!safeText) return []

  const words = safeText.split(/\s+/)
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      currentLine = candidate
      continue
    }

    if (currentLine) {
      lines.push(currentLine)
      currentLine = ''
    }

    if (font.widthOfTextAtSize(word, size) <= maxWidth) {
      currentLine = word
      continue
    }

    const chunks = chunkWord(word, font, size, maxWidth)
    lines.push(...chunks.slice(0, -1))
    currentLine = chunks[chunks.length - 1] || ''
  }

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines
}

function chunkWord(word: string, font: PDFFont, size: number, maxWidth: number) {
  const chunks: string[] = []
  let currentChunk = ''

  for (const character of word) {
    const candidate = currentChunk + character
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      currentChunk = candidate
      continue
    }

    if (currentChunk) {
      chunks.push(currentChunk)
    }
    currentChunk = character
  }

  if (currentChunk) {
    chunks.push(currentChunk)
  }

  return chunks
}

function formatShortDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return sanitizePdfText(value)

  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Europe/Paris',
  }).format(date)
}

function formatTimestamp(value: Date) {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'Europe/Paris',
  }).format(value)
}

function formatAmount(amountCents: number | null) {
  if (amountCents === null || amountCents === undefined) {
    return 'Non renseigne'
  }

  const euros = new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountCents / 100)

  return `${euros} EUR`
}

function sanitizePdfText(value: string) {
  return value
    .replace(/\r?\n+/g, ' | ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u202f/g, ' ')
    .replace(/\u2018|\u2019/g, "'")
    .replace(/\u201c|\u201d/g, '"')
    .replace(/\u2013|\u2014/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/\u20ac/g, ' EUR')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, '?')
}
