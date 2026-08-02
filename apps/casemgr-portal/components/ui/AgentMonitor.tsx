'use client'

import { useState, useEffect } from 'react'
import { backgroundAgents, BackgroundAgent } from '@/lib/background-agents'
import { motion, AnimatePresence } from 'framer-motion'

export function AgentMonitor() {
  const [agents, setAgents] = useState<BackgroundAgent[]>([])
  const [taskStats, setTaskStats] = useState({ pending: 0, running: 0, total: 0 })
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const updateStats = () => {
      setAgents(backgroundAgents.getAgents())
      setTaskStats(backgroundAgents.getTaskStats())
    }

    updateStats()
    const interval = setInterval(updateStats, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const toggleAgent = (id: string) => {
    const agent = backgroundAgents.getAgent(id)
    if (agent?.enabled) {
      backgroundAgents.disableAgent(id)
    } else {
      backgroundAgents.enableAgent(id)
    }
    setAgents(backgroundAgents.getAgents())
  }

  const formatNextRun = (date?: Date) => {
    if (!date) return 'Not scheduled'
    const diff = date.getTime() - Date.now()
    if (diff < 0) return 'Running...'
    
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) return `in ${hours}h ${minutes % 60}m`
    if (minutes > 0) return `in ${minutes}m`
    return 'Soon'
  }

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 text-accent flex items-center justify-center">
            🤖
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text">Background Agents</h3>
            <p className="text-xs text-muted">
              {agents.filter(a => a.enabled).length} active • {taskStats.pending} pending tasks
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="px-3 py-1.5 text-xs font-medium text-brand hover:bg-brand/10 rounded-lg transition-colors"
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </button>
      </div>

      {/* Agent Status Indicators */}
      <div className="flex gap-2 flex-wrap mb-4">
        {agents.map(agent => (
          <div
            key={agent.id}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 ${
              agent.enabled
                ? 'bg-green-500/10 text-green-400'
                : 'bg-gray-500/10 text-gray-400'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${agent.enabled ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
            {agent.name.split(' ')[0]}
          </div>
        ))}
      </div>

      {/* Task Queue Status */}
      {taskStats.total > 0 && (
        <div className="bg-brand/5 border border-brand/20 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">Task Queue</span>
            <span className="text-text font-medium">
              {taskStats.running > 0 && (
                <span className="text-brand">⚡ {taskStats.running} running • </span>
              )}
              {taskStats.pending} pending
            </span>
          </div>
        </div>
      )}

      {/* Detailed Agent List */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-2 overflow-hidden"
          >
            {agents.map(agent => (
              <div
                key={agent.id}
                className="bg-panel border border-border rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium text-text">{agent.name}</div>
                    <div className="text-xs text-muted mt-1">
                      Type: {agent.type} • Next run: {formatNextRun(agent.nextRun)}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleAgent(agent.id)}
                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                      agent.enabled
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                    }`}
                  >
                    {agent.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
                
                {agent.lastRun && (
                  <div className="text-xs text-muted">
                    Last run: {new Date(agent.lastRun).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
