-- COURSES MANAGEMENT SCHEMA FOR SDTOOLSINC
-- Production database tables for programs, courses, and lessons

-- Programs Table
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  overview TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  duration TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  target_audience TEXT NOT NULL,
  outcomes JSONB NOT NULL DEFAULT '[]',
  color TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('online', 'in-class', 'hybrid')),
  level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  duration TEXT NOT NULL,
  thumbnail TEXT NOT NULL,
  outline JSONB NOT NULL DEFAULT '{}',
  prerequisites JSONB NOT NULL DEFAULT '[]',
  credits INTEGER,
  instructors JSONB NOT NULL DEFAULT '[]',
  schedule JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lessons Table
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  video_url TEXT,
  duration INTEGER NOT NULL,
  content TEXT NOT NULL,
  resources JSONB NOT NULL DEFAULT '[]',
  lesson_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Enrollments Table
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  progress INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

-- Lesson Completion Tracking
CREATE TABLE IF NOT EXISTS lesson_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Create Indexes for Performance
CREATE INDEX idx_courses_program_id ON courses(program_id);
CREATE INDEX idx_lessons_course_id ON lessons(course_id);
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_lesson_completions_user_id ON lesson_completions(user_id);
CREATE INDEX idx_lesson_completions_lesson_id ON lesson_completions(lesson_id);

-- Enable RLS (Row Level Security)
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_completions ENABLE ROW LEVEL SECURITY;

-- Policies for Programs and Courses (Public Read)
CREATE POLICY "Allow public read on programs" ON programs FOR SELECT USING (true);
CREATE POLICY "Allow public read on courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Allow public read on lessons" ON lessons FOR SELECT USING (true);

-- Policies for Enrollments (User-specific)
CREATE POLICY "Users can view own enrollments" ON enrollments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll in courses" ON enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own enrollments" ON enrollments
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for Lesson Completions (User-specific)
CREATE POLICY "Users can view own completions" ON lesson_completions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can mark lessons complete" ON lesson_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert Programs Data
INSERT INTO programs (id, name, description, overview, thumbnail, duration, level, target_audience, outcomes, color)
VALUES
  (
    'a1b2c3d4-e5f6-4a5b-8c7d-9e8f7d6c5b4a',
    'Reentry & Resettlement Program',
    'Support for individuals successfully reintegrating into society',
    'Comprehensive program designed to help justice-involved individuals rebuild their lives with essential life skills, employment readiness, and community connections.',
    '🏠',
    '8 weeks',
    'Beginner',
    'Justice-involved individuals in reentry',
    '[
      "Develop practical life skills for successful community integration",
      "Prepare for employment opportunities",
      "Build financial stability foundations",
      "Establish positive community connections"
    ]'::jsonb,
    '#38bdf8'
  ),
  (
    'b2c3d4e5-f6a7-4b6c-9d8e-0f9a8b7c6d5e',
    'Job Training & Employment Program',
    'Career-focused training with job placement support',
    'Intensive program combining technical skills, professional development, and direct job placement assistance to help individuals secure sustainable employment.',
    '💼',
    '12 weeks',
    'Intermediate',
    'Job seekers and career changers',
    '[
      "Master in-demand technical skills",
      "Develop professional networking abilities",
      "Complete industry certifications",
      "Secure employment within 90 days"
    ]'::jsonb,
    '#2dd4bf'
  ),
  (
    'c3d4e5f6-a7b8-4c7d-ae9f-1a0b9c8d7e6f',
    'Personal Growth & Development',
    'Transform your mindset and unlock your potential',
    'Holistic program focused on mental health, resilience, goal-setting, and personal transformation to support lasting positive change.',
    '🌱',
    '10 weeks',
    'Beginner',
    'Individuals seeking personal transformation',
    '[
      "Build resilience and emotional intelligence",
      "Establish clear, achievable personal goals",
      "Develop healthy coping strategies",
      "Create accountability and support systems"
    ]'::jsonb,
    '#a78bfa'
  );

