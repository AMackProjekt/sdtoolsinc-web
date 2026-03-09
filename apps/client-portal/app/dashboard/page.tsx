'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { api, type DashboardData } from '@/lib/api'
import { Logo } from '../../../../components/ui/Logo'
import { StatCard } from '../../../../components/ui/StatCard'
import { HeroProgressCard } from '../../components/HeroProgressCard'
import { ProgressSection } from '../../components/ProgressSection'
import { UpcomingActivities } from '../../components/UpcomingActivities'
import { RecentMessages } from '../../components/RecentMessages'

// Mock data
const mockStats = {
  checkIns: 12,
  hoursLearned: 24,
  certificates: 3,
  coursesCompleted: 5
}

const mockProgress = {
  coursesCompleted: 5,
  totalCourses: 10,
  milestones: [
    { id: '1', title: 'Complete Profile Setup', completed: true },
    { id: '2', title: 'First Course Completed', completed: true },
    { id: '3', title: 'Attend First Workshop', completed: true },
    { id: '4', title: 'Submit Weekly Check-in', completed: false },
    { id: '5', title: 'Complete 10 Courses', completed: false }
  ]
}

const mockCourses = [
  { id: '1', title: 'Resume Building Essentials', progress: 100, completed: true },
  { id: '2', title: 'Interview Skills Workshop', progress: 75, completed: false },
  { id: '3', title: 'Financial Literacy Basics', progress: 45, completed: false }
]

const mockActivities = [
  {
    id: '1',
    title: 'One-on-One with Case Manager',
    type: 'meeting' as const,
    date: '2024-01-20',
    time: '2:00 PM',
    location: 'Office 201'
  },
  {
    id: '2',
    title: 'Job Fair - Local Employers',
    type: 'event' as const,
    date: '2024-01-22',
    time: '10:00 AM',
    location: 'Community Center'
  },
  {
    id: '3',
    title: 'Weekly Progress Report Due',
    type: 'deadline' as const,
    date: '2024-01-25',
    time: '5:00 PM'
  }
]

const mockMessages = [
  {
    id: '1',
    senderId: 'cm1',
    senderName: 'Sarah Johnson',
    subject: 'Great progress this week!',
    preview: "I've reviewed your latest check-in and wanted to congratulate you on...",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: '2',
    senderId: 'cm1',
    senderName: 'Sarah Johnson',
    subject: 'Upcoming job fair opportunity',
    preview: 'There is an excellent opportunity coming up next week that...',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: '3',
    senderId: 'admin',
    senderName: 'T.O.O.L.S Admin',
    subject: 'New courses available',
    preview: 'We have just added 3 new courses to the learning portal...',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: true
  }
]

export default function DashboardPage() {
  const router = useRouter()
  const { user, profile, isAuthenticated, isLoading, signOut } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [notificationCount] = useState(2)
  const [securityNotice, setSecurityNotice] = useState('')
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    stats: mockStats,
    progress: mockProgress,
    courses: mockCourses,
    activities: mockActivities,
    messages: mockMessages,
  })
  const unreadMessagesCount = dashboardData.messages.filter((message) => !message.read).length

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (!isAuthenticated) return

    const loadDashboard = async () => {
      try {
        const data = await api.getDashboardData()
        setDashboardData(data)
      } catch {
        setDashboardData({
          stats: mockStats,
          progress: mockProgress,
          courses: mockCourses,
          activities: mockActivities,
          messages: mockMessages,
        })
      }
    }

    const notice = window.localStorage.getItem('portal_security_notice')
    if (notice) {
      setSecurityNotice(notice)
      window.localStorage.removeItem('portal_security_notice')
    }

    loadDashboard()
  }, [isAuthenticated])

  const handleLogout = async () => {
    await signOut()
    router.push('/auth/login')
  }

  const getUserInitials = () => {
    const name = profile?.full_name || user?.email || 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />
        <div className="text-muted">Loading your dashboard...</div>
      </div>
    )
  }

  if (!user || !isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo href="/dashboard" size="md" animated />
            <nav className="hidden md:flex gap-6">
              <Link href="/dashboard" className="text-text font-medium hover:text-brand transition">
                Dashboard
              </Link>
              <Link href="/courses" className="text-muted hover:text-text transition">
                Courses
              </Link>
              <Link href="/journal" className="text-muted hover:text-text transition">
                Journal
              </Link>
              <Link href="/profile" className="text-muted hover:text-text transition">
                Profile
              </Link>
              <Link href="/messages" className="text-muted hover:text-text transition">
                Messages
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button className="relative p-2 text-muted hover:text-text transition rounded-lg hover:bg-glass">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-brand rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* User Avatar with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-glass transition"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-brand2 flex items-center justify-center text-sm font-medium text-white">
                  {getUserInitials()}
                </div>
                <svg
                  className={`w-4 h-4 text-muted transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 glass rounded-lg border border-border shadow-xl overflow-hidden">
                  <div className="p-3 border-b border-border">
                    <p className="text-sm font-medium text-text truncate">{profile?.full_name || 'User'}</p>
                    <p className="text-xs text-muted truncate">{user?.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-muted hover:text-text hover:bg-glass transition"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Profile & Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-glass transition border-t border-border"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold mb-2">Welcome back, {profile?.full_name || 'Guest'}!</h1>
          <p className="text-muted">Here's your progress overview and upcoming activities</p>
        </div>

        {securityNotice && (
          <div className="mb-6 rounded-lg border border-brand/30 bg-brand/10 px-4 py-3 text-sm text-brand" role="status" aria-live="polite">
            {securityNotice}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Check-ins"
            value={dashboardData.stats.checkIns}
            icon="✓"
            variant="success"
            trend={{ value: 15, label: 'vs last month', isPositive: true }}
          />
          <StatCard
            title="Hours Learned"
            value={dashboardData.stats.hoursLearned}
            icon="📚"
            variant="primary"
            trend={{ value: 20, label: 'vs last month', isPositive: true }}
          />
          <StatCard
            title="Certificates"
            value={dashboardData.stats.certificates}
            icon="🏆"
            variant="warning"
          />
          <StatCard
            title="Courses Completed"
            value={dashboardData.stats.coursesCompleted}
            icon="🎓"
            variant="default"
            onClick={() => router.push('/courses')}
          />
        </div>

        {/* Hero Progress Card */}
        <div className="mb-8">
          <HeroProgressCard
            coursesCompleted={dashboardData.progress.coursesCompleted}
            totalCourses={dashboardData.progress.totalCourses}
            milestones={dashboardData.progress.milestones}
            onClick={() => router.push('/courses')}
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ProgressSection courses={dashboardData.courses} />
          <UpcomingActivities activities={dashboardData.activities} />
        </div>

        {/* Recent Messages */}
        <div className="mb-8">
          <RecentMessages messages={dashboardData.messages} unreadCount={unreadMessagesCount} />
        </div>

        {/* Bottom CTAs */}
        <div className="glass rounded-xl p-6 text-center">
          <p className="text-muted mb-4">Ready to take the next step?</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/profile"
              className="px-6 py-3 bg-brand text-white font-semibold rounded-lg hover:bg-brand2 transition"
            >
              Submit Update
            </Link>
            <Link
              href="/courses"
              className="px-6 py-3 border border-brand text-brand font-semibold rounded-lg hover:bg-brand/10 transition"
            >
              View Resources
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
