'use client'

import type { User } from '@/lib/types'

export function HubHeader({ user }: { user: User | null }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-bg/80 border-b border-border">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand to-brand2 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🛠️</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-text">T.O.O.L.S Inc</h1>
            <p className="text-xs text-muted">Portal Hub</p>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-text">{user?.name || user?.email}</p>
            <p className="text-xs text-muted">
              {user?.roles?.join(', ') || 'No roles assigned'}
            </p>
          </div>
          <div className="w-10 h-10 bg-brand/20 rounded-full flex items-center justify-center">
            <span className="text-xl">👤</span>
          </div>
        </div>
      </div>
    </header>
  )
}
