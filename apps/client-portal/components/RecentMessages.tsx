'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/cn'

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  subject: string
  preview: string
  timestamp: string
  read: boolean
}

interface RecentMessagesProps {
  messages: Message[]
  unreadCount: number
  loading?: boolean
  className?: string
}

export function RecentMessages({ messages, unreadCount, loading = false, className }: RecentMessagesProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  if (loading) {
    return (
      <div className={cn('glass rounded-xl p-6', className)}>
        <div className="h-6 w-48 bg-glass animate-pulse rounded mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-glass animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-glass animate-pulse rounded" />
                <div className="h-3 w-full bg-glass animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('glass rounded-xl p-6', className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-text">Recent Messages</h2>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-brand/20 text-brand">
              {unreadCount} new
            </span>
          )}
        </div>
        <Link
          href="/messages"
          className="text-sm text-brand hover:text-brand2 transition-colors font-medium"
        >
          View All →
        </Link>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-8 text-muted">
          No messages yet
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/messages/${message.id}`}>
                <div className={cn(
                  'flex gap-3 p-3 rounded-lg transition-all hover:scale-[1.01] group',
                  message.read ? 'hover:bg-glass' : 'bg-brand/5 hover:bg-brand/10'
                )}>
                  <div className="relative flex-shrink-0">
                    {message.senderAvatar ? (
                      <img
                        src={message.senderAvatar}
                        alt={message.senderName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand/40 to-brand2/40 flex items-center justify-center text-sm font-medium text-white">
                        {getInitials(message.senderName)}
                      </div>
                    )}
                    {!message.read && (
                      <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-brand rounded-full border-2 border-panel" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <h3 className={cn(
                        'text-sm truncate group-hover:text-brand transition-colors',
                        message.read ? 'text-text font-medium' : 'text-text font-semibold'
                      )}>
                        {message.senderName}
                      </h3>
                      <span className="text-xs text-muted flex-shrink-0">
                        {getTimeAgo(message.timestamp)}
                      </span>
                    </div>

                    <p className={cn(
                      'text-sm mb-1',
                      message.read ? 'text-muted font-normal' : 'text-text font-medium'
                    )}>
                      {message.subject}
                    </p>

                    <p className="text-xs text-muted line-clamp-1">
                      {message.preview}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
