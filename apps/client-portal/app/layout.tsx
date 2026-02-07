import './globals.css'
import { AuthProvider } from '@/lib/auth'
import { RedirectTiming } from '@/components/RedirectTiming'

export const metadata = {
  title: 'T.O.O.L.S Inc Portal',
  description: 'Client Portal for T.O.O.L.S Inc',
  icons: {
    icon: '/logos/main-logo.png',
    shortcut: '/logos/main-logo.png',
    apple: '/logos/main-logo.png',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
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
          <RedirectTiming portal="client" />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
