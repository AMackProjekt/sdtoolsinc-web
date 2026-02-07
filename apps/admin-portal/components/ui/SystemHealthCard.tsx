'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { ReactNode } from 'react'

interface SystemHealthCardProps {
  title: string
  value: string | number
  status: 'healthy' | 'warning' | 'critical'
  icon?: ReactNode
  subtitle?: string
  className?: string
}

const statusConfig = {
  healthy: {
    bgGradient: 'from-green-500/20 to-green-500/5',
    borderColor: 'border-green-500/30',
    textColor: 'text-green-400',
    dotColor: 'bg-green-500'
  },
  warning: {
    bgGradient: 'from-yellow-500/20 to-yellow-500/5',
    borderColor: 'border-yellow-500/30',
    textColor: 'text-yellow-400',
    dotColor: 'bg-yellow-500'
  },
  critical: {
    bgGradient: 'from-red-500/20 to-red-500/5',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-400',
    dotColor: 'bg-red-500'
  }
}

export function SystemHealthCard({
  title,
  value,
  status,
  icon,
  subtitle,
  className
}: SystemHealthCardProps) {
  const config = statusConfig[status]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={cn(
        'glass rounded-xl p-6 border transition-all',
        config.borderColor,
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('w-2 h-2 rounded-full animate-pulse', config.dotColor)} />
            <h3 className="text-sm font-medium text-muted">{title}</h3>
          </div>
          <p className={cn('text-2xl font-bold', config.textColor)}>{value}</p>
          {subtitle && <p className="text-xs text-muted mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className={cn(
            'w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center',
            config.bgGradient
          )}>
            <span className={config.textColor}>{icon}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
