'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { PortalHeader } from '@/components/ui/PortalHeader'
import { Card, CardHeader } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import { GED_COURSE_LESSONS } from '@/lib/course-data'

// Required for Next.js static export with dynamic routes
export function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
  ]
}

interface Lesson {
  id: string
  title: string
  description: string
  duration: string
  completed: boolean
  videoUrl?: string
  resources?: Array<{ title: string; url: string; type: string }>
}

interface Course {
  id: string
  title: string
  description: string
  category: string
  progress: number
  instructor: string
  lessons: Lesson[]
}

// Mock course data - GED course uses actual data from course-data.ts
const mockCourse: Course = {
  id: '4',
  title: 'G.E.D Preparation',
  description: 'Complete preparation for all four GED test subjects: Mathematics, Reasoning Through Language Arts, Science, and Social Studies. Includes practice tests and study materials.',
  category: 'Education',
  progress: 30,
  instructor: 'T.O.O.L.S Inc Education Team',
  lessons: GED_COURSE_LESSONS
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)

  useEffect(() => {
    // TODO: Fetch course from API
    setCourse(mockCourse)
    setSelectedLesson(mockCourse.lessons[3]) // Current lesson
  }, [params.id])

  if (!course) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-muted">Loading course...</div>
      </div>
    )
  }

  const completedLessons = course.lessons.filter(l => l.completed).length
  const totalLessons = course.lessons.length

  return (
    <div className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />
      
      <PortalHeader user={user} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm">
          <Link href="/courses" className="text-muted hover:text-text transition">
            Courses
          </Link>
          <span className="text-muted">/</span>
          <span className="text-text">{course.title}</span>
        </div>

        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-extrabold mb-2">{course.title}</h1>
              <p className="text-muted text-lg mb-4">{course.description}</p>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-muted">Instructor: {course.instructor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-brand2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="text-muted">{completedLessons} of {totalLessons} lessons completed</span>
                </div>
              </div>
            </div>
          </div>
          
          <ProgressBar progress={course.progress} size="lg" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lesson List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader title="Lessons" subtitle={`${totalLessons} total`} />
              <div className="space-y-2">
                {course.lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => setSelectedLesson(lesson)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedLesson?.id === lesson.id
                        ? 'bg-brand/20 border border-brand'
                        : 'bg-panel hover:bg-panel/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        lesson.completed
                          ? 'bg-brand text-bg'
                          : 'bg-border text-muted'
                      }`}>
                        {lesson.completed ? '✓' : index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm mb-1">{lesson.title}</div>
                        <div className="text-xs text-muted">{lesson.duration}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Lesson Content */}
          <div className="lg:col-span-2">
            {selectedLesson ? (
              <Card>
                <CardHeader title={selectedLesson.title} />
                
                {/* Video Player Placeholder */}
                <div className="aspect-video bg-panel rounded-lg mb-6 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-brand mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-muted">Video Player</p>
                    <p className="text-sm text-muted mt-2">{selectedLesson.duration}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-bold mb-2">About this lesson</h3>
                  <p className="text-muted">{selectedLesson.description}</p>
                </div>

                {selectedLesson.resources && (
                  <div className="mb-6">
                    <h3 className="font-bold mb-3">Resources & Study Materials</h3>
                    <div className="space-y-2">
                      {selectedLesson.resources.map((resource, index) => (
                        <a
                          key={index}
                          href={resource.url}
                          target={resource.url.startsWith('http') ? '_blank' : '_self'}
                          rel={resource.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="flex items-center gap-2 p-3 bg-panel rounded-lg hover:bg-panel/60 transition group"
                        >
                          {resource.type === 'interactive' ? (
                            <svg className="w-5 h-5 text-brand flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          ) : resource.type === 'pdf' ? (
                            <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          ) : resource.type === 'website' ? (
                            <svg className="w-5 h-5 text-brand2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          )}
                          <span className="flex-1">{resource.title}</span>
                          <svg className="w-4 h-4 text-muted group-hover:text-brand transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  {!selectedLesson.completed && (
                    <Button variant="primary" className="flex-1">
                      Mark as Complete
                    </Button>
                  )}
                  <Button variant="outline" className="flex-1">
                    Next Lesson →
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="flex items-center justify-center min-h-[400px]">
                <div className="text-center text-muted">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <p>Select a lesson to begin</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
