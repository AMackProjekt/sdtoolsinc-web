// Course Management System Data Structure

export type CourseType = "online" | "in-class" | "hybrid";
export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl?: string;
  duration: number; // in minutes
  content: string;
  resources: Array<{
    id: string;
    title: string;
    url: string;
    type: "pdf" | "link" | "document";
  }>;
  order: number;
}

export interface CourseOutline {
  overview: string;
  objectives: string[];
  topics: string[];
  requirements?: string[];
  materials?: string[];
  assessmentMethod?: string;
}

export interface CourseSchedule {
  startDate?: string;
  endDate?: string;
  meetDays: string[]; // e.g., ["Monday", "Wednesday", "Friday"]
  startTime: string; // e.g., "09:00"
  endTime: string; // e.g., "11:00"
  location?: string;
  instructor?: string;
  maxCapacity?: number;
  currentEnrollment?: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  programId: string;
  type: CourseType;
  level: DifficultyLevel;
  duration: string; // e.g., "4 weeks"
  thumbnail: string;
  lessons: string[]; // lesson IDs
  outline: CourseOutline;
  schedule?: CourseSchedule;
  prerequisites?: string[];
  credits?: number;
  instructors?: string[];
}

export interface Program {
  id: string;
  name: string;
  description: string;
  overview: string;
  thumbnail: string;
  courseIds: string[];
  duration: string;
  level: DifficultyLevel;
  targetAudience: string;
  outcomes: string[];
  color: string;
}

// PROGRAMS DATA
export const programs: Program[] = [
  {
    id: "reentry",
    name: "Reentry & Resettlement Program",
    description: "Support for individuals successfully reintegrating into society",
    overview:
      "Comprehensive program designed to help justice-involved individuals rebuild their lives with essential life skills, employment readiness, and community connections.",
    thumbnail: "🏠",
    courseIds: ["job-readiness", "financial-literacy", "digital-skills", "conflict-resolution"],
    duration: "8 weeks",
    level: "Beginner",
    targetAudience: "Justice-involved individuals in reentry",
    outcomes: [
      "Develop practical life skills for successful community integration",
      "Prepare for employment opportunities",
      "Build financial stability foundations",
      "Establish positive community connections",
    ],
    color: "#38bdf8",
  },
  {
    id: "job-training",
    name: "Job Training & Employment Program",
    description: "Career-focused training with job placement support",
    overview:
      "Intensive program combining technical skills, professional development, and direct job placement assistance to help individuals secure sustainable employment.",
    thumbnail: "💼",
    courseIds: ["job-readiness", "advanced-digital-skills", "industry-certifications", "interview-mastery"],
    duration: "12 weeks",
    level: "Intermediate",
    targetAudience: "Job seekers and career changers",
    outcomes: [
      "Master in-demand technical skills",
      "Develop professional networking abilities",
      "Complete industry certifications",
      "Secure employment within 90 days",
    ],
    color: "#2dd4bf",
  },
  {
    id: "personal-growth",
    name: "Personal Growth & Development",
    description: "Transform your mindset and unlock your potential",
    overview:
      "Holistic program focused on mental health, resilience, goal-setting, and personal transformation to support lasting positive change.",
    thumbnail: "🌱",
    courseIds: ["personal-development", "mental-health-wellness", "goal-setting-accountability", "leadership-fundamentals"],
    duration: "10 weeks",
    level: "Beginner",
    targetAudience: "Individuals seeking personal transformation",
    outcomes: [
      "Build resilience and emotional intelligence",
      "Establish clear, achievable personal goals",
      "Develop healthy coping strategies",
      "Create accountability and support systems",
    ],
    color: "#a78bfa",
  },
];