-- Insert Courses Data
INSERT INTO courses (id, title, description, program_id, type, level, duration, thumbnail, outline, prerequisites, credits, instructors, schedule)
VALUES
  (
    'd4e5f6a7-b8c9-4d8e-bf0a-2b1c0d9e8f7a',
    'Job Readiness Fundamentals',
    'Master resume building, interview skills, and workplace communication',
    'a1b2c3d4-e5f6-4a5b-8c7d-9e8f7d6c5b4a',
    'hybrid',
    'Beginner',
    '4 weeks',
    '💼',
    '{
      "overview": "This course equips you with essential skills to successfully enter or re-enter the job market.",
      "objectives": [
        "Create a strong, compelling resume",
        "Master interview techniques and answering difficult questions",
        "Develop professional communication skills",
        "Build workplace etiquette and soft skills",
        "Understand employment rights and responsibilities"
      ],
      "topics": [
        "Resume writing best practices",
        "Cover letter essentials",
        "Interview preparation and practice",
        "Common interview questions",
        "Professional communication",
        "Workplace culture and etiquette",
        "Handling workplace conflicts",
        "Remote work professionalism"
      ],
      "requirements": ["Willingness to engage in role-play practice", "Access to computer and word processor"],
      "materials": [
        "Resume template",
        "Interview practice guide",
        "Professional communication checklist",
        "Job search resources"
      ],
      "assessmentMethod": "Completed resume + practice interview"
    }'::jsonb,
    '[]'::jsonb,
    3,
    '["Sarah Johnson", "Michael Chen"]'::jsonb,
    NULL
  ),
  (
    'e5f6a7b8-c9da-4e9f-c01b-3c2d1e0f9a8b',
    'Financial Literacy',
    'Learn budgeting, saving, and financial planning essentials',
    'a1b2c3d4-e5f6-4a5b-8c7d-9e8f7d6c5b4a',
    'online',
    'Beginner',
    '3 weeks',
    '💰',
    '{
      "overview": "Build a strong financial foundation. This course covers budgeting, saving strategies, credit management, and long-term financial planning.",
      "objectives": [
        "Create and maintain a personal budget",
        "Develop effective saving strategies",
        "Understand credit and debt management",
        "Build financial security for the future",
        "Make informed financial decisions"
      ],
      "topics": [
        "Budgeting basics",
        "Income and expense tracking",
        "Emergency funds",
        "Saving strategies",
        "Credit scores and credit reports",
        "Debt repayment strategies",
        "Banking products",
        "Financial planning"
      ],
      "requirements": [],
      "materials": [
        "Budget template",
        "Financial tracking spreadsheet",
        "Credit report guide",
        "Banking comparison chart"
      ],
      "assessmentMethod": "Create a personal budget + financial plan"
    }'::jsonb,
    '[]'::jsonb,
    2,
    '["James Williams"]'::jsonb,
    NULL
  ),
  (
    'f6a7b8c9-daeb-4faa-d12c-4d3e2f1a0b9c',
    'Personal Development',
    'Build confidence, set goals, and develop resilience',
    'c3d4e5f6-a7b8-4c7d-ae9f-1a0b9c8d7e6f',
    'hybrid',
    'Intermediate',
    '5 weeks',
    '🌱',
    '{
      "overview": "Transform your life by building confidence, setting meaningful goals, and developing the resilience to overcome obstacles.",
      "objectives": [
        "Build authentic self-confidence",
        "Set SMART goals",
        "Develop resilience and bounce-back skills",
        "Overcome limiting beliefs",
        "Create action plans for success"
      ],
      "topics": [
        "Self-discovery and identity",
        "Confidence building",
        "Goal setting frameworks",
        "Overcoming obstacles",
        "Resilience and stress management",
        "Building supportive relationships",
        "Creating accountability systems",
        "Measuring progress and adjusting plans"
      ],
      "requirements": ["Commitment to self-reflection", "Willingness to share in group settings"],
      "materials": [
        "Goal-setting worksheet",
        "Reflection journal",
        "Resilience toolkit",
        "Action plan template"
      ],
      "assessmentMethod": "Personal development plan + reflection journal"
    }'::jsonb,
    '[]'::jsonb,
    3,
    '["Dr. Angela Roberts", "Marcus Thompson"]'::jsonb,
    NULL
  ),
  (
    'a7b8c9da-ebfc-40ab-e23d-5e4f3a2b1c0d',
    'Digital Skills',
    'Master essential computer and internet skills for the modern workplace',
    'a1b2c3d4-e5f6-4a5b-8c7d-9e8f7d6c5b4a',
    'in-class',
    'Beginner',
    '6 weeks',
    '💻',
    '{
      "overview": "Gain essential computer and digital skills required for modern jobs. From basic computer literacy to productivity software.",
      "objectives": [
        "Master basic computer operations",
        "Use email and communication tools",
        "Develop proficiency in Microsoft Office suite",
        "Navigate the internet safely and effectively",
        "Understand digital security and privacy"
      ],
      "topics": [
        "Computer basics",
        "Operating systems",
        "Email and communication",
        "Microsoft Word and Excel",
        "Internet navigation",
        "Online safety and security",
        "Cloud storage and collaboration",
        "Video conferencing tools"
      ],
      "requirements": [
        "Access to computer",
        "Ability to attend 2 sessions per week on-site"
      ],
      "materials": [
        "Computer basics guide",
        "Software tutorials",
        "Security checklist",
        "Quick reference guides"
      ],
      "assessmentMethod": "Hands-on computer skills test + productivity task completion"
    }'::jsonb,
    '[]'::jsonb,
    3,
    '["David Kim", "Lisa Anderson"]'::jsonb,
    '{
      "startDate": "2024-02-05",
      "endDate": "2024-03-18",
      "meetDays": ["Monday", "Wednesday"],
      "startTime": "10:00",
      "endTime": "12:30",
      "location": "Learning Center, Room 201",
      "instructor": "David Kim",
      "maxCapacity": 12,
      "currentEnrollment": 0
    }'::jsonb
  ),
  (
    'b8c9daeb-fcad-41bc-f34e-6f5a4b3c2d1e',
    'Advanced Digital Skills',
    'Master advanced software, cloud tools, and productivity applications',
    'b2c3d4e5-f6a7-4b6c-9d8e-0f9a8b7c6d5e',
    'online',
    'Intermediate',
    '4 weeks',
    '⚙️',
    '{
      "overview": "Take your digital skills to the next level. Learn advanced features of productivity software and cloud-based collaboration platforms.",
      "objectives": [
        "Master advanced Excel and data analysis",
        "Develop proficiency in project management tools",
        "Utilize cloud collaboration platforms",
        "Automate routine tasks",
        "Create professional presentations and reports"
      ],
      "topics": [
        "Advanced Excel formulas and dashboards",
        "Data visualization",
        "Project management software",
        "Cloud productivity suites",
        "Automation tools",
        "Professional presentations",
        "Collaborative workflows"
      ],
      "requirements": ["Basic digital skills knowledge"],
      "materials": [
        "Advanced Excel templates",
        "Project management guides",
        "Automation scripts",
        "Best practices documentation"
      ],
      "assessmentMethod": "Create advanced Excel workbook + project management case study"
    }'::jsonb,
    '["d4e5f6a7-b8c9-4d8e-bf0a-2b1c0d9e8f7a"]'::jsonb,
    3,
    '["Robert Lee"]'::jsonb,
    NULL
  ),
  (
    'c9daebfc-adbe-42cd-045f-7a6b5c4d3e2f',
    'Conflict Resolution & Communication',
    'Develop skills to handle conflicts and communicate effectively',
    'a1b2c3d4-e5f6-4a5b-8c7d-9e8f7d6c5b4a',
    'hybrid',
    'Beginner',
    '3 weeks',
    '🤝',
    '{
      "overview": "Learn practical techniques to resolve conflicts peacefully and communicate assertively.",
      "objectives": [
        "Understand conflict dynamics",
        "Develop active listening skills",
        "Practice assertive communication",
        "Learn de-escalation techniques",
        "Build collaborative problem-solving abilities"
      ],
      "topics": [
        "Communication styles",
        "Active listening",
        "Assertiveness training",
        "Conflict sources and stages",
        "De-escalation techniques",
        "Mediation skills",
        "Difficult conversations",
        "Building consensus"
      ],
      "requirements": ["Openness to role-play and group discussion"],
      "materials": [
        "Communication scenarios",
        "De-escalation checklist",
        "Conversation starters",
        "Reference guide"
      ],
      "assessmentMethod": "Role-play scenarios + reflection paper"
    }'::jsonb,
    '[]'::jsonb,
    2,
    '["Patricia Morgan"]'::jsonb,
    NULL
  ),
  (
    'daebfcad-bfef-43de-156a-8b7c6d5e4f30',
    'Mental Health & Wellness',
    'Build resilience and develop healthy coping strategies',
    'c3d4e5f6-a7b8-4c7d-ae9f-1a0b9c8d7e6f',
    'online',
    'Beginner',
    '4 weeks',
    '🧠',
    '{
      "overview": "Prioritize your mental health. Learn evidence-based strategies for managing stress, anxiety, and depression.",
      "objectives": [
        "Understand mental health basics",
        "Identify stress triggers and responses",
        "Learn coping strategies",
        "Develop wellness routines",
        "Build emotional intelligence"
      ],
      "topics": [
        "Mental health awareness",
        "Stress management",
        "Anxiety management",
        "Depression awareness",
        "Coping strategies",
        "Mindfulness and meditation",
        "Physical wellness",
        "Building support networks"
      ],
      "requirements": [],
      "materials": [
        "Coping strategies guide",
        "Meditation resources",
        "Wellness planner",
        "Resource directory"
      ],
      "assessmentMethod": "Wellness plan creation + reflection journal"
    }'::jsonb,
    '[]'::jsonb,
    3,
    '["Dr. Jennifer Hayes"]'::jsonb,
    NULL
  ),
  (
    'ebfcadbe-fage-44ef-267b-9c8d7e6f5a41',
    'Industry Certifications Preparation',
    'Prepare for nationally recognized industry certifications',
    'b2c3d4e5-f6a7-4b6c-9d8e-0f9a8b7c6d5e',
    'in-class',
    'Advanced',
    '8 weeks',
    '🎓',
    '{
      "overview": "Prepare for and earn industry-recognized certifications that boost your employability.",
      "objectives": [
        "Master certification exam content",
        "Practice exam strategies",
        "Complete hands-on labs",
        "Pass certification exams",
        "Understand industry standards"
      ],
      "topics": [
        "Certification exam content",
        "Test-taking strategies",
        "Hands-on laboratory exercises",
        "Industry best practices",
        "Troubleshooting scenarios",
        "Professional ethics",
        "Career advancement strategies"
      ],
      "requirements": [
        "Prerequisite knowledge in field",
        "Regular attendance required",
        "Certification exam fee (student responsible)"
      ],
      "materials": [
        "Official study guides",
        "Practice exams",
        "Lab access",
        "Video tutorials"
      ],
      "assessmentMethod": "Pass official certification exam"
    }'::jsonb,
    '["a7b8c9da-ebfc-40ab-e23d-5e4f3a2b1c0d"]'::jsonb,
    4,
    '["Kevin Rodriguez", "Priya Patel"]'::jsonb,
    '{
      "startDate": "2024-03-04",
      "endDate": "2024-04-29",
      "meetDays": ["Tuesday", "Thursday"],
      "startTime": "14:00",
      "endTime": "16:30",
      "location": "Tech Center, Suite 300",
      "instructor": "Kevin Rodriguez",
      "maxCapacity": 15,
      "currentEnrollment": 0
    }'::jsonb
  ),
  (
    'fcadbeff-gahf-45fa-378c-ad9e8f7a6b52',
    'Interview Mastery & Negotiation',
    'Advanced techniques for landing your dream job and negotiating offers',
    'b2c3d4e5-f6a7-4b6c-9d8e-0f9a8b7c6d5e',
    'hybrid',
    'Intermediate',
    '3 weeks',
    '🎯',
    '{
      "overview": "Go beyond basic interview prep. Master behavioral interview techniques, technical interview preparation, and salary negotiation.",
      "objectives": [
        "Master STAR interview method",
        "Prepare for technical interviews",
        "Practice salary negotiation",
        "Handle difficult interview questions",
        "Create winning interview strategy"
      ],
      "topics": [
        "STAR method deep dive",
        "Behavioral interview questions",
        "Technical interview preparation",
        "Company research strategies",
        "Salary negotiation tactics",
        "Benefits negotiation",
        "Offer evaluation",
        "Declining offers professionally"
      ],
      "requirements": ["Completed Job Readiness course or equivalent experience"],
      "materials": [
        "Interview question bank",
        "Negotiation scripts",
        "Company research templates",
        "Offer comparison worksheet"
      ],
      "assessmentMethod": "Mock interviews with feedback + negotiation simulation"
    }'::jsonb,
    '["d4e5f6a7-b8c9-4d8e-bf0a-2b1c0d9e8f7a"]'::jsonb,
    2,
    '["Executive Coach Elena Martin"]'::jsonb,
    NULL
  ),
  (
    'adbeffga-hbig-46ab-489d-be0f9a8b7c63',
    'Goal Setting & Accountability Systems',
    'Create actionable goals and build accountability for sustained success',
    'c3d4e5f6-a7b8-4c7d-ae9f-1a0b9c8d7e6f',
    'online',
    'Beginner',
    '3 weeks',
    '🎯',
    '{
      "overview": "Transform vague dreams into concrete, achievable goals. Learn proven goal-setting frameworks and build accountability systems.",
      "objectives": [
        "Set SMART goals",
        "Create action plans",
        "Build accountability systems",
        "Track progress effectively",
        "Overcome goal-setting obstacles"
      ],
      "topics": [
        "Goal-setting frameworks",
        "SMART criteria",
        "Action planning",
        "Progress tracking methods",
        "Accountability partnerships",
        "Overcoming procrastination",
        "Celebrating milestones",
        "Adjusting goals as needed"
      ],
      "requirements": [],
      "materials": [
        "Goal-setting templates",
        "Progress tracking tools",
        "Accountability worksheets",
        "Quick reference guide"
      ],
      "assessmentMethod": "90-day action plan with accountability structure"
    }'::jsonb,
    '[]'::jsonb,
    2,
    '["Coach Tom Bailey"]'::jsonb,
    NULL
  ),
  (
    'beffgahi-icjh-47bc-59ae-cf1a0b9c8d74',
    'Leadership Fundamentals',
    'Develop core leadership skills and influence at any level',
    'c3d4e5f6-a7b8-4c7d-ae9f-1a0b9c8d7e6f',
    'in-class',
    'Intermediate',
    '5 weeks',
    '👥',
    '{
      "overview": "Whether you''re leading your first team or taking on expanded responsibilities, learn foundational leadership skills.",
      "objectives": [
        "Understand leadership styles",
        "Develop emotional intelligence",
        "Build high-performing teams",
        "Make ethical decisions",
        "Provide effective feedback"
      ],
      "topics": [
        "Leadership styles and models",
        "Emotional intelligence",
        "Team dynamics",
        "Delegation skills",
        "Conflict resolution",
        "Performance management",
        "Ethical decision-making",
        "Strategic thinking"
      ],
      "requirements": ["Some work or volunteer leadership experience preferred"],
      "materials": [
        "Leadership assessments",
        "Case studies",
        "Team building activities",
        "Feedback templates"
      ],
      "assessmentMethod": "Leadership self-assessment + group project + presentation"
    }'::jsonb,
    '[]'::jsonb,
    3,
    '["Dr. Strategic Coach"]'::jsonb,
    '{
      "startDate": "2024-03-11",
      "endDate": "2024-04-15",
      "meetDays": ["Wednesday"],
      "startTime": "18:00",
      "endTime": "20:30",
      "location": "Community Center, Auditorium",
      "instructor": "Dr. Strategic Coach",
      "maxCapacity": 25,
      "currentEnrollment": 0
    }'::jsonb
  );

