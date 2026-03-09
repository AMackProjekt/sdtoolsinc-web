'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'

export default function ProfilePage() {
  const router = useRouter()
  const { user, profile, isAuthenticated, isLoading, signOut } = useAuth()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      fullName: profile?.full_name || '',
      email: profile?.email || user?.email || '',
    }))
  }, [profile, user])

  const handleLogout = async () => {
    await signOut()
    router.push('/auth/login')
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setMessage('')

      await api.updateProfile({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      })

      setEditing(false)
      setMessage('Profile saved successfully.')
    } catch {
      setMessage('Unable to save profile right now. Your changes are kept locally on screen.')
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
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
              <Link href="/dashboard" className="text-muted hover:text-text transition">Dashboard</Link>
              <Link href="/courses" className="text-muted hover:text-text transition">Courses</Link>
              <Link href="/journal" className="text-muted hover:text-text transition">Journal</Link>
              <Link href="/messages" className="text-muted hover:text-text transition">Messages</Link>
              <Link href="/profile" className="text-text font-medium">Profile</Link>
            </nav>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 text-sm text-muted hover:text-text transition">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="glass rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Profile & Settings</h1>
              <p className="text-sm text-muted">Update your personal details used by your care team.</p>
            </div>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="px-4 py-2 rounded-lg bg-brand text-bg font-semibold hover:bg-brand2 transition">
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 rounded-lg border border-border text-text hover:bg-panel transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-brand text-bg font-semibold hover:bg-brand2 transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>

          {message && (
            <div className="rounded-lg border border-brand/30 bg-brand/10 px-4 py-3 text-sm text-brand" role="status" aria-live="polite">
              {message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-2">Full Name</label>
              <input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                disabled={!editing}
                className="w-full px-4 py-3 rounded-lg bg-panel border border-border text-text focus:border-brand focus:outline-none disabled:opacity-60"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!editing}
                className="w-full px-4 py-3 rounded-lg bg-panel border border-border text-text focus:border-brand focus:outline-none disabled:opacity-60"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone</label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!editing}
                className="w-full px-4 py-3 rounded-lg bg-panel border border-border text-text focus:border-brand focus:outline-none disabled:opacity-60"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-2">Address</label>
              <input
                id="address"
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={!editing}
                className="w-full px-4 py-3 rounded-lg bg-panel border border-border text-text focus:border-brand focus:outline-none disabled:opacity-60"
              />
            </div>
          </div>

          <div className="rounded-lg border border-border p-4 text-sm text-muted">
            Security: Verified email and staff approval are required for portal access. If your role or account status looks incorrect, contact your case manager.
          </div>
        </div>
      </main>
    </div>
  )
}
