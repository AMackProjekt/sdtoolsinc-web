'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PortalGrid } from '@/components/ui/PortalGrid'
import { HubHeader } from '@/components/ui/HubHeader'
import { RoleIndicator } from '@/components/ui/RoleIndicator'
import { getAvailablePortals } from '@/lib/portal-config'

export default function PortalHubPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [availablePortals, setAvailablePortals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch user session
    // For demo purposes, using mock data. Replace with actual API call:
    // fetch('/api/v1/users/me')
    //   .then(res => res.json())
    //   .then(data => { ... })
    
    // Mock user data for demonstration
    const mockUser = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      roles: ['client', 'case_manager'],
      stats: {
        activeClients: 12,
        completedTasks: 45,
        hoursLogged: 128,
      },
    }

    setUser(mockUser)
    
    // Get portals user has access to
    const portals = getAvailablePortals(mockUser.roles || [])
    setAvailablePortals(portals)
    setLoading(false)

    // Uncomment for actual API integration:
    // fetch('/api/v1/users/me')
    //   .then(res => res.json())
    //   .then(data => {
    //     setUser(data)
    //     const portals = getAvailablePortals(data.roles || [])
    //     setAvailablePortals(portals)
    //     setLoading(false)
    //   })
    //   .catch(() => {
    //     router.push('/auth/login')
    //   })
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">Loading your portals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />
      
      <HubHeader user={user} />
      
      <main className="mx-auto max-w-7xl px-6 pt-24 pb-16">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-brand to-brand2 bg-clip-text text-transparent">
            Welcome to T.O.O.L.S Inc
          </h1>
          <p className="text-lg text-muted mb-6">
            {user.name || user.email}
          </p>
          <RoleIndicator roles={user.roles || []} />
        </div>

        {/* Portal Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-text mb-6">Your Portals</h2>
          <PortalGrid portals={availablePortals} />
        </div>

        {/* Quick Stats */}
        {user.stats && (
          <div className="glass rounded-xl p-8">
            <h3 className="text-xl font-bold text-text mb-6">Quick Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-brand mb-2">
                  {user.stats.activeClients || 0}
                </div>
                <div className="text-sm text-muted">Active Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-brand2 mb-2">
                  {user.stats.completedTasks || 0}
                </div>
                <div className="text-sm text-muted">Completed Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">
                  {user.stats.hoursLogged || 0}
                </div>
                <div className="text-sm text-muted">Hours This Month</div>
              </div>
            </div>
          </div>
        )}

        {/* No Access Message */}
        {availablePortals.length === 0 && (
          <div className="glass rounded-xl p-12 text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-text mb-2">No Portal Access</h3>
            <p className="text-muted mb-6">
              You don&apos;t have access to any portals yet. Please contact your administrator.
            </p>
            <a 
              href="mailto:support@sdtoolsinc.org"
              className="px-6 py-3 bg-brand text-bg font-semibold rounded-lg hover:bg-brand2 transition inline-block"
            >
              Contact Support
            </a>
          </div>
        )}
      </main>
    </div>
  )
}
