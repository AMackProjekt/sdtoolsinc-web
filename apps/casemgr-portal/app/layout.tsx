'use client'

import './globals.css'
import { AuthProvider } from '@/lib/auth'
import { MackAI } from '@/components/ui/MackAI'
import { Toaster } from '@/components/ui/Toaster'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>T.O.O.L.S Inc - Case Manager Portal</title>
        <meta name="description" content="Case Manager Portal for T.O.O.L.S Inc" />
        <link rel="icon" href="/tools-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/tools-logo.png" />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          <MackAI />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}

