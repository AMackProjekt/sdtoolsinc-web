'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Case Manager options (placeholder)
const caseManagers = [
  { id: '1', name: 'Sarah Johnson' },
  { id: '2', name: 'Michael Chen' },
  { id: '3', name: 'Keisha Williams' },
  { id: '4', name: 'David Rodriguez' },
  { id: '5', name: 'Not Assigned' }
]

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    phone: '',
    email: '',
    address: '',
    caseManager: '',
    interests: {
      employmentAssistance: false,
      resumeBuilding: false,
      gedProgram: false,
      communityCollege: false,
      collegeExtension: false,
      calBenefits: false
    }
  })

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('portal_user')
    if (!storedUser) {
      router.push('/auth/login')
    } else {
      setUser(JSON.parse(storedUser))
      // Load profile data (TODO: fetch from API)
      setFormData({
        fullName: 'John Doe',
        dob: '1990-05-15',
        phone: '(555) 123-4567',
        email: JSON.parse(storedUser).email || '',
        address: '123 Main St, Los Angeles, CA 90001',
        caseManager: '1',
        interests: {
          employmentAssistance: true,
          resumeBuilding: true,
          gedProgram: false,
          communityCollege: true,
          collegeExtension: false,
          calBenefits: true
        }
      })
    }
  }, [router])

  const handleSave = async () => {
    // TODO: Save to API
    setEditing(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('portal_user')
    router.push('/auth/login')
  }

  const handleInterestChange = (interest: string) => {
    setFormData({
      ...formData,
      interests: {
        ...formData.interests,
        [interest]: !formData.interests[interest as keyof typeof formData.interests]
      }
    })
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
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-xl font-bold bg-gradient-to-r from-brand to-brand2 bg-clip-text text-transparent">
              T.O.O.L.S Portal
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/dashboard" className="text-muted hover:text-text transition">Dashboard</Link>
              <Link href="/courses" className="text-muted hover:text-text transition">Courses</Link>
              <Link href="/profile" className="text-text font-medium">Profile</Link>
            </nav>
          </div>

          {/* Case Manager & Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-panel border border-border">
              <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <select
                value={formData.caseManager}
                onChange={(e) => setFormData({ ...formData, caseManager: e.target.value })}
                className="bg-transparent text-sm text-text focus:outline-none cursor-pointer"
              >
                {caseManagers.map(manager => (
                  <option key={manager.id} value={manager.id} className="bg-panel">
                    {manager.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-muted hover:text-text transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Personal Information</h2>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 text-sm bg-brand text-bg font-semibold rounded-lg hover:bg-brand2 transition"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(false)}
                      className="px-4 py-2 text-sm border border-border text-text rounded-lg hover:bg-panel transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 text-sm bg-brand text-bg font-semibold rounded-lg hover:bg-brand2 transition"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    disabled={!editing}
                    className="w-full px-4 py-2 rounded-lg bg-panel border border-border text-text focus:border-brand focus:outline-none disabled:opacity-60"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    disabled={!editing}
                    className="w-full px-4 py-2 rounded-lg bg-panel border border-border text-text focus:border-brand focus:outline-none disabled:opacity-60"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!editing}
                    className="w-full px-4 py-2 rounded-lg bg-panel border border-border text-text focus:border-brand focus:outline-none disabled:opacity-60"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!editing}
                    className="w-full px-4 py-2 rounded-lg bg-panel border border-border text-text focus:border-brand focus:outline-none disabled:opacity-60"
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={!editing}
                    className="w-full px-4 py-2 rounded-lg bg-panel border border-border text-text focus:border-brand focus:outline-none disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            {/* Interests & Services */}
            <div className="glass rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6">Program Interests</h2>
              <div className="space-y-3">
                {/* Employment Assistance */}
                <label className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-brand/50 transition cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.interests.employmentAssistance}
                    onChange={() => handleInterestChange('employmentAssistance')}
                    disabled={!editing}
                    className="w-5 h-5 rounded border-border text-brand focus:ring-brand focus:ring-offset-0"
                  />
                  <div>
                    <div className="font-medium">Employment Assistance</div>
                    <div className="text-sm text-muted">Job search support and career guidance</div>
                  </div>
                </label>

                {/* Resume Building */}
                <label className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-brand/50 transition cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.interests.resumeBuilding}
                    onChange={() => handleInterestChange('resumeBuilding')}
                    disabled={!editing}
                    className="w-5 h-5 rounded border-border text-brand focus:ring-brand focus:ring-offset-0"
                  />
                  <div>
                    <div className="font-medium">Resume Building & Development</div>
                    <div className="text-sm text-muted">Create and improve your professional resume</div>
                  </div>
                </label>

                {/* G.E.D Program */}
                <label className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-brand/50 transition cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.interests.gedProgram}
                    onChange={() => handleInterestChange('gedProgram')}
                    disabled={!editing}
                    className="w-5 h-5 rounded border-border text-brand focus:ring-brand focus:ring-offset-0"
                  />
                  <div>
                    <div className="font-medium">G.E.D Program</div>
                    <div className="text-sm text-muted">Prepare for and earn your GED certificate</div>
                  </div>
                </label>

                {/* Community College */}
                <label className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-brand/50 transition cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.interests.communityCollege}
                    onChange={() => handleInterestChange('communityCollege')}
                    disabled={!editing}
                    className="w-5 h-5 rounded border-border text-brand focus:ring-brand focus:ring-offset-0"
                  />
                  <div>
                    <div className="font-medium">Community College Programs</div>
                    <div className="text-sm text-muted">Explore community college options and enrollment</div>
                  </div>
                </label>

                {/* College Extension */}
                <label className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-brand/50 transition cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.interests.collegeExtension}
                    onChange={() => handleInterestChange('collegeExtension')}
                    disabled={!editing}
                    className="w-5 h-5 rounded border-border text-brand focus:ring-brand focus:ring-offset-0"
                  />
                  <div>
                    <div className="font-medium">College Extension Programs</div>
                    <div className="text-sm text-muted">Advanced educational opportunities</div>
                  </div>
                </label>

                {/* CalBenefits */}
                <label className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-brand/50 transition cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.interests.calBenefits}
                    onChange={() => handleInterestChange('calBenefits')}
                    disabled={!editing}
                    className="w-5 h-5 rounded border-border text-brand focus:ring-brand focus:ring-offset-0"
                  />
                  <div>
                    <div className="font-medium">CalBenefits Assistance</div>
                    <div className="text-sm text-muted">Help with California benefits applications</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Sidebar - Progress & AI Assistant */}
          <div className="space-y-6">
            {/* Progress Tracker */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Your Progress</h3>
              <div className="space-y-4">
                {/* Overall Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Completion</span>
                    <span className="text-brand font-medium">65%</span>
                  </div>
                  <div className="h-2 rounded-full bg-panel overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand to-brand2" style={{ width: '65%' }} />
                  </div>
                </div>

                {/* Goals */}
                <div className="pt-4 border-t border-border space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-brand" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">Profile Setup</div>
                      <div className="text-muted">Complete</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-bg" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">Complete 3 Courses</div>
                      <div className="text-muted">2 of 3 done</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-border flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium">Upload Resume</div>
                      <div className="text-muted">Not started</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Assistant */}
            <div className="glass rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-accent flex items-center justify-center">
                  <svg className="w-6 h-6 text-bg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold">AI Motivation Coach</h3>
                  <p className="text-xs text-muted">Here to support you!</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-brand/10 border border-brand/30">
                  <p className="text-sm text-text">
                    🌟 Great progress today! You're 65% through your goals. Keep up the momentum!
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-panel">
                  <p className="text-sm text-muted">
                    💪 Remember: Every step forward is progress. You've got this!
                  </p>
                </div>

                <button className="w-full px-4 py-2 text-sm bg-gradient-to-r from-brand to-brand2 text-bg font-semibold rounded-lg hover:opacity-90 transition">
                  Chat with AI Coach
                </button>
              </div>
            </div>

            {/* Assigned Case Manager Card */}
            <div className="glass rounded-xl p-6">
              <h3 className="font-bold mb-4">Your Case Manager</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center">
                  <span className="text-brand font-bold text-lg">
                    {caseManagers.find(m => m.id === formData.caseManager)?.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-medium">{caseManagers.find(m => m.id === formData.caseManager)?.name}</div>
                  <div className="text-sm text-muted">Case Manager</div>
                </div>
              </div>
              <button className="w-full px-4 py-2 text-sm border border-brand text-brand rounded-lg hover:bg-brand/10 transition">
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
