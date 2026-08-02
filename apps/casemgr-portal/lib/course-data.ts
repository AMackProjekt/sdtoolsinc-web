// Educational Resources and Course Materials

export interface Resource {
  title: string
  url: string
  type: 'video' | 'pdf' | 'article' | 'interactive' | 'website'
}

export interface Lesson {
  id: string
  title: string
  description: string
  duration: string
  completed: boolean
  videoUrl?: string
  resources?: Resource[]
}

// Free Educational Platforms
export const FREE_EDUCATION_RESOURCES = [
  {
    id: 'khan-academy',
    title: 'Khan Academy',
    description: 'Free courses in math, science, computing, and more',
    url: 'https://www.khanacademy.org',
    category: 'Education',
    type: 'website' as const
  },
  {
    id: 'coursera-free',
    title: 'Coursera Free Courses',
    description: 'Free university courses from top institutions',
    url: 'https://www.coursera.org/courses?query=free',
    category: 'Education',
    type: 'website' as const
  },
  {
    id: 'edx',
    title: 'edX',
    description: 'Free online courses from Harvard, MIT, and more',
    url: 'https://www.edx.org',
    category: 'Education',
    type: 'website' as const
  },
  {
    id: 'ged-test-prep',
    title: 'GED Test Prep',
    description: 'Official GED preparation resources',
    url: 'https://ged.com/study/',
    category: 'Education',
    type: 'website' as const
  },
  {
    id: 'light-and-salt',
    title: 'Light & Salt Learning',
    description: 'Free GED prep and tutoring',
    url: 'https://www.lightandsaltlearning.org',
    category: 'Education',
    type: 'website' as const
  },
  {
    id: 'ca-community-college',
    title: 'California Community Colleges',
    description: 'Find and apply to CA community colleges',
    url: 'https://www.cccapply.org',
    category: 'Education',
    type: 'website' as const
  },
  {
    id: 'codecademy',
    title: 'Codecademy',
    description: 'Free coding courses and programming tutorials',
    url: 'https://www.codecademy.com/catalog/subject/all',
    category: 'Education',
    type: 'website' as const
  },
  {
    id: 'duolingo',
    title: 'Duolingo',
    description: 'Free language learning',
    url: 'https://www.duolingo.com',
    category: 'Education',
    type: 'website' as const
  },
  {
    id: 'mit-opencourseware',
    title: 'MIT OpenCourseWare',
    description: 'Free MIT course materials',
    url: 'https://ocw.mit.edu',
    category: 'Education',
    type: 'website' as const
  },
  {
    id: 'youtube-edu',
    title: 'YouTube Learning',
    description: 'Free educational videos on any topic',
    url: 'https://www.youtube.com/education',
    category: 'Education',
    type: 'website' as const
  }
]

