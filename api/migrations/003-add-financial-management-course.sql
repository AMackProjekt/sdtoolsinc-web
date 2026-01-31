-- Add Financial Management Course
-- This is a FREE comprehensive financial education course

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
)
VALUES (
  'f1234567-89ab-cdef-0123-456789abcdef',
  'Financial Management Mastery',
  'Comprehensive FREE course covering budgeting, credit management, banking, taxes, and long-term financial planning',
  'a1b2c3d4-e5f6-4a5b-8c7d-9e8f7d6c5b4a', -- Reentry & Resettlement Program
  'online',
  'Beginner',
  '6 weeks',
  '💳',
  '{
    "overview": "This comprehensive FREE course provides essential financial management skills for long-term success. Learn to budget effectively, manage credit, understand banking, navigate taxes, and plan for your financial future.",
    "objectives": [
      "Create and maintain a comprehensive personal budget",
      "Understand and improve your credit score",
      "Navigate banking products and services effectively",
      "Prepare and file basic tax returns",
      "Develop a long-term financial plan",
      "Build emergency savings and reduce debt",
      "Make informed financial decisions with confidence"
    ],
    "topics": [
      "Budgeting fundamentals and expense tracking",
      "Income management and cash flow",
      "Understanding credit scores and credit reports",
      "Credit building and repair strategies",
      "Debt management and payoff strategies",
      "Banking basics: checking, savings, and online banking",
      "Understanding bank fees and how to avoid them",
      "Tax basics for individuals",
      "Tax deductions and credits",
      "Filing tax returns (Form 1040)",
      "Emergency fund creation",
      "Retirement planning basics",
      "Investment fundamentals",
      "Financial goal setting and planning",
      "Avoiding financial scams and fraud"
    ],
    "requirements": [
      "No prior financial knowledge required",
      "Access to computer or smartphone",
      "Calculator or spreadsheet software"
    ],
    "materials": [
      "Budget planning worksheet",
      "Credit score tracker",
      "Banking comparison guide",
      "Tax preparation checklist",
      "Financial goal worksheet",
      "Emergency fund calculator",
      "Debt payoff calculator",
      "Sample budget templates",
      "Financial planning resources"
    ],
    "assessmentMethod": "Complete personal budget + credit improvement plan + tax basics quiz",
    "cost": "FREE",
    "certificateEligible": true
  }'::jsonb,
  '[]'::jsonb,
  4,
  '["James Williams, CFP", "Maria Rodriguez, CPA"]'::jsonb,
  '{
    "format": "Self-paced online",
    "availability": "24/7 access",
    "supportHours": "Mon-Fri 9am-5pm PST"
  }'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  outline = EXCLUDED.outline,
  updated_at = NOW();

