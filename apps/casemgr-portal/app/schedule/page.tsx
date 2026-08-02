'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { PortalHeader } from '@/components/ui/PortalHeader'
import { Button } from '@/components/ui/Button'
import { KPICard } from '@/components/ui/KPICard'

interface Meeting {
  id: string
  clientId: string
  clientName: string
  date: string
  time: string
  type: 'In-Person' | 'Phone' | 'Video' | 'Home Visit'
  duration: number
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No-Show'
  notes: string
  lastInteraction?: string
  interactionSummary?: string
}

interface CalendarIntegration {
  id: string
  name: string
  icon: string
  connected: boolean
  color: string
}

const MOCK_MEETINGS: Meeting[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'John Doe',
    date: '2026-01-20',
    time: '10:00 AM',
    type: 'In-Person',
    duration: 60,
    status: 'Scheduled',
    notes: 'Employment check-in',
    lastInteraction: '2026-01-15',
    interactionSummary: 'Started new job at ABC Corp, needs work attire assistance'
  },
  {
    id: '2',
    clientId: '2',
    clientName: 'Jane Smith',
    date: '2026-01-22',
    time: '2:00 PM',
    type: 'Video',
    duration: 45,
    status: 'Scheduled',
    notes: 'Benefits application review',
    lastInteraction: '2026-01-16',
    interactionSummary: 'CalFresh application submitted, awaiting interview date'
  },
  {
    id: '3',
    clientId: '4',
    clientName: 'Sarah Williams',
    date: '2026-01-25',
    time: '11:30 AM',
    type: 'Phone',
    duration: 30,
    status: 'Scheduled',
    notes: 'Housing update',
    lastInteraction: '2026-01-17',
    interactionSummary: 'Completed housing applications, follow-up needed on landlord references'
  }
]