-- Insert Lessons Data (Sample lessons for first course)
INSERT INTO lessons (id, course_id, title, description, video_url, duration, content, resources, lesson_order)
VALUES
  (
    'c9daebfc-adbe-42cd-045f-7a6b5c4d3e2f',
    'd4e5f6a7-b8c9-4d8e-bf0a-2b1c0d9e8f7a',
    'Building Your Foundation: Resume Essentials',
    'Learn the fundamentals of resume writing and format',
    'https://example.com/video/resume-essentials',
    45,
    'In this lesson, we cover what employers look for in a resume, essential resume sections, formatting best practices, and how to avoid common mistakes.',
    '[
      {
        "id": "res-1",
        "title": "Resume Template",
        "url": "/resources/resume-template.docx",
        "type": "document"
      },
      {
        "id": "res-2",
        "title": "Action Verbs List",
        "url": "/resources/action-verbs.pdf",
        "type": "pdf"
      }
    ]'::jsonb,
    1
  ),
  (
    'daebfcad-bfef-43de-156a-8b7c6d5e4f30',
    'd4e5f6a7-b8c9-4d8e-bf0a-2b1c0d9e8f7a',
    'Tailoring Your Resume for Success',
    'Customize your resume for specific job applications',
    'https://example.com/video/tailor-resume',
    40,
    'Learn how to analyze job descriptions, match keywords to your experience, highlight relevant skills, and reorganize content strategically.',
    '[
      {
        "id": "res-3",
        "title": "Resume Tailoring Checklist",
        "url": "/resources/tailoring-checklist.pdf",
        "type": "pdf"
      }
    ]'::jsonb,
    2
  ),
  (
    'ebfcadbe-fage-44ef-267b-9c8d7e6f5a41',
    'd4e5f6a7-b8c9-4d8e-bf0a-2b1c0d9e8f7a',
    'The Perfect Cover Letter',
    'Write compelling cover letters that get noticed',
    'https://example.com/video/cover-letter',
    50,
    'Cover letters guide covering structure, formatting, opening hooks, body paragraph strategy, and closing with confidence.',
    '[
      {
        "id": "res-4",
        "title": "Cover Letter Template",
        "url": "/resources/cover-letter-template.docx",
        "type": "document"
      }
    ]'::jsonb,
    3
  );

-- Create Materialized View for Course Statistics
CREATE MATERIALIZED VIEW IF NOT EXISTS course_statistics AS
SELECT
  c.id as course_id,
  c.title,
  p.name as program_name,
  COUNT(DISTINCT e.user_id) as total_enrolled,
  COUNT(DISTINCT lc.user_id) as users_with_completions,
  AVG(
    CASE WHEN e.completed_at IS NOT NULL THEN 1 ELSE 0 END
  ) as completion_rate
FROM courses c
LEFT JOIN programs p ON c.program_id = p.id
LEFT JOIN enrollments e ON c.id = e.course_id
LEFT JOIN lesson_completions lc ON EXISTS (
  SELECT 1 FROM lessons l WHERE l.course_id = c.id AND l.id = lc.lesson_id
)
GROUP BY c.id, c.title, p.name;

-- Create Index on Materialized View
CREATE UNIQUE INDEX idx_course_statistics_id ON course_statistics(course_id);
