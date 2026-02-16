'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { ProgressBar } from '../../../components/ui/ProgressBar'

interface HeroProgressCardProps {
  coursesCompleted: number
  totalCourses: number
  milestones: Array<{
    id: string
    title: string
    completed: boolean
  }>
  onClick?: () => void
  className?: string
}

export function HeroProgressCard({
  coursesCompleted,
  totalCourses,
  milestones,
  onClick,
  className
}: HeroProgressCardProps) {
  const progress = totalCourses > 0 ? (coursesCompleted / totalCourses) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'glass rounded-xl p-6 border border-border hover:border-brand/40 transition-all',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      whileHover={onClick ? { y: -2 } : undefined}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-text mb-1">Your Progress</h3>
          <p className="text-sm text-muted">
            {coursesCompleted} of {totalCourses} courses completed
          </p>
        </div>
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand/20 to-brand2/20 flex items-center justify-center">
          <span className="text-2xl font-bold text-brand">{Math.round(progress)}%</span>
        </div>
      </div>

      <ProgressBar
        value={coursesCompleted}
        max={totalCourses}
        color="brand"
        size="lg"
        className="mb-6"
      />

      <div className="space-y-2">
        <p className="text-sm font-medium text-text mb-3">Milestones</p>
        {milestones.map((milestone) => (
          <div key={milestone.id} className="flex items-center gap-3">
            <div className={cn(
              'w-5 h-5 rounded-full border-2 flex items-center justify-center',
              milestone.completed
                ? 'bg-green-500 border-green-500'
                : 'border-muted'
            )}>
              {milestone.completed && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className={cn(
              'text-sm',
              milestone.completed ? 'text-text' : 'text-muted'
            )}>
              {milestone.title}
            </span>
          </div>
        ))}
      </div>

      {onClick && (
        <div className="mt-4 pt-4 border-t border-border">
          <span className="text-sm text-brand hover:text-brand2 transition-colors">
            View detailed progress →
          </span>
        </div>
      )}
    </motion.div>
  )
}