export default function SchedulePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [meetings, setMeetings] = useState(MOCK_MEETINGS)
  const [showNewMeeting, setShowNewMeeting] = useState(false)
  const [showIntegrations, setShowIntegrations] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [calendarView, setCalendarView] = useState<'week' | 'month'>('week')

  const [integrations, setIntegrations] = useState<CalendarIntegration[]>([
    { id: 'google', name: 'Google Calendar', icon: '📅', connected: false, color: 'bg-blue-500' },
    { id: 'outlook', name: 'Outlook Calendar', icon: '📆', connected: false, color: 'bg-blue-600' },
    { id: 'eventbrite', name: 'Eventbrite', icon: '🎫', connected: false, color: 'bg-orange-500' },
    { id: 'calendly', name: 'Calendly', icon: '🗓️', connected: false, color: 'bg-blue-400' }
  ])

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

  const upcomingMeetings = meetings.filter(m => m.status === 'Scheduled' && new Date(m.date) >= new Date())
  const todaysMeetings = upcomingMeetings.filter(m => m.date === new Date().toISOString().split('T')[0])
  const thisWeekMeetings = upcomingMeetings.filter(m => {
    const meetingDate = new Date(m.date)
    const today = new Date()
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
    return meetingDate >= today && meetingDate <= weekFromNow
  })

  const handleConnectCalendar = (integrationId: string) => {
    setIntegrations(integrations.map(i => 
      i.id === integrationId ? { ...i, connected: !i.connected } : i
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-brand/10 text-brand border-brand/20'
      case 'Completed': return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'Cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'No-Show': return 'bg-orange-500/10 text-orange-400 border-orange-500/20'
      default: return 'bg-muted/10 text-muted border-border'
    }
  }

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'In-Person': return '🏢'
      case 'Phone': return '📱'
      case 'Video': return '🎥'
      case 'Home Visit': return '🏠'
      default: return '📅'
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <PortalHeader />
      
      <main className="mx-auto max-w-7xl px-6 pt-24 pb-16">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text mb-2">Schedule & Meetings</h1>
            <p className="text-muted">Manage client appointments and calendar integrations</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowIntegrations(true)}>
              🔗 Calendar Sync
            </Button>
            <Button variant="primary" onClick={() => setShowNewMeeting(true)}>
              + Schedule Meeting
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <KPICard
            title="Today's Meetings"
            value={todaysMeetings.length}
            icon="📅"
            color="brand"
          />
          <KPICard
            title="This Week"
            value={thisWeekMeetings.length}
            icon="📆"
            color="brand2"
          />
          <KPICard
            title="Upcoming Total"
            value={upcomingMeetings.length}
            icon="🗓️"
            color="accent"
          />
          <KPICard
            title="No-Show Rate"
            value="5%"
            icon="⚠️"
            trend={{ value: 3, label: "-3% vs last month", isPositive: true }}
            color="green"
          />
        </div>

        {/* Calendar Integrations Status */}
        {integrations.some(i => i.connected) && (
          <div className="glass rounded-xl p-4 mb-8">
            <div className="flex items-center gap-3">
              <span className="text-green-400">✓</span>
              <span className="text-text font-medium">Synced with:</span>
              <div className="flex gap-2">
                {integrations.filter(i => i.connected).map(i => (
                  <span key={i.id} className="text-sm px-3 py-1 bg-brand/10 text-brand rounded-full flex items-center gap-2">
                    {i.icon} {i.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Meetings */}
        <div className="glass rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-text mb-6">Upcoming Meetings</h2>
          
          <div className="space-y-4">
            {upcomingMeetings.map((meeting) => (
              <div key={meeting.id} className="glass rounded-lg p-5 hover:border-brand/40 transition-all">
                <div className="flex gap-4">
                  {/* Date Box */}
                  <div className="flex-shrink-0 w-20 text-center">
                    <div className="bg-brand/10 rounded-lg p-3">
                      <div className="text-2xl font-bold text-brand">
                        {new Date(meeting.date).getDate()}
                      </div>
                      <div className="text-xs text-muted uppercase">
                        {new Date(meeting.date).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                    </div>
                  </div>

                  {/* Meeting Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-text mb-1">{meeting.clientName}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted">
                          <span>{getMeetingTypeIcon(meeting.type)} {meeting.type}</span>
                          <span>⏰ {meeting.time}</span>
                          <span>⏱️ {meeting.duration} min</span>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-3 py-1 rounded border ${getStatusColor(meeting.status)}`}>
                        {meeting.status}
                      </span>
                    </div>

                    {/* Last Interaction */}
                    {meeting.lastInteraction && (
                      <div className="mb-3 p-3 bg-bg rounded-lg">
                        <div className="text-xs text-muted mb-1">
                          Last interaction: {new Date(meeting.lastInteraction).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-text">{meeting.interactionSummary}</div>
                      </div>
                    )}

                    {/* Meeting Notes */}
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted">
                        📝 {meeting.notes}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" className="text-xs py-1 px-3">
                          Reschedule
                        </Button>
                        <Button variant="ghost" className="text-xs py-1 px-3">
                          Complete
                        </Button>
                        <Button variant="ghost" className="text-xs py-1 px-3 text-red-400">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {upcomingMeetings.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-text mb-2">No upcoming meetings</h3>
                <p className="text-muted mb-4">Schedule a meeting with a client to get started</p>
                <Button variant="primary" onClick={() => setShowNewMeeting(true)}>
                  + Schedule Meeting
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Calendar Integrations Modal */}
        {showIntegrations && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-panel border border-border rounded-xl shadow-2xl w-full max-w-2xl">
              <div className="p-6 border-b border-border">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-text">Calendar Integrations</h2>
                  <button onClick={() => setShowIntegrations(false)} className="text-muted hover:text-text text-2xl">&times;</button>
                </div>
                <p className="text-sm text-muted mt-2">Sync meetings with your calendar apps</p>
              </div>
              
              <div className="p-6 space-y-4">
                {integrations.map((integration) => (
                  <div key={integration.id} className="glass rounded-lg p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${integration.color} rounded-lg flex items-center justify-center text-2xl`}>
                          {integration.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-text">{integration.name}</h3>
                          <p className="text-sm text-muted">
                            {integration.connected ? 'Connected and syncing' : 'Not connected'}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant={integration.connected ? 'outline' : 'primary'}
                        onClick={() => handleConnectCalendar(integration.id)}
                      >
                        {integration.connected ? '✓ Connected' : 'Connect'}
                      </Button>
                    </div>

                    {integration.connected && (
                      <div className="mt-4 p-3 bg-green-500/5 border border-green-500/20 rounded-lg text-sm text-green-400">
                        ✓ Meetings automatically sync to {integration.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-border">
                <Button variant="primary" className="w-full" onClick={() => setShowIntegrations(false)}>
                  Done
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* New Meeting Modal */}
        {showNewMeeting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-panel border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-border">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-text">Schedule New Meeting</h2>
                  <button onClick={() => setShowNewMeeting(false)} className="text-muted hover:text-text text-2xl">&times;</button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label htmlFor="scheduleClient" className="block text-sm font-medium text-muted mb-2">Client</label>
                  <select id="scheduleClient" className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none">
                    <option value="">Select client...</option>
                    <option value="1">John Doe</option>
                    <option value="2">Jane Smith</option>
                    <option value="3">Michael Johnson</option>
                    <option value="4">Sarah Williams</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="scheduleDate" className="block text-sm font-medium text-muted mb-2">Date</label>
                    <input
                      id="scheduleDate"
                      type="date"
                      className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="scheduleTime" className="block text-sm font-medium text-muted mb-2">Time</label>
                    <input
                      id="scheduleTime"
                      type="time"
                      className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="meetingType" className="block text-sm font-medium text-muted mb-2">Meeting Type</label>
                    <select id="meetingType" className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none">
                      <option value="In-Person">In-Person</option>
                      <option value="Phone">Phone</option>
                      <option value="Video">Video</option>
                      <option value="Home Visit">Home Visit</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="meetingDuration" className="block text-sm font-medium text-muted mb-2">Duration</label>
                    <select id="meetingDuration" className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none">
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted mb-2">Meeting Notes</label>
                  <textarea
                    rows={4}
                    placeholder="Purpose of meeting, agenda items, etc."
                    className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none resize-none"
                  />
                </div>

                {integrations.some(i => i.connected) && (
                  <div className="p-4 bg-brand/5 border border-brand/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <input type="checkbox" defaultChecked className="mt-1" aria-label="Add to synced calendars" />
                      <div>
                        <div className="text-sm font-medium text-text">Add to synced calendars</div>
                        <div className="text-xs text-muted mt-1">
                          This meeting will be added to: {integrations.filter(i => i.connected).map(i => i.name).join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-border flex justify-end gap-4">
                <Button variant="outline" onClick={() => setShowNewMeeting(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setShowNewMeeting(false)}>
                  Schedule Meeting
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
