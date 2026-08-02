'use client'

import { cn } from '@/lib/cn'

interface LoadingSkeletonProps {
  variant?: 'text' | 'card' | 'circle' | 'rectangle'
  width?: string
  height?: string
  className?: string
  count?: number
}

export function LoadingSkeleton({
  variant = 'text',
  width,
  height,
  className,
  count = 1
}: LoadingSkeletonProps) {
  const baseClasses = 'animate-pulse bg-glass rounded'

  const variantClasses = {
    text: 'h-4',
    card: 'h-32',
    circle: 'rounded-full w-12 h-12',
    rectangle: 'h-24'
  }

  const skeleton = (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={{
        width: width || undefined,
        height: height || (variant !== 'text' && variant !== 'circle' ? height : undefined)
      }}
    />
  )

  if (count > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i}>{skeleton}</div>
        ))}
      </div>
    )
  }

  return skeleton
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <LoadingSkeleton key={`header-${i}`} width="80%" height="1rem" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <LoadingSkeleton key={`cell-${rowIndex}-${colIndex}`} width="90%" height="1rem" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <LoadingSkeleton width="40%" height="1.5rem" />
        <LoadingSkeleton variant="circle" width="3rem" height="3rem" />
      </div>
      <LoadingSkeleton width="60%" height="2.5rem" />
      <LoadingSkeleton width="50%" height="1rem" />
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <LoadingSkeleton width="300px" height="2rem" />
        <LoadingSkeleton width="200px" height="1rem" />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>

      {/* Content */}
      <div className="glass rounded-xl p-6">
        <LoadingSkeleton width="200px" height="1.5rem" className="mb-4" />
        <TableSkeleton />
      </div>
    </div>
  )
}
