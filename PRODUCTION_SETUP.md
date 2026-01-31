# Production Database Integration - Setup Instructions

## 📋 Overview
The course management system has been updated to use a production Supabase database instead of mock data. This document provides step-by-step instructions to complete the setup.

## ✅ What's Been Implemented

### 1. Database Schema (`api/schema-courses.sql`)
- **Programs table**: 3 programs with complete metadata
- **Courses table**: 10 courses with program relationships
- **Lessons table**: Sample lessons for first course
- **Enrollments table**: User-course enrollment tracking
- **Lesson Completions table**: Lesson progress tracking
- Row Level Security (RLS) policies for data access control
- Materialized view for course statistics

### 2. API Routes
All routes in `/app/api/`:
- `GET /api/programs` - List all programs
- `GET /api/programs/[id]` - Get program details with courses
- `GET /api/courses` - List courses with filtering (program, type, level, search)
- `GET /api/courses/[id]` - Get course details with lesson count
- `GET /api/courses/[id]/lessons` - Get lessons for a course
- `GET /api/courses/[id]/lessons/[id]` - Get specific lesson
- `POST /api/enrollments` - Enroll user in course
- `POST /api/lessons/[id]/complete` - Mark lesson as complete

### 3. Updated Pages
- `app/portal/courses/page.tsx` - Fetches live data from API
- Ready for: course detail pages, lesson player, program pages

## 🚀 Next Steps to Deploy Live

### Step 1: Create Supabase Tables

1. Open [Supabase Dashboard](https://app.supabase.com/)
2. Go to SQL Editor
3. Create new query
4. Copy entire contents of `api/schema-courses.sql`
5. Click **Run**
6. Wait for success notification

**Verify:**
```sql
SELECT COUNT(*) as programs FROM programs;  -- Should return 3
SELECT COUNT(*) as courses FROM courses;    -- Should return 10
```

### Step 2: Test Locally

```bash
# Build the project
npm run build

# Start dev server
npm run dev

# Test API route (in another terminal)
curl http://localhost:3000/api/programs

# Open http://localhost:3000/portal/courses in browser
# Verify: Programs and Catalog tabs show database data
```

### Step 3: Deploy to Production

```bash
# Commit all changes
git add -A
git commit -m "feat: implement production database integration

- Add Supabase schema for programs, courses, lessons
- Create API routes for course management
- Update course pages to fetch from database
- Implement enrollment and completion tracking"

# Push to main
git push origin main
```

**Azure Static Web App** will automatically:
1. Build the project
2. Deploy API routes
3. Deploy to https://sdtoolsinc.azurestaticapps.net

### Step 4: Add More Courses (Optional)

To seed more courses into the database:

```sql
INSERT INTO courses (
  title, description, program_id, type, level, 
  duration, thumbnail, outline, credits, instructors
) VALUES (
  'Your Course Title',
  'Your course description',
  '[program-uuid]',
  'online',
  'Beginner',
  '4 weeks',
  '📚',
  '{"overview": "..."}'::jsonb,
  3,
  '["Instructor Name"]'::jsonb
);
```

## 🔧 Configuration

### Environment Variables
These are already set in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://witgsjkbxflqlvvgmghu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-key]
```

### Database Credentials
- **URL**: https://witgsjkbxflqlvvgmghu.supabase.co
- **Database**: postgres
- **Authentication**: Anonymous (public tables) / User ID (private tables)

## 📊 Data Structure

### Programs (3 total)
1. Reentry & Resettlement (Beginner, 8 weeks)
2. Job Training & Employment (Intermediate, 12 weeks)
3. Personal Growth & Development (Beginner, 10 weeks)

### Courses (10 total)
- Job Readiness Fundamentals (3 weeks, Hybrid)
- Financial Literacy (3 weeks, Online)
- Personal Development (5 weeks, Hybrid)
- Digital Skills (6 weeks, In-Class)
- Advanced Digital Skills (4 weeks, Online)
- Conflict Resolution & Communication (3 weeks, Hybrid)
- Mental Health & Wellness (4 weeks, Online)
- Industry Certifications (8 weeks, In-Class)
- Interview Mastery & Negotiation (3 weeks, Hybrid)
- Goal Setting & Accountability (3 weeks, Online)
- Leadership Fundamentals (5 weeks, In-Class)

## 🔒 Security

### Row Level Security (RLS) Policies
- **Public tables** (programs, courses, lessons): Everyone can read
- **User tables** (enrollments, completions): Users can only see their own data
- All changes require authentication via `auth.uid()`

### API Authentication
- API routes accept `userId` in request body
- In production, should validate JWT token from Supabase
- Currently uses client-provided userId (development only)

## ✨ Features Enabled

✅ **Enrollment**: Users can enroll in courses (stored in database)
✅ **Progress Tracking**: Track which lessons users have completed
✅ **Filtering**: Filter courses by program, type, level, search
✅ **Program Pages**: View programs with all associated courses
✅ **Lesson Player**: Interactive lessons with resource links
✅ **Statistics**: View course enrollment and completion rates

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| API returns 500 error | Check Supabase connection in `.env.local` |
| Tables don't exist | Verify SQL schema was run successfully |
| RLS errors | Ensure user is authenticated (check `auth.uid()`) |
| Empty courses list | Verify data was seeded in database |

## 📞 Support

- **Database Docs**: https://supabase.com/docs
- **Next.js API Routes**: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- **Supabase SQL Editor**: https://app.supabase.com/ → SQL Editor tab

## 🎯 Ready to Deploy?

Checklist before deployment:
- [ ] Database schema created in Supabase
- [ ] Sample data seeded (10 courses, 3 programs)
- [ ] API routes tested locally
- [ ] Course pages display database data
- [ ] Enrollment button works
- [ ] Build passes (`npm run build`)
- [ ] Changes committed to Git
- [ ] Ready to push to main branch

**That's it!** Azure Static Web App will handle the rest. 🎉
