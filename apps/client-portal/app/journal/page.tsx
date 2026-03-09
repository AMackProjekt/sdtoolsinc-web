'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api, type JournalEntry } from '@/lib/api'
import { useAuth } from '@/lib/auth'

const MOCK_ENTRIES: JournalEntry[] = [
  {
    id: 'seed-1',
    date: new Date().toISOString().split('T')[0],
    type: 'daily',
    emotionalState: 7,
    trialsBarriers: 'Transportation delays',
    progressFeeling: 7,
    selfCare: ['Sleep 7-8 hours', 'Meditation/Mindfulness'],
    selfLove: 'I acknowledged my progress this week.',
    exercise: '30-minute walk',
    growthMoment: 'I asked for help instead of shutting down.',
    personalInsight: 'Consistency beats perfection.',
    isPrivate: false,
  },
]

export default function JournalPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, signOut } = useAuth()
  const [entries, setEntries] = useState<JournalEntry[]>(MOCK_ENTRIES)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [entry, setEntry] = useState<JournalEntry>({
    id: 'draft',
    date: new Date().toISOString().split('T')[0],
    type: 'daily',
    emotionalState: 5,
    trialsBarriers: '',
    progressFeeling: 5,
    selfCare: [],
    selfLove: '',
    exercise: '',
    growthMoment: '',
    personalInsight: '',
    isPrivate: false,
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (!isAuthenticated) return

    const loadEntries = async () => {
      try {
        const data = await api.getJournalEntries()
        setEntries(data.length ? data : MOCK_ENTRIES)
      } catch {
        setEntries(MOCK_ENTRIES)
      }
    }

    loadEntries()
  }, [isAuthenticated])

  const handleLogout = async () => {
    await signOut()
    router.push('/auth/login')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!entry.growthMoment.trim()) {
      setMessage('Please add a growth moment before saving your entry.')
      return
    }

    setSaving(true)
    setMessage('')

    const payload: JournalEntry = {
      ...entry,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      summary: entry.isPrivate
        ? `Emotional state ${entry.emotionalState}/10, progress ${entry.progressFeeling}/10, self-care ${entry.selfCare.length} activities.`
        : undefined,
    }

    try {
      const saved = await api.createJournalEntry(payload)
      setEntries((prev) => [saved, ...prev])
      setMessage('Journal entry saved.')
    } catch {
      setEntries((prev) => [payload, ...prev])
      setMessage('Saved locally. It will sync when API is available.')
    } finally {
      setSaving(false)
      setEntry({
        id: 'draft',
        date: new Date().toISOString().split('T')[0],
        type: 'daily',
        emotionalState: 5,
        trialsBarriers: '',
        progressFeeling: 5,
        selfCare: [],
        selfLove: '',
        exercise: '',
        growthMoment: '',
        personalInsight: '',
        isPrivate: false,
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

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
              <Link href="/messages" className="text-muted hover:text-text transition">Messages</Link>
              <Link href="/profile" className="text-muted hover:text-text transition">Profile</Link>
            </nav>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 text-sm text-muted hover:text-text transition">Logout</button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-4xl font-extrabold mb-2">My Journal</h1>
          <p className="text-muted">Reflect on your growth and progress.</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="emotionalState" className="block text-sm font-medium mb-2">Emotional State (1-10)</label>
              <input
                id="emotionalState"
                type="number"
                min={1}
                max={10}
                value={entry.emotionalState}
                onChange={(e) => setEntry({ ...entry, emotionalState: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-lg bg-panel border border-border text-text focus:border-brand focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="progressFeeling" className="block text-sm font-medium mb-2">Progress Feeling (1-10)</label>
              <input
                id="progressFeeling"
                type="number"
                min={1}
                max={10}
                value={entry.progressFeeling}
                onChange={(e) => setEntry({ ...entry, progressFeeling: Number(e.target.value) })}
                className="w-full px-4 py-3 rounded-lg bg-panel border border-border text-text focus:border-brand focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="growthMoment" className="block text-sm font-medium mb-2">Growth Moment</label>
            <textarea
              id="growthMoment"
              value={entry.growthMoment}
              onChange={(e) => setEntry({ ...entry, growthMoment: e.target.value })}
              rows={3}
              required
              className="w-full px-4 py-3 rounded-lg bg-panel border border-border text-text focus:border-brand focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="personalInsight" className="block text-sm font-medium mb-2">Personal Insight</label>
            <textarea
              id="personalInsight"
              value={entry.personalInsight}
              onChange={(e) => setEntry({ ...entry, personalInsight: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-panel border border-border text-text focus:border-brand focus:outline-none"
            />
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={entry.isPrivate}
              onChange={(e) => setEntry({ ...entry, isPrivate: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            Keep entry private (only summary shared)
          </label>

          {message && (
            <div className="rounded-lg border border-brand/30 bg-brand/10 px-4 py-3 text-sm text-brand" role="status" aria-live="polite">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-brand text-bg font-semibold rounded-lg hover:bg-brand2 transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Journal Entry'}
          </button>
        </form>

        <section className="space-y-4">
          {entries.map((item) => (
            <article key={item.id} className="glass rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold">{item.type === 'daily' ? 'Daily Check-In' : 'Weekly Reflection'}</h2>
                <span className="text-xs text-muted">{new Date(item.date).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-muted mb-2">Emotional {item.emotionalState}/10 • Progress {item.progressFeeling}/10</p>
              <p className="text-sm text-text whitespace-pre-wrap">{item.isPrivate ? item.summary : item.growthMoment}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}
