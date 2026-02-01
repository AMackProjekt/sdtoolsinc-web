'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'

export default function DashboardPage() {
  const router = useRouter()
  const { user, profile, isAuthenticated, isLoading, signOut } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  const handleLogout = async () => {
    await signOut()
    router.push('/auth/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />
        <div className="text-muted">Loading...</div>
      </div>
    )
  }

  if (!user || !isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-xl font-bold bg-gradient-to-r from-brand to-brand2 bg-clip-text text-transparent">
              T.O.O.L.S Portal
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/dashboard" className="text-text font-medium">Dashboard</Link>
              <Link href="/courses" className="text-muted hover:text-text transition">Courses</Link>
              <Link href="/journal" className="text-muted hover:text-text transition">Journal</Link>
              <Link href="/profile" className="text-muted hover:text-text transition">Profile</Link>
              <Link href="/program-interest" className="text-muted hover:text-text transition">Add Portal to Your Program</Link>
            </nav>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 text-sm text-muted hover:text-text transition">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-extrabold mb-2">Welcome back, {profile?.full_name || 'Guest'}!</h1>
        <p className="text-muted mb-8">Here's your progress overview</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Email</h3>
              <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="text-sm truncate text-brand">{user?.email}</div>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Member Since</h3>
              <div className="w-10 h-10 rounded-full bg-brand2/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-brand2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="text-sm text-brand2">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Today'}
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Role</h3>
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-sm text-accent capitalize">{profile?.role || 'client'}</div>
          </div>
        </div>

        <div className="glass rounded-xl p-6 text-center">
          <p className="text-muted mb-4">Continue building your portal experience</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/courses" className="px-6 py-3 bg-brand text-bg font-semibold rounded-lg hover:bg-brand2 transition">
              Browse Courses
            </Link>
            <Link href="/profile" className="px-6 py-3 border border-brand text-brand font-semibold rounded-lg hover:bg-brand/10 transition">
              Edit Profile
            </Link>
            <Link href="/program-interest" className="px-6 py-3 bg-gradient-to-r from-accent to-brand2 text-bg font-semibold rounded-lg hover:opacity-90 transition">
              📋 Add Portal to Your Program
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
