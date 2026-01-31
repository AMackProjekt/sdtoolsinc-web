-- Add Financial Management Course to Database
-- This course is FREE and part of the Personal Growth & Development Program

-- First, get the Personal Growth & Development program ID
-- Use: 'c3d4e5f6-a7b8-4c7d-ae9f-1a0b9c8d7e6f'

INSERT INTO courses (id, title, description, program_id, type, level, duration, thumbnail, outline, prerequisites, credits, instructors, schedule)
VALUES (
  'f5e6d7c8-b9a0-4e9f-ca1b-3d2e4f5a6b7c',
  'Financial Management Fundamentals',
  'Learn essential money management skills including budgeting, saving, credit building, and financial planning. This FREE course helps you take control of your finances and build a stable financial future.',
  'c3d4e5f6-a7b8-4c7d-ae9f-1a0b9c8d7e6f',
  'online',
  'Beginner',
  '6 weeks',
  '💰',
  '{
    "overview": "This comprehensive course covers all aspects of personal financial management, from basic budgeting to long-term financial planning.",
    "objectives": [
      "Create and maintain a realistic budget",
      "Understand credit scores and how to improve them",
      "Develop savings strategies and emergency funds",
      "Learn about debt management and reduction",
      "Plan for long-term financial goals",
      "Understand banking basics and financial products"
    ],
    "topics": [
      "Introduction to Personal Finance",
      "Creating Your First Budget",
      "Understanding Income and Expenses",
      "Saving Strategies and Emergency Funds",
      "Credit Scores Explained",
      "Building and Repairing Credit",
      "Debt Management Techniques",
      "Banking Basics and Account Types",
      "Financial Goal Setting",
      "Introduction to Investing",
      "Protecting Your Financial Identity",
      "Planning for the Future"
    ],
    "requirements": ["Basic math skills", "Access to calculator or spreadsheet software"],
    "materials": [
      "Budget worksheet templates",
      "Credit score tracking tools",
      "Financial goal planning worksheets",
      "Debt payoff calculators"
    ]
  }'::jsonb,
  '[]'::jsonb,
  3,
  '["Sarah Martinez, Certified Financial Counselor", "David Thompson, Financial Literacy Coach"]'::jsonb,
  '{
    "format": "Self-paced online",
    "access": "Lifetime access to materials",
    "support": "Email support available",
    "certification": "Certificate upon completion"
  }'::jsonb
);

