'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { Logo } from '@/components/ui/Logo'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton'

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  subject: string
  preview: string
  body: string
  timestamp: string
  read: boolean
}

// Mock data - replace with API call
const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    senderId: 'cm-1',
    senderName: 'Jennifer Martinez',
    subject: 'Weekly Check-in',
    preview: 'Hi! Just wanted to check in on your progress this week...',
    body: 'Hi! Just wanted to check in on your progress this week. How are the courses going? Let me know if you need any support or resources.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: '2',
    senderId: 'cm-1',
    senderName: 'Jennifer Martinez',
    subject: 'Workshop Reminder',
    preview: 'Don\'t forget about the job readiness workshop tomorrow...',
    body: 'Don\'t forget about the job readiness workshop tomorrow at 2 PM. We\'ll be covering resume building and interview skills. Looking forward to seeing you there!',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    read: true
  }
]

export default function MessagesPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  const unreadCount = messages.filter(m => !m.read).length

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <LoadingSkeleton variant="card" width="300px" height="200px" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo size="md" href="/dashboard" />
            <nav className="hidden md:flex gap-6">
              <Link href="/dashboard" className="text-muted hover:text-text transition">Dashboard</Link>
              <Link href="/courses" className="text-muted hover:text-text transition">Courses</Link>
              <Link href="/journal" className="text-muted hover:text-text transition">Journal</Link>
              <Link href="/messages" className="text-text font-medium">Messages</Link>
              <Link href="/profile" className="text-muted hover:text-text transition">Profile</Link>
            </nav>
          </div>
          <Link href="/dashboard" className="px-4 py-2 text-sm text-muted hover:text-text transition">
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-4xl font-extrabold mb-2">Messages</h1>
          <p className="text-muted">
            {unreadCount > 0
              ? `You have ${unreadCount} unread message${unreadCount > 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message List */}
          <div className="lg:col-span-1 glass rounded-xl p-4">
            <div className="space-y-2">
              {messages.map((message) => (
                <button
                  key={message.id}
                  onClick={() => setSelectedMessage(message)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedMessage?.id === message.id
                      ? 'bg-brand/10 border-brand/30'
                      : message.read
                      ? 'hover:bg-glass'
                      : 'bg-brand/5 hover:bg-brand/10'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand/40 to-brand2/40 flex items-center justify-center text-sm font-medium text-white">
                        {getInitials(message.senderName)}
                      </div>
                      {!message.read && (
                        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-brand rounded-full border-2 border-panel" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <h3 className={`text-sm truncate ${!message.read ? 'font-semibold text-text' : 'font-medium text-text'}`}>
                          {message.senderName}
                        </h3>
                        <span className="text-xs text-muted flex-shrink-0">
                          {getTimeAgo(message.timestamp)}
                        </span>
                      </div>
                      <p className={`text-sm ${!message.read ? 'font-medium text-text' : 'text-muted'}`}>
                        {message.subject}
                      </p>
                      <p className="text-xs text-muted line-clamp-1 mt-1">
                        {message.preview}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message Content */}
          <div className="lg:col-span-2 glass rounded-xl p-6">
            {selectedMessage ? (
              <div>
                <div className="flex items-start gap-4 pb-6 border-b border-border mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand/40 to-brand2/40 flex items-center justify-center text-base font-medium text-white">
                    {getInitials(selectedMessage.senderName)}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-text mb-1">
                      {selectedMessage.subject}
                    </h2>
                    <div className="flex items-center gap-3 text-sm text-muted">
                      <span>{selectedMessage.senderName}</span>
                      <span>•</span>
                      <span>{new Date(selectedMessage.timestamp).toLocaleString()}</span>
                      {!selectedMessage.read && <StatusBadge status="active" size="sm">New</StatusBadge>}
                    </div>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-text leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.body}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-border flex gap-3">
                  <button className="px-6 py-3 bg-gradient-to-r from-brand to-brand2 text-white rounded-lg font-medium hover:shadow-lg transition-all">
                    Reply
                  </button>
                  <button className="px-6 py-3 border border-border text-text rounded-lg font-medium hover:bg-glass transition-all">
                    Mark as Unread
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 rounded-full bg-brand/20 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-text mb-2">Select a message</h3>
                <p className="text-muted">Choose a message from the list to view its content</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
