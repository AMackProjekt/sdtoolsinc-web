-- FINANCIAL MANAGEMENT COURSE
-- 6-week FREE course in Personal Growth program

-- First, ensure we have the Personal Growth program
-- If it doesn't exist, create it
INSERT INTO programs (id, name, description, overview, thumbnail, duration, level, target_audience, outcomes, color)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',  -- Fixed UUID for consistency
  'Personal Growth',
  'Personal development and life skills courses',
  'Build essential life skills for success in career and personal life',
  '/images/programs/personal-growth.jpg',
  'Self-paced',
  'Beginner',
  'All participants seeking personal development',
  '["Financial literacy", "Goal setting", "Personal development", "Life skills"]'::jsonb,
  '#8b5cf6'
)
ON CONFLICT (id) DO NOTHING;

-- Insert the Financial Management course
INSERT INTO courses (
  id,
  title,
  description,
  program_id,
  type,
  level,
  duration,
  thumbnail,
  outline,
  prerequisites,
  credits,
  instructors,
  schedule
) VALUES (
  'fm-2024-001',  -- Fixed ID for consistency
  'Financial Management Essentials',
  'Master the fundamentals of personal finance, budgeting, credit building, and financial goal setting. This comprehensive 6-week course provides practical tools and strategies for financial wellness.',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',  -- Personal Growth program
  'online',
  'Beginner',
  '6 weeks',
  '/images/courses/financial-management.jpg',
  '{
    "pricing": "FREE",
    "weeks": 6,
    "hoursPerWeek": "2-3",
    "materials": ["Budget templates", "Credit building guide", "Financial planning worksheets"],
    "highlights": [
      "Create a personal budget",
      "Build and improve credit score",
      "Establish emergency fund",
      "Develop debt reduction strategy",
      "Set SMART financial goals"
    ]
  }'::jsonb,
  '[]'::jsonb,
  0,
  '["Financial Literacy Specialist", "Community Financial Counselor"]'::jsonb,
  '{
    "format": "Self-paced with weekly modules",
    "access": "24/7 online access",
    "support": "Forum and case manager assistance available"
  }'::jsonb
);

-- Lesson 1: Financial Wellness Foundation
INSERT INTO lessons (
  id,
  course_id,
  title,
  description,
  video_url,
  duration,
  content,
  resources,
  lesson_order
) VALUES (
  'fm-lesson-001',
  'fm-2024-001',
  'Financial Wellness Foundation',
  'Understand the core principles of financial wellness and assess your current financial health.',
  '/videos/lessons/financial-wellness.mp4',
  45,
  '# Financial Wellness Foundation

## Learning Objectives
- Define financial wellness and its key components
- Assess your current financial situation
- Identify financial stressors and opportunities
- Set the foundation for financial transformation

## Core Concepts

### What is Financial Wellness?
Financial wellness is the state of having control over your day-to-day and month-to-month finances, the capacity to absorb financial shocks, being on track to meet your financial goals, and having the financial freedom to make choices that allow you to enjoy life.

### The Four Pillars of Financial Wellness
1. **Spending**: Living within your means
2. **Saving**: Building emergency and goal-based savings
3. **Borrowing**: Using credit responsibly
4. **Planning**: Setting and achieving financial goals

## Financial Health Assessment

Take time to honestly evaluate:
- Current income and expenses
- Debt levels and types
- Savings and assets
- Financial goals and timeline
- Risk factors and concerns

## Key Takeaways
- Financial wellness is achievable for everyone
- Small, consistent steps lead to significant change
- Understanding your starting point is crucial
- Professional support is available and valuable',
  '[
    {
      "id": "fw-template-001",
      "title": "Financial Health Assessment Worksheet",
      "url": "/resources/financial-health-assessment.pdf",
      "type": "pdf"
    },
    {
      "id": "fw-tool-001",
      "title": "Financial Wellness Calculator",
      "url": "/tools/financial-wellness-calculator",
      "type": "link"
    }
  ]'::jsonb,
  1
);