-- Add sample lessons for Financial Management course
INSERT INTO lessons (course_id, title, description, video_url, duration, content, resources, lesson_order)
VALUES
  (
    'f5e6d7c8-b9a0-4e9f-ca1b-3d2e4f5a6b7c',
    'Introduction to Financial Wellness',
    'Understanding the fundamentals of financial health and why it matters for your future success.',
    null,
    25,
    'In this introductory lesson, we explore what financial wellness means and why it''s crucial for overall life stability. We''ll discuss common financial challenges faced by individuals in reentry, strategies to overcome them, and the mindset shifts needed for financial success.

Key Topics Covered:
- What is financial wellness?
- Common financial barriers and how to overcome them
- The psychology of money management
- Setting yourself up for financial success
- Creating a financial wellness action plan

By the end of this lesson, you''ll understand the foundation of good financial management and be ready to take control of your financial future.',
    '[
      {
        "id": "r1",
        "title": "Financial Wellness Checklist",
        "url": "/resources/financial-wellness-checklist.pdf",
        "type": "pdf"
      },
      {
        "id": "r2",
        "title": "Money Mindset Quiz",
        "url": "/resources/money-mindset-quiz.pdf",
        "type": "pdf"
      }
    ]'::jsonb,
    1
  ),
  (
    'f5e6d7c8-b9a0-4e9f-ca1b-3d2e4f5a6b7c',
    'Creating Your First Budget',
    'Learn how to create a realistic budget that works for your lifestyle and helps you achieve your financial goals.',
    null,
    35,
    'Budgeting is the cornerstone of financial management. In this lesson, you''ll learn practical budgeting techniques that actually work in real life.

What You''ll Learn:
- The 50/30/20 budgeting rule
- Tracking your income and expenses
- Identifying unnecessary spending
- Creating budget categories that make sense
- Using budgeting apps and tools
- Adjusting your budget as life changes
- Tips for sticking to your budget

We''ll work through real examples and you''ll create your own budget by the end of this lesson.',
    '[
      {
        "id": "r1",
        "title": "Monthly Budget Template",
        "url": "/resources/monthly-budget-template.xlsx",
        "type": "document"
      },
      {
        "id": "r2",
        "title": "Expense Tracking Worksheet",
        "url": "/resources/expense-tracking.pdf",
        "type": "pdf"
      },
      {
        "id": "r3",
        "title": "Top Free Budgeting Apps",
        "url": "/resources/budgeting-apps-guide.pdf",
        "type": "pdf"
      }
    ]'::jsonb,
    2
  ),
  (
    'f5e6d7c8-b9a0-4e9f-ca1b-3d2e4f5a6b7c',
    'Understanding and Building Credit',
    'Demystify credit scores and learn proven strategies to build or rebuild your credit history.',
    null,
    30,
    'Credit scores can seem mysterious, but understanding how they work is essential for financial success. This lesson breaks down everything you need to know.

Topics Covered:
- What is a credit score and why does it matter?
- The 5 factors that affect your credit score
- How to check your credit report for free
- Common credit myths debunked
- Strategies to build credit from scratch
- Repairing damaged credit
- Secured credit cards and credit builder loans
- The impact of credit inquiries
- Dealing with collections and charge-offs

You''ll leave this lesson with a clear action plan for improving your credit score.',
    '[
      {
        "id": "r1",
        "title": "Credit Score Guide",
        "url": "/resources/credit-score-guide.pdf",
        "type": "pdf"
      },
      {
        "id": "r2",
        "title": "Credit Dispute Letter Template",
        "url": "/resources/credit-dispute-template.pdf",
        "type": "pdf"
      },
      {
        "id": "r3",
        "title": "Free Credit Report Resources",
        "url": "https://www.annualcreditreport.com",
        "type": "link"
      }
    ]'::jsonb,
    3
  ),
  (
    'f5e6d7c8-b9a0-4e9f-ca1b-3d2e4f5a6b7c',
    'Building Your Emergency Fund',
    'Learn the importance of emergency savings and practical strategies to build your financial safety net.',
    null,
    28,
    'An emergency fund is your financial safety net. This lesson teaches you how to build one, even on a tight budget.

What We''ll Cover:
- Why emergency funds are critical
- How much should you save?
- Starting small: the $1,000 emergency fund
- Automatic savings strategies
- Where to keep your emergency fund
- Rebuilding after using your fund
- Creative ways to boost your savings
- The psychology of not touching your emergency fund

Learn how to protect yourself from financial emergencies and unexpected expenses.',
    '[
      {
        "id": "r1",
        "title": "Emergency Fund Calculator",
        "url": "/resources/emergency-fund-calculator.xlsx",
        "type": "document"
      },
      {
        "id": "r2",
        "title": "52-Week Savings Challenge",
        "url": "/resources/52-week-savings.pdf",
        "type": "pdf"
      }
    ]'::jsonb,
    4
  ),
  (
    'f5e6d7c8-b9a0-4e9f-ca1b-3d2e4f5a6b7c',
    'Debt Management Strategies',
    'Effective strategies for managing and eliminating debt while maintaining financial stability.',
    null,
    32,
    'Debt can feel overwhelming, but with the right strategies, you can take control and become debt-free.

Lesson Highlights:
- Understanding good debt vs. bad debt
- The debt avalanche method
- The debt snowball method
- Negotiating with creditors
- Debt consolidation options
- When to consider bankruptcy (and when not to)
- Avoiding predatory lending and payday loans
- Staying debt-free long-term
- Building wealth while paying off debt

You''ll create a personalized debt payoff plan during this lesson.',
    '[
      {
        "id": "r1",
        "title": "Debt Payoff Calculator",
        "url": "/resources/debt-payoff-calculator.xlsx",
        "type": "document"
      },
      {
        "id": "r2",
        "title": "Creditor Negotiation Script",
        "url": "/resources/creditor-negotiation.pdf",
        "type": "pdf"
      },
      {
        "id": "r3",
        "title": "Debt Management Resources",
        "url": "/resources/debt-management-guide.pdf",
        "type": "pdf"
      }
    ]'::jsonb,
    5
  ),
  (
    'f5e6d7c8-b9a0-4e9f-ca1b-3d2e4f5a6b7c',
    'Financial Goal Setting and Future Planning',
    'Learn to set and achieve short-term and long-term financial goals for lasting financial security.',
    null,
    30,
    'Setting clear financial goals is the key to building the life you want. This lesson helps you create a roadmap for your financial future.

Topics Covered:
- SMART financial goal setting
- Short-term vs. long-term goals
- Creating a 5-year financial plan
- Introduction to retirement planning
- Understanding investing basics
- Creating multiple income streams
- Protecting your assets
- Teaching financial literacy to family
- Reviewing and adjusting your financial plan

End this course with a comprehensive financial action plan for your future.',
    '[
      {
        "id": "r1",
        "title": "Financial Goal Worksheet",
        "url": "/resources/financial-goals-worksheet.pdf",
        "type": "pdf"
      },
      {
        "id": "r2",
        "title": "5-Year Financial Plan Template",
        "url": "/resources/5-year-financial-plan.pdf",
        "type": "pdf"
      },
      {
        "id": "r3",
        "title": "Investment Basics Guide",
        "url": "/resources/investment-basics.pdf",
        "type": "pdf"
      }
    ]'::jsonb,
    6
  );

-- Mark this course as FREE in the course metadata (optional)
UPDATE courses 
SET outline = jsonb_set(
  outline, 
  '{pricing}', 
  '{"cost": "FREE", "value": "$299", "scholarship": "Fully funded for all participants"}'::jsonb
)
WHERE id = 'f5e6d7c8-b9a0-4e9f-ca1b-3d2e4f5a6b7c';
