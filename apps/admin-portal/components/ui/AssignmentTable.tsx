'use client'

import { motion } from 'framer-motion'
import { Edit, Trash2, Eye, MoreVertical } from 'lucide-react'
import { StatusBadge, type BadgeVariant } from './StatusBadge'
import { useState } from 'react'

export interface Assignment {
  Id: string
  ClientId: string
  CaseManagerId: string
  AssignedBy: string
  AssignedAt: string
  Status: 'active' | 'inactive' | 'transferred'
  Notes?: string
  ClientDisplayName: string
  ClientEmail: string
  CaseManagerDisplayName: string
  CaseManagerEmail: string
  AssignedByDisplayName: string
  AssignedByEmail: string
}

interface AssignmentTableProps {
  assignments: Assignment[]
  loading?: boolean
  onEdit?: (assignment: Assignment) => void
  onDelete?: (assignment: Assignment) => void
  onView?: (assignment: Assignment) => void
}

const statusVariants: Record<Assignment['Status'], BadgeVariant> = {
  active: 'success',
  inactive: 'default',
  transferred: 'info'
}

export function AssignmentTable({
  assignments,
  loading = false,
  onEdit,
  onDelete,
  onView
}: AssignmentTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  if (loading) {
    return (
      <div className="glass rounded-xl p-6">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-glass animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (assignments.length === 0) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-text mb-2">No Assignments Found</h3>
        <p className="text-sm text-muted">Create your first assignment to get started</p>
      </div>
    )
  }

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-4 px-4 text-sm font-medium text-muted">Client</th>
              <th className="text-left py-4 px-4 text-sm font-medium text-muted">Case Manager</th>
              <th className="text-left py-4 px-4 text-sm font-medium text-muted">Assigned Date</th>
              <th className="text-left py-4 px-4 text-sm font-medium text-muted">Status</th>
              <th className="text-left py-4 px-4 text-sm font-medium text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment, index) => (
              <motion.tr
                key={assignment.Id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-border hover:bg-glass/50 transition-colors"
              >
                {/* Client */}
                <td className="py-4 px-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-text">
                      {assignment.ClientDisplayName}
                    </span>
                    <span className="text-xs text-muted">{assignment.ClientEmail}</span>
                  </div>
                </td>

                {/* Case Manager */}
                <td className="py-4 px-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-text">
                      {assignment.CaseManagerDisplayName}
                    </span>
                    <span className="text-xs text-muted">{assignment.CaseManagerEmail}</span>
                  </div>
                </td>

                {/* Assigned Date */}
                <td className="py-4 px-4">
                  <span className="text-sm text-text">
                    {new Date(assignment.AssignedAt).toLocaleDateString()}
                  </span>
                </td>

                {/* Status */}
                <td className="py-4 px-4">
                  <StatusBadge
                    label={assignment.Status}
                    variant={statusVariants[assignment.Status]}
                    dot
                  />
                </td>

                {/* Actions */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {onView && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onView(assignment)}
                        className="p-2 rounded-lg text-muted hover:text-text hover:bg-glass transition-colors"
                        aria-label="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                    )}
                    {onEdit && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onEdit(assignment)}
                        className="p-2 rounded-lg text-muted hover:text-brand transition-colors"
                        aria-label="Edit assignment"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                    )}
                    {onDelete && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onDelete(assignment)}
                        className="p-2 rounded-lg text-muted hover:text-red-400 transition-colors"
                        aria-label="Delete assignment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
