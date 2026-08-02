import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Portal Hub - T.O.O.L.S Inc',
  description: 'Access all your T.O.O.L.S Inc portals from one place',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
