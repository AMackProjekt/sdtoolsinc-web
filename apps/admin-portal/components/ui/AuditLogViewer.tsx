'use client'

import { motion } from 'framer-motion'
import { Eye, Download, Filter } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import { useState } from 'react'

export interface AuditLog {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: string
  resource: string
  resourceId?: string
  ipAddress: string
  userAgent?: string
  details?: string
  status: 'success' | 'failure' | 'warning'
}

interface AuditLogViewerProps {
  logs: AuditLog[]
  loading?: boolean
  onViewDetails?: (log: AuditLog) => void
  onExport?: () => void
}

export function AuditLogViewer({
  logs,
  loading = false,
  onViewDetails,
  onExport
}: AuditLogViewerProps) {
  const [expandedLog, setExpandedLog] = useState<string | null>(null)

  const getActionIcon = (action: string) => {
    if (action.includes('create')) return '➕'
    if (action.includes('update')) return '✏️'
    if (action.includes('delete')) return '🗑️'
    if (action.includes('login')) return '🔐'
    if (action.includes('logout')) return '🚪'
    return '📝'
  }

  const getStatusVariant = (status: AuditLog['status']) => {
    switch (status) {
      case 'success':
        return 'success'
      case 'failure':
        return 'danger'
      case 'warning':
        return 'warning'
      default:
        return 'default'
    }
  }

  if (loading) {
    return (
      <div className="glass rounded-xl p-6">
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-20 bg-glass animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-text mb-2">No Audit Logs Found</h3>
        <p className="text-sm text-muted">No activity logs match your filters</p>
      </div>
    )
  }

  return (
    <div className="glass rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-text">Audit Log Entries</h3>
        {onExport && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExport}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-brand border border-brand/30 rounded-lg hover:bg-brand/10 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </motion.button>
        )}
      </div>

      {/* Logs List */}
      <div className="divide-y divide-border">
        {logs.map((log, index) => {
          const isExpanded = expandedLog === log.id

          return (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="hover:bg-glass/50 transition-colors"
            >
              <div className="p-4">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="text-2xl flex-shrink-0">
                    {getActionIcon(log.action)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-text mb-1">
                          {log.action}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                          <span>{log.userName}</span>
                          <span>•</span>
                          <span>{log.resource}</span>
                          <span>•</span>
                          <span>{new Date(log.timestamp).toLocaleString()}</span>
                          <span>•</span>
                          <span className="font-mono">{log.ipAddress}</span>
                        </div>
                      </div>
                      <StatusBadge
                        label={log.status}
                        variant={getStatusVariant(log.status)}
                      />
                    </div>

                    {/* Details (Expandable) */}
                    {log.details && (
                      <button
                        onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                        className="text-xs text-brand hover:text-brand2 transition-colors"
                      >
                        {isExpanded ? 'Hide' : 'Show'} Details
                      </button>
                    )}

                    {isExpanded && log.details && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 p-3 rounded-lg bg-panel border border-border"
                      >
                        <pre className="text-xs text-muted whitespace-pre-wrap font-mono">
                          {log.details}
                        </pre>
                      </motion.div>
                    )}
                  </div>

                  {/* View Button */}
                  {onViewDetails && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onViewDetails(log)}
                      className="p-2 rounded-lg text-muted hover:text-text hover:bg-glass transition-colors flex-shrink-0"
                      aria-label="View full details"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
