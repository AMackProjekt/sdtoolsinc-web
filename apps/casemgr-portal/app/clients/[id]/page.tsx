'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { PortalHeader } from '@/components/ui/PortalHeader'
import { Button } from '@/components/ui/Button'
import { FileUpload } from '@/components/ui/FileUpload'
import { 
  uploadFile, 
  getClientFiles, 
  downloadFile, 
  deleteFile,
  exportToCSV,
  exportToJSON,
  type StoredFile 
} from '@/lib/file-storage'

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
  notes?: string[]
  documents?: { name: string, date: string, type: string }[]
  appointments?: { date: string, type: string, notes: string }[]
  goals?: { goal: string, status: string, dueDate: string }[]
  emergencyContact?: { name: string, phone: string, relationship: string }
}

// Mock data - in production this would come from an API/database
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
    address: '123 Main St, Los Angeles, CA 90001',
    caseType: 'Reentry',
    priority: 'Medium',
    emergencyContact: {
      name: 'Jane Doe',
      phone: '(555) 999-8888',
      relationship: 'Sister'
    },
    notes: [
      'Met with client to discuss job placement options - 2026-01-15',
      'Client attended orientation session - 2026-01-10',
      'Initial intake completed - 2026-01-05'
    ],
    documents: [
      { name: 'Resume.pdf', date: '2026-01-12', type: 'Employment' },
      { name: 'Intake Form.pdf', date: '2026-01-05', type: 'Administrative' },
      { name: 'ID Verification.pdf', date: '2026-01-05', type: 'Administrative' }
    ],
    appointments: [
      { date: '2026-01-20', type: 'Follow-up Meeting', notes: 'Discuss job opportunities' },
      { date: '2026-01-15', type: 'Check-in', notes: 'Review progress on goals' },
      { date: '2026-01-10', type: 'Orientation', notes: 'Program introduction' }
    ],
    goals: [
      { goal: 'Secure full-time employment', status: 'In Progress', dueDate: '2026-02-15' },
      { goal: 'Complete job readiness training', status: 'Completed', dueDate: '2026-01-10' },
      { goal: 'Obtain stable housing', status: 'In Progress', dueDate: '2026-03-01' }
    ]
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
    address: '456 Oak Ave, Los Angeles, CA 90002',
    caseType: 'Employment',
    priority: 'High',
    emergencyContact: {
      name: 'Mike Smith',
      phone: '(555) 888-7777',
      relationship: 'Brother'
    },
    notes: [
      'Referred to job training program - 2026-01-16',
      'Working on resume development - 2026-01-12'
    ],
    documents: [
      { name: 'Assessment Results.pdf', date: '2026-01-14', type: 'Evaluation' }
    ],
    appointments: [
      { date: '2026-01-22', type: 'Career Counseling', notes: 'Explore job opportunities' }
    ],
    goals: [
      { goal: 'Complete skills assessment', status: 'Completed', dueDate: '2026-01-14' },
      { goal: 'Enroll in training program', status: 'In Progress', dueDate: '2026-02-01' }
    ]
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
    address: '789 Pine Rd, Los Angeles, CA 90003',
    caseType: 'Housing',
    priority: 'Low',
    notes: [
      'Awaiting housing application approval - 2026-01-10'
    ],
    goals: [
      { goal: 'Secure permanent housing', status: 'In Progress', dueDate: '2026-02-28' }
    ]
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
    address: '321 Elm St, Los Angeles, CA 90004',
    caseType: 'Reentry',
    priority: 'Medium',
    emergencyContact: {
      name: 'Tom Williams',
      phone: '(555) 777-6666',
      relationship: 'Spouse'
    },
    notes: [
      'Client excelling in current position - 2026-01-17',
      'Promoted to team lead role - 2026-01-10'
    ],
    goals: [
      { goal: 'Maintain stable employment', status: 'Completed', dueDate: '2026-01-15' },
      { goal: 'Complete mentorship program', status: 'In Progress', dueDate: '2026-02-10' }
    ]
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
    address: '654 Maple Dr, Los Angeles, CA 90005',
    caseType: 'Support Services',
    priority: 'High',
    notes: [
      'Multiple missed appointments - needs follow-up - 2026-01-05'
    ],
    goals: [
      { goal: 'Re-engage with program', status: 'Not Started', dueDate: '2026-01-31' }
    ]
  }
]

