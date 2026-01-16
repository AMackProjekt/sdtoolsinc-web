'use client'

import { useEffect, useState } from 'react'

export default function PortalHome() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication via Azure SWA
    fetch('/.auth/me')
      .then(res => res.json())
      .then(data => {
        setUser(data.clientPrincipal)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass p-8 rounded-xl max-w-md text-center">
          <h1 className="text-3xl font-bold mb-4">T.O.O.L.S Inc Portal</h1>
          <p className="text-muted mb-6">Please sign in to access the portal</p>
          <a
            href="/.auth/login/aad"
            className="inline-block px-6 py-3 bg-brand text-bg font-semibold rounded-lg hover:bg-brand2 transition"
          >
            Sign In with Microsoft
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Welcome, {user.userDetails}</h1>
          <a
            href="/.auth/logout"
            className="px-4 py-2 glass rounded-lg hover:border-brand transition"
          >
            Sign Out
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-2">My Progress</h2>
            <p className="text-muted">Track your journey and milestones</p>
          </div>
          <div className="glass p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-2">Resources</h2>
            <p className="text-muted">Access tools and materials</p>
          </div>
          <div className="glass p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-2">Support</h2>
            <p className="text-muted">Get help and connect with mentors</p>
          </div>
        </div>
      </div>
    </div>
  )
}
