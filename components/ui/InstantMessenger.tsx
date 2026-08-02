'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: Date
  isOwn: boolean
}

interface InstantMessengerProps {
  recipientId: string
  recipientName: string
  currentUserId: string
  currentUserName: string
  onSendMessage: (content: string) => Promise<void>
  onLoadMessages?: () => Promise<Message[]>
  className?: string
}

export function InstantMessenger({
  recipientId,
  recipientName,
  currentUserId,
  currentUserName,
  onSendMessage,
  onLoadMessages,
  className
}: InstantMessengerProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [online, setOnline] = useState(true)
  const [typing, setTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load initial messages
    const loadInitialMessages = async () => {
      if (onLoadMessages) {
        const loadedMessages = await onLoadMessages()
        setMessages(loadedMessages)
      }
    }
    loadInitialMessages()

    // Simulate online status check
    const onlineInterval = setInterval(() => {
      setOnline(Math.random() > 0.1) // 90% online
    }, 5000)

    return () => clearInterval(onlineInterval)
  }, [onLoadMessages])

  useEffect(() => {
    // Auto-scroll to bottom on new messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return

    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      senderId: currentUserId,
      senderName: currentUserName,
      content: newMessage,
      timestamp: new Date(),
      isOwn: true
    }

    setMessages(prev => [...prev, tempMessage])
    setNewMessage('')
    setSending(true)

    try {
      await onSendMessage(newMessage)
      // In real implementation, server would return the actual message with ID
    } catch (error) {
      console.error('Failed to send message:', error)
      // Remove temp message on error
      setMessages(prev => prev.filter(m => m.id !== tempMessage.id))
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  return (
    <div className={cn('glass rounded-xl flex flex-col h-[600px]', className)}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand/40 to-brand2/40 flex items-center justify-center text-sm font-medium text-white">
              {getInitials(recipientName)}
            </div>
            <div className={cn(
              'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-panel',
              online ? 'bg-green-500' : 'bg-gray-500'
            )} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-text">{recipientName}</h3>
            <p className="text-xs text-muted">
              {online ? (typing ? 'typing...' : 'Active now') : 'Offline'}
            </p>
          </div>
          <button className="p-2 rounded-lg hover:bg-glass transition-colors text-muted hover:text-text">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-brand/20 flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm text-muted">No messages yet</p>
            <p className="text-xs text-muted mt-1">Start the conversation!</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn('flex gap-2', message.isOwn ? 'flex-row-reverse' : 'flex-row')}
              >
                {!message.isOwn && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand/40 to-brand2/40 flex items-center justify-center text-xs font-medium text-white flex-shrink-0">
                    {getInitials(message.senderName)}
                  </div>
                )}
                <div className={cn('flex flex-col', message.isOwn ? 'items-end' : 'items-start')}>
                  <div className={cn(
                    'px-4 py-2 rounded-2xl max-w-xs break-words',
                    message.isOwn
                      ? 'bg-gradient-to-r from-brand to-brand2 text-white rounded-br-sm'
                      : 'bg-glass border border-border text-text rounded-bl-sm'
                  )}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <span className="text-xs text-muted mt-1 px-2">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <button className="p-2 rounded-lg hover:bg-glass transition-colors text-muted hover:text-text">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-bg border border-border rounded-lg text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand"
            disabled={sending}
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-all',
              !newMessage.trim() || sending
                ? 'bg-muted/20 text-muted cursor-not-allowed'
                : 'bg-gradient-to-r from-brand to-brand2 text-white hover:shadow-lg'
            )}
          >
            {sending ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
