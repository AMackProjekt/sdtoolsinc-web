'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface JournalEntry {
  id: string
  date: string
  type: 'daily' | 'weekly'
  emotionalState: number // 1-10
  trialsBarriers: string
  progressFeeling: number // 1-10
  selfCare: string[]
  selfLove: string
  exercise: string
  growthMoment: string
  personalInsight: string
  isPrivate: boolean
  summary?: string
}

const MOCK_ENTRIES: JournalEntry[] = [
  {
    id: '1',
    date: '2026-01-17',
    type: 'daily',
    emotionalState: 7,
    trialsBarriers: 'Had difficulty finding transportation to job interview',
    progressFeeling: 8,
    selfCare: ['Sleep 8 hours', 'Healthy meals', 'Meditation 10 min'],
    selfLove: 'Reminded myself that setbacks are temporary and I\'m making progress',
    exercise: 'Morning walk - 30 minutes',
    growthMoment: 'Old me would have cancelled the interview. Instead, I called ahead, explained the situation, and they helped me reschedule.',
    personalInsight: 'I\'m learning that asking for help is strength, not weakness',
    isPrivate: false
  },
  {
    id: '2',
    date: '2026-01-10',
    type: 'weekly',
    emotionalState: 8,
    trialsBarriers: 'Financial stress from unexpected car repair',
    progressFeeling: 7,
    selfCare: ['Consistent sleep', 'Connected with support group', 'Healthy cooking'],
    selfLove: 'Practiced gratitude for small wins this week',
    exercise: 'Gym 3x this week',
    growthMoment: 'When stressed about money, I created a budget plan instead of panicking. Old me would have made impulsive decisions.',
    personalInsight: 'Building a support network takes time but it\'s worth it',
    isPrivate: true,
    summary: 'Working through financial challenges with planning and support'
  }
]

