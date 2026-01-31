# Portal Enhancement Features Documentation

## Overview
This document describes the new features added to the T.O.O.L.S Inc portal system to better serve justice-involved individuals through enhanced profiles, communication, reporting, education, and recognition systems.

## New Features

### 1. Enhanced User Profiles

#### Demographics Collection
The profile system now captures comprehensive demographic information:
- **Personal Details**: Date of birth, gender identity, ethnicity
- **Status Indicators**: Veteran status, disability accommodations
- **Purpose**: Better service matching, compliance reporting, personalized support

#### Contact Information
Complete contact management including:
- Primary and alternate phone numbers
- Full mailing address (street, city, state, ZIP)
- Emergency contact with phone number
- **Use Case**: Emergency response, mail communications, family contact

#### Personal Customization
Users can personalize their experience:
- **Theme Selection**: Dark mode (default) or light mode
- **Language**: English or Spanish (extendable to more languages)
- **Notifications**: Push notifications toggle
- **Email Updates**: Weekly progress reports opt-in/out

#### Implementation
- **File**: `/app/portal/profile/page.tsx`
- **Data Model**: Extended User type in `/lib/auth.tsx`
- **Storage**: localStorage (ready for Supabase migration)

---

### 2. Case Manager Messaging System

#### Real-Time Communication
Instant messaging interface connecting users with their assigned case managers:
- **Message Types**: Text messages with timestamps
- **Status Indicators**: Online/offline status, unread counts
- **Read Receipts**: Message read status tracking

#### Case Manager Information Panel
Dedicated sidebar displaying:
- Case manager name and role
- Profile avatar (initials-based)
- Contact information (email, phone)
- Availability hours
- Online status indicator

#### Features
- **Send Messages**: Text input with Enter-to-send
- **Message History**: Chronological conversation view
- **Timestamp Format**: "2m ago", "5h ago", or date
- **Visual Design**: Different bubble styles for client vs case manager

#### Implementation
- **File**: `/app/portal/messages/page.tsx`
- **Mock Data**: Sample messages and case manager info
- **Production Ready**: Structure ready for Supabase Realtime integration

#### Production Integration Steps
```javascript
// Example Supabase Realtime setup
const subscription = supabase
  .channel('messages')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    // Add new message to state
    setMessages(prev => [...prev, payload.new])
  })
  .subscribe()
```

---

### 3. Anonymous Reporting & Grievance System

#### Report Types
Four categories of submissions:
1. **General Concern** (💬): Feedback about services/programs
2. **Incident Report** (⚠️): Safety concerns, harassment, violations
3. **Formal Grievance** (📋): Complaints about treatment/services
4. **Suggestion** (💡): Improvement ideas

#### Anonymous Submission
- **Toggle**: Optional anonymous filing
- **Confidentiality**: No identifying information collected when anonymous
- **Tracking**: Unique tracking number for follow-up
- **Format**: `TYPE-TIMESTAMP` (e.g., `CON-123456`)

#### Report Form Fields
- **Subject**: Brief summary (required)
- **Description**: Detailed explanation (required)
- **Location**: Where incident occurred (optional)
- **Date**: When incident happened (optional)
- **Contact Info**: Name and email if not anonymous (optional)

#### Success Flow
After submission:
1. Confirmation screen with tracking number
2. Guidance on response timeline (3-5 business days)
3. Options to submit another report or return to dashboard

#### Implementation
- **File**: `/app/portal/report/page.tsx`
- **Tracking System**: Timestamp-based unique IDs
- **Storage**: Ready for backend API integration

#### Important Notices Displayed
- Reports reviewed within 3-5 business days
- All reports treated with strict confidentiality
- False reports may result in disciplinary action
- Emergency situations should call 911

---

### 4. Financial Management Course (FREE)

#### Course Overview
Comprehensive 6-week online course covering essential financial skills:
- **Duration**: 6 weeks (self-paced)
- **Format**: Online, 24/7 access
- **Cost**: FREE for all users
- **Certificate**: Eligible for completion certificate
- **Credits**: 4 continuing education credits

#### Course Curriculum

**Lesson 1: Introduction to Personal Finance** (30 min)
- Understanding income and expenses
- Calculating net worth
- Setting SMART financial goals
- Financial literacy importance

**Lesson 2: Budgeting Fundamentals** (45 min)
- The 50/30/20 budget rule
- Fixed vs variable expenses
- Zero-based budgeting
- Budget categories and tracking

**Lesson 3: Understanding Credit** (40 min)
- Credit score components (300-850 range)
- Factors affecting credit (payment history 35%, utilization 30%, etc.)
- How to check credit reports (AnnualCreditReport.com)
- Credit improvement strategies

**Lesson 4: Banking and Financial Services** (35 min)
- Types of accounts (checking, savings, money market)
- Choosing a bank
- Avoiding bank fees
- Online banking security

