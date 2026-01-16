import './globals.css'

export const metadata = {
  title: 'T.O.O.L.S Inc Portal',
  description: 'Client Portal for T.O.O.L.S Inc'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
