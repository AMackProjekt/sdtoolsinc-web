/**
 * Background Agent System for Case Manager Portal
 * Handles automated tasks like reminders, data syncing, and scheduled updates
 */

export type AgentTask = {
  id: string
  type: 'reminder' | 'sync' | 'notification' | 'report' | 'cleanup'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'running' | 'completed' | 'failed'
  scheduledFor?: Date
  createdAt: Date
  completedAt?: Date
  data: any
  error?: string
}

export type BackgroundAgent = {
  id: string
  name: string
  type: string
  enabled: boolean
  lastRun?: Date
  nextRun?: Date
  interval?: number // in milliseconds
  task: () => Promise<void>
}

class BackgroundAgentManager {
  private agents: Map<string, BackgroundAgent> = new Map()
  private taskQueue: AgentTask[] = []
  private isProcessing: boolean = false
  private intervalIds: Map<string, NodeJS.Timeout> = new Map()

  constructor() {
    this.initializeDefaultAgents()
  }

  private initializeDefaultAgents() {
    // Meeting Reminder Agent
    this.registerAgent({
      id: 'meeting-reminder',
      name: 'Meeting Reminder Agent',
      type: 'reminder',
      enabled: true,
      interval: 15 * 60 * 1000, // Check every 15 minutes
      task: async () => {
        console.log('🔔 Checking for upcoming meetings...')
        // Check for meetings in next 24 hours and send reminders
        await this.addTask({
          type: 'reminder',
          priority: 'high',
          data: { action: 'check_upcoming_meetings', window: '24h' }
        })
      }
    })

    // Client Progress Tracking Agent
    this.registerAgent({
      id: 'progress-tracker',
      name: 'Client Progress Tracker',
      type: 'sync',
      enabled: true,
      interval: 60 * 60 * 1000, // Check every hour
      task: async () => {
        console.log('📊 Updating client progress metrics...')
        await this.addTask({
          type: 'sync',
          priority: 'medium',
          data: { action: 'calculate_progress', source: 'all_clients' }
        })
      }
    })

    // Overdue Tasks Alert Agent
    this.registerAgent({
      id: 'overdue-alerts',
      name: 'Overdue Tasks Alert',
      type: 'notification',
      enabled: true,
      interval: 30 * 60 * 1000, // Check every 30 minutes
      task: async () => {
        console.log('⚠️ Checking for overdue tasks...')
        await this.addTask({
          type: 'notification',
          priority: 'urgent',
          data: { action: 'identify_overdue', notify: true }
        })
      }
    })

    // Daily Report Generator
    this.registerAgent({
      id: 'daily-report',
      name: 'Daily Report Generator',
      type: 'report',
      enabled: true,
      interval: 24 * 60 * 60 * 1000, // Once per day
      task: async () => {
        console.log('📝 Generating daily summary report...')
        await this.addTask({
          type: 'report',
          priority: 'low',
          data: { action: 'generate_daily_summary', include: ['clients', 'meetings', 'progress'] }
        })
      }
    })

    // Data Cleanup Agent
    this.registerAgent({
      id: 'data-cleanup',
      name: 'Data Cleanup Agent',
      type: 'cleanup',
      enabled: true,
      interval: 7 * 24 * 60 * 60 * 1000, // Once per week
      task: async () => {
        console.log('🧹 Running data cleanup...')
        await this.addTask({
          type: 'cleanup',
          priority: 'low',
          data: { action: 'archive_old_records', retentionDays: 90 }
        })
      }
    })
  }

  registerAgent(agent: BackgroundAgent) {
    this.agents.set(agent.id, agent)
    if (agent.enabled && agent.interval) {
      this.scheduleAgent(agent.id)
    }
  }

