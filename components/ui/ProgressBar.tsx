'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface ProgressBarProps {
  value: number
  max?: number
  color?: 'brand' | 'success' | 'warning' | 'danger'
  label?: string
  showPercentage?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
  animated?: boolean
}

const colorClasses = {
  brand: 'from-brand to-brand2',
  success: 'from-green-400 to-green-600',
  warning: 'from-yellow-400 to-orange-500',
  danger: 'from-red-400 to-red-600'
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4'
}

export function ProgressBar({
  value,
  max = 100,
  color = 'brand',
  label,
  showPercentage = true,
  size = 'md',
  className,
  animated = true
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-sm text-muted">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-medium text-text">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className={cn(
        'w-full bg-bg rounded-full overflow-hidden',
        sizeClasses[size]
      )}>
        {animated ? (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'h-full bg-gradient-to-r rounded-full',
              colorClasses[color]
            )}
          />
        ) : (
          <div
            className={cn(
              'h-full bg-gradient-to-r rounded-full transition-all duration-300',
              colorClasses[color]
            )}
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
    </div>
  )
}
