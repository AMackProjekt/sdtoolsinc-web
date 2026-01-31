# Supabase Live Database Setup

## Step 1: Execute Database Schema

Your Supabase database schema is ready! Follow these steps to create all tables:

### Method 1: Using Supabase SQL Editor (Recommended)

1. **Open Supabase Dashboard**
   - Go to: https://app.supabase.com
   - Select your project: **witgsjkbxflqlvvgmghu**

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Paste the Complete Schema**
   - Open the file: `api/schema-courses.sql` in this repository (752 lines)
   - Copy the entire content
   - Paste into the SQL Editor

4. **Execute the Schema**
   - Click the blue "Run" button (or Ctrl+Enter)
   - Wait for completion (should take 5-10 seconds)
   - You should see success messages for each CREATE statement

### Verification

After execution, verify everything was created:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verify data was seeded
SELECT COUNT(*) FROM programs;        -- Should return: 3
SELECT COUNT(*) FROM courses;         -- Should return: 10
SELECT COUNT(*) FROM lessons;         -- Should return: 3
```

## Step 2: Verify Row Level Security (RLS)

The schema automatically configures RLS policies for:
- **Programs**: Public read access ✅
- **Courses**: Public read access ✅
- **Lessons**: Public read access ✅
- **Enrollments**: User-specific access (authenticated users only) ✅
- **Lesson Completions**: User-specific access (authenticated users only) ✅

## Step 3: Environment Variables Verified

Your environment variables are already configured:

- **NEXT_PUBLIC_SUPABASE_URL**: `https://witgsjkbxflqlvvgmghu.supabase.co`
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Configured in Azure App Settings

## Live Data Structure

### Programs Table (3 rows)
- Reentry & Resettlement Program
- Job Training & Employment Program
- Personal Growth & Development

### Courses Table (10 rows per program structure)
- Job Readiness Fundamentals
- Financial Literacy
- Personal Development
- Digital Skills
- Advanced Digital Skills
- Conflict Resolution & Communication
- Mental Health & Wellness
- Industry Certifications Preparation
- Interview Mastery & Negotiation
- Goal Setting & Accountability Systems

### Lessons Table (3+ sample lessons)
- Building Your Foundation: Resume Essentials
- Tailoring Your Resume for Success
- The Perfect Cover Letter

### Enrollments & Lesson Completions
- Tracked per authenticated user
- No sample data (created by user enrollment)

## Troubleshooting

### Schema Already Exists?
If you see an error like "relation already exists", the tables are already created. This is fine - the schema uses `CREATE TABLE IF NOT EXISTS`.

### Connection Issues?
- Verify your Supabase URL and API key in `.env.local`
- Test connectivity in Supabase Dashboard → SQL Editor
- Check Network tab in browser for CORS issues

### Need to Reset?
Drop all tables and recreate:
```sql
DROP TABLE IF EXISTS lesson_completions CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS programs CASCADE;

-- Then paste the full schema-courses.sql again
```

---

**⚠️ IMPORTANT**: This schema uses Row Level Security to ensure users can only access their own enrollments. Public read is enabled for programs/courses/lessons.

Once schema is executed, the portal pages will automatically fetch live data from Supabase! 🚀
