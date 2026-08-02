'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { PortalHeader } from '@/components/ui/PortalHeader'
import { Button } from '@/components/ui/Button'
import { DataTable } from '@/components/ui/DataTable'

interface Task {
  id: string
  title: string
  clientId?: string
  clientName?: string
  dueDate: string
  priority: 'urgent' | 'high' | 'medium' | 'low'
  status: 'pending' | 'in-progress' | 'completed' | 'overdue'
  category: string
  description?: string
  completed: boolean
}

const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Complete intake assessment for John Doe',
    clientId: '1',
    clientName: 'John Doe',
    dueDate: '2026-01-20',
    priority: 'high',
    status: 'pending',
    category: 'Assessment',
    description: 'Initial intake and needs assessment',
    completed: false
  },
  {
    id: '2',
    title: 'Schedule follow-up meeting with Jane Smith',
    clientId: '2',
    clientName: 'Jane Smith',
    dueDate: '2026-01-22',
    priority: 'medium',
    status: 'pending',
    category: 'Scheduling',
    completed: false
  },
  {
    id: '3',
    title: 'Review employment documents for Michael Johnson',
    clientId: '3',
    clientName: 'Michael Johnson',
    dueDate: '2026-01-19',
    priority: 'urgent',
    status: 'overdue',
    category: 'Documentation',
    description: 'Missing verification documents',
    completed: false
  },
  {
    id: '4',
    title: 'Submit monthly reports',
    dueDate: '2026-01-25',
    priority: 'high',
    status: 'in-progress',
    category: 'Administrative',
    description: 'Monthly case management reports',
    completed: false
  },
  {
    id: '5',
    title: 'Update case notes for Sarah Williams',
    clientId: '4',
    clientName: 'Sarah Williams',
    dueDate: '2026-01-20',
    priority: 'medium',
    status: 'completed',
    category: 'Documentation',
    completed: true
  },
]

export default function TasksPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [tasks, setTasks] = useState(MOCK_TASKS)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [showAddTask, setShowAddTask] = useState(false)

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

  const toggleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed, status: !task.completed ? 'completed' : 'pending' }
        : task
    ))
  }

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory
    return matchesStatus && matchesPriority && matchesCategory
  })

  const overdueTasks = tasks.filter(t => t.status === 'overdue')
  const todayTasks = tasks.filter(t => t.dueDate === new Date().toISOString().split('T')[0] && !t.completed)
  const upcomingTasks = tasks.filter(t => new Date(t.dueDate) > new Date() && !t.completed)
  const completedTasks = tasks.filter(t => t.completed)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-400'
      case 'high':
        return 'text-orange-400'
      case 'medium':
        return 'text-yellow-400'
      case 'low':
        return 'text-green-400'
      default:
        return 'text-muted'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'in-progress':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
      case 'overdue':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
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
            <h1 className="text-3xl font-bold text-text mb-2">Tasks & To-Do</h1>
            <p className="text-muted">Manage your daily tasks and priorities</p>
          </div>
          <Button variant="primary" onClick={() => setShowAddTask(true)}>
            + Add Task
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="glass rounded-xl p-6">
            <div className="text-2xl font-bold text-red-400 mb-1">{overdueTasks.length}</div>
            <div className="text-sm text-muted">Overdue</div>
          </div>
          <div className="glass rounded-xl p-6">
            <div className="text-2xl font-bold text-brand mb-1">{todayTasks.length}</div>
            <div className="text-sm text-muted">Due Today</div>
          </div>
          <div className="glass rounded-xl p-6">
            <div className="text-2xl font-bold text-yellow-400 mb-1">{upcomingTasks.length}</div>
            <div className="text-sm text-muted">Upcoming</div>
          </div>
          <div className="glass rounded-xl p-6">
            <div className="text-2xl font-bold text-green-400 mb-1">{completedTasks.length}</div>
            <div className="text-sm text-muted">Completed</div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="filterStatus" className="block text-sm font-medium text-muted mb-2">Status</label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-brand"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="overdue">Overdue</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label htmlFor="filterPriority" className="block text-sm font-medium text-muted mb-2">Priority</label>
              <select
                id="filterPriority"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-brand"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label htmlFor="filterCategory" className="block text-sm font-medium text-muted mb-2">Category</label>
              <select
                id="filterCategory"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 bg-bg border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-brand"
              >
                <option value="all">All Categories</option>
                <option value="Assessment">Assessment</option>
                <option value="Scheduling">Scheduling</option>
                <option value="Documentation">Documentation</option>
                <option value="Administrative">Administrative</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setFilterStatus('all')
                  setFilterPriority('all')
                  setFilterCategory('all')
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-semibold text-text mb-6">All Tasks</h2>
          
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 text-muted">
              <div className="text-4xl mb-4">✓</div>
              <p>No tasks found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-glass hover:bg-brand/5 transition-colors border border-transparent hover:border-brand/30"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskComplete(task.id)}
                    className="mt-1 w-5 h-5 rounded border-border bg-bg cursor-pointer"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3 className={`text-text font-medium ${task.completed ? 'line-through opacity-50' : ''}`}>
                          {task.title}
                        </h3>
                        {task.clientName && (
                          <p className="text-sm text-muted">Client: {task.clientName}</p>
                        )}
                        {task.description && (
                          <p className="text-sm text-muted mt-1">{task.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded border ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                        <span className={`text-lg ${getPriorityColor(task.priority)}`}>
                          {task.priority === 'urgent' && '🔴'}
                          {task.priority === 'high' && '🟠'}
                          {task.priority === 'medium' && '🟡'}
                          {task.priority === 'low' && '🟢'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted">
                      <span className="flex items-center gap-1">
                        📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        📁 {task.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {task.clientId && (
                      <Button
                        variant="outline"
                        className="text-sm"
                        onClick={() => router.push(`/clients/${task.clientId}`)}
                      >
                        View Client
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