-- Add Lessons for Financial Management Course
INSERT INTO lessons (course_id, title, description, video_url, duration, content, resources, lesson_order)
VALUES
  (
    'f1234567-89ab-cdef-0123-456789abcdef',
    'Introduction to Personal Finance',
    'Understanding your financial situation and setting goals',
    '/videos/finance/lesson-1.mp4',
    30,
    '# Welcome to Financial Management Mastery

## What You''ll Learn
This lesson introduces you to the fundamentals of personal finance and helps you assess your current financial situation.

## Key Concepts
- Understanding income and expenses
- Calculating net worth
- Setting SMART financial goals
- The importance of financial literacy

## Your Current Financial Picture
Take time to gather information about:
- All sources of income
- Monthly expenses
- Debts and obligations
- Assets and savings

## Setting Financial Goals
Learn to set:
- Short-term goals (1 year)
- Medium-term goals (1-5 years)
- Long-term goals (5+ years)

## Activity
Complete the financial assessment worksheet to understand where you are today.',
    '[
      {"title": "Financial Assessment Worksheet", "url": "/resources/financial-assessment.pdf"},
      {"title": "Goal Setting Guide", "url": "/resources/goal-setting.pdf"},
      {"title": "Net Worth Calculator", "url": "/resources/net-worth-calculator.xlsx"}
    ]'::jsonb,
    1
  ),
  (
    'f1234567-89ab-cdef-0123-456789abcdef',
    'Budgeting Fundamentals',
    'Create a realistic budget that works for your lifestyle',
    '/videos/finance/lesson-2.mp4',
    45,
    '# Creating Your Personal Budget

## Why Budget?
A budget is your financial roadmap. It helps you:
- Track where your money goes
- Plan for expenses
- Save for goals
- Avoid debt

## The 50/30/20 Rule
- 50% Needs (housing, food, utilities)
- 30% Wants (entertainment, dining out)
- 20% Savings and debt repayment

## Budget Categories
### Fixed Expenses
- Rent/mortgage
- Insurance
- Car payment
- Phone bill

### Variable Expenses
- Groceries
- Gas
- Entertainment
- Dining out

### Irregular Expenses
- Car maintenance
- Medical bills
- Gifts
- Clothing

## Zero-Based Budgeting
Every dollar has a job. Income minus expenses should equal zero.

## Activity
Create your first monthly budget using the provided template.',
    '[
      {"title": "Monthly Budget Template", "url": "/resources/budget-template.xlsx"},
      {"title": "Budget Categories Guide", "url": "/resources/budget-categories.pdf"},
      {"title": "Expense Tracking App Recommendations", "url": "/resources/budget-apps.pdf"}
    ]'::jsonb,
    2
  ),
  (
    'f1234567-89ab-cdef-0123-456789abcdef',
    'Understanding Credit',
    'Learn how credit works and how to improve your score',
    '/videos/finance/lesson-3.mp4',
    40,
    '# Credit Scores and Credit Reports

## What is Credit?
Credit is borrowed money that you must repay with interest. Your credit history determines your creditworthiness.

## Credit Score Basics
- Range: 300-850
- Excellent: 750+
- Good: 700-749
- Fair: 650-699
- Poor: Below 650

## Factors Affecting Your Score
1. Payment History (35%)
2. Credit Utilization (30%)
3. Length of Credit History (15%)
4. New Credit (10%)
5. Credit Mix (10%)

## How to Check Your Credit
- AnnualCreditReport.com (free annual reports)
- Credit monitoring services
- Credit card providers

## Improving Your Credit
- Pay bills on time
- Keep credit utilization below 30%
- Don''t close old accounts
- Dispute errors on your report
- Become an authorized user

## Activity
Request your free credit report and review it for errors.',
    '[
      {"title": "Credit Report Guide", "url": "/resources/credit-report-guide.pdf"},
      {"title": "Credit Score Factors Infographic", "url": "/resources/credit-score-factors.png"},
      {"title": "Credit Improvement Plan", "url": "/resources/credit-improvement-plan.pdf"}
    ]'::jsonb,
    3
  ),
  (
    'f1234567-89ab-cdef-0123-456789abcdef',
    'Banking and Financial Services',
    'Navigate checking accounts, savings accounts, and banking services',
    '/videos/finance/lesson-4.mp4',
    35,
    '# Banking Essentials

## Types of Bank Accounts
### Checking Accounts
- For daily transactions
- Debit card access
- Bill pay features
- Minimum balance requirements

### Savings Accounts
- For emergency funds and goals
- Earns interest
- Limited transactions
- FDIC insured up to $250,000

### Money Market Accounts
- Higher interest rates
- Check writing privileges
- Higher minimum balance

## Choosing a Bank
Consider:
- Fees and charges
- ATM network
- Online/mobile banking
- Customer service
- Branch locations

## Avoiding Bank Fees
- Maintain minimum balance
- Use in-network ATMs
- Set up direct deposit
- Opt out of overdraft protection
- Monitor your account regularly

## Online Banking
- Mobile check deposit
- Bill pay
- Account alerts
- Money transfers

## Financial Safety
- Protect your PIN
- Monitor for fraud
- Use strong passwords
- Enable two-factor authentication

## Activity
Compare three banks and choose the best fit for your needs.',
    '[
      {"title": "Banking Comparison Chart", "url": "/resources/bank-comparison.xlsx"},
      {"title": "Bank Fee Checklist", "url": "/resources/bank-fees.pdf"},
      {"title": "Online Banking Security Guide", "url": "/resources/online-banking-security.pdf"}
    ]'::jsonb,
    4
  ),
  (
    'f1234567-89ab-cdef-0123-456789abcdef',
    'Tax Basics for Individuals',
    'Understanding taxes, deductions, and filing your return',
    '/videos/finance/lesson-5.mp4',
    50,
    '# Understanding Personal Taxes

## Why Pay Taxes?
Taxes fund public services:
- Roads and infrastructure
- Public education
- Emergency services
- Social programs

## Types of Taxes
- Income tax (federal and state)
- Payroll tax (Social Security, Medicare)
- Sales tax
- Property tax

## Income Tax Basics
### Tax Filing Status
- Single
- Married filing jointly
- Married filing separately
- Head of household
- Qualifying widow(er)

### Tax Forms
- W-2: Employment income
- 1099: Contract/freelance income
- Form 1040: Individual tax return

## Deductions and Credits
### Standard Deduction
- Single: $13,850 (2023)
- Married: $27,700 (2023)

### Common Credits
- Earned Income Tax Credit (EITC)
- Child Tax Credit
- Education credits

## Tax Withholding
- W-4 form determines withholding
- Adjust throughout the year
- Avoid large refunds or bills

## Filing Your Return
1. Gather documents (W-2s, 1099s)
2. Choose filing method (online, paper, tax preparer)
3. Complete Form 1040
4. Claim deductions and credits
5. Calculate tax owed or refund
6. File by April 15

## Free Filing Options
- IRS Free File
- VITA (Volunteer Income Tax Assistance)
- Tax preparation software

## Activity
Complete a practice Form 1040 with sample data.',
    '[
      {"title": "Tax Filing Checklist", "url": "/resources/tax-checklist.pdf"},
      {"title": "Common Tax Deductions", "url": "/resources/tax-deductions.pdf"},
      {"title": "Tax Preparation Guide", "url": "/resources/tax-prep-guide.pdf"},
      {"title": "IRS Free File Information", "url": "https://www.irs.gov/freefile"}
    ]'::jsonb,
    5
  ),
  (
    'f1234567-89ab-cdef-0123-456789abcdef',
    'Building Your Financial Future',
    'Emergency funds, debt management, and long-term planning',
    '/videos/finance/lesson-6.mp4',
    55,
    '# Long-Term Financial Planning

## Emergency Fund
Why you need one:
- Job loss
- Medical emergencies
- Car repairs
- Unexpected expenses

Target: 3-6 months of expenses

### Building Your Fund
1. Start with $500-$1,000
2. Save consistently each month
3. Keep in high-yield savings
4. Don''t touch except for emergencies

## Debt Management
### Debt Payoff Strategies
**Debt Snowball**
- Pay smallest debt first
- Motivating quick wins
- May pay more interest

**Debt Avalanche**
- Pay highest interest first
- Saves the most money
- Requires patience

### Avoiding New Debt
- Live within your means
- Use cash or debit
- Think before borrowing

## Retirement Planning
### Why Start Early
- Compound interest
- Employer matching
- Tax advantages

### Retirement Accounts
- 401(k)
- IRA (Traditional and Roth)
- Social Security

### How Much to Save
Target: 10-15% of income

## Investment Basics
- Stocks
- Bonds
- Mutual funds
- Index funds
- Risk vs. return

## Financial Goals Review
- Short-term (emergency fund)
- Medium-term (down payment, car)
- Long-term (retirement, education)

## Staying on Track
- Review budget monthly
- Check credit annually
- Adjust goals as needed
- Celebrate milestones

## Activity
Create your comprehensive financial plan with goals, budget, and action steps.',
    '[
      {"title": "Emergency Fund Calculator", "url": "/resources/emergency-fund-calc.xlsx"},
      {"title": "Debt Payoff Calculator", "url": "/resources/debt-payoff-calc.xlsx"},
      {"title": "Retirement Planning Guide", "url": "/resources/retirement-planning.pdf"},
      {"title": "Financial Plan Template", "url": "/resources/financial-plan-template.pdf"}
    ]'::jsonb,
    6
  );

-- Update courses to mark Financial Management as free and certificate-eligible
UPDATE courses 
SET outline = jsonb_set(
  jsonb_set(outline, '{cost}', '"FREE"'),
  '{certificateEligible}', 
  'true'
)
WHERE id = 'f1234567-89ab-cdef-0123-456789abcdef';