-- Lesson 2: Budgeting Basics
INSERT INTO lessons (
  id,
  course_id,
  title,
  description,
  video_url,
  duration,
  content,
  resources,
  lesson_order
) VALUES (
  'fm-lesson-002',
  'fm-2024-001',
  'Budgeting Basics',
  'Learn proven budgeting methods and create your personalized budget plan.',
  '/videos/lessons/budgeting-basics.mp4',
  50,
  '# Budgeting Basics

## Learning Objectives
- Understand different budgeting methods
- Track income and expenses accurately
- Create a realistic monthly budget
- Adjust spending to align with priorities

## Popular Budgeting Methods

### 50/30/20 Rule
- 50% Needs (housing, food, utilities)
- 30% Wants (entertainment, dining out)
- 20% Savings and debt payment

### Zero-Based Budget
Every dollar has a purpose, income minus expenses equals zero.

### Envelope System
Allocate cash to category envelopes for controlled spending.

## Creating Your Budget

### Step 1: Calculate Total Income
List all income sources (after taxes)

### Step 2: List Fixed Expenses
- Rent/mortgage
- Utilities
- Insurance
- Loan payments

### Step 3: Track Variable Expenses
- Groceries
- Transportation
- Personal care
- Entertainment

### Step 4: Set Savings Goals
Pay yourself first - automate savings

### Step 5: Review and Adjust
Monitor monthly and adapt as needed

## Budgeting Tips
- Use apps or spreadsheets for tracking
- Review spending weekly
- Build in a buffer for unexpected expenses
- Celebrate small wins
- Don''t be too restrictive - balance is key',
  '[
    {
      "id": "bb-template-001",
      "title": "Monthly Budget Template (Excel)",
      "url": "/resources/monthly-budget-template.xlsx",
      "type": "document"
    },
    {
      "id": "bb-template-002",
      "title": "50/30/20 Budget Planner",
      "url": "/resources/503020-budget-planner.pdf",
      "type": "pdf"
    },
    {
      "id": "bb-guide-001",
      "title": "Expense Tracking Guide",
      "url": "/resources/expense-tracking-guide.pdf",
      "type": "pdf"
    }
  ]'::jsonb,
  2
);

-- Lesson 3: Credit Building Strategies
INSERT INTO lessons (
  id,
  course_id,
  title,
  description,
  video_url,
  duration,
  content,
  resources,
  lesson_order
) VALUES (
  'fm-lesson-003',
  'fm-2024-001',
  'Credit Building Strategies',
  'Understand credit scores, reports, and proven strategies to build and improve credit.',
  '/videos/lessons/credit-building.mp4',
  55,
  '# Credit Building Strategies

## Learning Objectives
- Understand how credit scores work
- Learn what factors affect credit scores
- Develop strategies to build credit
- Identify and dispute credit report errors

## Credit Score Basics

### FICO Score Ranges
- 800-850: Exceptional
- 740-799: Very Good
- 670-739: Good
- 580-669: Fair
- 300-579: Poor

### Credit Score Factors
1. **Payment History (35%)** - Most important factor
2. **Credit Utilization (30%)** - Debt-to-credit ratio
3. **Credit History Length (15%)** - Age of accounts
4. **Credit Mix (10%)** - Variety of account types
5. **New Credit (10%)** - Recent inquiries and accounts

## Building Credit Strategies

### For Those Starting Out
- Secured credit card
- Credit builder loan
- Become authorized user
- Consider student credit card

### For Those Rebuilding
- Pay all bills on time (set up autopay)
- Keep credit utilization under 30%
- Don''t close old accounts
- Dispute errors on credit report
- Diversify credit types over time

## Credit Report Rights
- Free annual credit report from each bureau
- Dispute inaccurate information
- Add explanatory statements
- Freeze credit to prevent identity theft

## Red Flags to Avoid
- Co-signing loans (unless carefully considered)
- Maxing out credit cards
- Applying for too many cards at once
- Paying only minimum payments
- Closing oldest credit accounts

## Long-term Credit Health
Building good credit is a marathon, not a sprint. Consistent, responsible behavior over time yields the best results.',
  '[
    {
      "id": "cb-guide-001",
      "title": "Credit Score Improvement Guide",
      "url": "/resources/credit-improvement-guide.pdf",
      "type": "pdf"
    },
    {
      "id": "cb-template-001",
      "title": "Credit Report Dispute Letter Template",
      "url": "/resources/credit-dispute-letter.docx",
      "type": "document"
    },
    {
      "id": "cb-link-001",
      "title": "Free Annual Credit Report",
      "url": "https://www.annualcreditreport.com",
      "type": "link"
    }
  ]'::jsonb,
  3
);

