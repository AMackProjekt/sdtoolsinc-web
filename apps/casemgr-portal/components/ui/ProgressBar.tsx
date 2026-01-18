'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface ProgressBarProps {
  progress: number
  label?: string
  showPercentage?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'brand' | 'brand2' | 'accent'
  className?: string
}

export function ProgressBar({
  progress,
  label,
  showPercentage = true,
  size = 'md',
  color = 'brand',
  className
}: ProgressBarProps) {
  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }

  const colors = {
    brand: 'bg-brand',
    brand2: 'bg-brand2',
    accent: 'bg-accent'
  }

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2 text-sm">
          {label && <span className="text-muted">{label}</span>}
          {showPercentage && <span className="font-medium">{progress}%</span>}
        </div>
      )}
      <div className={cn('w-full bg-border rounded-full overflow-hidden', heights[size])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className={cn(heights[size], colors[color], 'rounded-full')}
        />
      </div>
    </div>
  )
}