**Lesson 5: Tax Basics for Individuals** (50 min)
- Understanding income tax
- Filing status options
- W-2, 1099, and Form 1040
- Common deductions and credits
- Free filing options (IRS Free File, VITA)

**Lesson 6: Building Your Financial Future** (55 min)
- Emergency fund creation (3-6 months expenses)
- Debt payoff strategies (snowball vs avalanche)
- Retirement planning basics
- Investment fundamentals
- Long-term goal setting

#### Course Resources
Each lesson includes downloadable materials:
- Budget templates (Excel/PDF)
- Financial calculators
- Checklists and worksheets
- Reference guides
- External resource links

#### Instructors
- **James Williams, CFP**: Certified Financial Planner
- **Maria Rodriguez, CPA**: Certified Public Accountant

#### Implementation
- **File**: `/api/migrations/003-add-financial-management-course.sql`
- **Database**: Supabase courses and lessons tables
- **Course ID**: `f1234567-89ab-cdef-0123-456789abcdef`

#### Assessment Method
- Complete personal budget
- Credit improvement plan
- Tax basics quiz

---

### 5. Course Certificate System

#### Certificate Design
Professional certificate template featuring:
- **T.O.O.L.S Inc Branding**: Logo and full organization name
- **Decorative Elements**: Double border, corner accents, watermark
- **Certificate Information**:
  - Recipient name (from user profile)
  - Course name
  - Completion date
  - Instructor name and signature line
  - Continuing education credits (if applicable)
  - Unique verification ID

#### Certificate Features
- **Unique ID**: Format `CERT-YYYY-CODE-NNNNNN`
- **Verification**: ID for authenticity checks
- **Download**: High-quality format
- **Print**: Browser print functionality
- **Share**: LinkedIn-ready format

#### User Interface
**Certificates Grid View**:
- Card display with course info
- Completion date
- Instructor name
- Credits earned
- Certificate ID
- Action buttons (View, Download)

**Certificate Preview**:
- Full-size certificate display
- Download button with icon
- Print button
- Close preview option

#### Implementation
- **Component**: `/components/certificates/Certificate.tsx`
- **Page**: `/app/portal/certificates/page.tsx`
- **Rendering**: React component (exportable to PDF)

#### Production Enhancement Options
```javascript
// Add PDF generation with jsPDF
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const downloadPDF = async (certificateElement) => {
  const canvas = await html2canvas(certificateElement);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [canvas.width, canvas.height]
  });
  pdf.addImage(imgData, 'PNG', 0, 0);
  pdf.save(`certificate-${courseId}.pdf`);
};
```

---

## Dashboard Integration

### Updated Navigation
The dashboard now includes cards for all new features:

1. **My Courses** (📚) - Existing
2. **Profile Settings** (👤) - Enhanced description
3. **Messages** (💬) - NEW with unread count badge
4. **My Certificates** (🏆) - NEW
5. **Submit Report** (📝) - NEW
6. **MackAi System** (🤖) - Existing

### Visual Indicators
- Hover effects on navigation cards
- Unread message count badge (pulsing dot + number)
- Improved descriptions for each feature

---

## User Flows

### Profile Update Flow
1. User navigates to Profile Settings from dashboard
2. Fills in demographics and contact information
3. Adjusts preferences (theme, language, notifications)
4. Clicks "Save Changes"
5. Sees success confirmation
6. Data persists for future sessions

### Messaging Flow
1. User clicks Messages from dashboard
2. Sees conversation history with case manager
3. Types message in text area
4. Presses Enter or clicks Send button
5. Message appears immediately in chat
6. Case manager receives notification (production)

### Reporting Flow
1. User clicks Submit Report from dashboard
2. Selects report type (concern, incident, grievance, suggestion)
3. Chooses anonymous or identified submission
4. Fills in report details
5. Reviews important notices
6. Submits report
7. Receives tracking number
8. Can submit another or return to dashboard

### Course Completion Flow
1. User enrolls in Financial Management course
2. Completes all 6 lessons
3. Passes assessments
4. System generates certificate automatically
5. Certificate appears in My Certificates
6. User can view, download, or print

---

## Data Models

### Extended User Type
```typescript
type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  enrolledCourses: string[];
  completedLessons: string[];
  demographics?: {
    dateOfBirth?: string;
    gender?: string;
    ethnicity?: string;
    veteranStatus?: boolean;
    disabilityStatus?: boolean;
  };
  contactInfo?: {
    phoneNumber?: string;
    alternatePhone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
  };
  caseManagerId?: string;
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    theme: "dark" | "light";
    language?: string;
  };
};
```

### Message Type
```typescript
interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "client" | "case_manager";
  content: string;
  timestamp: Date;
  read: boolean;
}
```