-- Lesson 4: Emergency Funds & Savings
INSERT INTO lessons (
  id,
  course_id,
  title,
  description,
  video_url,
  duration,
  content,
  resources,
  lesson_order
) VALUES (
  'fm-lesson-004',
  'fm-2024-001',
  'Emergency Funds & Savings',
  'Build financial resilience through emergency savings and smart saving strategies.',
  '/videos/lessons/emergency-funds.mp4',
  45,
  '# Emergency Funds & Savings

## Learning Objectives
- Understand the importance of emergency funds
- Calculate your emergency fund target
- Develop a savings strategy
- Explore high-yield savings options

## Why Emergency Funds Matter

Life is unpredictable. Emergency funds provide:
- Financial cushion for unexpected expenses
- Reduced stress and anxiety
- Prevention of debt accumulation
- Freedom to handle crises without panic

## Emergency Fund Goals

### Starter Emergency Fund
**Goal:** $500-$1,000
**Purpose:** Small emergencies and urgent repairs

### Basic Emergency Fund
**Goal:** 1 month of expenses
**Purpose:** Larger emergencies, brief income disruption

### Full Emergency Fund
**Goal:** 3-6 months of expenses
**Purpose:** Job loss, major medical issues, significant repairs

## Building Your Emergency Fund

### Step 1: Start Small
Even $5-10 per week adds up over time.

### Step 2: Automate Savings
Set up automatic transfers to savings account.

### Step 3: Save Windfalls
Tax refunds, bonuses, gifts → emergency fund

### Step 4: Reduce Expenses
Find areas to cut and redirect to savings.

### Step 5: Increase Income
Side gigs, overtime, selling unused items

## Best Practices

### Where to Keep Emergency Funds
- High-yield savings account
- Money market account
- Separate from checking (less temptation)
- FDIC insured institution
- Easy access (no penalties)

### What Counts as Emergency
✅ Medical emergencies
✅ Car repairs (if needed for work)
✅ Home repairs (urgent)
✅ Job loss
✅ Unexpected travel (family emergency)

❌ Vacation
❌ New gadgets
❌ Holiday shopping
❌ Routine expenses

## Savings Challenges
- 52-week challenge (save week number in dollars)
- $5 challenge (save every $5 bill you receive)
- Round-up apps (round purchases, save difference)
- No-spend challenges (one month category freeze)',
  '[
    {
      "id": "ef-calculator-001",
      "title": "Emergency Fund Calculator",
      "url": "/tools/emergency-fund-calculator",
      "type": "link"
    },
    {
      "id": "ef-template-001",
      "title": "Savings Goal Tracker",
      "url": "/resources/savings-goal-tracker.pdf",
      "type": "pdf"
    },
    {
      "id": "ef-guide-001",
      "title": "52-Week Savings Challenge",
      "url": "/resources/52-week-challenge.pdf",
      "type": "pdf"
    }
  ]'::jsonb,
  4
);

-- Lesson 5: Debt Management
INSERT INTO lessons (
  id,
  course_id,
  title,
  description,
  video_url,
  duration,
  content,
  resources,
  lesson_order
) VALUES (
  'fm-lesson-005',
  'fm-2024-001',
  'Debt Management',
  'Develop effective strategies to pay down debt and avoid future debt traps.',
  '/videos/lessons/debt-management.mp4',
  50,
  '# Debt Management

## Learning Objectives
- Understand different types of debt
- Learn debt payoff strategies
- Avoid common debt traps
- Negotiate with creditors when needed

## Types of Debt

### "Good" Debt (Can Build Wealth)
- Student loans (education investment)
- Mortgage (home equity building)
- Business loans (income generation)

### "Bad" Debt (High Interest, No Asset)
- Credit card balances
- Payday loans
- Title loans
- High-interest personal loans

## Debt Payoff Strategies

### Debt Snowball Method
**Strategy:** Pay off smallest balance first
**Pros:** Quick wins, motivation boost
**Best for:** Those needing encouragement

1. List debts smallest to largest
2. Pay minimums on all except smallest
3. Attack smallest with extra payments
4. Roll payment to next debt when paid off

### Debt Avalanche Method
**Strategy:** Pay off highest interest first
**Pros:** Saves most money on interest
**Best for:** Math-focused individuals

1. List debts highest to lowest interest rate
2. Pay minimums on all except highest rate
3. Attack highest rate with extra payments
4. Roll payment to next debt when paid off

### Debt Consolidation
Combine multiple debts into single payment
**Consider when:**
- Multiple high-interest debts
- Lower interest rate available
- Simplification needed
**Caution:** Doesn''t address root spending issues

## Working with Creditors

### If You''re Struggling
1. Contact creditors proactively
2. Explain your situation honestly
3. Request hardship programs
4. Negotiate payment plans
5. Ask about interest rate reduction

### Debt Settlement
Last resort option - negotiate reduced payoff
**Warning:** Impacts credit score significantly

## Avoiding Debt Traps

### Payday Loans
- Extremely high APR (300%+)
- Cycle of borrowing
- Seek alternatives: community assistance, payment plans

### Credit Card Minimum Payments
Only paying minimums = years of debt
Always pay more when possible

### Lifestyle Inflation
Don''t increase spending with income increases
Instead: increase debt payments and savings

## Prevention Strategies
- Use cash or debit for discretionary spending
- Implement 24-hour rule for purchases
- Build emergency fund to prevent new debt
- Track spending religiously
- Avoid buy-now-pay-later schemes',
  '[
    {
      "id": "dm-calculator-001",
      "title": "Debt Payoff Calculator",
      "url": "/tools/debt-payoff-calculator",
      "type": "link"
    },
    {
      "id": "dm-template-001",
      "title": "Debt Inventory Worksheet",
      "url": "/resources/debt-inventory.xlsx",
      "type": "document"
    },
    {
      "id": "dm-guide-001",
      "title": "Creditor Negotiation Scripts",
      "url": "/resources/creditor-negotiation-guide.pdf",
      "type": "pdf"
    }
  ]'::jsonb,
  5
);

