'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/admin-auth'
import { motion } from 'framer-motion'

// Types
interface DashboardStats {
  totalUsers: number
  activeClients: number
  caseManagers: number
  pendingAssignments: number
}

interface RecentActivity {
  id: string
  type: 'user_created' | 'client_assigned' | 'case_updated' | 'admin_action'
  description: string
  timestamp: string
  user: string
}

// Mock data
const MOCK_STATS: DashboardStats = {
  totalUsers: 247,
  activeClients: 156,
  caseManagers: 18,
  pendingAssignments: 12
}

const MOCK_ACTIVITIES: RecentActivity[] = [
  {
    id: '1',
    type: 'user_created',
    description: 'New client registered: Sarah Johnson',
    timestamp: '2 hours ago',
    user: 'System'
  },
  {
    id: '2',
    type: 'client_assigned',
    description: 'Client assigned to Case Manager David Lee',
    timestamp: '4 hours ago',
    user: 'Admin'
  },
  {
    id: '3',
    type: 'case_updated',
    description: 'Case status updated for Michael Brown',
    timestamp: '6 hours ago',
    user: 'CM: Jennifer Martinez'
  },
  {
    id: '4',
    type: 'admin_action',
    description: 'System backup completed successfully',
    timestamp: '8 hours ago',
    user: 'System'
  },
  {
    id: '5',
    type: 'user_created',
    description: 'New case manager joined: Alex Thompson',
    timestamp: '1 day ago',
    user: 'Super Admin'
  }
]

// Stat Card Component
interface StatCardProps {
  title: string
  value: number
  icon: string
  color: 'red' | 'orange' | 'purple' | 'blue'
  trend?: { value: number; isPositive: boolean }
}

function StatCard({ title, value, icon, color, trend }: StatCardProps) {
  const colorClasses = {
    red: 'from-brand/20 to-brand/5 text-brand',
    orange: 'from-brand2/20 to-brand2/5 text-brand2',
    purple: 'from-accent/20 to-accent/5 text-accent',
    blue: 'from-blue-500/20 to-blue-500/5 text-blue-400'
  }

  const borderColors = {
    red: 'hover:border-brand/40',
    orange: 'hover:border-brand2/40',
    purple: 'hover:border-accent/40',
    blue: 'hover:border-blue-500/40'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`glass rounded-xl p-6 transition-all ${borderColors[color]}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        {trend && (
          <div className={`text-sm font-medium ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-text mb-1">{value.toLocaleString()}</div>
      <div className="text-sm text-muted">{title}</div>
    </motion.div>
  )
}

// Quick Action Button Component
interface QuickActionProps {
  icon: string
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

function QuickActionButton({ icon, label, onClick, variant = 'secondary' }: QuickActionProps) {
  const baseClasses = "flex items-center gap-3 px-6 py-4 rounded-xl font-medium transition-all"
  const variantClasses = variant === 'primary'
    ? "bg-gradient-to-r from-brand to-brand2 text-white hover:shadow-lg hover:shadow-brand/25 hover:scale-[1.02] active:scale-[0.98]"
    : "glass hover:border-brand/40 text-text hover:scale-[1.02] active:scale-[0.98]"

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses}`}
    >
      <span className="text-2xl">{icon}</span>
      <span>{label}</span>
    </motion.button>
  )
}

// Activity Item Component
function ActivityItem({ activity }: { activity: RecentActivity }) {
  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'user_created':
        return '👤'
      case 'client_assigned':
        return '📋'
      case 'case_updated':
        return '✏️'
      case 'admin_action':
        return '⚙️'
      default:
        return '•'
    }
  }

  const getActivityColor = (type: RecentActivity['type']) => {
    switch (type) {
      case 'user_created':
        return 'text-green-400'
      case 'client_assigned':
        return 'text-blue-400'
      case 'case_updated':
        return 'text-orange-400'
      case 'admin_action':
        return 'text-purple-400'
      default:
        return 'text-muted'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-4 p-4 rounded-lg hover:bg-glass transition-colors"
    >
      <div className={`text-2xl ${getActivityColor(activity.type)}`}>
        {getActivityIcon(activity.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-text text-sm font-medium mb-1">{activity.description}</p>
        <div className="flex items-center gap-2 text-xs text-muted">
          <span>{activity.user}</span>
          <span>•</span>
          <span>{activity.timestamp}</span>
        </div>
      </div>
    </motion.div>
  )
}

// Main Dashboard Component
export default function AdminDashboard() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [stats, setStats] = useState<DashboardStats>(MOCK_STATS)
  const [activities, setActivities] = useState<RecentActivity[]>(MOCK_ACTIVITIES)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    } else {
      // Simulate data loading
      setTimeout(() => setIsLoading(false), 300)
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand/30 border-t-brand rounded-full animate-spin" />
          <div className="text-muted">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Fixed background gradient */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-brand/5 via-transparent to-transparent" />

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-border bg-bg/80">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-text">Admin Dashboard</h1>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-brand/10 text-brand border border-brand/20">
                {user.role === 'super_admin' ? 'Super Admin' : user.role.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted hidden sm:block">Welcome, {user.name}</span>
              <button
                onClick={() => router.push('/settings')}
                className="p-2 rounded-lg hover:bg-glass transition-colors text-muted hover:text-text"
                aria-label="Settings"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pt-8 pb-16">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-text mb-2">
            Welcome back, {user.name} 👋
          </h2>
          <p className="text-muted">
            Here&apos;s what&apos;s happening with your platform today
          </p>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon="👥"
            color="red"
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Active Clients"
            value={stats.activeClients}
            icon="✨"
            color="orange"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Case Managers"
            value={stats.caseManagers}
            icon="👔"
            color="purple"
            trend={{ value: 2, isPositive: true }}
          />
          <StatCard
            title="Pending Assignments"
            value={stats.pendingAssignments}
            icon="⏳"
            color="blue"
            trend={{ value: 3, isPositive: false }}
          />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-6 mb-8"
        >
          <h3 className="text-xl font-semibold text-text mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickActionButton
              icon="➕"
              label="Create User"
              onClick={() => router.push('/users/create')}
              variant="primary"
            />
            <QuickActionButton
              icon="📋"
              label="Assign Client"
              onClick={() => router.push('/clients')}
            />
            <QuickActionButton
              icon="📊"
              label="View Reports"
              onClick={() => router.push('/reports')}
            />
            <QuickActionButton
              icon="🔍"
              label="View Audit Logs"
              onClick={() => router.push('/audit')}
            />
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-text">Recent Activity</h3>
            <button
              onClick={() => router.push('/audit')}
              className="text-sm text-brand hover:text-brand2 transition-colors font-medium"
            >
              View All →
            </button>
          </div>
          
          <div className="space-y-2">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))
            ) : (
              <div className="text-center py-12 text-muted">
                No recent activity to display
              </div>
            )}
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
        >
          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <h4 className="text-sm font-medium text-text">System Status</h4>
            </div>
            <p className="text-xs text-muted">All systems operational</p>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl">💾</span>
              <h4 className="text-sm font-medium text-text">Last Backup</h4>
            </div>
            <p className="text-xs text-muted">8 hours ago</p>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl">🔒</span>
              <h4 className="text-sm font-medium text-text">Security</h4>
            </div>
            <p className="text-xs text-muted">No alerts detected</p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
