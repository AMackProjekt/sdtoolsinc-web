'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/cn'
import { NotificationCenter } from './NotificationCenter'
import { CaseManagerCard } from './CaseManagerCard'

interface PortalHeaderProps {
  user?: {
    username: string
    fullName?: string
    caseManagerId?: string
  } | null
}

export function PortalHeader({ user }: PortalHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [showQuickActions, setShowQuickActions] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('portal_user')
    router.push('/auth/login')
  }

  const navItems = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/clients', label: 'Clients', icon: '👥' },
    { href: '/programs', label: '30/60/90', icon: '📋' },
    { href: '/schedule', label: 'Schedule', icon: '📅' },
    { href: '/resources', label: 'Resources', icon: '📚' },
    { href: '/calbenefits', label: 'CalBenefits', icon: '🏥' },
  ]

  const quickActions = [
    { label: 'Add New Client', action: () => router.push('/?addClient=true'), icon: '➕' },
    { label: 'Schedule Meeting', action: () => router.push('/schedule?new=true'), icon: '📅' },
    { label: 'View All Clients', action: () => router.push('/clients'), icon: '👥' },
    { label: 'Search Resources', action: () => router.push('/resources'), icon: '🔍' },
    { label: 'CalBenefits Portal', action: () => router.push('/calbenefits'), icon: '🏥' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-brand to-brand2 bg-clip-text text-transparent">
            T.O.O.L.S Case Manager
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex gap-6 items-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'font-medium transition-colors',
                  pathname === item.href
                    ? 'text-text'
                    : 'text-muted hover:text-text'
                )}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Quick Actions Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="px-3 py-1.5 bg-brand/10 text-brand rounded-lg text-sm font-medium hover:bg-brand/20 transition-colors flex items-center gap-2"
              >
                ⚡ Quick Actions
              </button>
              
              {showQuickActions && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowQuickActions(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-panel border border-border rounded-xl shadow-xl overflow-hidden z-50">
                    {quickActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          action.action()
                          setShowQuickActions(false)
                        }}
                        className="w-full px-4 py-3 text-left text-sm text-text hover:bg-brand/10 transition-colors flex items-center gap-3"
                      >
                        <span className="text-lg">{action.icon}</span>
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <NotificationCenter />
            
            {/* Case Manager Info - Desktop */}
            {user && (
              <div className="hidden lg:block">
                <CaseManagerCard caseManagerId={user.caseManagerId} compact />
              </div>
            )}
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-muted hover:text-text transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex gap-4 mt-4 overflow-x-auto pb-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium whitespace-nowrap transition-colors px-3 py-1.5 rounded-lg',
                pathname === item.href
                  ? 'bg-brand/10 text-brand'
                  : 'text-muted hover:text-text hover:bg-panel'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