-- Lesson 6: Goal Setting & Financial Planning
INSERT INTO lessons (
  id,
  course_id,
  title,
  description,
  video_url,
  duration,
  content,
  resources,
  lesson_order
) VALUES (
  'fm-lesson-006',
  'fm-2024-001',
  'Goal Setting & Financial Planning',
  'Create a comprehensive financial plan with SMART goals for short-term and long-term success.',
  '/videos/lessons/goal-setting.mp4',
  50,
  '# Goal Setting & Financial Planning

## Learning Objectives
- Set SMART financial goals
- Create short and long-term plans
- Develop action steps for goal achievement
- Monitor and adjust financial plans

## SMART Financial Goals

### S - Specific
"Save money" → "Save $5,000 for emergency fund"

### M - Measurable
Track progress with concrete numbers

### A - Achievable
Realistic given current income and expenses

### R - Relevant
Aligns with your values and priorities

### T - Time-bound
Set clear deadline for completion

## Goal Categories

### Short-Term Goals (0-2 years)
- Build $1,000 emergency fund
- Pay off credit card
- Save for specific purchase
- Improve credit score by 50 points

### Medium-Term Goals (2-5 years)
- Save house down payment
- Pay off student loans
- Build 6-month emergency fund
- Start retirement savings

### Long-Term Goals (5+ years)
- Retirement planning
- Child''s education fund
- Pay off mortgage
- Achieve financial independence

## Creating Your Financial Plan

### Step 1: Vision
What does financial success look like for you?

### Step 2: Current State
Where are you now financially?

### Step 3: Goal Setting
What specific goals will get you there?

### Step 4: Action Plan
What steps are needed for each goal?

### Step 5: Timeline
When will you achieve each milestone?

### Step 6: Monitor & Adjust
Review quarterly, adjust as needed

## Action Planning Template

**Goal:** Save $5,000 emergency fund in 12 months

**Monthly Target:** $417/month

**Action Steps:**
1. Open high-yield savings account
2. Set up automatic transfer of $417/month
3. Save all tax refunds/bonuses
4. Reduce dining out by $100/month
5. Sell unused items for extra $200

**Milestones:**
- Month 3: $1,250 saved
- Month 6: $2,500 saved
- Month 9: $3,750 saved
- Month 12: $5,000 achieved!

## Staying Motivated

### Visual Progress Tracking
- Charts and graphs
- Thermometer goal tracker
- Milestone celebrations

### Accountability
- Share goals with trusted friend
- Join financial community
- Regular check-ins with case manager

### Reward System
Set mini-rewards for milestones (budget-friendly)

## Common Obstacles & Solutions

**Obstacle:** Unexpected expenses
**Solution:** Build buffer in budget, maintain starter emergency fund

**Obstacle:** Lack of motivation
**Solution:** Connect goals to deeper values, visualize success

**Obstacle:** Income limitations
**Solution:** Focus on expense reduction, explore income增加opportunities

**Obstacle:** Setbacks
**Solution:** Don''t give up! Adjust timeline, recommit to plan

## Next Steps After Course

1. Complete financial plan worksheet
2. Schedule monthly money dates (self-review)
3. Connect with financial counselor for guidance
4. Join T.O.O.L.S financial wellness community
5. Continue learning and growing

## Congratulations!
You''ve completed the Financial Management Essentials course. You now have the knowledge and tools to take control of your financial future. Remember: financial wellness is a journey, not a destination. Keep learning, stay committed, and don''t hesitate to seek support when needed.

**Your financial transformation starts today!**',
  '[
    {
      "id": "gs-template-001",
      "title": "SMART Goals Worksheet",
      "url": "/resources/smart-goals-worksheet.pdf",
      "type": "pdf"
    },
    {
      "id": "gs-template-002",
      "title": "Financial Plan Template",
      "url": "/resources/financial-plan-template.xlsx",
      "type": "document"
    },
    {
      "id": "gs-guide-001",
      "title": "Vision Board Guide",
      "url": "/resources/financial-vision-board-guide.pdf",
      "type": "pdf"
    },
    {
      "id": "gs-calculator-001",
      "title": "Goal Timeline Calculator",
      "url": "/tools/goal-timeline-calculator",
      "type": "link"
    }
  ]'::jsonb,
  6
);

-- Add comment for course metadata
COMMENT ON COLUMN courses.outline IS 'For free courses, include {"pricing": "FREE"} in outline JSON';