// COURSES DATA
export const courses: Course[] = [
  {
    id: "job-readiness",
    title: "Job Readiness Fundamentals",
    description: "Master resume building, interview skills, and workplace communication",
    programId: "reentry",
    type: "hybrid",
    level: "Beginner",
    duration: "4 weeks",
    thumbnail: "💼",
    lessons: ["lesson-1", "lesson-2", "lesson-3", "lesson-4", "lesson-5"],
    outline: {
      overview:
        "This course equips you with essential skills to successfully enter or re-enter the job market. Learn how to create compelling resumes, ace interviews, and communicate professionally in the workplace.",
      objectives: [
        "Create a strong, compelling resume",
        "Master interview techniques and answering difficult questions",
        "Develop professional communication skills",
        "Build workplace etiquette and soft skills",
        "Understand employment rights and responsibilities",
      ],
      topics: [
        "Resume writing best practices",
        "Cover letter essentials",
        "Interview preparation and practice",
        "Common interview questions",
        "Professional communication",
        "Workplace culture and etiquette",
        "Handling workplace conflicts",
        "Remote work professionalism",
      ],
      requirements: ["Willingness to engage in role-play practice", "Access to computer and word processor"],
      materials: [
        "Resume template",
        "Interview practice guide",
        "Professional communication checklist",
        "Job search resources",
      ],
      assessmentMethod: "Completed resume + practice interview",
    },
    prerequisites: [],
    instructors: ["Sarah Johnson", "Michael Chen"],
    credits: 3,
  },
  {
    id: "financial-literacy",
    title: "Financial Literacy",
    description: "Learn budgeting, saving, and financial planning essentials",
    programId: "reentry",
    type: "online",
    level: "Beginner",
    duration: "3 weeks",
    thumbnail: "💰",
    lessons: ["lesson-6", "lesson-7", "lesson-8", "lesson-9"],
    outline: {
      overview:
        "Build a strong financial foundation. This course covers budgeting, saving strategies, credit management, and long-term financial planning to help you achieve financial stability.",
      objectives: [
        "Create and maintain a personal budget",
        "Develop effective saving strategies",
        "Understand credit and debt management",
        "Build financial security for the future",
        "Make informed financial decisions",
      ],
      topics: [
        "Budgeting basics",
        "Income and expense tracking",
        "Emergency funds",
        "Saving strategies",
        "Credit scores and credit reports",
        "Debt repayment strategies",
        "Banking products",
        "Financial planning",
      ],
      materials: [
        "Budget template",
        "Financial tracking spreadsheet",
        "Credit report guide",
        "Banking comparison chart",
      ],
      assessmentMethod: "Create a personal budget + financial plan",
    },
    prerequisites: [],
    instructors: ["James Williams"],
    credits: 2,
  },
  {
    id: "personal-development",
    title: "Personal Development",
    description: "Build confidence, set goals, and develop resilience",
    programId: "personal-growth",
    type: "hybrid",
    level: "Intermediate",
    duration: "5 weeks",
    thumbnail: "🌱",
    lessons: ["lesson-10", "lesson-11", "lesson-12", "lesson-13"],
    outline: {
      overview:
        "Transform your life by building confidence, setting meaningful goals, and developing the resilience to overcome obstacles. This transformative course combines self-reflection with practical goal-setting.",
      objectives: [
        "Build authentic self-confidence",
        "Set SMART goals",
        "Develop resilience and bounce-back skills",
        "Overcome limiting beliefs",
        "Create action plans for success",
      ],
      topics: [
        "Self-discovery and identity",
        "Confidence building",
        "Goal setting frameworks",
        "Overcoming obstacles",
        "Resilience and stress management",
        "Building supportive relationships",
        "Creating accountability systems",
        "Measuring progress and adjusting plans",
      ],
      requirements: ["Commitment to self-reflection", "Willingness to share in group settings"],
      materials: [
        "Goal-setting worksheet",
        "Reflection journal",
        "Resilience toolkit",
        "Action plan template",
      ],
      assessmentMethod: "Personal development plan + reflection journal",
    },
    prerequisites: [],
    instructors: ["Dr. Angela Roberts", "Marcus Thompson"],
    credits: 3,
  },
  {
    id: "digital-skills",
    title: "Digital Skills",
    description: "Master essential computer and internet skills for the modern workplace",
    programId: "reentry",
    type: "in-class",
    level: "Beginner",
    duration: "6 weeks",
    thumbnail: "💻",
    lessons: ["lesson-14", "lesson-15", "lesson-16", "lesson-17", "lesson-18"],
    outline: {
      overview:
        "Gain essential computer and digital skills required for modern jobs. From basic computer literacy to productivity software, this hands-on course prepares you for the digital workplace.",
      objectives: [
        "Master basic computer operations",
        "Use email and communication tools",
        "Develop proficiency in Microsoft Office suite",
        "Navigate the internet safely and effectively",
        "Understand digital security and privacy",
      ],
      topics: [
        "Computer basics",
        "Operating systems",
        "Email and communication",
        "Microsoft Word and Excel",
        "Internet navigation",
        "Online safety and security",
        "Cloud storage and collaboration",
        "Video conferencing tools",
      ],
      requirements: [
        "Access to computer",
        "Ability to attend 2 sessions per week on-site",
      ],
      materials: [
        "Computer basics guide",
        "Software tutorials",
        "Security checklist",
        "Quick reference guides",
      ],
      assessmentMethod: "Hands-on computer skills test + productivity task completion",
    },
    schedule: {
      startDate: "2024-02-05",
      endDate: "2024-03-18",
      meetDays: ["Monday", "Wednesday"],
      startTime: "10:00",
      endTime: "12:30",
      location: "Learning Center, Room 201",
      instructor: "David Kim",
      maxCapacity: 12,
      currentEnrollment: 8,
    },
    prerequisites: [],
    instructors: ["David Kim", "Lisa Anderson"],
    credits: 3,
  },
  {
    id: "advanced-digital-skills",
    title: "Advanced Digital Skills",
    description: "Master advanced software, cloud tools, and productivity applications",
    programId: "job-training",
    type: "online",
    level: "Intermediate",
    duration: "4 weeks",
    thumbnail: "⚙️",
    lessons: ["lesson-19", "lesson-20", "lesson-21"],
    outline: {
      overview:
        "Take your digital skills to the next level. Learn advanced features of productivity software, project management tools, and cloud-based collaboration platforms used by leading companies.",
      objectives: [
        "Master advanced Excel and data analysis",
        "Develop proficiency in project management tools",
        "Utilize cloud collaboration platforms",
        "Automate routine tasks",
        "Create professional presentations and reports",
      ],
      topics: [
        "Advanced Excel formulas and dashboards",
        "Data visualization",
        "Project management software",
        "Cloud productivity suites",
        "Automation tools",
        "Professional presentations",
        "Collaborative workflows",
      ],
      requirements: ["Basic digital skills knowledge"],
      materials: [
        "Advanced Excel templates",
        "Project management guides",
        "Automation scripts",
        "Best practices documentation",
      ],
      assessmentMethod: "Create advanced Excel workbook + project management case study",
    },
    prerequisites: ["digital-skills"],
    instructors: ["Robert Lee"],
    credits: 3,
  },
  {
    id: "conflict-resolution",
    title: "Conflict Resolution & Communication",
    description: "Develop skills to handle conflicts and communicate effectively",
    programId: "reentry",
    type: "hybrid",
    level: "Beginner",
    duration: "3 weeks",
    thumbnail: "🤝",
    lessons: ["lesson-22", "lesson-23", "lesson-24"],
    outline: {
      overview:
        "Learn practical techniques to resolve conflicts peacefully, communicate assertively, and build healthy relationships in personal and professional settings.",
      objectives: [
        "Understand conflict dynamics",
        "Develop active listening skills",
        "Practice assertive communication",
        "Learn de-escalation techniques",
        "Build collaborative problem-solving abilities",
      ],
      topics: [
        "Communication styles",
        "Active listening",
        "Assertiveness training",
        "Conflict sources and stages",
        "De-escalation techniques",
        "Mediation skills",
        "Difficult conversations",
        "Building consensus",
      ],
      requirements: ["Openness to role-play and group discussion"],
      materials: [
        "Communication scenarios",
        "De-escalation checklist",
        "Conversation starters",
        "Reference guide",
      ],
      assessmentMethod: "Role-play scenarios + reflection paper",
    },
    prerequisites: [],
    instructors: ["Patricia Morgan"],
    credits: 2,
  },
  {
    id: "mental-health-wellness",
    title: "Mental Health & Wellness",
    description: "Build resilience and develop healthy coping strategies",
    programId: "personal-growth",
    type: "online",
    level: "Beginner",
    duration: "4 weeks",
    thumbnail: "🧠",
    lessons: ["lesson-25", "lesson-26", "lesson-27", "lesson-28"],
    outline: {
      overview:
        "Prioritize your mental health. Learn evidence-based strategies for managing stress, anxiety, and depression while building emotional resilience and wellness practices.",
      objectives: [
        "Understand mental health basics",
        "Identify stress triggers and responses",
        "Learn coping strategies",
        "Develop wellness routines",
        "Build emotional intelligence",
      ],
      topics: [
        "Mental health awareness",
        "Stress management",
        "Anxiety management",
        "Depression awareness",
        "Coping strategies",
        "Mindfulness and meditation",
        "Physical wellness",
        "Building support networks",
      ],
      materials: [
        "Coping strategies guide",
        "Meditation resources",
        "Wellness planner",
        "Resource directory",
      ],
      assessmentMethod: "Wellness plan creation + reflection journal",
    },
    prerequisites: [],
    instructors: ["Dr. Jennifer Hayes"],
    credits: 3,
  },
  {
    id: "industry-certifications",
    title: "Industry Certifications Preparation",
    description: "Prepare for nationally recognized industry certifications",
    programId: "job-training",
    type: "in-class",
    level: "Advanced",
    duration: "8 weeks",
    thumbnail: "🎓",
    lessons: ["lesson-29", "lesson-30", "lesson-31", "lesson-32"],
    outline: {
      overview:
        "Prepare for and earn industry-recognized certifications that boost your employability. Choose from CompTIA A+, Microsoft Certifications, or Project Management Professional tracks.",
      objectives: [
        "Master certification exam content",
        "Practice exam strategies",
        "Complete hands-on labs",
        "Pass certification exams",
        "Understand industry standards",
      ],
      topics: [
        "Certification exam content",
        "Test-taking strategies",
        "Hands-on laboratory exercises",
        "Industry best practices",
        "Troubleshooting scenarios",
        "Professional ethics",
        "Career advancement strategies",
      ],
      requirements: [
        "Prerequisite knowledge in field",
        "Regular attendance required",
        "Certification exam fee (student responsible)",
      ],
      materials: [
        "Official study guides",
        "Practice exams",
        "Lab access",
        "Video tutorials",
      ],
      assessmentMethod: "Pass official certification exam",
    },
    schedule: {
      startDate: "2024-03-04",
      endDate: "2024-04-29",
      meetDays: ["Tuesday", "Thursday"],
      startTime: "14:00",
      endTime: "16:30",
      location: "Tech Center, Suite 300",
      instructor: "Kevin Rodriguez",
      maxCapacity: 15,
      currentEnrollment: 12,
    },
    prerequisites: ["digital-skills"],
    instructors: ["Kevin Rodriguez", "Priya Patel"],
    credits: 4,
  },
  {
    id: "interview-mastery",
    title: "Interview Mastery & Negotiation",
    description: "Advanced techniques for landing your dream job and negotiating offers",
    programId: "job-training",
    type: "hybrid",
    level: "Intermediate",
    duration: "3 weeks",
    thumbnail: "🎯",
    lessons: ["lesson-33", "lesson-34", "lesson-35"],
    outline: {
      overview:
        "Go beyond basic interview prep. Master behavioral interview techniques, technical interview preparation, salary negotiation, and advanced job search strategies to secure your ideal position.",
      objectives: [
        "Master STAR interview method",
        "Prepare for technical interviews",
        "Practice salary negotiation",
        "Handle difficult interview questions",
        "Create winning interview strategy",
      ],
      topics: [
        "STAR method deep dive",
        "Behavioral interview questions",
        "Technical interview preparation",
        "Company research strategies",
        "Salary negotiation tactics",
        "Benefits negotiation",
        "Offer evaluation",
        "Declining offers professionally",
      ],
      requirements: ["Completed Job Readiness course or equivalent experience"],
      materials: [
        "Interview question bank",
        "Negotiation scripts",
        "Company research templates",
        "Offer comparison worksheet",
      ],
      assessmentMethod: "Mock interviews with feedback + negotiation simulation",
    },
    prerequisites: ["job-readiness"],
    instructors: ["Executive Coach Elena Martin"],
    credits: 2,
  },
  {
    id: "goal-setting-accountability",
    title: "Goal Setting & Accountability Systems",
    description: "Create actionable goals and build accountability for sustained success",
    programId: "personal-growth",
    type: "online",
    level: "Beginner",
    duration: "3 weeks",
    thumbnail: "🎯",
    lessons: ["lesson-36", "lesson-37", "lesson-38"],
    outline: {
      overview:
        "Transform vague dreams into concrete, achievable goals. Learn proven goal-setting frameworks and build accountability systems that keep you motivated and on track.",
      objectives: [
        "Set SMART goals",
        "Create action plans",
        "Build accountability systems",
        "Track progress effectively",
        "Overcome goal-setting obstacles",
      ],
      topics: [
        "Goal-setting frameworks",
        "SMART criteria",
        "Action planning",
        "Progress tracking methods",
        "Accountability partnerships",
        "Overcoming procrastination",
        "Celebrating milestones",
        "Adjusting goals as needed",
      ],
      materials: [
        "Goal-setting templates",
        "Progress tracking tools",
        "Accountability worksheets",
        "Quick reference guide",
      ],
      assessmentMethod: "90-day action plan with accountability structure",
    },
    prerequisites: [],
    instructors: ["Coach Tom Bailey"],
    credits: 2,
  },
  {
    id: "leadership-fundamentals",
    title: "Leadership Fundamentals",
    description: "Develop core leadership skills and influence at any level",
    programId: "personal-growth",
    type: "in-class",
    level: "Intermediate",
    duration: "5 weeks",
    thumbnail: "👥",
    lessons: ["lesson-39", "lesson-40", "lesson-41", "lesson-42"],
    outline: {
      overview:
        "Whether you're leading your first team or taking on expanded responsibilities, learn foundational leadership skills including emotional intelligence, decision-making, and team building.",
      objectives: [
        "Understand leadership styles",
        "Develop emotional intelligence",
        "Build high-performing teams",
        "Make ethical decisions",
        "Provide effective feedback",
      ],
      topics: [
        "Leadership styles and models",
        "Emotional intelligence",
        "Team dynamics",
        "Delegation skills",
        "Conflict resolution",
        "Performance management",
        "Ethical decision-making",
        "Strategic thinking",
      ],
      requirements: ["Some work or volunteer leadership experience preferred"],
      materials: [
        "Leadership assessments",
        "Case studies",
        "Team building activities",
        "Feedback templates",
      ],
      assessmentMethod: "Leadership self-assessment + group project + presentation",
    },
    schedule: {
      startDate: "2024-03-11",
      endDate: "2024-04-15",
      meetDays: ["Wednesday"],
      startTime: "18:00",
      endTime: "20:30",
      location: "Community Center, Auditorium",
      instructor: "Dr. Strategic Coach",
      maxCapacity: 25,
      currentEnrollment: 18,
    },
    prerequisites: [],
    instructors: ["Dr. Strategic Coach"],
    credits: 3,
  },
];

