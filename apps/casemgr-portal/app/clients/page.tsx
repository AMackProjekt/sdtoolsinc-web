'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { PortalHeader } from '@/components/ui/PortalHeader'
import { Button } from '@/components/ui/Button'
import { AddClientModal } from '@/components/ui/AddClientModal'

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
  address?: string
  caseType?: string
  priority?: string
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
    employer: 'ABC Corp',
    address: '123 Main St, Los Angeles, CA',
    caseType: 'Reentry',
    priority: 'Medium'
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
    employed: false,
    address: '456 Oak Ave, Los Angeles, CA',
    caseType: 'Employment',
    priority: 'High'
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
    employer: 'Retail Plus',
    address: '789 Pine Rd, Los Angeles, CA',
    caseType: 'Housing',
    priority: 'Low'
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
    employer: 'Tech Solutions',
    address: '321 Elm St, Los Angeles, CA',
    caseType: 'Reentry',
    priority: 'Medium'
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
    employed: false,
    address: '654 Maple Dr, Los Angeles, CA',
    caseType: 'Benefits',
    priority: 'Low'
  },
]

export default function ClientsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useAuth()
  const [clients, setClients] = useState(MOCK_CLIENTS)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddClient, setShowAddClient] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('All')
  const [filterCaseType, setFilterCaseType] = useState<string>('All')
  const [clientsPerPage] = useState(15)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])

  // Handle URL query parameters
  useEffect(() => {
    const status = searchParams.get('status')
    const employed = searchParams.get('employed')
    
    if (status) {
      setFilterStatus(status)
    }
  }, [searchParams])

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-muted">Loading...</div>
      </div>
    )
  }

  let filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
    
    const matchesStatus = filterStatus === 'All' || client.status === filterStatus
    const matchesCaseType = filterCaseType === 'All' || client.caseType === filterCaseType
    
    // Handle employed filter from URL
    const employedParam = searchParams.get('employed')
    const matchesEmployed = !employedParam || (employedParam === 'true' && client.employed)
    
    return matchesSearch && matchesStatus && matchesCaseType && matchesEmployed
  })

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
      employed: false,
      caseType: data.caseType,
      priority: data.priority
    }
    setClients([...clients, newClient])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'Pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'Inactive':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
      default:
        return 'bg-muted/10 text-muted border-border'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'text-red-400'
      case 'High':
        return 'text-orange-400'
      case 'Medium':
        return 'text-yellow-400'
      case 'Low':
        return 'text-green-400'
      default:
        return 'text-muted'
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <PortalHeader />
      
      <main className="mx-auto max-w-7xl px-6 pt-24 pb-16">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text mb-2">Client Management</h1>
            <p className="text-muted">View and manage all clients</p>
          </div>
          <Button variant="primary" onClick={() => setShowAddClient(true)}>
            + Add New Client
          </Button>
        </div>

        {/* Filters */}
        <div className="glass rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-2">Search</label>
              <input
                type="text"
                placeholder="Name, email, or phone..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
            
            <div>
              <label htmlFor="filterStatus" className="block text-sm font-medium text-muted mb-2">Status</label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-brand"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label htmlFor="filterCaseType" className="block text-sm font-medium text-muted mb-2">Case Type</label>
              <select
                id="filterCaseType"
                value={filterCaseType}
                onChange={(e) => { setFilterCaseType(e.target.value); setCurrentPage(1); }}
                className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-brand"
              >
                <option value="All">All Types</option>
                <option value="Reentry">Reentry</option>
                <option value="Employment">Employment</option>
                <option value="Housing">Housing</option>
                <option value="Benefits">Benefits</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearchTerm('')
                  setFilterStatus('All')
                  setFilterCaseType('All')
                  setCurrentPage(1)
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>

          <div className="mt-4 text-sm text-muted">
            Showing {startIndex + 1}-{Math.min(startIndex + clientsPerPage, filteredClients.length)} of {filteredClients.length} clients
          </div>
        </div>

        {/* Client Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedClients.map((client) => (
            <div key={client.id} className="glass rounded-xl p-6 hover:border-brand/40 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-text">{client.name}</h3>
                  <p className="text-sm text-muted">ID: {client.id}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded border ${getStatusColor(client.status)}`}>
                  {client.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted">📧</span>
                  <span className="text-text">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted">📱</span>
                  <span className="text-text">{client.phone}</span>
                </div>
                {client.address && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted">📍</span>
                    <span className="text-text text-xs">{client.address}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {client.employed ? (
                  <div className="text-xs">
                    <span className="text-muted">Employment</span>
                    <div className="text-text flex items-center gap-1">
                      <span className="text-green-400">✓</span> {client.employer}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs">
                    <span className="text-muted">Employment</span>
                    <div className="text-text">Not employed</div>
                  </div>
                )}

                <div className="text-xs">
                  <span className="text-muted">Case Type</span>
                  <div className="text-text">{client.caseType || 'N/A'}</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-xs text-muted mb-1">
                  <span>Progress</span>
                  <span>{client.progress}%</span>
                </div>
                <div className="bg-bg rounded-full h-2 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-inline-styles */}
                  <div 
                    className="h-full bg-gradient-to-r from-brand to-brand2"
                    style={{ width: `${client.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-border">
                <Button variant="primary" className="flex-1 text-sm py-2">
                  View Details
                </Button>
                <Button variant="outline" className="flex-1 text-sm py-2">
                  Add Note
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <Button 
              variant="ghost" 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="text-sm"
            >
              ← Previous
            </Button>
            
            <div className="flex gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page = i + 1
                if (totalPages > 5 && currentPage > 3) {
                  page = currentPage - 2 + i
                  if (page > totalPages) page = totalPages - 4 + i
                }
                return (
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
                )
              })}
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
          <div className="glass rounded-xl p-12 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-text mb-2">No clients found</h3>
            <p className="text-muted">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Add Client Modal */}
        <AddClientModal 
          isOpen={showAddClient}
          onClose={() => setShowAddClient(false)}
          onSave={handleAddClient}
        />
      </main>
    </div>
  )
}
