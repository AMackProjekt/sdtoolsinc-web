'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const MACKAI_RESPONSES: Record<string, string> = {
  greeting: "Good day! I'm MackAI, your distinguished digital companion. How may I be of service today?",
  help: "I'm here to assist you with navigating the portal, understanding your courses, finding resources, and answering questions about the T.O.O.L.S Inc programs. Please, feel free to ask me anything.",
  courses: "Certainly! We offer a variety of educational programs including G.E.D Preparation, Job Interview Skills, Resume Writing, and Financial Literacy. Would you like to know more about any particular course?",
  resources: "I'd be delighted to guide you to our resources. We have free educational platforms like Khan Academy, Coursera, and edX, as well as employment resources and community support programs. What are you most interested in?",
  profile: "Your profile contains your personal information, interests, and case manager details. You can update your information at any time. Is there something specific you'd like to adjust?",
  casemgr: "Your case manager is your dedicated support professional who guides you through your journey. They're available to schedule meetings, answer questions, and provide personalized assistance. Would you like to reach out to them?",
  progress: "Tracking your progress is essential to achieving your goals. You can view your course completion, hours learned, and achievements on your dashboard. Keep up the excellent work!",
  polite: "Thank you for your kind words! I strive to provide courteous and professional assistance. Is there anything else I can help you with today?",
  default: "That's an interesting question. While I may not have a specific answer at the moment, I encourage you to reach out to your case manager or browse our resources section. Is there something else I can assist you with?"
}

export function MackAI() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Good day! I'm MackAI. How may I assist you today?",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const getBotResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase()
    
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('greetings')) {
      return MACKAI_RESPONSES.greeting
    }
    if (msg.includes('help') || msg.includes('what can you do') || msg.includes('assist')) {
      return MACKAI_RESPONSES.help
    }
    if (msg.includes('course') || msg.includes('class') || msg.includes('learn') || msg.includes('ged')) {
      return MACKAI_RESPONSES.courses
    }
    if (msg.includes('resource') || msg.includes('material') || msg.includes('link') || msg.includes('website')) {
      return MACKAI_RESPONSES.resources
    }
    if (msg.includes('profile') || msg.includes('account') || msg.includes('information')) {
      return MACKAI_RESPONSES.profile
    }
    if (msg.includes('case manager') || msg.includes('casemgr') || msg.includes('case mgr')) {
      return MACKAI_RESPONSES.casemgr
    }
    if (msg.includes('progress') || msg.includes('achievement') || msg.includes('completion')) {
      return MACKAI_RESPONSES.progress
    }
    if (msg.includes('thank') || msg.includes('please') || msg.includes('polite') || msg.includes('gentleman')) {
      return MACKAI_RESPONSES.polite
    }
    
    return MACKAI_RESPONSES.default
  }

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate typing delay for more natural conversation
    await new Promise(resolve => setTimeout(resolve, 800))

    const botResponse: Message = {
      role: 'assistant',
      content: getBotResponse(inputValue),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, botResponse])
    setIsTyping(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-brand to-brand2 rounded-full shadow-lg flex items-center justify-center text-bg hover:shadow-xl transition-shadow"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-h-[600px] glass rounded-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-brand to-brand2 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-bg/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-xl">🎩</span>
                </div>
                <div>
                  <h3 className="font-bold text-bg">MackAI</h3>
                  <p className="text-xs text-bg/80">The Gentleman's Edition</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg/40">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-brand text-bg'
                        : 'bg-panel text-text border border-border'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-panel text-text border border-border px-4 py-2 rounded-lg">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-brand rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 bg-brand rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 bg-brand rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-panel/60 backdrop-blur-sm border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 bg-bg border border-border rounded-lg text-sm text-text placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  aria-label="Send message"
                  title="Send message"
                  className="px-4 py-2 bg-brand text-bg rounded-lg hover:bg-brand2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-muted mt-2 text-center italic">
                Powered by T.O.O.L.S Inc • Polite & Respectful AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
