'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { PortalHeader } from '@/components/ui/PortalHeader'
import { Button } from '@/components/ui/Button'
import { KPICard } from '@/components/ui/KPICard'

interface ProgramClient {
  id: string
  name: string
  programStart: string
  currentDay: number
  currentCycle: '30-Day' | '60-Day' | '90-Day'
  milestone1Complete: boolean
  milestone2Complete: boolean
  status: 'On Track' | 'Needs Attention' | 'At Risk'
  documentsComplete: number
  totalDocuments: number
  interviewsScheduled: number
  communityServiceHours: number
  employed: boolean
}

interface Milestone1Checklist {
  id: boolean
  birthCertificate: boolean
  socialSecurityCard: boolean
  alienRegistrationCard: boolean
  otherDocuments: boolean
  resumeSubmitted: boolean
  employmentGoalsABC: boolean
  preEmploymentCourse: boolean
}

interface Milestone2Checklist {
  intro: boolean
  coverLetter: boolean
  resume: boolean
  professionalReferences: boolean
  hrQuestionnaire: boolean
  professionalWebpage: boolean
  interviewScheduled: boolean
  communityService4Hours: boolean
  professionalEmail: boolean
  linkedInAccount: boolean
  indeedAccount: boolean
  calEmploymentsAccount: boolean
  eddAccount: boolean
}

const MOCK_PROGRAM_CLIENTS: ProgramClient[] = [
  {
    id: '1',
    name: 'John Doe',
    programStart: '2025-12-19',
    currentDay: 30,
    currentCycle: '30-Day',
    milestone1Complete: false,
    milestone2Complete: false,
    status: 'On Track',
    documentsComplete: 3,
    totalDocuments: 5,
    interviewsScheduled: 0,
    communityServiceHours: 0,
    employed: false
  },
  {
    id: '2',
    name: 'Jane Smith',
    programStart: '2025-11-19',
    currentDay: 60,
    currentCycle: '60-Day',
    milestone1Complete: true,
    milestone2Complete: false,
    status: 'On Track',
    documentsComplete: 5,
    totalDocuments: 5,
    interviewsScheduled: 1,
    communityServiceHours: 2,
    employed: false
  },
  {
    id: '3',
    name: 'Michael Johnson',
    programStart: '2025-10-19',
    currentDay: 90,
    currentCycle: '90-Day',
    milestone1Complete: true,
    milestone2Complete: true,
    status: 'On Track',
    documentsComplete: 5,
    totalDocuments: 5,
    interviewsScheduled: 3,
    communityServiceHours: 6,
    employed: true
  }
]