export default function JournalPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [entries, setEntries] = useState<JournalEntry[]>(MOCK_ENTRIES)
  const [showNewEntry, setShowNewEntry] = useState(false)
  const [entryType, setEntryType] = useState<'daily' | 'weekly'>('daily')
  const [newEntry, setNewEntry] = useState<Partial<JournalEntry>>({
    emotionalState: 5,
    progressFeeling: 5,
    selfCare: [],
    isPrivate: false
  })

  const selfCareOptions = [
    'Sleep 7-8 hours',
    'Healthy meals',
    'Meditation/Mindfulness',
    'Connected with friends/family',
    'Time in nature',
    'Creative activity',
    'Journaling',
    'Boundaries/Saying no',
    'Professional support',
    'Positive affirmations'
  ]

  useEffect(() => {
    const storedUser = localStorage.getItem('portal_user')
    if (!storedUser) {
      router.push('/auth/login')
    } else {
      setUser(JSON.parse(storedUser))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('portal_user')
    router.push('/auth/login')
  }

  const handleSelfCareToggle = (option: string) => {
    const current = newEntry.selfCare || []
    if (current.includes(option)) {
      setNewEntry({ ...newEntry, selfCare: current.filter(o => o !== option) })
    } else {
      setNewEntry({ ...newEntry, selfCare: [...current, option] })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      type: entryType,
      emotionalState: newEntry.emotionalState || 5,
      trialsBarriers: newEntry.trialsBarriers || '',
      progressFeeling: newEntry.progressFeeling || 5,
      selfCare: newEntry.selfCare || [],
      selfLove: newEntry.selfLove || '',
      exercise: newEntry.exercise || '',
      growthMoment: newEntry.growthMoment || '',
      personalInsight: newEntry.personalInsight || '',
      isPrivate: newEntry.isPrivate || false,
      summary: newEntry.isPrivate ? generateSummary(newEntry) : undefined
    }

    setEntries([entry, ...entries])
    setShowNewEntry(false)
    setNewEntry({
      emotionalState: 5,
      progressFeeling: 5,
      selfCare: [],
      isPrivate: false
    })
  }

  const generateSummary = (entry: Partial<JournalEntry>): string => {
    const emotional = entry.emotionalState! >= 7 ? 'positive' : entry.emotionalState! >= 4 ? 'stable' : 'challenging'
    const progress = entry.progressFeeling! >= 7 ? 'strong' : entry.progressFeeling! >= 4 ? 'steady' : 'slow'
    return `Emotional state: ${emotional}, Progress feeling: ${progress}, Engaging in self-care activities, Reflecting on growth`
  }

  const getEmotionalStateLabel = (state: number) => {
    if (state >= 9) return '😄 Excellent'
    if (state >= 7) return '😊 Good'
    if (state >= 5) return '😐 Okay'
    if (state >= 3) return '😟 Struggling'
    return '😢 Very Difficult'
  }

  const getProgressLabel = (progress: number) => {
    if (progress >= 9) return '🚀 Making great strides'
    if (progress >= 7) return '⬆️ Moving forward'
    if (progress >= 5) return '➡️ Steady pace'
    if (progress >= 3) return '⏸️ Slow progress'
    return '⬇️ Feeling stuck'
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-xl font-bold bg-gradient-to-r from-brand to-brand2 bg-clip-text text-transparent">
              T.O.O.L.S Portal
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/dashboard" className="text-muted hover:text-text transition">Dashboard</Link>
              <Link href="/courses" className="text-muted hover:text-text transition">Courses</Link>
              <Link href="/journal" className="text-text font-medium">Journal</Link>
              <Link href="/profile" className="text-muted hover:text-text transition">Profile</Link>
            </nav>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 text-sm text-muted hover:text-text transition">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold mb-2">My Journal</h1>
          <p className="text-muted">Reflect on your journey, track your growth, and celebrate your progress</p>
        </div>

        {/* New Entry Button */}
        {!showNewEntry && (
          <div className="glass rounded-xl p-6 mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-text mb-1">Ready to reflect?</h2>
              <p className="text-sm text-muted">Take a moment to check in with yourself</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setEntryType('daily'); setShowNewEntry(true); }}
                className="px-6 py-3 bg-brand text-bg font-semibold rounded-lg hover:bg-brand2 transition"
              >
                📝 Daily Check-In
              </button>
              <button
                onClick={() => { setEntryType('weekly'); setShowNewEntry(true); }}
                className="px-6 py-3 border border-brand text-brand font-semibold rounded-lg hover:bg-brand/10 transition"
              >
                📊 Weekly Reflection
              </button>
            </div>
          </div>
        )}

        {/* New Entry Form */}
        {showNewEntry && (
          <form onSubmit={handleSubmit} className="glass rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text">
                {entryType === 'daily' ? '📝 Daily Check-In' : '📊 Weekly Reflection'}
              </h2>
              <button
                type="button"
                onClick={() => setShowNewEntry(false)}
                className="text-muted hover:text-text"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-6">
              {/* Emotional State */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  How are you feeling today? <span className="text-brand">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newEntry.emotionalState}
                    onChange={(e) => setNewEntry({ ...newEntry, emotionalState: parseInt(e.target.value) })}
                    className="flex-1 h-2 bg-panel rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xl font-bold text-brand w-16">{getEmotionalStateLabel(newEntry.emotionalState!)}</span>
                </div>
              </div>

              {/* Trials & Barriers */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  What challenges or barriers did you face?
                </label>
                <textarea
                  rows={3}
                  value={newEntry.trialsBarriers}
                  onChange={(e) => setNewEntry({ ...newEntry, trialsBarriers: e.target.value })}
                  className="w-full px-4 py-3 bg-panel border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none resize-none"
                  placeholder="Describe any obstacles, difficulties, or challenges you encountered..."
                />
              </div>

              {/* Progress Feeling */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  How do you feel about your progress? <span className="text-brand">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newEntry.progressFeeling}
                    onChange={(e) => setNewEntry({ ...newEntry, progressFeeling: parseInt(e.target.value) })}
                    className="flex-1 h-2 bg-panel rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xl font-bold text-brand2 w-48">{getProgressLabel(newEntry.progressFeeling!)}</span>
                </div>
              </div>

              {/* Self-Care */}
              <div>
                <label className="block text-sm font-medium text-text mb-3">
                  Self-Care Activities (select all that apply)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selfCareOptions.map(option => (
                    <label key={option} className="flex items-center gap-2 p-3 bg-panel rounded-lg cursor-pointer hover:bg-glass transition">
                      <input
                        type="checkbox"
                        checked={(newEntry.selfCare || []).includes(option)}
                        onChange={() => handleSelfCareToggle(option)}
                        className="w-4 h-4 rounded border-border text-brand focus:ring-brand"
                      />
                      <span className="text-sm text-text">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Self-Love */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  What did you do to show yourself love today?
                </label>
                <textarea
                  rows={2}
                  value={newEntry.selfLove}
                  onChange={(e) => setNewEntry({ ...newEntry, selfLove: e.target.value })}
                  className="w-full px-4 py-3 bg-panel border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none resize-none"
                  placeholder="Kind words, boundaries, rest, forgiveness, celebration..."
                />
              </div>

              {/* Exercise */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Physical activity or movement
                </label>
                <input
                  type="text"
                  value={newEntry.exercise}
                  onChange={(e) => setNewEntry({ ...newEntry, exercise: e.target.value })}
                  className="w-full px-4 py-3 bg-panel border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                  placeholder="Walk, gym, yoga, sports, stretching..."
                />
              </div>

              {/* Growth Moment */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Growth Moment 🌱 <span className="text-brand">*</span>
                </label>
                <p className="text-xs text-muted mb-2">
                  Describe a situation where you handled things differently than the old you would have
                </p>
                <textarea
                  rows={4}
                  value={newEntry.growthMoment}
                  onChange={(e) => setNewEntry({ ...newEntry, growthMoment: e.target.value })}
                  className="w-full px-4 py-3 bg-panel border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none resize-none"
                  placeholder="Example: 'Old me would have reacted with anger, but today I took a breath and communicated calmly...'"
                  required
                />
              </div>

              {/* Personal Insight */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Personal Insight 💡
                </label>
                <textarea
                  rows={3}
                  value={newEntry.personalInsight}
                  onChange={(e) => setNewEntry({ ...newEntry, personalInsight: e.target.value })}
                  className="w-full px-4 py-3 bg-panel border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none resize-none"
                  placeholder="What are you learning about yourself? What patterns do you notice?"
                />
              </div>

              {/* Privacy Setting */}
              <div className="bg-bg rounded-lg p-4">
                <h3 className="text-sm font-medium text-text mb-3">Privacy Settings</h3>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={!newEntry.isPrivate}
                      onChange={() => setNewEntry({ ...newEntry, isPrivate: false })}
                      className="mt-1 w-4 h-4"
                    />
                    <div>
                      <div className="text-sm font-medium text-text">📢 Share with Case Manager</div>
                      <div className="text-xs text-muted">Your case manager can see the full entry to better support you</div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={newEntry.isPrivate}
                      onChange={() => setNewEntry({ ...newEntry, isPrivate: true })}
                      className="mt-1 w-4 h-4"
                    />
                    <div>
                      <div className="text-sm font-medium text-text">🔒 Keep Private</div>
                      <div className="text-xs text-muted">
                        Only a brief summary will be shared (emotional state, progress, self-care engagement, growth reflection)
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-brand text-bg font-semibold rounded-lg hover:bg-brand2 transition"
                >
                  Save Journal Entry
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewEntry(false)}
                  className="px-6 py-3 border border-border text-text rounded-lg hover:bg-glass transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Journal Entries */}
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="glass rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-text">
                      {entry.type === 'daily' ? '📝 Daily Check-In' : '📊 Weekly Reflection'}
                    </h3>
                    <span className="text-sm text-muted">{new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${entry.isPrivate ? 'bg-purple-500/10 text-purple-400' : 'bg-brand/10 text-brand'}`}>
                    {entry.isPrivate ? '🔒 Private' : '📢 Shared'}
                  </span>
                </div>
              </div>

              {entry.isPrivate ? (
                <div className="p-4 bg-bg rounded-lg border border-border">
                  <div className="text-sm text-muted mb-2">Summary for Case Manager:</div>
                  <div className="text-sm text-text">{entry.summary}</div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-bg rounded-lg">
                      <div className="text-xs text-muted mb-1">Emotional State</div>
                      <div className="text-lg font-bold text-brand">{getEmotionalStateLabel(entry.emotionalState)}</div>
                    </div>
                    <div className="p-3 bg-bg rounded-lg">
                      <div className="text-xs text-muted mb-1">Progress Feeling</div>
                      <div className="text-lg font-bold text-brand2">{getProgressLabel(entry.progressFeeling)}</div>
                    </div>
                  </div>

                  {entry.trialsBarriers && (
                    <div>
                      <div className="text-sm font-medium text-muted mb-1">Challenges & Barriers</div>
                      <div className="text-sm text-text">{entry.trialsBarriers}</div>
                    </div>
                  )}

                  {entry.selfCare.length > 0 && (
                    <div>
                      <div className="text-sm font-medium text-muted mb-2">Self-Care Activities</div>
                      <div className="flex flex-wrap gap-2">
                        {entry.selfCare.map((activity, i) => (
                          <span key={i} className="px-3 py-1 bg-brand/10 text-brand text-xs rounded-full">
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {entry.selfLove && (
                    <div>
                      <div className="text-sm font-medium text-muted mb-1">Self-Love</div>
                      <div className="text-sm text-text">{entry.selfLove}</div>
                    </div>
                  )}

                  {entry.exercise && (
                    <div>
                      <div className="text-sm font-medium text-muted mb-1">Physical Activity</div>
                      <div className="text-sm text-text">{entry.exercise}</div>
                    </div>
                  )}

                  <div className="p-4 bg-brand/5 rounded-lg border border-brand/20">
                    <div className="text-sm font-medium text-brand mb-2">🌱 Growth Moment</div>
                    <div className="text-sm text-text">{entry.growthMoment}</div>
                  </div>

                  {entry.personalInsight && (
                    <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                      <div className="text-sm font-medium text-accent mb-2">💡 Personal Insight</div>
                      <div className="text-sm text-text">{entry.personalInsight}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
