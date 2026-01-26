'use client'

import { motion } from 'framer-motion'

interface KPICardProps {
  title: string
  value: string | number
  icon: string
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  color?: 'brand' | 'brand2' | 'accent' | 'green' | 'yellow' | 'red'
  onClick?: () => void
  href?: string
}

const colorClasses = {
  brand: 'from-brand/20 to-brand/5 text-brand',
  brand2: 'from-brand2/20 to-brand2/5 text-brand2',
  accent: 'from-accent/20 to-accent/5 text-accent',
  green: 'from-green-500/20 to-green-500/5 text-green-400',
  yellow: 'from-yellow-500/20 to-yellow-500/5 text-yellow-400',
  red: 'from-red-500/20 to-red-500/5 text-red-400'
}

export function KPICard({ title, value, icon, trend, color = 'brand', onClick, href }: KPICardProps) {
  const isClickable = onClick || href
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={`glass rounded-xl p-6 hover:border-brand/40 transition-all ${
        isClickable ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''
      }`}
      whileHover={isClickable ? { y: -2 } : {}}
      whileTap={isClickable ? { scale: 0.98 } : {}}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-2xl`}>
          {icon}
        </div>
        {trend && (
          <div className={`text-sm ${trend.isPositive !== false ? 'text-green-400' : 'text-red-400'}`}>
            {trend.isPositive !== false ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <div className="text-3xl font-bold text-text">{value}</div>
        <div className="text-sm text-muted">{title}</div>
        {trend && <div className="text-xs text-muted">{trend.label}</div>}
      </div>
    </motion.div>
  )
}
