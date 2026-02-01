/**
 * Course Materials & Content Library
 * Structured learning materials for T.O.O.L.S Inc courses
 */

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  content: string;
  duration: string;
  type: "video" | "reading" | "interactive" | "exercise";
}

export interface CourseContent {
  courseId: string;
  courseName: string;
  description: string;
  thumbnail: string;
  lessons: Lesson[];
  totalDuration: string;
  level: string;
}

export const courseContents: CourseContent[] = [
  {
    courseId: "job-readiness",
    courseName: "Job Readiness Essentials",
    description: "Master the fundamentals of preparing for employment success",
    thumbnail: "💼",
    level: "Beginner",
    totalDuration: "4 hours",
    lessons: [
      {
        id: "jr-1",
        title: "Understanding Your Strengths",
        description: "Identify and articulate your key skills and competencies",
        content: `
# Understanding Your Strengths

## Key Topics
- Self-assessment techniques
- Identifying transferable skills
- Understanding your unique value proposition
- Overcoming limiting beliefs about your background

## Learning Objectives
By the end of this lesson, you will be able to:
- Identify 5-10 personal strengths
- Articulate how your background builds resilience
- Recognize transferable skills from all experiences
- Develop a growth mindset about employment

## Activities
1. Complete the Personal Strength Inventory
2. Write 3 examples of overcoming challenges
3. Identify skills used in those experiences
4. Share one strength with the group (optional)
        `,
        type: "interactive",
        duration: "45 min"
      },
      {
        id: "jr-2",
        title: "Resume Building for Reentry",
        description: "Create a compelling resume that addresses background honestly",
        content: `
# Resume Building for Reentry

## Resume Framework
- Contact information
- Professional summary
- Skills section
- Work experience (highlighting growth)
- Education & certifications
- Volunteer work & community involvement

## Addressing Employment Gaps
- Be honest and brief
- Highlight what you learned during gaps
- Focus on skill development
- Show commitment to change

## Sample Resume Sections
### Professional Summary
"Results-oriented professional committed to leveraging [skills] to drive impact. Successfully completed [program/training]. Strong communicator with proven ability to overcome challenges and learn quickly."

### Experience Section Format
- Use action verbs (Led, Managed, Improved, Created)
- Quantify results when possible
- Show progression and growth
- Connect past experiences to future goals

## Resources
- Resume template provided
- Example resumes for different industries
- Common resume mistakes to avoid
        `,
        type: "reading",
        duration: "60 min"
      },
      {
        id: "jr-3",
        title: "Interview Preparation",
        description: "Prepare for common interview questions and scenarios",
        content: `
# Interview Preparation Masterclass

## Common Interview Questions
1. "Tell me about yourself"
2. "Why are you interested in this position?"
3. "What are your strengths?"
4. "Tell me about a challenge you overcame"
5. "Why should we hire you?"

## STAR Method (Situation, Task, Action, Result)
Use this framework for behavioral questions:
- **Situation**: Set the context
- **Task**: Describe the challenge
- **Action**: Explain what you did
- **Result**: Share the outcome

## Addressing Background Questions
- Keep it brief and professional
- Emphasize learning and growth
- Connect past to future goals
- Focus on skills gained

## Interview Day Checklist
- Arrive 10-15 minutes early
- Dress appropriately for the industry
- Bring copies of resume and portfolio
- Prepare questions to ask interviewer
- Bring pen and notebook
- Turn off phone

## Practice Interview
You'll participate in a mock interview with feedback from an instructor.
        `,
        type: "interactive",
        duration: "90 min"
      },
      {
        id: "jr-4",
        title: "Networking & Job Search Strategy",
        description: "Build professional relationships and find hidden job opportunities",
        content: `
# Networking & Job Search Strategy

## The Power of Networking
- 70-80% of jobs are filled through networking
- Building genuine professional relationships
- Leveraging your network effectively
- Following up appropriately

## Networking Strategies
1. **LinkedIn**: Create professional profile, connect with 500+ people
2. **Industry Events**: Attend job fairs and professional meetups
3. **Informational Interviews**: Talk to people in your field
4. **Community Involvement**: Volunteer and meet professionals
5. **Referral Programs**: Ask current connections for introductions

## Job Search Channels
- Job boards: Indeed, LinkedIn, Monster
- Company websites: Apply directly
- Staffing agencies: Get placed quickly
- Apprenticeships: Learn while earning
- Government programs: WIOA, AJCC resources

## 72-Hour Rule
**First 72 hours after release are critical:**
- Apply to jobs immediately
- Activate your network
- Visit local workforce agencies
- Explore community resources

## Staying Motivated
- Set daily job search goals (5-10 applications)
- Track your progress
- Celebrate small wins
- Stay positive through rejection
- Use feedback to improve
        `,
        type: "reading",
        duration: "45 min"
      }
    ]
  },
  {
    courseId: "financial-literacy",
    courseName: "Financial Literacy for Fresh Starts",
    description: "Build a strong financial foundation for your future",
    thumbnail: "💰",
    level: "Beginner",
    totalDuration: "3.5 hours",
    lessons: [
      {
        id: "fl-1",
        title: "Budget Basics",
        description: "Create and manage your first budget",
        content: `
# Budget Basics: Taking Control of Your Money

## What is a Budget?
A budget is a plan that shows you where your money comes from and where it goes.

## Why Budget?
- Control spending
- Reduce financial stress
- Reach goals faster
- Avoid debt
- Build wealth

## Simple Budgeting Formula
**Income - Expenses = Surplus or Deficit**

## The 50/30/20 Rule
- **50%** Needs (food, housing, utilities)
- **30%** Wants (entertainment, dining out)
- **20%** Savings & Debt Repayment

## Creating Your First Budget
### Step 1: Track Income
- Salary/wages
- Side income
- Benefits
- Total monthly income

### Step 2: List Expenses
- Fixed: Rent, insurance, utilities
- Variable: Food, transportation, entertainment
- Debt: Loan payments, credit cards

### Step 3: Compare & Adjust
- Are expenses under income?
- Which areas can you reduce?
- Where can you save?

## Budgeting Tools
- Spreadsheet (Excel, Google Sheets)
- Apps: YNAB, EveryDollar, Mint
- Pen and paper
- Banking app tools

## Practice Exercise
Create your own monthly budget using the template provided.
        `,
        type: "interactive",
        duration: "60 min"
      },
      {
        id: "fl-2",
        title: "Understanding Credit",
        description: "Build healthy credit from the ground up",
        content: `
# Understanding Credit: Your Financial Passport

## What is Credit?
Credit is a lender's trust that you'll repay borrowed money. It's measured by a credit score.

## Credit Scores Explained
- **Range**: 300-850
- **Good**: 670+
- **Excellent**: 750+
- **Bad**: Below 580

## What Affects Your Credit Score
1. **Payment History (35%)**: Pay bills on time
2. **Credit Utilization (30%)**: Keep balances low
3. **Length of History (15%)**: Keep accounts open
4. **Credit Mix (10%)**: Mix of credit types helps
5. **New Inquiries (10%)**: Avoid multiple applications

## Building Credit from Zero
### Option 1: Secured Credit Card
- Put down $500-1000 deposit
- Get credit line for that amount
- Make small purchases monthly
- Pay in full on time
- Upgrade to regular card after 6-12 months

### Option 2: Credit Builder Loan
- Borrow small amount (e.g., $300-1000)
- Money goes to savings account
- Make monthly payments
- Payments reported to credit bureaus
- Receive loan at end of term

### Option 3: Become Authorized User
- Have someone add you to their account
- Builds credit without your own account
- Their payment history helps you

## Red Flags to Avoid
- High-interest payday loans
- Predatory lending
- Credit repair scams
- Missing payments
- Maxing out credit cards

## Free Credit Monitoring
- AnnualCreditReport.com (free annual report)
- Credit Karma (free monthly monitoring)
- Your bank's credit monitoring
- Your credit card company's tools
        `,
        type: "reading",
        duration: "45 min"
      },
      {
        id: "fl-3",
        title: "Banking 101",
        description: "Set up your bank account and manage it wisely",
        content: `
# Banking 101: Your Foundation for Financial Health

## Types of Bank Accounts

### Checking Account
- For daily transactions
- Unlimited deposits/withdrawals
- Comes with debit card
- Check writing available
- Low to no fees

### Savings Account
- For storing money
- Earn interest on balance
- Limited transactions (6/month typically)
- Emergency fund storage
- Higher interest rates available

### Money Market Account
- Hybrid checking/savings
- Better interest rates
- Limited checks
- Higher minimum balance

## Choosing a Bank
- **Traditional Bank**: Full service, physical locations
- **Credit Union**: Member-owned, lower fees
- **Online Bank**: No branches, lowest fees, highest rates
- **Community Bank**: Local, personalized service

## Setting Up Your Account
1. Bring ID and proof of address
2. Initial deposit (typically $25+)
3. Choose account type
4. Set up online access
5. Order debit card
6. Review fees and features

## Using Your Debit Card Safely
- Keep PIN private
- Monitor transactions
- Report fraud immediately
- Set spending limits
- Use ATM fees wisely

## Banking Fees to Avoid
- Overdraft fees ($30-35 each)
- Monthly maintenance fees
- ATM fees
- Wire transfer fees
- Minimum balance fees

## Smart Banking Tips
- Set up direct deposit
- Automate bill payments
- Use online banking
- Monitor account activity
- Keep receipts
- Reconcile monthly
        `,
        type: "interactive",
        duration: "50 min"
      }
    ]
  },
  {
    courseId: "mental-health-wellness",
    courseName: "Mental Health & Wellness for Reentry",
    description: "Build resilience and mental wellness strategies for sustainable success",
    thumbnail: "🧠",
    level: "Beginner",
    totalDuration: "4 hours",
    lessons: [
      {
        id: "mh-1",
        title: "Understanding Reentry Trauma",
        description: "Recognize and address trauma specific to reentry",
        content: `
# Understanding Reentry Trauma

## What is Reentry Trauma?
Reentry trauma is the psychological impact of:
- Loss of freedom and autonomy
- Identity disruption
- Community disconnection
- Stigma and discrimination
- Relationship changes
- Economic challenges
- Grief and loss

## Common Reentry Challenges
- Hypervigilance (constant alert)
- Trust issues
- Emotional dysregulation
- Isolation
- Shame and guilt
- Identity confusion
- Difficulty adjusting to freedom

## Physical Symptoms
- Sleep disturbances
- Headaches
- Muscle tension
- Stomach issues
- Fatigue
- Racing heart
- Panic responses

## Psychological Symptoms
- Flashbacks
- Intrusive thoughts
- Avoidance behaviors
- Depression
- Anxiety
- Anger outbursts
- Emotional numbness

## Healing is Possible
**Important: These are normal responses to abnormal situations**
- With support, trauma can heal
- You're not weak or broken
- Many people recover fully
- Recovery takes time
- Professional help is available

## First Steps to Healing
1. Recognize trauma symptoms
2. Find a trusted person
3. Seek professional support
4. Build healthy routines
5. Connect with community
6. Practice self-compassion
        `,
        type: "interactive",
        duration: "60 min"
      },
      {
        id: "mh-2",
        title: "Coping Strategies & Resilience",
        description: "Learn practical tools for managing stress and building resilience",
        content: `
# Coping Strategies & Building Resilience

## What is Resilience?
Resilience is your ability to bounce back from challenges and adapt to change.

## Components of Resilience
1. **Self-awareness**: Know your triggers and strengths
2. **Social connection**: Build meaningful relationships
3. **Self-care**: Prioritize your health
4. **Purpose**: Know what matters to you
5. **Growth mindset**: See challenges as learning
6. **Problem-solving**: Address issues actively

## Healthy Coping Mechanisms

### Physical Coping
- Exercise (walking, sports, dancing)
- Yoga and stretching
- Breathing exercises (4-7-8 breathing)
- Healthy eating
- Good sleep hygiene
- Time in nature

### Emotional Coping
- Journaling
- Talking to trusted friends
- Therapy or counseling
- Support groups
- Creative expression (art, music)
- Meditation and mindfulness

### Social Coping
- Spend time with supportive people
- Join community groups
- Volunteer
- Call someone
- Attend support groups
- Build mentorship relationships

### Spiritual Coping
- Prayer or spiritual practice
- Volunteering
- Gratitude practice
- Time in nature
- Connecting with values
- Helping others

## Building Your Personal Resilience Plan
1. Identify your strengths
2. Know your triggers
3. Choose 3-5 coping strategies
4. Build support network
5. Practice regularly
6. Adjust as needed

## The Resilience Cycle
- Face challenge
- Use coping strategies
- Overcome challenge
- Grow stronger
- Become more resilient
        `,
        type: "reading",
        duration: "50 min"
      },
      {
        id: "mh-3",
        title: "Building Support Networks",
        description: "Create meaningful connections and access professional help",
        content: `
# Building Support Networks: You Don't Have to Do It Alone

## Types of Support

### Personal Support
- Family and friends
- Mentors
- Peers with similar experiences
- Support groups
- Community members

### Professional Support
- Therapists/Counselors
- Psychiatrists
- Medical doctors
- Case managers
- Peer specialists

### Community Support
- Religious organizations
- Community centers
- Non-profit organizations
- Government agencies
- Educational institutions

## Finding Quality Support
- Ask trusted people for recommendations
- Research credentials
- Start with free resources
- Don't settle for bad fit
- Keep trying until you find right support

## Support Groups
### Benefits
- Connect with people who understand
- Share experiences
- Learn coping strategies
- Reduce shame and isolation
- Build friendships
- Find hope

### Types of Groups
- Reentry support groups
- 12-step programs
- Peer support groups
- Online communities
- Mental health specific groups

## Red Flags in Relationships
- Constant criticism
- Isolation from others
- Control or manipulation
- Broken promises
- Disrespect
- Making you feel worse

## Building Healthy Relationships
- Clear communication
- Mutual respect
- Setting boundaries
- Honoring commitments
- Supporting each other
- Growing together

## Creating Your Support Network
1. List 3-5 trusted people
2. Identify professional resources
3. Research community groups
4. Schedule first meeting
5. Be open and honest
6. Nurture relationships

## What to Say When Asking for Help
"I'm going through a challenging time and would appreciate your support. I'm working on [goal], and I'd value your perspective/friendship/advice."
        `,
        type: "interactive",
        duration: "55 min"
      }
    ]
  }
];

export function getCourseContent(courseId: string): CourseContent | undefined {
  return courseContents.find(c => c.courseId === courseId);
}

export function getLesson(courseId: string, lessonId: string): Lesson | undefined {
  const course = getCourseContent(courseId);
  return course?.lessons.find(l => l.id === lessonId);
}

export function getAllCourseLessons(courseId: string): Lesson[] {
  const course = getCourseContent(courseId);
  return course?.lessons || [];
}
