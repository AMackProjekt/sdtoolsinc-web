'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/cn'
import { ProgressBar } from '@/components/ui/ProgressBar'

interface Course {
  id: string
  title: string
  progress: number
  completed: boolean
  thumbnail?: string
}

interface ProgressSectionProps {
  courses: Course[]
  loading?: boolean
  className?: string
}

export function ProgressSection({ courses, loading = false, className }: ProgressSectionProps) {
  if (loading) {
    return (
      <div className={cn('glass rounded-xl p-6', className)}>
        <div className="h-6 w-48 bg-glass animate-pulse rounded mb-4" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-glass animate-pulse rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('glass rounded-xl p-6', className)}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text">Course Progress</h2>
        <Link
          href="/courses"
          className="text-sm text-brand hover:text-brand2 transition-colors font-medium"
        >
          View All Courses →
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted mb-4">No courses enrolled yet</p>
          <Link
            href="/courses"
            className="inline-block px-6 py-3 bg-gradient-to-r from-brand to-brand2 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/courses/${course.id}`}>
                <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-glass transition-colors group">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-brand/20 to-brand2/20 flex items-center justify-center">
                      <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-text truncate group-hover:text-brand transition-colors">
                        {course.title}
                      </h3>
                      {course.completed && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                    <ProgressBar
                      value={course.progress}
                      max={100}
                      showPercentage={false}
                      size="sm"
                    />
                  </div>

                  <div className="text-sm font-medium text-muted group-hover:text-brand transition-colors">
                    {course.progress}%
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
