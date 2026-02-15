'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { PortalHeader } from '@/components/ui/PortalHeader'
import { Button } from '@/components/ui/Button'

interface Appointment {
  id: string
  clientId: string
  clientName: string
  date: string
  time: string
  type: string
  status: 'upcoming' | 'completed' | 'cancelled'
  notes?: string
  duration: number
}

const MOCK_APPOINTMENTS: Appointment[] = [
  { 
    id: '1', 
    clientId: '1',
    clientName: 'John Doe', 
    date: '2026-01-20', 
    time: '09:00',
    type: 'Initial Consultation', 
    status: 'upcoming',
    notes: 'First meeting to discuss program options',
    duration: 60
  },
  { 
    id: '2', 
    clientId: '2',
    clientName: 'Jane Smith', 
    date: '2026-01-20', 
    time: '11:30',
    type: 'Progress Check-in', 
    status: 'upcoming',
    notes: 'Review job search progress',
    duration: 45
  },
  { 
    id: '3', 
    clientId: '3',
    clientName: 'Michael Johnson', 
    date: '2026-01-20', 
    time: '14:00',
    type: 'Job Placement Follow-up', 
    status: 'upcoming',
    notes: 'Discuss employment opportunities',
    duration: 30
  },
  { 
    id: '4', 
    clientId: '4',
    clientName: 'Sarah Williams', 
    date: '2026-01-20', 
    time: '16:30',
    type: '30-Day Review', 
    status: 'upcoming',
    notes: 'Program milestone review',
    duration: 60
  },
  { 
    id: '5', 
    clientId: '1',
    clientName: 'John Doe', 
    date: '2026-01-22', 
    time: '10:00',
    type: 'Follow-up Meeting', 
    status: 'upcoming',
    duration: 45
  },
  { 
    id: '6', 
    clientId: '2',
    clientName: 'Jane Smith', 
    date: '2026-01-18', 
    time: '14:00',
    type: 'Intake Session', 
    status: 'completed',
    notes: 'Completed intake assessment',
    duration: 90
  },
]

export default function CalendarPage() {
  return (
    <Suspense fallback={null}>
      <CalendarPageContent />
    </Suspense>
  )
}

function CalendarPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useAuth()
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS)
  const [view, setView] = useState<'calendar' | 'list'>('list')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterClient, setFilterClient] = useState<string>('all')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-muted">Loading...</div>
      </div>
    )
  }

  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus
    const matchesClient = filterClient === 'all' || apt.clientId === filterClient
    return matchesStatus && matchesClient
  })

  const upcomingAppointments = filteredAppointments.filter(apt => 
    apt.status === 'upcoming' && new Date(apt.date) >= new Date()
  ).sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime())

  const todayAppointments = filteredAppointments.filter(apt => 
    apt.date === new Date().toISOString().split('T')[0]
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'completed':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      default:
        return 'bg-muted/10 text-muted border-border'
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <PortalHeader />
      
      <main className="mx-auto max-w-7xl px-6 pt-24 pb-16">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text mb-2">Calendar & Appointments</h1>
            <p className="text-muted">Schedule and manage client meetings</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant={view === 'list' ? 'primary' : 'outline'}
              onClick={() => setView('list')}
            >
              📋 List View
            </Button>
            <Button 
              variant={view === 'calendar' ? 'primary' : 'outline'}
              onClick={() => setView('calendar')}
            >
              📅 Calendar View
            </Button>
            <Button variant="primary">
              + Schedule Appointment
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="glass rounded-xl p-6">
            <div className="text-2xl font-bold text-text mb-1">{todayAppointments.length}</div>
            <div className="text-sm text-muted">Today&apos;s Meetings</div>
          </div>
          <div className="glass rounded-xl p-6">
            <div className="text-2xl font-bold text-text mb-1">{upcomingAppointments.length}</div>
            <div className="text-sm text-muted">Upcoming</div>
          </div>
          <div className="glass rounded-xl p-6">
            <div className="text-2xl font-bold text-text mb-1">
              {appointments.filter(a => a.status === 'completed').length}
            </div>
            <div className="text-sm text-muted">Completed</div>
          </div>
          <div className="glass rounded-xl p-6">
            <div className="text-2xl font-bold text-text mb-1">
              {Math.round(appointments.reduce((sum, a) => sum + a.duration, 0) / 60)}h
            </div>
            <div className="text-sm text-muted">Total Hours</div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="filterStatus" className="block text-sm font-medium text-muted mb-2">Status</label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-brand"
              >
                <option value="all">All Statuses</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label htmlFor="filterClient" className="block text-sm font-medium text-muted mb-2">Client</label>
              <select
                id="filterClient"
                value={filterClient}
                onChange={(e) => setFilterClient(e.target.value)}
                className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-brand"
              >
                <option value="all">All Clients</option>
                {Array.from(new Set(appointments.map(a => a.clientName))).map(name => (
                  <option key={name} value={appointments.find(a => a.clientName === name)?.clientId}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setFilterStatus('all')
                  setFilterClient('all')
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        {view === 'list' && (
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-semibold text-text mb-6">Upcoming Appointments</h2>
            
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-12 text-muted">
                <div className="text-4xl mb-4">📅</div>
                <p>No upcoming appointments</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    onClick={() => router.push(`/clients/${apt.clientId}`)}
                    className="flex items-start gap-4 p-4 rounded-lg bg-glass hover:bg-brand/5 cursor-pointer transition-colors border border-transparent hover:border-brand/30"
                  >
                    <div className="flex-shrink-0 text-center">
                      <div className="text-2xl font-bold text-brand">
                        {new Date(apt.date).getDate()}
                      </div>
                      <div className="text-xs text-muted uppercase">
                        {new Date(apt.date).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-text font-semibold">{apt.clientName}</h3>
                          <p className="text-sm text-muted">{apt.type}</p>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded border ${getStatusColor(apt.status)}`}>
                          {apt.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted mb-2">
                        <span className="flex items-center gap-1">
                          🕐 {apt.time}
                        </span>
                        <span className="flex items-center gap-1">
                          ⏱️ {apt.duration} min
                        </span>
                      </div>

                      {apt.notes && (
                        <p className="text-sm text-muted">{apt.notes}</p>
                      )}
                    </div>

                    <div className="flex-shrink-0">
                      <Button variant="outline" className="text-sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Calendar View */}
        {view === 'calendar' && (
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-semibold text-text mb-6">Calendar View</h2>
            <div className="text-center py-12 text-muted">
              <div className="text-4xl mb-4">📅</div>
              <p>Calendar view coming soon</p>
              <p className="text-sm mt-2">Use list view to manage appointments</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