  scheduleAgent(agentId: string) {
    const agent = this.agents.get(agentId)
    if (!agent || !agent.interval) return

    // Clear existing interval if any
    const existingInterval = this.intervalIds.get(agentId)
    if (existingInterval) {
      clearInterval(existingInterval)
    }

    // Schedule new interval
    const intervalId = setInterval(async () => {
      if (agent.enabled) {
        agent.lastRun = new Date()
        agent.nextRun = new Date(Date.now() + agent.interval!)
        try {
          await agent.task()
        } catch (error) {
          console.error(`Agent ${agent.name} failed:`, error)
        }
      }
    }, agent.interval)

    this.intervalIds.set(agentId, intervalId)
    agent.nextRun = new Date(Date.now() + agent.interval)
  }

  async addTask(taskData: Omit<AgentTask, 'id' | 'status' | 'createdAt'>) {
    const task: AgentTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      createdAt: new Date(),
      ...taskData
    }

    this.taskQueue.push(task)
    this.taskQueue.sort((a, b) => {
      const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 }
      return priorityWeight[b.priority] - priorityWeight[a.priority]
    })

    if (!this.isProcessing) {
      this.processQueue()
    }

    return task.id
  }

  private async processQueue() {
    if (this.isProcessing || this.taskQueue.length === 0) return

    this.isProcessing = true

    while (this.taskQueue.length > 0) {
      const task = this.taskQueue.shift()
      if (!task) break

      task.status = 'running'
      
      try {
        // Simulate task processing
        await this.executeTask(task)
        task.status = 'completed'
        task.completedAt = new Date()
      } catch (error) {
        task.status = 'failed'
        task.error = error instanceof Error ? error.message : 'Unknown error'
        console.error(`Task ${task.id} failed:`, error)
      }

      // Small delay between tasks to prevent blocking
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    this.isProcessing = false
  }

  private async executeTask(task: AgentTask): Promise<void> {
    // This is where actual task execution logic would go
    // For now, we'll simulate with console logs and delays
    
    console.log(`🤖 Executing ${task.type} task:`, task.data)
    
    switch (task.type) {
      case 'reminder':
        // Send notifications for upcoming meetings
        await new Promise(resolve => setTimeout(resolve, 500))
        break
      
      case 'sync':
        // Sync data with external sources or calculate metrics
        await new Promise(resolve => setTimeout(resolve, 1000))
        break
      
      case 'notification':
        // Send alerts to case managers
        await new Promise(resolve => setTimeout(resolve, 300))
        break
      
      case 'report':
        // Generate and save reports
        await new Promise(resolve => setTimeout(resolve, 2000))
        break
      
      case 'cleanup':
        // Archive or delete old data
        await new Promise(resolve => setTimeout(resolve, 1500))
        break
      
      default:
        throw new Error(`Unknown task type: ${task.type}`)
    }
  }

  getAgents(): BackgroundAgent[] {
    return Array.from(this.agents.values())
  }

  getAgent(id: string): BackgroundAgent | undefined {
    return this.agents.get(id)
  }

  enableAgent(id: string) {
    const agent = this.agents.get(id)
    if (agent) {
      agent.enabled = true
      if (agent.interval) {
        this.scheduleAgent(id)
      }
    }
  }

  disableAgent(id: string) {
    const agent = this.agents.get(id)
    if (agent) {
      agent.enabled = false
      const intervalId = this.intervalIds.get(id)
      if (intervalId) {
        clearInterval(intervalId)
        this.intervalIds.delete(id)
      }
    }
  }

  getTaskQueue(): AgentTask[] {
    return [...this.taskQueue]
  }

  getTaskStats() {
    return {
      pending: this.taskQueue.filter(t => t.status === 'pending').length,
      running: this.taskQueue.filter(t => t.status === 'running').length,
      total: this.taskQueue.length
    }
  }

  shutdown() {
    // Clear all intervals
    this.intervalIds.forEach(intervalId => clearInterval(intervalId))
    this.intervalIds.clear()
    console.log('🛑 Background agent system shut down')
  }
}

// Singleton instance
export const backgroundAgents = new BackgroundAgentManager()

// Initialize agents in browser environment only
if (typeof window !== 'undefined') {
  console.log('🚀 Background agent system initialized')
  
  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    backgroundAgents.shutdown()
  })
}