// LESSONS DATA
export const lessons: Lesson[] = [
  {
    id: "lesson-1",
    courseId: "job-readiness",
    title: "Building Your Foundation: Resume Essentials",
    description: "Learn the fundamentals of resume writing and format",
    duration: 45,
    videoUrl: "https://example.com/video/resume-essentials",
    order: 1,
    content: `
In this lesson, we'll cover:
- What employers look for in a resume
- Essential resume sections
- Formatting best practices
- Avoiding common mistakes
- Action verbs and results-oriented language

Your resume is your first impression. Make it count!
    `,
    resources: [
      {
        id: "res-1",
        title: "Resume Template",
        url: "/resources/resume-template.docx",
        type: "document",
      },
      {
        id: "res-2",
        title: "Action Verbs List",
        url: "/resources/action-verbs.pdf",
        type: "pdf",
      },
    ],
  },
  {
    id: "lesson-2",
    courseId: "job-readiness",
    title: "Tailoring Your Resume for Success",
    description: "Customize your resume for specific job applications",
    duration: 40,
    videoUrl: "https://example.com/video/tailor-resume",
    order: 2,
    content: `
Learn how to:
- Analyze job descriptions
- Match keywords to your experience
- Highlight relevant skills
- Reorganize content strategically
- Show impact and achievements

Customization increases interview callback rates by up to 40%!
    `,
    resources: [
      {
        id: "res-3",
        title: "Resume Tailoring Checklist",
        url: "/resources/tailoring-checklist.pdf",
        type: "pdf",
      },
    ],
  },
  {
    id: "lesson-3",
    courseId: "job-readiness",
    title: "The Perfect Cover Letter",
    description: "Write compelling cover letters that get noticed",
    duration: 50,
    videoUrl: "https://example.com/video/cover-letter",
    order: 3,
    content: `
Cover letters guide:
- Structure and formatting
- Opening hooks
- Body paragraph strategy
- Closing with confidence
- Industry-specific examples

A strong cover letter can make the difference!
    `,
    resources: [
      {
        id: "res-4",
        title: "Cover Letter Template",
        url: "/resources/cover-letter-template.docx",
        type: "document",
      },
    ],
  },
  {
    id: "lesson-4",
    courseId: "job-readiness",
    title: "Interview Preparation: Questions & Answers",
    description: "Master common interview questions and craft strong responses",
    duration: 60,
    videoUrl: "https://example.com/video/interview-prep",
    order: 4,
    content: `
Interview Q&A Guide:
- Tell me about yourself
- Why do you want this job?
- What are your strengths and weaknesses?
- Describe a challenging situation
- Where do you see yourself in 5 years?
- Behavioral questions
- Industry-specific questions

Practice makes perfect!
    `,
    resources: [
      {
        id: "res-5",
        title: "Common Interview Questions",
        url: "/resources/interview-questions.pdf",
        type: "pdf",
      },
    ],
  },
  {
    id: "lesson-5",
    courseId: "job-readiness",
    title: "Interview Success: Day Of & Following Up",
    description: "Execute your interview strategy and follow up effectively",
    duration: 35,
    videoUrl: "https://example.com/video/interview-day",
    order: 5,
    content: `
Interview day strategy:
- Pre-interview preparations
- What to bring
- Body language tips
- Active listening strategies
- Asking great questions
- Following up professionally
- Handling rejection
- Negotiating the offer

You've got this!
    `,
    resources: [
      {
        id: "res-6",
        title: "Interview Checklist",
        url: "/resources/interview-checklist.pdf",
        type: "pdf",
      },
      {
        id: "res-7",
        title: "Follow-up Email Template",
        url: "/resources/followup-email.txt",
        type: "document",
      },
    ],
  },
];