export default function ClientDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const { user, isAuthenticated } = useAuth()
  const [client, setClient] = useState<Client | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'documents' | 'appointments' | 'goals'>('overview')
  const [newNote, setNewNote] = useState('')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [clientFiles, setClientFiles] = useState<StoredFile[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    
    // Load client files
    if (foundClient) {
      setClientFiles(getClientFiles(foundClient.id))
    }
    // Find client by ID - in production, fetch from API
    const foundClient = MOCK_CLIENTS.find(c => c.id === params.id)
    setClient(foundClient || null)
  }, [params.id])

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-muted">Loading...</div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-bg">
        <PortalHeader title="Client Not Found" />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="glass rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-text mb-4">Client Not Found</h2>
            <p className="text-muted mb-6">The client you&apos;re looking for doesn&apos;t exist.</p>
            <Button onClick={() => router.push('/clients')}>
              Back to Clients
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      const updatedNotes = [
        `${newNote} - ${new Date().toISOString().split('T')[0]}`,
   

  const handleFileUpload = async (file: File, metadata: { type: string; description?: string }) => {
    if (!client || !user) return
    
    setUploading(true)
    try {
      const storedFile = await uploadFile(file, {
        ...metadata,
        uploadedBy: user.email || user.name || 'Unknown'
      }, client.id)
      
      setClientFiles(prev => [storedFile, ...prev])
      setShowUploadModal(false)
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload file. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleFileDownload = (file: StoredFile) => {
    downloadFile(file)
  }

  const handleFileDelete = (fileId: string) => {
    if (!client) return
    if (confirm('Are you sure you want to delete this file?')) {
      if (deleteFile(fileId, client.id)) {
        setClientFiles(prev => prev.filter(f => f.id !== fileId))
      }
    }
  }

  const handleExportClientData = () => {
    if (!client) return
    
    const exportData = {
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        status: client.status,
        progress: client.progress,
        address: client.address,
        caseType: client.caseType,
        priority: client.priority
      },
      notes: client.notes || [],
      documents: clientFiles.map(f => ({
        name: f.name,
        type: f.type,
        uploadedAt: f.uploadedAt,
        uploadedBy: f.uploadedBy
      })),
      appointments: client.appointments || [],
      goals: client.goals || [],
      exportedAt: new Date().toISOString()
    }
    
    exportToJSON(exportData, `client-${client.id}-${client.name.replace(/\s+/g, '-')}`)
  }     ...(client.notes || [])
      ]
      setCliediv className="flex gap-2">
              <Button variant="outline" onClick={handleExportClientData}>
                Export Data
              </Button>
              <Button variant="primary" onClick={() => router.push(`/clients/${client.id}/edit`)}>
                Edit Client
              </Button>
            </div
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-400 bg-green-400/10'
      case 'Pending': return 'text-yellow-400 bg-yellow-400/10'
      case 'Inactive': return 'text-red-400 bg-red-400/10'
      default: return 'text-muted bg-panel'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-400 bg-red-400/10'
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10'
      case 'Low': return 'text-green-400 bg-green-400/10'
      default: return 'text-muted bg-panel'
    }
  }

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-400 bg-green-400/10'
      case 'In Progress': return 'text-blue-400 bg-blue-400/10'
      case 'Not Started': return 'text-muted bg-panel'
      default: return 'text-muted bg-panel'
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <PortalHeader title="Client Details" />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => router.push('/clients')}
          className="mb-6"
        >
          ← Back to Clients
        </Button>

        {/* Client Header */}
        <div className="glass rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-text mb-2">{client.name}</h1>
              <div className="flex items-center gap-3 text-sm text-muted">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                  {client.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(client.priority || 'Low')}`}>
                  {client.priority || 'Low'} Priority
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-brand/10 text-brand">
                  {client.caseType}
                </span>
              </div>
            </div>
            <Button variant="primary" onClick={() => router.push(`/clients/${client.id}/edit`)}>
              Edit Client
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-muted mb-2">
              <span>Overall Progress</span>
              <span>{client.progress}%</span>
            </div>
            <div className="bg-bg rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-brand to-brand2 transition-all duration-500"
                style={{ width: `${client.progress}%` }}
              />
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-muted mb-1">Email</div>
              <div className="text-sm text-text">{client.email}</div>
            </div>
            <div>
              <div className="text-xs text-muted mb-1">Phone</div>
              <div className="text-sm text-text">{client.phone}</div>
            </div>
            <div>
              <div className="text-xs text-muted mb-1">Last Contact</div>
              <div className="text-sm text-text">{new Date(client.lastContact).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {(['overview', 'notes', 'documents', 'appointments', 'goals'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-medium capitalize transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-brand text-white'
                  : 'glass text-muted hover:text-text'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-bold text-text mb-4">Personal Information</h2>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-muted mb-1">Address</div>
                  <div className="text-sm text-text">{client.address || 'Not provided'}</div>
                </div>
                <div>
                  <div className="text-xs text-muted mb-1">Email</div>
                  <div className="text-sm text-text">{client.email}</div>
                </div>
                <div>
                  <div className="text-xs text-muted mb-1">Phone</div>
                  <div className="text-sm text-text">{client.phone}</div>
                </div>
                {client.emergencyContact && (
                  <div className="pt-3 border-t border-border">
                    <div className="text-xs text-muted mb-2">Emergency Contact</div>
                    <div className="text-sm text-text">{client.emergencyContact.name}</div>
                    <div className="text-xs text-muted">{client.emergencyContact.relationship}</div>
                    <div className="text-sm text-text mt-1">{client.emergencyContact.phone}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Employment Status */}
            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-bold text-text mb-4">Employment Status</h2>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-muted mb-1">Status</div>
                  <div className="text-sm text-text">{client.employed ? 'Employed' : 'Unemployed'}</div>
                </div>
                {client.employed && (
                  <>
                    <div>
                      <div className="text-xs text-muted mb-1">Employer</div>
                      <div className="text-sm text-text">{client.employer || 'Not specified'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted mb-1">Hours per Week</div>
                      <div className="text-sm text-text">{client.hoursWorked || 0} hours</div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Next Meeting */}
            {client.nextMeeting && (
              <div className="glass rounded-xl p-6">
                <h2 className="text-xl font-bold text-text mb-4">Next Meeting</h2>
                <div className="text-2xl font-bold text-brand mb-2">
                  {new Date(client.nextMeeting).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <Button variant="outline" className="mt-4 w-full">
                  Schedule New Meeting
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-bold text-text mb-4">Case Notes</h2>
            
            {/* Add Note Form */}
            <div className="mb-6 p-4 bg-bg rounded-lg">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a new note..."
                className="w-full bg-panel border border-border rounded-lg px-4 py-3 text-text placeholder-muted focus:outline-none focus:border-brand resize-none"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                  Add Note
                </Button>
              </div>
            </div>

            {/* Notes List */}
            <div className="space-y-3">
              {(client.notes || []).map((note, index) => (
                <div key={index} className="p-4 bg-bg rounded-lg border border-border">
                  <p className="text-text text-sm">{note}</p>
                </div>
              ))}
              {(!client.notes || client.notes.length === 0) && (
                <div className="text-center text-muted py-8">
                  No notes yet. Add your first note above.
                </div>
              )}
            </div>
          </div>
        )}
 onClick={() => setShowUploadModal(!showUploadModal)}>
                {showUploadModal ? 'Cancel Upload' : 'Upload Document'}
              </Button>
            </div>

            {/* Upload Form */}
            {showUploadModal && (
              <div className="mb-6 p-4 bg-bg rounded-lg border border-border">
                <FileUpload
                  onUpload={handleFileUpload}
                  acceptedTypes=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                  maxSizeMB={10}
                  label="Select Document"
                  showPreview={true}
                />
              </div>
            )}
            
            {/* Files List */}
            <div className="space-y-3">
              {clientFiles.map((file) => {
                const fileExt = file.name.split('.').pop()?.toUpperCase() || 'FILE'
                return (
                  <div key={file.id} className="p-4 bg-bg rounded-lg border border-border flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-brand text-xs font-bold">{fileExt}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-text font-medium truncate">{file.name}</div>
                        <div className="text-xs text-muted">
                          {file.documentType} • {new Date(file.uploadedAt).toLocaleDateString()} • {file.uploadedBy}
                        </div>
                        {file.description && (
                          <div className="text-xs text-muted mt-1 italic">{file.description}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleFileDownload(file)}
                      >
                        Download
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleFileDelete(file.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )
              })}
              {clientFiles.length === 0 && !showUploadModal && (
                <div className="text-center text-muted py-8">
                  No documents uploaded yet. Click &quot;Upload Document&quot; to add files
                </div>
              ))}
              {(!client.documents || client.documents.length === 0) && (
                <div className="text-center text-muted py-8">
                  No documents uploaded yet.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="glass rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-text">Appointments</h2>
              <Button variant="primary">Schedule Appointment</Button>
            </div>
            
            <div className="space-y-3">
              {(client.appointments || []).map((apt, index) => (
                <div key={index} className="p-4 bg-bg rounded-lg border border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm text-text font-medium">{apt.type}</div>
                      <div className="text-xs text-muted mt-1">
                        {new Date(apt.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                      <div className="text-sm text-muted mt-2">{apt.notes}</div>
                    </div>
                    <Button variant="outline" size="sm">Reschedule</Button>
                  </div>
                </div>
              ))}
              {(!client.appointments || client.appointments.length === 0) && (
                <div className="text-center text-muted py-8">
                  No appointments scheduled.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="glass rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-text">Goals & Milestones</h2>
              <Button variant="primary">Add Goal</Button>
            </div>
            
            <div className="space-y-3">
              {(client.goals || []).map((goal, index) => (
                <div key={index} className="p-4 bg-bg rounded-lg border border-border">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-sm text-text font-medium mb-2">{goal.goal}</div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getGoalStatusColor(goal.status)}`}>
                          {goal.status}
                        </span>
                        <span className="text-xs text-muted">
                          Due: {new Date(goal.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                  </div>
                </div>
              ))}
              {(!client.goals || client.goals.length === 0) && (
                <div className="text-center text-muted py-8">
                  No goals set yet.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