### Report Type
```typescript
type ReportType = "incident" | "grievance" | "concern" | "suggestion";

interface Report {
  type: ReportType;
  isAnonymous: boolean;
  name?: string;
  email?: string;
  subject: string;
  description: string;
  location?: string;
  dateOfIncident?: string;
  trackingNumber: string;
  submittedAt: Date;
}
```

### Certificate Type
```typescript
interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  completionDate: string;
  certificateId: string;
  instructorName: string;
  credits?: number;
}
```

---

## Security Considerations

### Profile Data
- **Current**: Base64 encoding in localStorage
- **Production**: Encrypt sensitive data, use HTTPS, implement proper authentication
- **PII Protection**: Comply with data protection regulations

### Messaging
- **Encryption**: End-to-end encryption for HIPAA compliance
- **Access Control**: Users can only see their own messages
- **Audit Trail**: Log all message activity for compliance

### Reporting
- **Anonymous Protection**: Never log IP addresses for anonymous reports
- **Data Retention**: Secure storage with access controls
- **Investigation**: Only authorized staff can view reports

### Certificates
- **Verification**: Implement certificate verification endpoint
- **Tampering Prevention**: Digital signatures or blockchain verification
- **Authenticity**: Unique IDs linked to user and course records

---

## Testing Checklist

### Profile System
- [ ] All fields save correctly
- [ ] Data persists after logout/login
- [ ] Form validation works
- [ ] Theme changes apply immediately
- [ ] Language toggle works (if implemented)

### Messaging
- [ ] Messages send successfully
- [ ] Timestamps display correctly
- [ ] Case manager info displays
- [ ] Mobile responsive design
- [ ] Enter key sends message

### Reporting
- [ ] All report types selectable
- [ ] Anonymous toggle works
- [ ] Tracking number generates
- [ ] Success screen displays
- [ ] Form validation enforced

### Certificates
- [ ] Completed courses show certificates
- [ ] Certificate displays correctly
- [ ] Download button works
- [ ] Print button works
- [ ] Certificate ID is unique

### Dashboard
- [ ] All navigation cards work
- [ ] Message badge shows count
- [ ] Hover effects display
- [ ] Links navigate correctly

---

## Deployment Notes

### Database Migrations
Run the Financial Management course migration:
```bash
psql -h [supabase-host] -U postgres -d postgres -f api/migrations/003-add-financial-management-course.sql
```

Or use Supabase dashboard SQL Editor to execute the migration.

### Environment Variables
No new environment variables required for these features.

### Dependencies
All features use existing dependencies:
- React 19
- Next.js 16
- Framer Motion 11
- Tailwind CSS 3

Optional for PDF generation:
```bash
npm install jspdf html2canvas
```

---

## Future Enhancements

### Profile System
- [ ] Photo upload for avatar
- [ ] Document attachments (ID, certifications)
- [ ] Social media links
- [ ] Pronouns field

### Messaging
- [ ] File attachments (images, documents)
- [ ] Voice messages
- [ ] Message reactions (emoji)
- [ ] Group messaging (family, support team)
- [ ] Video call integration

### Reporting
- [ ] Photo/video evidence upload
- [ ] Witness statements
- [ ] Report status tracking
- [ ] Email notifications on status changes
- [ ] Admin portal for report management

### Certificates
- [ ] PDF export with watermark
- [ ] Social media sharing buttons
- [ ] Certificate wallet (digital credential storage)
- [ ] Blockchain verification
- [ ] QR code for quick verification

### Financial Course
- [ ] Interactive budgeting calculator
- [ ] Credit score simulator
- [ ] Tax filing practice environment
- [ ] Gamification (badges, points)
- [ ] Discussion forums

---

## Support & Documentation

### User Help Articles
Create help articles for:
- How to update your profile
- How to message your case manager
- How to file a report anonymously
- How to download your certificate
- How to access the Financial Management course

### Staff Training
Train staff on:
- Responding to messages promptly
- Handling reports with sensitivity
- Certificate verification process
- Profile data privacy requirements

### Technical Documentation
- API endpoints for production integration
- Database schema documentation
- Security protocols
- Disaster recovery procedures

---

## Success Metrics

### Engagement
- Profile completion rate
- Messages sent per user
- Reports submitted (by type)
- Course enrollment and completion
- Certificate downloads

### Satisfaction
- User feedback scores
- Case manager response times
- Report resolution times
- Course ratings
- Feature usage analytics

### Outcomes
- Employment rate improvements
- Financial literacy scores
- User retention rates
- Program completion rates
- Recidivism reduction

---

## Contact & Support

For technical issues or questions about these features:
- **Development Team**: GitHub Issues
- **User Support**: support@toolsinc.org
- **Emergency**: 911 or designated crisis line

---

*Last Updated: January 2024*
*Version: 1.0*
*Authors: Development Team*
