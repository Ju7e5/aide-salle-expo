import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ExpoCarrelage',
  description: 'Gestion de la salle exposition carrelage',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
