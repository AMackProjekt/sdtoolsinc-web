'use client'

import { cn } from '@/lib/cn'
import { ReactNode } from 'react'

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'at-risk' | 'completed' | 'success' | 'warning' | 'danger'
  variant?: 'default' | 'outline' | 'solid'
  size?: 'sm' | 'md' | 'lg'
  children?: ReactNode
  className?: string
}

const statusClasses = {
  active: 'bg-green-500/10 text-green-400 border-green-500/20',
  inactive: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'at-risk': 'bg-red-500/10 text-red-400 border-red-500/20',
  completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  success: 'bg-green-500/10 text-green-400 border-green-500/20',
  warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  danger: 'bg-red-500/10 text-red-400 border-red-500/20'
}

const solidStatusClasses = {
  active: 'bg-green-500 text-white',
  inactive: 'bg-gray-500 text-white',
  pending: 'bg-yellow-500 text-white',
  'at-risk': 'bg-red-500 text-white',
  completed: 'bg-blue-500 text-white',
  success: 'bg-green-500 text-white',
  warning: 'bg-yellow-500 text-white',
  danger: 'bg-red-500 text-white'
}

const outlineStatusClasses = {
  active: 'border-green-500 text-green-400',
  inactive: 'border-gray-500 text-gray-400',
  pending: 'border-yellow-500 text-yellow-400',
  'at-risk': 'border-red-500 text-red-400',
  completed: 'border-blue-500 text-blue-400',
  success: 'border-green-500 text-green-400',
  warning: 'border-yellow-500 text-yellow-400',
  danger: 'border-red-500 text-red-400'
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5'
}

const statusLabels = {
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending',
  'at-risk': 'At Risk',
  completed: 'Completed',
  success: 'Success',
  warning: 'Warning',
  danger: 'Danger'
}

export function StatusBadge({
  status,
  variant = 'default',
  size = 'md',
  children,
  className
}: StatusBadgeProps) {
  const variantClass = variant === 'solid' 
    ? solidStatusClasses[status]
    : variant === 'outline'
    ? `bg-transparent border ${outlineStatusClasses[status]}`
    : statusClasses[status]

  return (
    <span className={cn(
      'inline-flex items-center font-medium rounded-full border',
      sizeClasses[size],
      variantClass,
      className
    )}>
      {children || statusLabels[status]}
    </span>
  )
}
