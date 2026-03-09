import { supabase } from './supabase'
import { withMetric } from './observability'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api'

export interface DashboardData {
  stats: {
    checkIns: number
    hoursLearned: number
    certificates: number
    coursesCompleted: number
  }
  progress: {
    coursesCompleted: number
    totalCourses: number
    milestones: Array<{ id: string; title: string; completed: boolean }>
  }
  courses: Array<{ id: string; title: string; progress: number; completed: boolean }>
  activities: Array<{ id: string; title: string; type: 'meeting' | 'event' | 'deadline'; date: string; time: string; location?: string }>
  messages: Array<{ id: string; senderId: string; senderName: string; subject: string; preview: string; timestamp: string; read: boolean }>
}

export interface Message {
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

export interface JournalEntry {
  id: string
  date: string
  type: 'daily' | 'weekly'
  emotionalState: number
  trialsBarriers: string
  progressFeeling: number
  selfCare: string[]
  selfLove: string
  exercise: string
  growthMoment: string
  personalInsight: string
  isPrivate: boolean
  summary?: string
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.access_token) {
    return {}
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
  }
}

export async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  return withMetric(`api.${endpoint}`, async () => {
    const url = API_BASE + endpoint
    const authHeaders = await getAuthHeaders()

    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options?.headers,
      },
    })

    if (!res.ok) {
      let message = 'API request failed'
      try {
        const error = await res.json()
        message = error.error?.message || message
      } catch {
        // ignore json parse issues
      }
      throw new Error(message)
    }

    return res.json() as Promise<T>
  })
}

export const api = {
  getCurrentUser: () => fetchAPI('/v1/users/me'),
  updateProfile: (data: any) => fetchAPI('/v1/users/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  getProgress: () => fetchAPI('/v1/progress'),
  updateProgress: (data: any) => fetchAPI('/v1/progress', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getDashboardData: () => fetchAPI<DashboardData>('/v1/client/dashboard'),
  getMessages: () => fetchAPI<Message[]>('/v1/client/messages'),
  getJournalEntries: () => fetchAPI<JournalEntry[]>('/v1/client/journal'),
  createJournalEntry: (entry: JournalEntry) =>
    fetchAPI<JournalEntry>('/v1/client/journal', {
      method: 'POST',
      body: JSON.stringify(entry),
    }),
}
