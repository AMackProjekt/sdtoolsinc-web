'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/cn'

interface Activity {
  id: string
  title: string
  type: 'meeting' | 'workshop' | 'deadline' | 'event'
  date: string
  time: string
  location?: string
  isPastDue?: boolean
}

interface UpcomingActivitiesProps {
  activities: Activity[]
  loading?: boolean
  className?: string
}

const activityIcons = {
  meeting: '🤝',
  workshop: '🎓',
  deadline: '⏰',
  event: '📅'
}

const activityColors = {
  meeting: 'from-blue-500/20 to-blue-500/5 border-blue-500/20',
  workshop: 'from-purple-500/20 to-purple-500/5 border-purple-500/20',
  deadline: 'from-orange-500/20 to-orange-500/5 border-orange-500/20',
  event: 'from-green-500/20 to-green-500/5 border-green-500/20'
}

export function UpcomingActivities({ activities, loading = false, className }: UpcomingActivitiesProps) {
  const handleAddToCalendar = (activity: Activity) => {
    // Create iCal format for calendar apps
    const startDate = new Date(`${activity.date} ${activity.time}`)
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000) // Add 1 hour
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${activity.title}
LOCATION:${activity.location || 'TBD'}
END:VEVENT
END:VCALENDAR`

    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activity.title.replace(/\s+/g, '-')}.ics`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className={cn('glass rounded-xl p-6', className)}>
        <div className="h-6 w-48 bg-glass animate-pulse rounded mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-glass animate-pulse rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('glass rounded-xl p-6', className)}>
      <h2 className="text-xl font-semibold text-text mb-6">Upcoming Activities</h2>

      {activities.length === 0 ? (
        <div className="text-center py-8 text-muted">
          No upcoming activities scheduled
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/activities/${activity.id}`}>
                <div className={cn(
                  'flex items-start gap-4 p-4 rounded-lg border transition-all hover:scale-[1.01] group',
                  activity.isPastDue
                    ? 'bg-red-500/5 border-red-500/20'
                    : 'glass border-border hover:border-brand/40'
                )}>
                  <div className={cn(
                    'w-12 h-12 rounded-lg flex items-center justify-center text-2xl border',
                    activity.isPastDue
                      ? 'bg-red-500/20 border-red-500/30'
                      : activityColors[activity.type]
                  )}>
                    {activityIcons[activity.type]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={cn(
                        'text-sm font-medium group-hover:text-brand transition-colors',
                        activity.isPastDue ? 'text-red-400' : 'text-text'
                      )}>
                        {activity.title}
                        {activity.isPastDue && <span className="ml-2 text-xs">(Past Due)</span>}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          handleAddToCalendar(activity)
                        }}
                        className="text-xs text-brand hover:text-brand2 transition-colors px-2 py-1 rounded hover:bg-brand/10"
                        title="Add to calendar"
                      >
                        + Cal
                      </button>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(activity.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {activity.time}
                      </span>
                      {activity.location && (
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {activity.location}
                        </span>
                      )}
                    </div>
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
