import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Réservations - Le Quai Ouest',
  description: 'Gestion des réservations du restaurant Le Quai Ouest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
