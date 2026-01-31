# Portal Enhancement Documentation

## Overview
This document describes the new features added to the T.O.O.L.S Inc portal to enhance user experience, communication, and support services.

## New Features

### 1. Enhanced User Profile (/portal/profile)

#### Demographics Section
Users can now provide demographic information (optional):
- Age
- Gender (Male, Female, Non-binary, Prefer not to say)
- Ethnicity
- Location (City, State)

#### Contact Information
Enhanced contact details management:
- Phone number
- Street address
- City, State, ZIP code

#### Emergency Contact
Users can add emergency contact information:
- Contact name
- Contact phone
- Relationship to user

**Implementation Details:**
- Fields stored in `demographics` and `contactInfo` objects in User type
- All fields are optional to protect user privacy
- Data updates via `updateProfile()` function
- UI uses form inputs with validation

---

### 2. Customization Settings (/portal/settings)

#### Appearance Customization
- **Font Size**: Small, Medium, Large options
- **Accent Color**: 6 color themes (Sky Blue, Teal, Purple, Orange, Pink, Green)

#### Notification Preferences
- Push notifications toggle
- Email updates toggle

#### Privacy & Data
- Privacy policy link
- Data download option
- Data security information

**Implementation Details:**
- Settings stored in `preferences` object in User type
- Toggle switches for boolean preferences
- Color picker for accent color selection
- Changes persist in localStorage (production: Supabase)

---

### 3. Instant Messaging System (/portal/messages)

#### Features
- Direct messaging with assigned case manager
- Inbox with unread message count
- Message composition with subject and body
- Read/unread status tracking
- Reply functionality
- Message history

#### UI Components
- **Inbox View**: List of all messages with preview
- **Message Detail**: Full message view with reply option
- **Compose View**: Form for new messages

**Database Schema** (schema-enhancements.sql):
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  sender_id UUID REFERENCES auth.users(id),
  recipient_id UUID REFERENCES auth.users(id),
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Supabase Functions:**
- `getMessages(userId)`: Fetch all messages for user
- `sendMessage(senderId, recipientId, subject, message)`: Send new message
- `markMessageRead(messageId)`: Mark message as read

---

### 4. Anonymous Reporting & Grievance System (/portal/report)

#### Report Types
- **Report**: Safety concerns, facility issues, health concerns, discrimination
- **Grievance**: Unfair treatment, policy violations, service quality, rights violations
- **Feedback**: General feedback and suggestions

#### Features
- Anonymous submission toggle
- Priority levels (Low, Medium, High, Urgent)
- Category selection
- Detailed description field
- Status tracking (Pending, Under Review, Resolved, Closed)
- Submission history

#### Submission Categories

**Reports:**
- Safety Concern
- Staff Misconduct
- Facility Issue
- Health & Wellness
- Discrimination
- Other

**Grievances:**
- Unfair Treatment
- Policy Violation
- Service Quality
- Access to Services
- Rights Violation
- Other