export default function ProgramsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [clients, setClients] = useState<ProgramClient[]>(MOCK_PROGRAM_CLIENTS)
  const [selectedClient, setSelectedClient] = useState<ProgramClient | null>(null)
  const [showMilestoneModal, setShowMilestoneModal] = useState<1 | 2 | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCycle, setFilterCycle] = useState<string>('All')

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

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCycle = filterCycle === 'All' || client.currentCycle === filterCycle
    return matchesSearch && matchesCycle
  })

  const onTrackCount = clients.filter(c => c.status === 'On Track').length
  const needsAttentionCount = clients.filter(c => c.status === 'Needs Attention').length
  const atRiskCount = clients.filter(c => c.status === 'At Risk').length
  const employedCount = clients.filter(c => c.employed).length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Track': return 'text-brand2 bg-brand2/10'
      case 'Needs Attention': return 'text-yellow-400 bg-yellow-400/10'
      case 'At Risk': return 'text-red-400 bg-red-400/10'
      default: return 'text-muted bg-muted/10'
    }
  }

  const getCycleColor = (cycle: string) => {
    switch (cycle) {
      case '30-Day': return 'text-brand bg-brand/10'
      case '60-Day': return 'text-accent bg-accent/10'
      case '90-Day': return 'text-brand2 bg-brand2/10'
      default: return 'text-muted bg-muted/10'
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      <PortalHeader />

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-text mb-2">30/60/90-Day Program</h1>
          <p className="text-muted">Track client progress through structured reentry milestones</p>
        </div>

        {/* Program Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="On Track"
            value={onTrackCount}
            icon="✓"
            trend={{ value: 0, label: "stable", isPositive: true }}
          />
          <KPICard
            title="Needs Attention"
            value={needsAttentionCount}
            icon="⚠️"
            trend={{ value: 0, label: "stable", isPositive: false }}
          />
          <KPICard
            title="At Risk"
            value={atRiskCount}
            icon="🔴"
            trend={{ value: 0, label: "stable", isPositive: false }}
          />
          <KPICard
            title="Gainfully Employed"
            value={employedCount}
            icon="💼"
            trend={{ value: 0, label: "stable", isPositive: true }}
          />
        </div>

        {/* Program Structure Overview */}
        <div className="glass rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-text mb-6">Program Structure</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 30-Day Cycle */}
            <div className="bg-bg rounded-lg p-6 border border-brand/30">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📋</span>
                <h3 className="text-xl font-bold text-brand">30-Day Cycle</h3>
              </div>
              <div className="space-y-2 text-sm text-muted">
                <p className="font-semibold text-text">Focus: Documentation & Foundation</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>ID, Birth Certificate, SSC</li>
                  <li>Alien Registration Card (if applicable)</li>
                  <li>Pre-employment prep course</li>
                  <li>Submit existing resume</li>
                  <li>ABC Employment Goals</li>
                </ul>
                <p className="pt-2 text-xs font-bold text-brand">→ Milestone 1</p>
              </div>
            </div>

            {/* 60-Day Cycle */}
            <div className="bg-bg rounded-lg p-6 border border-accent/30">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">💼</span>
                <h3 className="text-xl font-bold text-accent">60-Day Cycle</h3>
              </div>
              <div className="space-y-2 text-sm text-muted">
                <p className="font-semibold text-text">Focus: Employment Readiness</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Professional dress & speaking</li>
                  <li>Interview preparation</li>
                  <li>Resume building</li>
                  <li>LinkedIn, Indeed, CalEmployments</li>
                  <li>Job applications & follow-up</li>
                  <li>4+ hours community service</li>
                </ul>
                <p className="pt-2 text-xs font-bold text-accent">→ Milestone 2</p>
              </div>
            </div>

            {/* 90-Day Cycle */}
            <div className="bg-bg rounded-lg p-6 border border-brand2/30">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎯</span>
                <h3 className="text-xl font-bold text-brand2">90-Day Cycle</h3>
              </div>
              <div className="space-y-2 text-sm text-muted">
                <p className="font-semibold text-text">Focus: Financial Stability & Mentorship</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Financial management training</li>
                  <li>Budget creation</li>
                  <li>Banking accounts setup</li>
                  <li>KingMe Mentor Program (eligible)</li>
                  <li>T.A.Y. volunteer work</li>
                </ul>
                <p className="pt-2 text-xs font-bold text-brand2">→ Program Complete</p>
              </div>
            </div>
          </div>

          {/* ABC Method Explanation */}
          <div className="mt-6 p-4 bg-brand/5 border border-brand/20 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <h4 className="font-bold text-text mb-2">ABC Employment Goals Method</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-brand">A = Any</span>
                    <p className="text-muted">Any job to start earning immediately</p>
                  </div>
                  <div>
                    <span className="font-semibold text-accent">B = Better</span>
                    <p className="text-muted">Better position with growth potential</p>
                  </div>
                  <div>
                    <span className="font-semibold text-brand2">C = Career</span>
                    <p className="text-muted">Career path aligned with long-term goals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
            />
            <select
              value={filterCycle}
              onChange={(e) => setFilterCycle(e.target.value)}
              className="px-4 py-2 bg-bg border border-border rounded-lg text-text focus:ring-2 focus:ring-brand focus:outline-none"
            >
              <option value="All">All Cycles</option>
              <option value="30-Day">30-Day Cycle</option>
              <option value="60-Day">60-Day Cycle</option>
              <option value="90-Day">90-Day Cycle</option>
            </select>
          </div>
        </div>

        {/* Client List */}
        <div className="glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-bg border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">Client</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">Current Cycle</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">Day</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">Documents</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">Milestones</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-glass transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-text">{client.name}</div>
                      <div className="text-xs text-muted">Started: {client.programStart}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCycleColor(client.currentCycle)}`}>
                        {client.currentCycle}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-text">
                      Day {client.currentDay}/90
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-panel rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-brand transition-all"
                            style={{ width: `${(client.documentsComplete / client.totalDocuments) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted">{client.documentsComplete}/{client.totalDocuments}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-1">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${client.milestone1Complete ? 'bg-brand2 text-bg' : 'bg-panel text-muted'}`}>
                          1
                        </span>
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${client.milestone2Complete ? 'bg-brand2 text-bg' : 'bg-panel text-muted'}`}>
                          2
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(client.status)}`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedClient(client)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Client Detail Modal */}
        {selectedClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="glass rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="p-6 border-b border-border sticky top-0 bg-panel/95 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-text">{selectedClient.name}</h2>
                    <p className="text-sm text-muted">Program Day {selectedClient.currentDay}/90 • {selectedClient.currentCycle}</p>
                  </div>
                  <button
                    onClick={() => setSelectedClient(null)}
                    className="text-muted hover:text-text transition"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Progress Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-bg rounded-lg p-4">
                    <div className="text-xs text-muted mb-1">Documents</div>
                    <div className="text-2xl font-bold text-brand">{selectedClient.documentsComplete}/{selectedClient.totalDocuments}</div>
                  </div>
                  <div className="bg-bg rounded-lg p-4">
                    <div className="text-xs text-muted mb-1">Interviews</div>
                    <div className="text-2xl font-bold text-accent">{selectedClient.interviewsScheduled}</div>
                  </div>
                  <div className="bg-bg rounded-lg p-4">
                    <div className="text-xs text-muted mb-1">Service Hours</div>
                    <div className="text-2xl font-bold text-brand2">{selectedClient.communityServiceHours}</div>
                  </div>
                  <div className="bg-bg rounded-lg p-4">
                    <div className="text-xs text-muted mb-1">Employment</div>
                    <div className="text-2xl font-bold text-text">{selectedClient.employed ? '✓' : '—'}</div>
                  </div>
                </div>

                {/* Milestone Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowMilestoneModal(1)}
                    className={`flex-1 p-4 rounded-lg border-2 transition ${
                      selectedClient.milestone1Complete 
                        ? 'border-brand2 bg-brand2/10' 
                        : 'border-border hover:border-brand'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <div className="font-bold text-text">Milestone 1</div>
                        <div className="text-xs text-muted">30-Day Documentation</div>
                      </div>
                      {selectedClient.milestone1Complete && <span className="text-2xl">✓</span>}
                    </div>
                  </button>

                  <button
                    onClick={() => setShowMilestoneModal(2)}
                    className={`flex-1 p-4 rounded-lg border-2 transition ${
                      selectedClient.milestone2Complete 
                        ? 'border-brand2 bg-brand2/10' 
                        : 'border-border hover:border-brand'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <div className="font-bold text-text">Milestone 2</div>
                        <div className="text-xs text-muted">60-Day Employment Ready</div>
                      </div>
                      {selectedClient.milestone2Complete && <span className="text-2xl">✓</span>}
                    </div>
                  </button>
                </div>

                {/* ABC Employment Goals */}
                <div className="bg-bg rounded-lg p-4">
                  <h3 className="font-bold text-text mb-3">ABC Employment Goals</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <span className="text-brand font-bold">A:</span>
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Any job to start earning (e.g., warehouse, retail)"
                          className="w-full px-3 py-2 bg-panel border border-border rounded text-sm text-text"
                        />
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-accent font-bold">B:</span>
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Better position with growth (e.g., supervisor, specialist)"
                          className="w-full px-3 py-2 bg-panel border border-border rounded text-sm text-text"
                        />
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-brand2 font-bold">C:</span>
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Career path goal (e.g., manager, entrepreneur)"
                          className="w-full px-3 py-2 bg-panel border border-border rounded text-sm text-text"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button variant="primary" className="flex-1">Save Changes</Button>
                  <Button variant="outline" onClick={() => setSelectedClient(null)}>Close</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Milestone Checklist Modal */}
        {showMilestoneModal && selectedClient && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="glass rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-text">
                    Milestone {showMilestoneModal} Checklist
                  </h2>
                  <button
                    onClick={() => setShowMilestoneModal(null)}
                    className="text-muted hover:text-text transition"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {showMilestoneModal === 1 && (
                  <>
                    <h3 className="font-bold text-text">30-Day Documentation Requirements</h3>
                    <div className="space-y-2">
                      {['ID (State ID or Driver\'s License)', 'Birth Certificate', 'Social Security Card', 'Alien Registration Card (if applicable)', 'Other Required Documents', 'Resume Submitted', 'ABC Employment Goals Mapped', 'Pre-Employment Prep Course Started'].map((item, i) => (
                        <label key={i} className="flex items-center gap-3 p-3 bg-bg rounded-lg cursor-pointer hover:bg-glass">
                          <input type="checkbox" className="w-5 h-5 rounded border-border text-brand" />
                          <span className="text-text">{item}</span>
                        </label>
                      ))}
                    </div>
                  </>
                )}

                {showMilestoneModal === 2 && (
                  <>
                    <h3 className="font-bold text-text">60-Day Employment Readiness Requirements</h3>
                    <div className="space-y-2">
                      {[
                        'Professional Introduction Written',
                        'Cover Letter Template Created',
                        'Resume Built and Polished',
                        'Professional References Sheet',
                        'HR Questionnaire (7 from HR, 3 for client)',
                        'Personal Professional Webpage',
                        'At Least 1 Interview Scheduled',
                        '4+ Hours Community Service (Sharia\'s Closet)',
                        'Professional Email Account Created',
                        'LinkedIn Profile Created',
                        'Indeed Profile Created',
                        'CalEmployments Account Created',
                        'EDD Account Created'
                      ].map((item, i) => (
                        <label key={i} className="flex items-center gap-3 p-3 bg-bg rounded-lg cursor-pointer hover:bg-glass">
                          <input type="checkbox" className="w-5 h-5 rounded border-border text-brand" />
                          <span className="text-text">{item}</span>
                        </label>
                      ))}
                    </div>
                  </>
                )}

                <div className="pt-4">
                  <Button variant="primary" className="w-full" onClick={() => setShowMilestoneModal(null)}>
                    Save Checklist
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
