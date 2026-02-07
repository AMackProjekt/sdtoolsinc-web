'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { ReactNode } from 'react'

export interface StatCardProps {
  title: string
  value: string | number
  icon?: ReactNode | string
  trend?: {
    value: number
    label?: string
    isPositive?: boolean
  }
  onClick?: () => void
  loading?: boolean
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'default'
  className?: string
}

const variantClasses = {
  primary: 'from-brand/20 to-brand/5 border-brand/20 hover:border-brand/40',
  success: 'from-green-500/20 to-green-500/5 border-green-500/20 hover:border-green-500/40',
  warning: 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/20 hover:border-yellow-500/40',
  danger: 'from-red-500/20 to-red-500/5 border-red-500/20 hover:border-red-500/40',
  default: 'from-glass to-glass/5 border-border hover:border-border'
}

const iconColorClasses = {
  primary: 'text-brand',
  success: 'text-green-400',
  warning: 'text-yellow-400',
  danger: 'text-red-400',
  default: 'text-muted'
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  onClick,
  loading = false,
  variant = 'default',
  className
}: StatCardProps) {
  const isClickable = !!onClick

  const content = (
    <div className="relative h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm text-muted mb-1">{title}</p>
          {loading ? (
            <div className="h-8 w-24 bg-glass animate-pulse rounded" />
          ) : (
            <p className="text-3xl font-bold text-text">{value}</p>
          )}
        </div>
        {icon && (
          <div className={cn(
            'w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-xl',
            variantClasses[variant]
          )}>
            {typeof icon === 'string' ? icon : <span className={iconColorClasses[variant]}>{icon}</span>}
          </div>
        )}
      </div>
      {trend && !loading && (
        <div className="flex items-center gap-2">
          <span className={cn(
            'text-sm font-medium',
            trend.isPositive ? 'text-green-400' : 'text-red-400'
          )}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          {trend.label && (
            <span className="text-xs text-muted">{trend.label}</span>
          )}
        </div>
      )}
      {isClickable && (
        <div className="absolute top-2 right-2 text-muted/50 text-xs">
          →
        </div>
      )}
    </div>
  )

  const baseClasses = cn(
    'glass rounded-xl p-6 border transition-all',
    variantClasses[variant],
    isClickable && 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]',
    className
  )

  if (isClickable) {
    return (
      <motion.button
        onClick={onClick}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={baseClasses}
      >
        {content}
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={baseClasses}
    >
      {content}
    </motion.div>
  )
}