**Database Schema**:
```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  type TEXT CHECK (type IN ('report', 'grievance', 'feedback')),
  category TEXT,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  anonymous BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Supabase Functions:**
- `submitReport(report)`: Submit new report/grievance
- `getUserReports(userId)`: Get user's submission history

---

### 5. Course Certificates (/portal/certificates)

#### Features
- Professional certificate design
- Unique certificate number
- Verification seal
- Download functionality (PDF generation)
- Certificate gallery view
- Course and program information

#### Certificate Design Elements
- T.O.O.L.S Inc branding
- Decorative borders
- User name (recipient)
- Course name
- Program name
- Completion date
- Certificate number
- Verification seal
- Authorized signatures

**Database Schema**:
```sql
CREATE TABLE certificates (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  course_id UUID REFERENCES courses(id),
  certificate_number TEXT UNIQUE NOT NULL,
  issued_date TIMESTAMPTZ DEFAULT NOW(),
  completion_date TIMESTAMPTZ NOT NULL
);
```

**Supabase Functions:**
- `generateCertificate(userId, courseId, programId)`: Generate new certificate
- `getUserCertificates(userId)`: Get all certificates for user
- `verifyCertificate(certificateNumber)`: Verify certificate authenticity

**Certificate Component** (`components/certificates/Certificate.tsx`):
- Reusable React component
- A4 aspect ratio design
- Print-ready layout
- Professional typography
- Responsive design

---

### 6. Financial Management Course (FREE)

#### Course Details
- **Title**: Financial Management Fundamentals
- **Duration**: 6 weeks
- **Level**: Beginner
- **Type**: Online, self-paced
- **Cost**: FREE
- **Program**: Personal Growth & Development

#### Curriculum (6 Lessons)

1. **Introduction to Financial Wellness** (25 min)
   - Understanding financial health
   - Common barriers and solutions
   - Money mindset

2. **Creating Your First Budget** (35 min)
   - 50/30/20 budgeting rule
   - Expense tracking
   - Budget templates and tools

3. **Understanding and Building Credit** (30 min)
   - Credit scores explained
   - Building/rebuilding credit
   - Credit reports and disputes

4. **Building Your Emergency Fund** (28 min)
   - Importance of emergency savings
   - Savings strategies
   - Automatic savings setup

5. **Debt Management Strategies** (32 min)
   - Debt avalanche vs. snowball
   - Creditor negotiation
   - Avoiding predatory lending

6. **Financial Goal Setting and Future Planning** (30 min)
   - SMART goal setting
   - 5-year financial planning
   - Introduction to investing

**Resources Included:**
- Budget templates
- Credit score tracking tools
- Debt payoff calculators
- Financial goal worksheets
- Investment basics guide

**Database Implementation**: See `api/schema-financial-course.sql`

---

## Dashboard Updates

The portal dashboard (/portal/dashboard) now includes navigation cards for all new features:

1. 📚 My Courses
2. 👤 Profile Settings
3. 💬 Messages (NEW)
4. 🏆 Certificates (NEW)
5. ⚙️ Customization (NEW)
6. 📋 Report & Grievance (NEW)
7. 🤖 MackAi System
8. 🌐 My Portals
9. 📊 Analytics

---

## Database Migrations

### Required Migrations

1. **Profile Extensions** (schema-enhancements.sql):
   ```sql
   ALTER TABLE profiles ADD COLUMN demographics JSONB DEFAULT '{}';
   ALTER TABLE profiles ADD COLUMN contact_info JSONB DEFAULT '{}';
   ALTER TABLE profiles ADD COLUMN case_manager_id UUID REFERENCES auth.users(id);
   ALTER TABLE profiles ADD COLUMN preferences JSONB DEFAULT '{}';
   ```

2. **Messages Table** (schema-enhancements.sql)
3. **Reports Table** (schema-enhancements.sql)
4. **Certificates Table** (schema-enhancements.sql)
5. **Financial Course** (schema-financial-course.sql)

### Migration Order
1. Run `api/schema-enhancements.sql` in Supabase SQL Editor
2. Run `api/schema-financial-course.sql` in Supabase SQL Editor
3. Verify tables created with: `SELECT * FROM information_schema.tables WHERE table_schema='public';`

---

## Security Considerations

### Anonymous Reporting
- Reports can be submitted without user_id (anonymous)
- RLS policies allow viewing own reports OR reports where user_id IS NULL
- Submissions are confidential and secure

### Data Privacy
- All personal information fields are optional
- Users control what information they share
- GDPR-compliant data handling
- Data encryption at rest (Supabase)

### Row Level Security (RLS)
All new tables have RLS policies:
- Messages: Users can only view sent/received messages
- Reports: Users can view own reports; case managers can view assigned reports
- Certificates: Users can view own certificates; public verification allowed

---

## Future Enhancements

### Messaging
- Real-time updates with Supabase Realtime
- File attachments
- Message search
- Thread conversations
- Notifications for new messages

### Certificates
- PDF generation with html2canvas/jsPDF
- Email delivery
- Social media sharing
- QR code for verification
- Blockchain verification (future)

### Reports
- Admin dashboard for reviewing reports
- Automated status updates
- Email notifications
- Report analytics

### Financial Course
- Interactive budget calculators
- Credit score simulator
- Video lessons
- Live Q&A sessions
- Certification exam

---

## Testing Checklist

### Profile Enhancement
- [ ] Save demographics information
- [ ] Save contact information
- [ ] Save emergency contact
- [ ] Validate phone number format
- [ ] Validate ZIP code format
- [ ] Test form submission

### Settings
- [ ] Change font size and verify UI updates
- [ ] Select different accent colors
- [ ] Toggle notifications
- [ ] Toggle email updates
- [ ] Save preferences

### Messaging
- [ ] Send message to case manager
- [ ] View inbox messages
- [ ] Read message details
- [ ] Reply to message
- [ ] Verify read/unread status
- [ ] Check unread count

### Reporting
- [ ] Submit anonymous report
- [ ] Submit identified report
- [ ] Submit grievance
- [ ] Select different priorities
- [ ] View submission history
- [ ] Check status tracking

### Certificates
- [ ] View certificate gallery
- [ ] Open certificate detail
- [ ] Download certificate
- [ ] Verify certificate number
- [ ] Check certificate design

---

## API Reference

### Supabase Helper Functions (lib/supabase.ts)

#### Messages
```typescript
getMessages(userId: string): Promise<Message[]>
sendMessage(senderId: string, recipientId: string, subject: string, message: string): Promise<Message | null>
markMessageRead(messageId: string): Promise<boolean>
```

#### Reports
```typescript
submitReport(report: Partial<Report>): Promise<Report | null>
getUserReports(userId: string): Promise<Report[]>
```

#### Certificates
```typescript
generateCertificate(userId: string, courseId: string, programId?: string): Promise<Certificate | null>
getUserCertificates(userId: string): Promise<Certificate[]>
verifyCertificate(certificateNumber: string): Promise<Certificate | null>
```

---

## Component Reference

### Certificate Component
```tsx
<Certificate
  userName="John Doe"
  courseName="Financial Management Fundamentals"
  programName="Personal Growth & Development"
  completionDate="2026-01-31"
  certificateNumber="TOOLS-2026-001234"
  onDownload={() => handleDownload()}
/>
```

---

## Deployment Notes

1. **Database Setup**: Run SQL migration scripts in Supabase
2. **Environment Variables**: Ensure Supabase credentials are set
3. **Build**: Address static export vs. dynamic routes issue (existing)
4. **Test**: Verify all new pages load correctly
5. **Monitor**: Check for errors in Supabase logs

---

## Support & Maintenance

### Contact
- Technical Issues: Report via GitHub Issues
- Feature Requests: Submit via GitHub Discussions
- Security Concerns: Email security@toolsinc.org (placeholder)

### Documentation
- User Guide: [Link to user documentation]
- Admin Guide: [Link to admin documentation]
- API Documentation: [Link to API docs]

---

**Version**: 1.0.0  
**Last Updated**: January 31, 2026  
**Author**: GitHub Copilot Agent
