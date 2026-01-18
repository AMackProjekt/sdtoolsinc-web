'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  title: string
  content: string
  type: 'info' | 'success' | 'warning' | 'update'
  date: string
  read: boolean
}

const mockMessages: Message[] = [
  {
    id: '1',
    title: 'New Course Available',
    content: 'Check out our new Professional Communication course!',
    type: 'info',
    date: '2024-01-15',
    read: false
  },
  {
    id: '2',
    title: 'Course Completed!',
    content: 'Congratulations! You completed Resume Writing Mastery.',
    type: 'success',
    date: '2024-01-14',
    read: false
  },
  {
    id: '3',
    title: 'Upcoming Event',
    content: 'Join us for a virtual job fair next Wednesday at 2 PM.',
    type: 'warning',
    date: '2024-01-13',
    read: true
  },
  {
    id: '4',
    title: 'Profile Update Required',
    content: 'Please update your contact information in your profile.',
    type: 'update',
    date: '2024-01-10',
    read: true
  }
]

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(mockMessages)

  const unreadCount = messages.filter(m => !m.read).length

  const markAsRead = (id: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, read: true } : msg
    ))
  }

  const markAllAsRead = () => {
    setMessages(prev => prev.map(msg => ({ ...msg, read: true })))
  }

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-brand2/10 border-brand2'
      case 'warning':
        return 'bg-yellow-400/10 border-yellow-400'
      case 'update':
        return 'bg-accent/10 border-accent'
      default:
        return 'bg-brand/10 border-brand'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5 text-brand2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'warning':
        return (
          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )
      case 'update':
        return (
          <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-panel transition-colors"
      >
        <svg className="w-6 h-6 text-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-bg text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-96 glass rounded-xl shadow-xl z-50 max-h-[500px] flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-brand hover:text-brand2 transition"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                {unreadCount > 0 && (
                  <p className="text-sm text-muted">{unreadCount} unread message{unreadCount !== 1 ? 's' : ''}</p>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-2">
                {messages.length > 0 ? (
                  <div className="space-y-2">
                    {messages.map(message => (
                      <button
                        key={message.id}
                        onClick={() => markAsRead(message.id)}
                        className={`w-full text-left p-3 rounded-lg transition-all border ${
                          message.read
                            ? 'bg-panel/40 border-transparent'
                            : getTypeStyles(message.type)
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getTypeIcon(message.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-semibold text-sm">{message.title}</h4>
                              {!message.read && (
                                <span className="w-2 h-2 bg-brand rounded-full flex-shrink-0 mt-1" />
                              )}
                            </div>
                            <p className="text-sm text-muted mb-2">{message.content}</p>
                            <p className="text-xs text-muted">
                              {new Date(message.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted">
                    <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p>No notifications</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