// HELPER FUNCTIONS

/**
 * Get all courses for a specific program
 */
export function getCoursesByProgram(programId: string): Course[] {
  return courses.filter((course) => course.programId === programId);
}

/**
 * Get a single program by ID
 */
export function getProgramById(programId: string): Program | undefined {
  return programs.find((p) => p.id === programId);
}

/**
 * Get a single course by ID
 */
export function getCourseById(courseId: string): Course | undefined {
  return courses.find((c) => c.id === courseId);
}

/**
 * Get all lessons for a course
 */
export function getLessonsByCourse(courseId: string): Lesson[] {
  const course = getCourseById(courseId);
  if (!course) return [];
  return lessons
    .filter((lesson) => course.lessons.includes(lesson.id))
    .sort((a, b) => a.order - b.order);
}

/**
 * Get a single lesson by ID
 */
export function getLessonById(lessonId: string): Lesson | undefined {
  return lessons.find((l) => l.id === lessonId);
}

/**
 * Filter courses by criteria
 */
export function filterCourses(
  courseList: Course[] = courses,
  filters?: {
    programId?: string;
    type?: CourseType;
    level?: DifficultyLevel;
    search?: string;
  }
): Course[] {
  let filtered = courseList;

  if (filters?.programId) {
    filtered = filtered.filter((c) => c.programId === filters.programId);
  }

  if (filters?.type) {
    filtered = filtered.filter((c) => c.type === filters.type);
  }

  if (filters?.level) {
    filtered = filtered.filter((c) => c.level === filters.level);
  }

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.title.toLowerCase().includes(search) ||
        c.description.toLowerCase().includes(search)
    );
  }

  return filtered;
}

/**
 * Get next lesson in course
 */
export function getNextLesson(courseId: string, currentLessonId: string): Lesson | null {
  const courseLessons = getLessonsByCourse(courseId);
  const currentIndex = courseLessons.findIndex((l) => l.id === currentLessonId);
  return currentIndex < courseLessons.length - 1 ? courseLessons[currentIndex + 1] : null;
}

/**
 * Get previous lesson in course
 */
export function getPreviousLesson(courseId: string, currentLessonId: string): Lesson | null {
  const courseLessons = getLessonsByCourse(courseId);
  const currentIndex = courseLessons.findIndex((l) => l.id === currentLessonId);
  return currentIndex > 0 ? courseLessons[currentIndex - 1] : null;
}

/**
 * Get course progress percentage
 */
export function getCourseProgress(
  courseId: string,
  completedLessonIds: string[]
): number {
  const courseLessons = getLessonsByCourse(courseId);
  if (courseLessons.length === 0) return 0;
  const completed = completedLessonIds.filter((id) =>
    courseLessons.some((l) => l.id === id)
  ).length;
  return Math.round((completed / courseLessons.length) * 100);
}
