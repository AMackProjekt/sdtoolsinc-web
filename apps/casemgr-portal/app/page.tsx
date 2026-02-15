'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { PortalHeader } from '@/components/ui/PortalHeader'
import { Button } from '@/components/ui/Button'
import { AddClientModal } from '@/components/ui/AddClientModal'
import { CaseNoteTemplates } from '@/components/ui/CaseNoteTemplates'
import { KPICard } from '@/components/ui/KPICard'
import { AgentMonitor } from '@/components/ui/AgentMonitor'
import { AICoach } from '@/components/ui/AICoach'
import { ChartWrapper } from '@/components/ui/ChartWrapper'
import { WeeklyEngagementChart } from '@/components/ui/WeeklyEngagementChart'
import { ClientEngagementChart } from '@/components/ui/ClientEngagementChart'
import '@/lib/background-agents'

interface Client {
  id: string
  name: string
  email: string
  phone: string
  status: 'Active' | 'Pending' | 'Inactive'
  nextMeeting: string | null
  progress: number
  lastContact: string
  employed?: boolean
  hoursWorked?: number
  employer?: string
}

const MOCK_CLIENTS: Client[] = [
  { 
    id: '1', 
    name: 'John Doe', 
    email: 'john@example.com', 
    phone: '(555) 123-4567', 
    status: 'Active', 
    nextMeeting: '2026-01-20', 
    progress: 65,
    lastContact: '2026-01-15',
    employed: true,
    hoursWorked: 38,
    employer: 'ABC Corp'
  },
  { 
    id: '2', 
    name: 'Jane Smith', 
    email: 'jane@example.com', 
    phone: '(555) 234-5678', 
    status: 'Active', 
    nextMeeting: '2026-01-22', 
    progress: 45,
    lastContact: '2026-01-16',
    employed: false
  },
  { 
    id: '3', 
    name: 'Michael Johnson', 
    email: 'michael@example.com', 
    phone: '(555) 345-6789', 
    status: 'Pending', 
    nextMeeting: null, 
    progress: 20,
    lastContact: '2026-01-10',
    employed: true,
    hoursWorked: 20,
    employer: 'Retail Plus'
  },
  { 
    id: '4', 
    name: 'Sarah Williams', 
    email: 'sarah@example.com', 
    phone: '(555) 456-7890', 
    status: 'Active', 
    nextMeeting: '2026-01-25', 
    progress: 80,
    lastContact: '2026-01-17',
    employed: true,
    hoursWorked: 40,
    employer: 'Tech Solutions'
  },
  { 
    id: '5', 
    name: 'Robert Brown', 
    email: 'robert@example.com', 
    phone: '(555) 567-8901', 
    status: 'Inactive', 
    nextMeeting: null, 
    progress: 15,
    lastContact: '2026-01-05',
    employed: false
  },
]

export default function CaseManagerDashboard() {
  return (
    <Suspense fallback={null}>
      <CaseManagerDashboardContent />
    </Suspense>
  )
}

function CaseManagerDashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useAuth()
  const [clients, setClients] = useState(MOCK_CLIENTS)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddClient, setShowAddClient] = useState(false)
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [noteContent, setNoteContent] = useState('')
  const [clientsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])

  // Handle addClient query parameter
  useEffect(() => {
    if (searchParams.get('addClient') === 'true') {
      setShowAddClient(true)
    }
  }, [searchParams])

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-muted">Loading...</div>
      </div>
    )
  }

  const activeClients = clients.filter(c => c.status === 'Active').length
  const pendingClients = clients.filter(c => c.status === 'Pending').length
  const upcomingMeetings = clients.filter(c => c.nextMeeting).length
  const employedClients = clients.filter(c => c.employed).length
  const avgProgress = Math.round(clients.reduce((sum, c) => sum + c.progress, 0) / clients.length)

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage)
  const startIndex = (currentPage - 1) * clientsPerPage
  const paginatedClients = filteredClients.slice(startIndex, startIndex + clientsPerPage)

  const handleAddClient = (data: any) => {
    const newClient: Client = {
      id: (clients.length + 1).toString(),
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      status: 'Pending',
      nextMeeting: null,
      progress: 0,
      lastContact: new Date().toISOString().split('T')[0],
      employed: false
    }
    setClients([...clients, newClient])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500/10 text-green-400'
      case 'Pending':
        return 'bg-yellow-500/10 text-yellow-400'
      case 'Inactive':
        return 'bg-gray-500/10 text-gray-400'
      default:
        return 'bg-muted/10 text-muted'
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <PortalHeader />
      
      <main className="mx-auto max-w-7xl px-6 pt-24 pb-16">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">
            Welcome back, {user.name}
          </h1>
          <p className="text-muted">
            Manage your clients and track their progress
          </p>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KPICard
            title="Total Clients"
            value={clients.length}
            icon="👥"
            trend={{ value: 12, label: "+2 this month", isPositive: true }}
            color="brand"
            onClick={() => router.push('/clients')}
          />
          <KPICard
            title="Active Cases"
            value={activeClients}
            icon="✅"
            trend={{ value: Math.round((activeClients/clients.length)*100), label: "% active", isPositive: true }}
            color="green"
            onClick={() => router.push('/clients?status=Active')}
          />
          <KPICard
            title="Employed Clients"
            value={employedClients}
            icon="💼"
            trend={{ value: Math.round((employedClients/clients.length)*100), label: "employment rate", isPositive: true }}
            color="brand2"
            onClick={() => router.push('/clients?employed=true')}
          />
          <KPICard
            title="Resources Available"
            value="46"
            icon="📚"
            trend={{ value: 27, label: "+27 new resources added", isPositive: true }}
            color="accent"
            onClick={() => router.push('/resources')}
          />
        </div>

        {/* Secondary KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <KPICard
            title="Meetings This Week"
            value={upcomingMeetings}
            icon="📅"
            color="yellow"
          />
          <KPICard
            title="Pending Actions"
            value={pendingClients}
            icon="⏳"
            color="yellow"
          />
          <KPICard
            title="Success Rate"
            value="78%"
            icon="🎯"
            trend={{ value: 5, label: "+5% vs last month", isPositive: true }}
            color="green"
          />
        </div>

        {/* Background Agents Monitor */}
        <div className="mb-8">
          <AgentMonitor />
        </div>

        {/* Engagement Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartWrapper title="Weekly Activity" description="Engagement metrics for the past 7 days" height="300px">
            <WeeklyEngagementChart />
          </ChartWrapper>
          <ChartWrapper title="Client Growth Trends" description="6-month client engagement overview" height="300px">
            <ClientEngagementChart />
          </ChartWrapper>
        </div>

        {/* Today's Schedule & High Priority Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Today's Schedule */}
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-text">Today&apos;s Schedule</h2>
              <Button variant="ghost" className="text-sm" onClick={() => router.push('/calendar')}>
                View All →
              </Button>
            </div>
            <div className="space-y-3">
              {[
                { time: '9:00 AM', client: 'John Doe', type: 'Initial Consultation', status: 'upcoming' },
                { time: '11:30 AM', client: 'Jane Smith', type: 'Progress Check-in', status: 'upcoming' },
                { time: '2:00 PM', client: 'Michael Johnson', type: 'Job Placement Follow-up', status: 'upcoming' },
                { time: '4:30 PM', client: 'Sarah Williams', type: '30-Day Review', status: 'upcoming' },
              ].map((meeting, idx) => (
                <div
                  key={idx}
                  onClick={() => router.push(`/calendar?meeting=${idx}`)}
                  className="flex items-start gap-3 p-3 rounded-lg bg-glass hover:bg-brand/5 cursor-pointer transition-colors border border-transparent hover:border-brand/30"
                >
                  <div className="flex-shrink-0 w-16 text-sm text-muted">
                    {meeting.time}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-text font-medium">{meeting.client}</div>
                    <div className="text-sm text-muted truncate">{meeting.type}</div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-500/10 text-blue-400">
                      {meeting.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* High Priority Alerts */}
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-text">High Priority Alerts</h2>
              <Button variant="ghost" className="text-sm" onClick={() => router.push('/tasks')}>
                View All →
              </Button>
            </div>
            <div className="space-y-3">
              {[
                { 
                  title: 'Missing Documentation', 
                  client: 'Robert Brown', 
                  severity: 'urgent',
                  action: 'Review case file',
                  link: '/clients/5'
                },
                { 
                  title: 'Follow-up Required', 
                  client: 'John Doe', 
                  severity: 'warning',
                  action: 'Schedule next meeting',
                  link: '/clients/1'
                },
                { 
                  title: 'Program Completion Pending', 
                  client: 'Sarah Williams', 
                  severity: 'warning',
                  action: 'Complete 90-day assessment',
                  link: '/clients/4'
                },
              ].map((alert, idx) => (
                <div
                  key={idx}
                  onClick={() => router.push(alert.link)}
                  className="flex items-start gap-3 p-3 rounded-lg bg-glass hover:bg-brand/5 cursor-pointer transition-colors border border-transparent hover:border-brand/30"
                >
                  <div className="flex-shrink-0 mt-1">
                    {alert.severity === 'urgent' ? (
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-text font-medium">{alert.title}</div>
                    <div className="text-sm text-muted">{alert.client}</div>
                    <div className="text-xs text-brand mt-1">{alert.action}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-text mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="primary" className="w-full" onClick={() => setShowAddClient(true)}>
              + Add New Client
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => setShowNoteModal(true)}>
              📝 New Case Note
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.push('/calendar')}>
              📅 Schedule Meeting
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.push('/tasks')}>
              ✓ View Tasks
            </Button>
          </div>
        </div>

        {/* Client List */}
        <div className="glass rounded-xl p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-text">Client List</h2>
              <p className="text-sm text-muted mt-1">
                Showing {startIndex + 1}-{Math.min(startIndex + clientsPerPage, filteredClients.length)} of {filteredClients.length}
              </p>
            </div>
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full sm:w-64 px-4 py-2 bg-bg border border-border rounded-lg text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-3 text-muted font-medium">Name</th>
                  <th className="text-left py-2 px-3 text-muted font-medium">Status</th>
                  <th className="text-left py-2 px-3 text-muted font-medium">Employment</th>
                  <th className="text-left py-2 px-3 text-muted font-medium">Progress</th>
                  <th className="text-left py-2 px-3 text-muted font-medium">Next Meeting</th>
                  <th className="text-left py-2 px-3 text-muted font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedClients.map((client) => (
                  <tr key={client.id} className="border-b border-border hover:bg-glass transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-medium text-text">{client.name}</div>
                      <div className="text-xs text-muted">{client.phone}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(client.status)}`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {client.employed ? (
                        <div>
                          <div className="text-text flex items-center gap-1">
                            <span className="text-green-400">✓</span> {client.employer}
                          </div>
                          <div className="text-xs text-muted">{client.hoursWorked}h/week</div>
                        </div>
                      ) : (
                        <span className="text-muted">Not employed</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-bg rounded-full h-1.5 overflow-hidden w-16">
                          {/* eslint-disable-next-line @next/next/no-inline-styles */}
                          <div 
                            className="h-full bg-gradient-to-r from-brand to-brand2"
                            style={{ width: `${client.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted">{client.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {client.nextMeeting ? (
                        <div className="text-xs text-text">
                          {new Date(client.nextMeeting).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-muted text-xs">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex gap-1">
                        <Button variant="ghost" className="text-xs py-1 px-2">
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6 pt-4 border-t border-border">
              <Button 
                variant="ghost" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="text-sm"
              >
                ← Previous
              </Button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      currentPage === page 
                        ? 'bg-brand text-white' 
                        : 'text-muted hover:bg-glass'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <Button 
                variant="ghost" 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="text-sm"
              >
                Next →
              </Button>
            </div>
          )}

          {filteredClients.length === 0 && (
            <div className="text-center py-12 text-muted">
              No clients found matching &quot;{searchTerm}&quot;
            </div>
          )}
        </div>

        {/* Modals */}
        <AddClientModal 
          isOpen={showAddClient}
          onClose={() => setShowAddClient(false)}
          onSave={handleAddClient}
        />

        {/* Case Note Modal */}
        {showNoteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-panel border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-border">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-text">New Case Note</h2>
                  <button onClick={() => setShowNoteModal(false)} className="text-muted hover:text-text text-2xl">&times;</button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label htmlFor="quickAddClient" className="block text-sm font-medium text-muted mb-2">Client</label>
                  <select id="quickAddClient" className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none">
                    <option value="">Select client...</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <CaseNoteTemplates onSelectTemplate={(content) => setNoteContent(content)} />

                <div>
                  <label className="block text-sm font-medium text-muted mb-2">Note Content</label>
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    rows={12}
                    className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none resize-none font-mono text-sm"
                    placeholder="Enter case note details..."
                  />
                </div>
              </div>

              <div className="p-6 border-t border-border flex justify-end gap-4">
                <Button variant="outline" onClick={() => setShowNoteModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => { setShowNoteModal(false); setNoteContent(''); }}>
                  Save Note
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* AI Coach */}
      <AICoach 
        recentAchievements={['Managed 15 active clients', 'Completed 23 appointments this month']}
      />
    </div>
  )
}
