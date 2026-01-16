'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('portal_user')
    if (!storedUser) {
      router.push('/auth/login')
    } else {
      setUser(JSON.parse(storedUser))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('portal_user')
    router.push('/auth/login')
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Loading...</div>
      </div>
    )
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
              <Link href="/profile" className="text-muted hover:text-text transition">Profile</Link>
            </nav>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 text-sm text-muted hover:text-text transition">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-extrabold mb-2">Welcome back, {user.username}!</h1>
        <p className="text-muted mb-8">Here's your progress overview</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Courses Enrolled</h3>
              <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-brand">3</div>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Completed</h3>
              <div className="w-10 h-10 rounded-full bg-brand2/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-brand2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-brand2">1</div>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Hours Learned</h3>
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-accent">24</div>
          </div>
        </div>

        <div className="glass rounded-xl p-6 text-center">
          <p className="text-muted mb-4">Continue building your portal experience</p>
          <div className="flex gap-4 justify-center">
            <Link href="/courses" className="px-6 py-3 bg-brand text-bg font-semibold rounded-lg hover:bg-brand2 transition">
              Browse Courses
            </Link>
            <Link href="/profile" className="px-6 py-3 border border-brand text-brand font-semibold rounded-lg hover:bg-brand/10 transition">
              Edit Profile
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
