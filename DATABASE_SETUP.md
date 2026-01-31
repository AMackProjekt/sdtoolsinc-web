# Production Database Deployment Guide

## Overview
This guide walks through setting up the production Supabase database for T.O.O.L.S Inc course management system.

## Prerequisites
- Supabase account (already created: https://witgsjkbxflqlvvgmghu.supabase.co)
- SQL Editor access in Supabase
- Environment variables configured in `.env.local`

## Step 1: Environment Setup

Ensure your `.env.local` file has:
```env
NEXT_PUBLIC_SUPABASE_URL=https://witgsjkbxflqlvvgmghu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
```

## Step 2: Create Database Schema

### Option A: Using Supabase Web UI (Recommended)

1. Go to Supabase Dashboard → SQL Editor
2. Create a new query
3. Copy and paste the entire contents of `api/schema-courses.sql`
4. Click "Run"
5. Verify all tables are created successfully

### Option B: Using CLI
```bash
# First, install Supabase CLI if not already installed
brew install supabase/tap/supabase

# Link to your project
supabase link --project-ref witgsjkbxflqlvvgmghu

# Run the SQL migration
supabase db push < api/schema-courses.sql
```

## Step 3: Verify Database Setup

Run these queries in SQL Editor to verify:

```sql
-- Check programs table
SELECT COUNT(*) FROM programs;  -- Should return 3

-- Check courses table
SELECT COUNT(*) FROM courses;   -- Should return 10

-- Check lessons table
SELECT COUNT(*) FROM lessons;   -- Should return 3+ (sample data)

-- Check RLS is enabled
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

Expected output:
- 3 programs
- 10 courses
- 3 lessons (sample data for first course)
- 5 tables with RLS enabled: programs, courses, lessons, enrollments, lesson_completions

## Step 4: Test API Routes Locally

```bash
# Start the development server
npm run dev

# In a new terminal, test the API routes

# Test getting all courses
curl http://localhost:3000/api/courses

# Test getting a specific course (use actual UUID from your database)
curl http://localhost:3000/api/courses/[course-id]

# Test getting programs
curl http://localhost:3000/api/programs
```

## Step 5: Verify Next.js Pages with Live Data

1. Start dev server: `npm run dev`
2. Navigate to http://localhost:3000/portal/courses
3. Verify:
   - Programs tab shows 3 programs from database
   - Catalog tab shows 10 courses with filtering working
   - Course detail pages load from database
   - Lesson player displays real lesson data

## Step 6: Configure RLS Policies (Security)

The schema includes Row Level Security (RLS) policies:
- **Public tables**: programs, courses, lessons are readable by everyone
- **Private tables**: enrollments, lesson_completions require user authentication
- Users can only see their own enrollments and completions

To verify RLS is working:
```sql
-- Should only show user's own enrollments
SELECT * FROM enrollments WHERE user_id = auth.uid();
```

## Step 7: Add More Lessons (Optional)

To add more lessons to courses, use:
```sql
INSERT INTO lessons (course_id, title, description, video_url, duration, content, resources, lesson_order)
VALUES (
  '[course-uuid]',
  'Lesson Title',
  'Lesson Description',
  'https://example.com/video.mp4',
  45,
  'Detailed lesson content here...',
  '[]'::jsonb,
  2
);
```

## Step 8: Production Deployment

After testing locally:

```bash
# Build for production
npm run build

# Deploy to Azure Static Web App
git add -A
git commit -m "chore: add production database integration"
git push origin main
```

Azure will automatically:
1. Build the Next.js application
2. Deploy API routes
3. Deploy to https://sdtoolsinc.azurestaticapps.net

## Troubleshooting

### API Returns 500 Error
- Check Supabase credentials in .env.local
- Verify table exists: `SELECT * FROM information_schema.tables WHERE table_name='courses';`
- Check Supabase logs for detailed error

### RLS Prevents Access
- Verify RLS policies are created: `SELECT * FROM pg_policies;`
- For public tables, policies should allow `FOR SELECT USING (true)`
- For private tables, verify user is authenticated: `SELECT auth.uid();`

### Database Queries Return Empty
- Verify data was inserted: `SELECT COUNT(*) FROM courses;`
- Check program_id foreign key references are valid

## Next Steps

1. ✅ Database schema created
2. ✅ Sample data seeded
3. ✅ API routes working
4. ✅ Pages updated to use database
5. ⏳ Add more courses and lessons as needed
6. ⏳ Implement advanced features (certificates, badges, etc.)
7. ⏳ Set up analytics and reporting

## Support

For issues or questions:
- Check Supabase documentation: https://supabase.com/docs
- Review API route logs in Azure Portal
- Test queries in Supabase SQL Editor first
