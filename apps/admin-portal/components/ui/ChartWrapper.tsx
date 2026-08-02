'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { LoadingSkeleton } from './LoadingSkeleton'

interface ChartWrapperProps {
  title?: string
  description?: string
  children: ReactNode
  loading?: boolean
  error?: string
  onExport?: () => void
  className?: string
  height?: string
}

export function ChartWrapper({
  title,
  description,
  children,
  loading = false,
  error,
  onExport,
  className,
  height = '300px'
}: ChartWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('glass rounded-xl p-6', className)}
    >
      {/* Header */}
      {(title || onExport) && (
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {title && <h3 className="text-lg font-semibold text-text mb-1">{title}</h3>}
            {description && <p className="text-sm text-muted">{description}</p>}
          </div>
          {onExport && (
            <button
              onClick={onExport}
              className="px-3 py-1.5 text-sm text-brand hover:text-brand2 border border-brand/30 rounded-lg hover:bg-brand/10 transition-colors"
              aria-label="Export chart"
            >
              Export
            </button>
          )}
        </div>
      )}

      {/* Chart Content */}
      <div style={{ height }} className="w-full">
        {loading ? (
          <div className="flex flex-col gap-4 h-full">
            <LoadingSkeleton width="40%" height="1.5rem" />
            <div className="flex-1 flex items-end gap-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-glass animate-pulse rounded-t"
                  style={{ height: `${30 + Math.random() * 60}%` }}
                />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-muted">{error}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </motion.div>
  )
}
