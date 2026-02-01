'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface StatCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  trend?: {
    value: number
    label: string
  }
  color?: 'brand' | 'brand2' | 'accent'
  className?: string
}

export function StatCard({ title, value, icon, trend, color = 'brand', className }: StatCardProps) {
  const colors = {
    brand: {
      bg: 'bg-brand/20',
      text: 'text-brand'
    },
    brand2: {
      bg: 'bg-brand2/20',
      text: 'text-brand2'
    },
    accent: {
      bg: 'bg-accent/20',
      text: 'text-accent'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn('glass rounded-xl p-6', className)}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm text-muted">{title}</h3>
        {icon && (
          <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', colors[color].bg)}>
            <div className={cn('w-5 h-5', colors[color].text)}>{icon}</div>
          </div>
        )}
      </div>
      <div className={cn('text-3xl font-bold', colors[color].text)}>{value}</div>
      {trend && (
        <div className="mt-2 flex items-center gap-2 text-sm">
          <span className={cn(trend.value >= 0 ? 'text-brand2' : 'text-red-400')}>
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-muted">{trend.label}</span>
        </div>
      )}
    </motion.div>
  )
}
