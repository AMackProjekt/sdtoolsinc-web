'use client'

import { useState, useEffect } from 'react'
import { Button } from './Button'

interface CoachingMessage {
  type: 'motivation' | 'tip' | 'celebration' | 'encouragement' | 'quote'
  message: string
  author?: string
  action?: string
}

interface AICoachProps {
  clientName?: string
  progress?: number
  recentAchievements?: string[]
  goals?: { goal: string; status: string }[]
  lastActivity?: string
}

export function AICoach({ 
  clientName, 
  progress = 0, 
  recentAchievements = [],
  goals = [],
  lastActivity 
}: AICoachProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMessage, setCurrentMessage] = useState<CoachingMessage | null>(null)
  const [showNewBadge, setShowNewBadge] = useState(true)

  // Motivational quotes and tips library
  const motivationalContent = {
    quotes: [
      { message: "Your past does not define your future. Every day is a new opportunity to become the person you want to be.", author: "Unknown" },
      { message: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
      { message: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
      { message: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
      { message: "You are braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne" },
      { message: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
      { message: "Every accomplishment starts with the decision to try.", author: "John F. Kennedy" },
      { message: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" }
    ],
    tips: [
      { message: "Break down big goals into smaller, manageable steps. Celebrate each small win along the way.", action: "Set a small goal for today" },
      { message: "Build a support network. Connect with mentors, peers, or support groups who understand your journey.", action: "Reach out to someone today" },
      { message: "Practice self-compassion. Be as kind to yourself as you would be to a friend facing similar challenges.", action: "Write down 3 things you did well today" },
      { message: "Establish a daily routine. Structure helps create stability and builds positive momentum.", action: "Create a morning routine" },
      { message: "Focus on progress, not perfection. Every step forward is a victory worth celebrating.", action: "Review your progress this week" },
      { message: "Keep a gratitude journal. Writing down three things you're grateful for each day can shift your mindset.", action: "Start a gratitude practice" },
      { message: "Set boundaries and learn to say no to things that don't serve your growth.", action: "Identify one boundary to set" },
      { message: "Invest in your skills. Learning something new builds confidence and opens doors.", action: "Explore a new skill or training" }
    ],
    celebrations: [
      { message: "Amazing progress! You've come so far. Your dedication is inspiring and shows real commitment to your goals." },
      { message: "Look at you go! Every step you take is building a stronger foundation for your future." },
      { message: "You're doing it! Your hard work and persistence are paying off. Keep this momentum going!" },
      { message: "What an achievement! You should be proud of how far you've come. This is just the beginning!" },
      { message: "Outstanding effort! Your commitment to growth and change is truly remarkable." }
    ],
    encouragement: [
      { message: "Remember, setbacks are not failures—they're opportunities to learn and grow stronger." },
      { message: "Your journey is unique. Don't compare your progress to others. Focus on being better than you were yesterday." },
      { message: "It's okay to have difficult days. What matters is that you keep showing up and trying." },
      { message: "You've already overcome so much. You have the strength to handle whatever comes next." },
      { message: "Every day you're working toward your goals is a day to be proud of, no matter how small the step." },
      { message: "Your potential is limitless. Don't let past mistakes define what you can achieve." },
      { message: "Challenges are temporary, but the skills and resilience you're building will last forever." },
      { message: "You are capable of more than you know. Keep pushing forward—you've got this!" }
    ]
  }

  // Generate personalized coaching message based on context
  const generateMessage = (): CoachingMessage => {
    // Celebration for high progress
    if (progress >= 70) {
      const celebration = motivationalContent.celebrations[Math.floor(Math.random() * motivationalContent.celebrations.length)]
      return {
        type: 'celebration',
        message: `${clientName ? `${clientName}, ` : ''}${celebration.message} You're at ${progress}% completion!`
      }
    }

    // Encouragement for recent achievements
    if (recentAchievements.length > 0) {
      return {
        type: 'encouragement',
        message: `Great work on ${recentAchievements[0]}! This shows real commitment to your growth. What would you like to accomplish next?`
      }
    }

    // Goal-focused encouragement
    if (goals.length > 0) {
      const inProgressGoals = goals.filter(g => g.status === 'In Progress')
      if (inProgressGoals.length > 0) {
        return {
          type: 'encouragement',
          message: `You're making progress on "${inProgressGoals[0].goal}". Stay focused—you're building momentum!`,
          action: 'Review your goals'
        }
      }
    }

    // Random motivational content
    const contentType = Math.random() > 0.5 ? 'quotes' : 'tips'
    const content = motivationalContent[contentType][Math.floor(Math.random() * motivationalContent[contentType].length)]
    
    return {
      type: contentType === 'quotes' ? 'quote' : 'tip',
      message: content.message,
      author: 'author' in content ? content.author : undefined,
      action: 'action' in content ? content.action : undefined
    }
  }

  // Load new message when component mounts or when opened
  useEffect(() => {
    if (isOpen && !currentMessage) {
      setCurrentMessage(generateMessage())
    }
  }, [isOpen])

  // Show new message daily
  useEffect(() => {
    const lastMessageDate = localStorage.getItem('lastCoachingMessageDate')
    const today = new Date().toDateString()
    
    if (lastMessageDate !== today) {
      setShowNewBadge(true)
      localStorage.setItem('lastCoachingMessageDate', today)
    }
  }, [])

  const handleOpen = () => {
    setIsOpen(true)
    setShowNewBadge(false)
    if (!currentMessage) {
      setCurrentMessage(generateMessage())
    }
  }

  const handleNewMessage = () => {
    setCurrentMessage(generateMessage())
  }

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'celebration': return '🎉'
      case 'quote': return '💡'
      case 'tip': return '✨'
      case 'encouragement': return '💪'
      default: return '🌟'
    }
  }

  return (
    <>
      {/* Floating Coach Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={handleOpen}
          className="relative group"
          aria-label="Open AI Coach"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-brand2 flex items-center justify-center text-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
            🤖
          </div>
          {showNewBadge && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand rounded-full animate-pulse" />
          )}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-bg/95 backdrop-blur-sm rounded-lg text-xs text-text whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            AI Coach
          </div>
        </button>
      </div>

      {/* Coaching Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="glass rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-border bg-gradient-to-br from-accent/10 to-brand2/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🤖</div>
                  <div>
                    <h2 className="text-xl font-bold text-text">AI Coach</h2>
                    <p className="text-xs text-muted">Your daily source of motivation</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted hover:text-text transition"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Message Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {currentMessage && (
                <div className="space-y-4">
                  {/* Message Type Badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getMessageIcon(currentMessage.type)}</span>
                    <span className="text-xs font-medium uppercase tracking-wider text-brand2">
                      {currentMessage.type}
                    </span>
                  </div>

                  {/* Message */}
                  <p className="text-base text-text leading-relaxed">
                    {currentMessage.message}
                  </p>

                  {/* Author (for quotes) */}
                  {currentMessage.author && (
                    <p className="text-sm text-muted italic">
                      — {currentMessage.author}
                    </p>
                  )}

                  {/* Action Button */}
                  {currentMessage.action && (
                    <div className="pt-4">
                      <Button variant="outline" size="sm" className="w-full">
                        {currentMessage.action}
                      </Button>
                    </div>
                  )}

                  {/* Progress Visualization */}
                  {progress > 0 && (
                    <div className="mt-6 p-4 bg-bg rounded-lg">
                      <div className="flex justify-between text-xs text-muted mb-2">
                        <span>Your Journey</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-2 bg-panel rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-accent to-brand2 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Recent Achievements */}
                  {recentAchievements.length > 0 && (
                    <div className="mt-4 p-4 bg-brand/5 rounded-lg border border-brand/20">
                      <div className="text-xs font-medium text-brand mb-2">Recent Wins</div>
                      <ul className="space-y-1">
                        {recentAchievements.slice(0, 3).map((achievement, i) => (
                          <li key={i} className="text-sm text-text flex items-start gap-2">
                            <span className="text-brand">✓</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-border bg-bg/50">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleNewMessage}
                  className="flex-1"
                >
                  New Message
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => setIsOpen(false)}
                  className="flex-1"
                >
                  Got It!
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