// G.E.D Preparation Course
export const GED_COURSE_LESSONS: Lesson[] = [
  {
    id: '1',
    title: 'Introduction to GED',
    description: 'Overview of GED test structure and requirements',
    duration: '20 min',
    completed: true,
    resources: [
      {
        title: 'GED Official Website',
        url: 'https://ged.com',
        type: 'website'
      },
      {
        title: 'GED Test Overview PDF',
        url: '/resources/ged-overview.pdf',
        type: 'pdf'
      }
    ]
  },
  {
    id: '2',
    title: 'Mathematics Fundamentals',
    description: 'Basic arithmetic, algebra, and geometry concepts',
    duration: '45 min',
    completed: true,
    resources: [
      {
        title: 'Khan Academy Math',
        url: 'https://www.khanacademy.org/math',
        type: 'interactive'
      },
      {
        title: 'GED Math Practice Tests',
        url: 'https://ged.com/study/ged_math/',
        type: 'interactive'
      }
    ]
  },
  {
    id: '3',
    title: 'Reasoning Through Language Arts',
    description: 'Reading comprehension and writing skills',
    duration: '40 min',
    completed: true,
    resources: [
      {
        title: 'Reading Comprehension Strategies',
        url: '/resources/reading-strategies.pdf',
        type: 'pdf'
      },
      {
        title: 'Grammar Basics',
        url: 'https://www.khanacademy.org/humanities/grammar',
        type: 'interactive'
      }
    ]
  },
  {
    id: '4',
    title: 'Science Test Preparation',
    description: 'Life science, physical science, and earth science',
    duration: '50 min',
    completed: false,
    resources: [
      {
        title: 'Khan Academy Science',
        url: 'https://www.khanacademy.org/science',
        type: 'interactive'
      },
      {
        title: 'GED Science Study Guide',
        url: 'https://ged.com/study/ged_science/',
        type: 'website'
      }
    ]
  },
  {
    id: '5',
    title: 'Social Studies Essentials',
    description: 'US history, government, economics, and geography',
    duration: '45 min',
    completed: false,
    resources: [
      {
        title: 'US History Overview',
        url: 'https://www.khanacademy.org/humanities/us-history',
        type: 'interactive'
      }
    ]
  },
  {
    id: '6',
    title: 'Advanced Math Concepts',
    description: 'Algebra, functions, and data analysis',
    duration: '55 min',
    completed: false,
    resources: [
      {
        title: 'Algebra Practice',
        url: 'https://www.khanacademy.org/math/algebra',
        type: 'interactive'
      }
    ]
  },
  {
    id: '7',
    title: 'Extended Response Writing',
    description: 'Essay writing techniques for GED',
    duration: '40 min',
    completed: false,
    resources: [
      {
        title: 'Essay Writing Guide',
        url: '/resources/essay-writing-guide.pdf',
        type: 'pdf'
      }
    ]
  },
  {
    id: '8',
    title: 'Test-Taking Strategies',
    description: 'Time management and test anxiety reduction',
    duration: '30 min',
    completed: false
  },
  {
    id: '9',
    title: 'Practice Test 1 - Math',
    description: 'Full-length practice exam',
    duration: '90 min',
    completed: false,
    resources: [
      {
        title: 'Official GED Practice Tests',
        url: 'https://ged.com/study/practice_test/',
        type: 'interactive'
      }
    ]
  },
  {
    id: '10',
    title: 'Practice Test 2 - RLA',
    description: 'Full-length reading and writing exam',
    duration: '150 min',
    completed: false
  },
  {
    id: '11',
    title: 'Practice Test 3 - Science',
    description: 'Full-length science exam',
    duration: '90 min',
    completed: false
  },
  {
    id: '12',
    title: 'Practice Test 4 - Social Studies',
    description: 'Full-length social studies exam',
    duration: '70 min',
    completed: false
  }
]

// Employment Resources
export const EMPLOYMENT_RESOURCES = [
  {
    id: 'linkedin-learning',
    title: 'LinkedIn Learning',
    description: 'Professional development courses (some free with library card)',
    url: 'https://www.linkedin.com/learning/',
    category: 'Employment',
    type: 'website' as const
  },
  {
    id: 'indeed-career',
    title: 'Indeed Career Guide',
    description: 'Free career advice and job search tips',
    url: 'https://www.indeed.com/career-advice',
    category: 'Employment',
    type: 'website' as const
  },
  {
    id: 'sdworks',
    title: 'San Diego Workforce Partnership',
    description: 'Free job training and placement services',
    url: 'https://workforce.org',
    category: 'Employment',
    type: 'website' as const
  },
  {
    id: 'america-job-center',
    title: 'America\'s Job Center',
    description: 'Free career counseling and job search assistance',
    url: 'https://www.careeronestop.org/LocalHelp/AmericanJobCenters/american-job-centers.aspx',
    category: 'Employment',
    type: 'website' as const
  }
]

export const ALL_FREE_RESOURCES = [
  ...FREE_EDUCATION_RESOURCES,
  ...EMPLOYMENT_RESOURCES
]
