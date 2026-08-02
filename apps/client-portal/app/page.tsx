'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PortalHome() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login page
    router.push('/auth/login')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-muted">Redirecting to login...</div>
    </div>
  )
}
