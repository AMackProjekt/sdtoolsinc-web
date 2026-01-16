'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Placeholder course data
const courses = [
  {
    id: '1',
    title: 'Job Interview Skills',
    category: 'Employment',
    duration: '4 weeks',
    progress: 75,
    lessons: 12,
    completed: 9,
    enrolled: true,
    thumbnail: 'https://via.placeholder.com/300x180/38bdf8/ffffff?text=Interview+Skills'
  },
  {
    id: '2',
    title: 'Resume Writing Mastery',
    category: 'Employment',
    duration: '2 weeks',
    progress: 100,
    lessons: 8,
    completed: 8,
    enrolled: true,
    thumbnail: 'https://via.placeholder.com/300x180/2dd4bf/ffffff?text=Resume+Writing'
  },
  {
    id: '3',
    title: 'Financial Literacy Basics',
    category: 'Life Skills',
    duration: '6 weeks',
    progress: 0,
    lessons: 15,
    completed: 0,
    enrolled: false,
    thumbnail: 'https://via.placeholder.com/300x180/a78bfa/ffffff?text=Financial+Literacy'
  },
  {
    id: '4',
    title: 'G.E.D Preparation',
    category: 'Education',
    duration: '12 weeks',
    progress: 30,
    lessons: 24,
    completed: 7,
    enrolled: true,
    thumbnail: 'https://via.placeholder.com/300x180/38bdf8/ffffff?text=GED+Prep'
  },
  {
    id: '5',
    title: 'Professional Communication',
    category: 'Employment',
    duration: '3 weeks',
    progress: 0,
    lessons: 10,
    completed: 0,
    enrolled: false,
    thumbnail: 'https://via.placeholder.com/300x180/2dd4bf/ffffff?text=Communication'
  },
  {
    id: '6',
    title: 'CalBenefits Navigation',
    category: 'Benefits',
    duration: '2 weeks',
    progress: 0,
    lessons: 6,
    completed: 0,
    enrolled: false,
    thumbnail: 'https://via.placeholder.com/300x180/a78bfa/ffffff?text=CalBenefits'
  }
]

const categories = ['All', 'Employment', 'Education', 'Life Skills', 'Benefits']

export default function CoursesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('portal_user')
    if (!storedUser) {
      router.push('/auth/login')
    } else {
      setUser(JSON.parse(storedUser))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('portal_user')
    router.push('/auth/login')
  }

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-xl font-bold bg-gradient-to-r from-brand to-brand2 bg-clip-text text-transparent">
              T.O.O.L.S Portal
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/dashboard" className="text-muted hover:text-text transition">Dashboard</Link>
              <Link href="/courses" className="text-text font-medium">Courses</Link>
              <Link href="/profile" className="text-muted hover:text-text transition">Profile</Link>
            </nav>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-muted hover:text-text transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold mb-2">Course Catalog</h1>
          <p className="text-muted">Explore courses tailored to your goals and interests</p>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-panel border border-border text-text focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                  selectedCategory === category
                    ? 'bg-brand text-bg'
                    : 'bg-panel border border-border text-muted hover:text-text hover:border-brand/50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* My Courses Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">My Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.filter(c => c.enrolled).map(course => (
              <div key={course.id} className="glass rounded-xl overflow-hidden hover:border-brand/50 transition">
                <div className="h-40 bg-gradient-to-br from-brand/20 to-accent/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-brand mb-2">{course.progress}%</div>
                    <div className="text-sm text-muted">Complete</div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="text-xs text-brand font-medium mb-2">{course.category}</div>
                  <h3 className="text-lg font-bold mb-2">{course.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted mb-4">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {course.completed}/{course.lessons} lessons
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="h-2 rounded-full bg-panel overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-brand to-brand2" style={{ width: `${course.progress}%` }} />
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 bg-brand text-bg font-semibold rounded-lg hover:bg-brand2 transition">
                    {course.progress > 0 ? 'Continue' : 'Start Course'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Courses Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {selectedCategory === 'All' ? 'All Courses' : `${selectedCategory} Courses`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <div key={course.id} className="glass rounded-xl overflow-hidden hover:border-brand/50 transition">
                <div className="h-40 bg-gradient-to-br from-panel to-bg flex items-center justify-center border-b border-border">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-brand mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <div className="text-sm text-brand font-medium">{course.category}</div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2">{course.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted mb-4">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {course.lessons} lessons
                    </div>
                  </div>
                  {course.enrolled ? (
                    <button className="w-full px-4 py-2 bg-brand text-bg font-semibold rounded-lg hover:bg-brand2 transition">
                      Continue Learning
                    </button>
                  ) : (
                    <button className="w-full px-4 py-2 border border-brand text-brand font-semibold rounded-lg hover:bg-brand/10 transition">
                      Enroll Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted mb-4">No courses found matching your criteria</div>
              <button
                onClick={() => {
                  setSelectedCategory('All')
                  setSearchQuery('')
                }}
                className="text-brand hover:text-brand2 transition"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
