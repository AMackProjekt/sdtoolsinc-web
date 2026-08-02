'use client'

import './globals.css'
import { AuthProvider } from '@/lib/auth'
import { MackAI } from '@/components/ui/MackAI'
import { Toaster } from '@/components/ui/Toaster'
import { RedirectTiming } from '@/components/RedirectTiming'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>T.O.O.L.S Inc - Case Manager Portal</title>
        <meta name="description" content="Case Manager Portal for T.O.O.L.S Inc" />
        <link rel="icon" href="/logos/main-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logos/main-logo.png" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-CLEPBVEEFX" />
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CLEPBVEEFX');
          `
        }} />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          <RedirectTiming portal="casemgr" />
          {children}
          <MackAI />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}

