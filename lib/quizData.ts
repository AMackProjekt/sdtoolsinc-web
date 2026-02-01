/**
 * Quiz System for T.O.O.L.S Inc Courses
 * Each course has a 25-question assessment
 * Questions cover key concepts from course materials
 */

export type Question = {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
};

export type Quiz = {
  courseId: string;
  courseName: string;
  description: string;
  totalQuestions: number;
  passingScore: number; // percentage (0-100)
  questions: Question[];
  estimatedTime: number; // in minutes
};

export type QuizAttempt = {
  id: string;
  courseId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  answers: (number | null)[]; // answer indices, null if unanswered
  score?: number; // percentage
  passed?: boolean;
};

/**
 * QUIZ 1: Job Readiness - 25 Questions
 */
export const jobReadinessQuiz: Quiz = {
  courseId: "job-readiness",
  courseName: "Job Readiness Essentials",
  description: "Master the fundamentals of preparing for employment success",
  totalQuestions: 25,
  passingScore: 70,
  estimatedTime: 45,
  questions: [
    {
      id: "jr-1",
      questionText: "What is the first step in your job search strategy?",
      options: [
        "Updating your resume",
        "Identifying your skills and interests",
        "Applying to 100 jobs online",
        "Calling employers randomly"
      ],
      correctAnswer: 1,
      explanation: "Starting with self-assessment helps you target the right opportunities aligned with your strengths and interests.",
      difficulty: "easy"
    },
    {
      id: "jr-2",
      questionText: "Which of these is NOT typically on a resume?",
      options: [
        "Contact information",
        "Work experience",
        "Social media passwords",
        "Education background"
      ],
      correctAnswer: 2,
      explanation: "Never share passwords or sensitive personal information on a resume. Keep it professional and relevant.",
      difficulty: "easy"
    },
    {
      id: "jr-3",
      questionText: "How should you prepare for a job interview?",
      options: [
        "Research the company",
        "Prepare answers to common questions",
        "Dress professionally",
        "All of the above"
      ],
      correctAnswer: 3,
      explanation: "Thorough interview preparation includes researching the company, practicing responses, and dressing appropriately.",
      difficulty: "easy"
    },
    {
      id: "jr-4",
      questionText: "What should you do if asked about your background during an interview?",
      options: [
        "Lie about your past",
        "Avoid the topic entirely",
        "Be honest and explain what you've learned",
        "Get defensive"
      ],
      correctAnswer: 2,
      explanation: "Honesty and showing growth is more impressive than deception. Employers value candidates who own their past and demonstrate positive change.",
      difficulty: "medium"
    },
    {
      id: "jr-5",
      questionText: "Which follow-up action is best after an interview?",
      options: [
        "Wait 2 weeks before contacting them",
        "Send a thank-you note within 24 hours",
        "Call them repeatedly",
        "Post about the interview on social media"
      ],
      correctAnswer: 1,
      explanation: "A prompt thank-you note shows professionalism and keeps you top-of-mind with hiring managers.",
      difficulty: "easy"
    },
    {
      id: "jr-6",
      questionText: "What's the appropriate dress code for your first job interview if it's not specified?",
      options: [
        "Business casual or business formal",
        "Whatever you wear daily",
        "Athleisure",
        "It doesn't matter"
      ],
      correctAnswer: 0,
      explanation: "When in doubt, dress professionally. You can always dress down, but you can't dress up at an interview.",
      difficulty: "easy"
    },
    {
      id: "jr-7",
      questionText: "How long should a typical cover letter be?",
      options: [
        "1-2 paragraphs",
        "Less than one page",
        "3-4 pages",
        "Cover letters are not needed"
      ],
      correctAnswer: 1,
      explanation: "A strong cover letter is concise—typically 3-4 paragraphs on less than one page.",
      difficulty: "medium"
    },
    {
      id: "jr-8",
      questionText: "What is the best way to handle a gap in your employment?",
      options: [
        "Hide it",
        "Explain it honestly and highlight what you did during the gap",
        "Make up a job",
        "Only mention recent jobs"
      ],
      correctAnswer: 1,
      explanation: "Employment gaps are common. Be straightforward and show what you accomplished during that time.",
      difficulty: "medium"
    },
    {
      id: "jr-9",
      questionText: "Which is a strong accomplishment to highlight on your resume?",
      options: [
        "I worked at a job for 2 years",
        "Led a team project that increased efficiency by 30%",
        "Had perfect attendance",
        "Got along with my coworkers"
      ],
      correctAnswer: 1,
      explanation: "Quantifiable achievements and demonstrated impact are more compelling than general statements.",
      difficulty: "medium"
    },
    {
      id: "jr-10",
      questionText: "What does networking mean in job searching?",
      options: [
        "Having many social media followers",
        "Building professional relationships with people in your field",
        "Attending every event",
        "Only talking to people online"
      ],
      correctAnswer: 1,
      explanation: "Networking is about building genuine professional relationships that can lead to job opportunities and mentorship.",
      difficulty: "medium"
    },
    {
      id: "jr-11",
      questionText: "How should you handle a difficult question in an interview?",
      options: [
        "Refuse to answer",
        "Pause, take a breath, and answer honestly and thoughtfully",
        "Answer with the first thing that comes to mind",
        "Ask the interviewer to skip it"
      ],
      correctAnswer: 1,
      explanation: "Taking time to think demonstrates professionalism. Honest, thoughtful answers are valued over rushed responses.",
      difficulty: "medium"
    },
    {
      id: "jr-12",
      questionText: "What should you avoid posting on social media when job hunting?",
      options: [
        "Career-focused content",
        "Negative comments, controversial content, or unprofessional photos",
        "Professional accomplishments",
        "All professional content"
      ],
      correctAnswer: 1,
      explanation: "Employers often check social media. Maintain a professional online presence to avoid damaging your candidacy.",
      difficulty: "easy"
    },
    {
      id: "jr-13",
      questionText: "What is a 'behavioral interview question'?",
      options: [
        "A question about your criminal history",
        "A question asking how you handled a specific situation in the past",
        "A question about your salary expectations",
        "A trick question"
      ],
      correctAnswer: 1,
      explanation: "Behavioral questions (like 'Tell me about a time...') help employers understand how you handle real situations.",
      difficulty: "medium"
    },
    {
      id: "jr-14",
      questionText: "What should you research about a company before an interview?",
      options: [
        "Employee gossip on social media",
        "Their mission, recent news, and why the role appeals to you",
        "Just show up prepared to listen",
        "Their competitor information"
      ],
      correctAnswer: 1,
      explanation: "Understanding a company's mission and recent news helps you ask intelligent questions and show genuine interest.",
      difficulty: "medium"
    },
    {
      id: "jr-15",
      questionText: "How many references should you provide?",
      options: [
        "As many as possible",
        "2-3 professional references who can speak to your abilities",
        "Just one boss",
        "You don't need references anymore"
      ],
      correctAnswer: 1,
      explanation: "2-3 quality references who can credibly speak to your work abilities is standard.",
      difficulty: "easy"
    },
    {
      id: "jr-16",
      questionText: "What should you do if you don't know the answer to an interview question?",
      options: [
        "Make something up",
        "Say you don't know and move on",
        "Honestly say you don't know but explain how you'd find the answer",
        "Ask them to repeat it several times"
      ],
      correctAnswer: 2,
      explanation: "Demonstrating problem-solving ability and honesty is better than pretending to know something you don't.",
      difficulty: "medium"
    },
    {
      id: "jr-17",
      questionText: "Which benefit is typically most important to emphasize when leaving a previous job?",
      options: [
        "You didn't like your boss",
        "Your commitment to your career growth and new opportunities",
        "Workplace gossip",
        "Salary alone"
      ],
      correctAnswer: 1,
      explanation: "Focus on positive reasons for career moves, emphasizing growth and new opportunities.",
      difficulty: "medium"
    },
    {
      id: "jr-18",
      questionText: "What's the best way to follow up after submitting an online application?",
      options: [
        "Spam their email daily",
        "Wait exactly 3 weeks",
        "If instructions allow, follow their specific directions; otherwise, give it 1-2 weeks",
        "Never follow up"
      ],
      correctAnswer: 2,
      explanation: "Respect instructions given. Generally, waiting 1-2 weeks before a professional follow-up is appropriate.",
      difficulty: "easy"
    },
    {
      id: "jr-19",
      questionText: "How should you approach salary negotiation?",
      options: [
        "Accept whatever they offer",
        "Research market rates and discuss confidently based on your value",
        "Demand much more than the posted range",
        "Never bring it up"
      ],
      correctAnswer: 1,
      explanation: "Research fair market rates for your role, experience level, and location. Negotiate respectfully based on data.",
      difficulty: "hard"
    },
    {
      id: "jr-20",
      questionText: "What makes a strong LinkedIn profile?",
      options: [
        "A professional photo and complete information",
        "Many connections without any actual profile content",
        "Controversial opinions",
        "Links to social media accounts only"
      ],
      correctAnswer: 0,
      explanation: "A professional headshot, complete job history, and compelling summary make a strong LinkedIn presence.",
      difficulty: "medium"
    },
    {
      id: "jr-21",
      questionText: "When should you start your job search after being released from incarceration?",
      options: [
        "After 6 months",
        "Immediately—the first 72 hours matter most",
        "After completing all programs",
        "When you feel completely ready"
      ],
      correctAnswer: 1,
      explanation: "The first 72 hours after reentry are critical. Starting your job search immediately demonstrates commitment and momentum.",
      difficulty: "hard"
    },
    {
      id: "jr-22",
      questionText: "How do you explain your background to an employer?",
      options: [
        "Minimize or avoid the topic",
        "Focus solely on your mistakes",
        "Be honest, show growth, and emphasize your strengths and rehabilitation",
        "Create a false narrative"
      ],
      correctAnswer: 2,
      explanation: "Honest, thoughtful disclosure combined with evidence of personal growth is most compelling and ethical.",
      difficulty: "hard"
    },
    {
      id: "jr-23",
      questionText: "Which of these is a FREE job search resource?",
      options: [
        "LinkedIn",
        "Your local library and workforce development agencies",
        "Indeed and other job boards",
        "All of the above"
      ],
      correctAnswer: 3,
      explanation: "Many free resources exist: job boards, libraries, workforce programs, and non-profits supporting reentry.",
      difficulty: "easy"
    },
    {
      id: "jr-24",
      questionText: "What's the value of getting a mentor in your field?",
      options: [
        "Mentors are unnecessary",
        "Industry insights, career guidance, and accountability",
        "Only for people without experience",
        "It's too complicated to arrange"
      ],
      correctAnswer: 1,
      explanation: "Mentors provide valuable guidance, help you avoid pitfalls, and expand your professional network.",
      difficulty: "medium"
    },
    {
      id: "jr-25",
      questionText: "What's the ultimate goal of your job search process?",
      options: [
        "Getting any job quickly",
        "Finding a role where you can contribute, grow, and build a career path",
        "Making the most money possible",
        "Just keeping yourself occupied"
      ],
      correctAnswer: 1,
      explanation: "The best job search results in roles where you can grow, contribute meaningfully, and build sustainable career paths.",
      difficulty: "hard"
    }
  ]
};

/**
 * QUIZ 2: Financial Literacy - 25 Questions
 */
export const financialLiteracyQuiz: Quiz = {
  courseId: "financial-literacy",
  courseName: "Financial Literacy for Fresh Starts",
  description: "Build a strong financial foundation for your future",
  totalQuestions: 25,
  passingScore: 70,
  estimatedTime: 45,
  questions: [
    {
      id: "fl-1",
      questionText: "What is a budget?",
      options: [
        "A list of your dreams",
        "A plan for how you'll spend your money",
        "Something only rich people need",
        "A punishment for bad financial habits"
      ],
      correctAnswer: 1,
      explanation: "A budget is a practical plan that helps you control spending and reach financial goals.",
      difficulty: "easy"
    },
    {
      id: "fl-2",
      questionText: "What should be your first financial priority after reentry?",
      options: [
        "Buying luxury items",
        "Establishing housing and meeting basic needs",
        "Investing in the stock market",
        "Taking out a large loan"
      ],
      correctAnswer: 1,
      explanation: "Meeting basic needs like stable housing is the foundation for financial stability.",
      difficulty: "easy"
    },
    {
      id: "fl-3",
      questionText: "What is an emergency fund?",
      options: [
        "Money for celebrations",
        "Savings set aside for unexpected expenses",
        "Money you must spend immediately",
        "Only for wealthy people"
      ],
      correctAnswer: 1,
      explanation: "An emergency fund (ideally 3-6 months of expenses) prevents financial crisis when unexpected costs arise.",
      difficulty: "easy"
    },
    {
      id: "fl-4",
      questionText: "What does a credit score measure?",
      options: [
        "How much money you have",
        "Your likelihood to repay borrowed money",
        "Your job performance",
        "Your social media activity"
      ],
      correctAnswer: 1,
      explanation: "Credit scores reflect your borrowing and repayment history, affecting loan approval and interest rates.",
      difficulty: "easy"
    },
    {
      id: "fl-5",
      questionText: "What is APR (Annual Percentage Rate)?",
      options: [
        "A type of bank account",
        "The yearly cost of borrowing money, expressed as a percentage",
        "Your annual paycheck",
        "A credit card company name"
      ],
      correctAnswer: 1,
      explanation: "APR includes interest and fees, showing the true cost of borrowing. Lower APR is better.",
      difficulty: "medium"
    },
    {
      id: "fl-6",
      questionText: "Which action helps build credit?",
      options: [
        "Never taking out any loans",
        "Taking out multiple large loans at once",
        "Making on-time payments on a credit card or small loan",
        "Ignoring bills"
      ],
      correctAnswer: 2,
      explanation: "Responsible borrowing and consistent, on-time payments build positive credit history.",
      difficulty: "medium"
    },
    {
      id: "fl-7",
      questionText: "What's predatory lending?",
      options: [
        "A normal type of bank loan",
        "Lending with unfair terms designed to trap borrowers",
        "Loans that help people",
        "Only a problem in other countries"
      ],
      correctAnswer: 1,
      explanation: "Predatory lending exploits borrowers with hidden fees, high rates, and aggressive practices.",
      difficulty: "hard"
    },
    {
      id: "fl-8",
      questionText: "What should you do before taking out any loan?",
      options: [
        "Take it immediately",
        "Read all terms carefully and compare options",
        "Borrow from anyone offering money",
        "Hide the loan from family"
      ],
      correctAnswer: 1,
      explanation: "Understanding loan terms protects you from predatory practices and poor financial decisions.",
      difficulty: "medium"
    },
    {
      id: "fl-9",
      questionText: "What is a secured credit card?",
      options: [
        "A card that requires you to put down a cash deposit",
        "Only used online",
        "More expensive than regular credit cards",
        "Not useful for building credit"
      ],
      correctAnswer: 0,
      explanation: "Secured cards require a deposit but help those with no credit history build positive credit.",
      difficulty: "medium"
    },
    {
      id: "fl-10",
      questionText: "How often should you check your credit report?",
      options: [
        "Never",
        "Once every 5 years",
        "At least once a year, especially after reentry",
        "Only when applying for a loan"
      ],
      correctAnswer: 2,
      explanation: "Regular checks help you catch errors and monitor for identity theft or fraud.",
      difficulty: "easy"
    },
    {
      id: "fl-11",
      questionText: "What's the difference between wants and needs?",
      options: [
        "There is no difference",
        "Needs are essential (food, shelter); wants are nice to have (entertainment, luxury)",
        "Needs are expensive; wants are cheap",
        "Wants are more important than needs"
      ],
      correctAnswer: 1,
      explanation: "Understanding this distinction is key to smart budgeting and financial stability.",
      difficulty: "easy"
    },
    {
      id: "fl-12",
      questionText: "What should you do with tax refunds?",
      options: [
        "Spend it all immediately",
        "Put it in an emergency fund or toward goals",
        "Give it away",
        "Invest it all in risky ventures"
      ],
      correctAnswer: 1,
      explanation: "Tax refunds are opportunities to build savings or pay down debt.",
      difficulty: "medium"
    },
    {
      id: "fl-13",
      questionText: "What is the 50/30/20 budgeting rule?",
      options: [
        "Spend 50% on wants",
        "50% needs, 30% wants, 20% savings/debt",
        "A rule that doesn't work for anyone",
        "Something only accountants use"
      ],
      correctAnswer: 1,
      explanation: "This is a common budgeting framework that helps allocate income proportionally to needs, wants, and savings.",
      difficulty: "medium"
    },
    {
      id: "fl-14",
      questionText: "How do banks make money?",
      options: [
        "By charging you fees and lending money at higher rates than they pay on deposits",
        "Only through deposits",
        "They give all money to charity",
        "By selling your personal information"
      ],
      correctAnswer: 0,
      explanation: "Understanding bank business models helps you choose accounts and products wisely.",
      difficulty: "medium"
    },
    {
      id: "fl-15",
      questionText: "What's a high-yield savings account?",
      options: [
        "An account that makes you work physically",
        "A savings account offering higher interest rates than traditional accounts",
        "A risky investment account",
        "Only for millionaires"
      ],
      correctAnswer: 1,
      explanation: "High-yield savings accounts help your money grow faster while remaining safe.",
      difficulty: "medium"
    },
    {
      id: "fl-16",
      questionText: "What should you NOT share over the phone or internet?",
      options: [
        "Your email address",
        "Your job title",
        "Social Security number, passwords, or credit card information",
        "Your name"
      ],
      correctAnswer: 2,
      explanation: "Never share sensitive identifying or financial information with unverified sources.",
      difficulty: "easy"
    },
    {
      id: "fl-17",
      questionText: "What's the benefit of having a bank account?",
      options: [
        "Banks are dangerous",
        "Safe money storage, direct deposit capability, and financial tools",
        "Banks just take your money",
        "It's not needed with digital payments"
      ],
      correctAnswer: 1,
      explanation: "Bank accounts provide security, convenience, and build your financial footprint.",
      difficulty: "easy"
    },
    {
      id: "fl-18",
      questionText: "What is interest?",
      options: [
        "Money the bank keeps",
        "Extra money you pay when you borrow, or earn when you save",
        "A tax on your account",
        "Only charged on large loans"
      ],
      correctAnswer: 1,
      explanation: "Interest is the cost of borrowing or the reward for saving money.",
      difficulty: "easy"
    },
    {
      id: "fl-19",
      questionText: "Why is avoiding payday loans important?",
      options: [
        "They're not really available",
        "They often have extremely high interest rates and trap people in debt cycles",
        "They're only for emergencies",
        "There's no problem with them"
      ],
      correctAnswer: 1,
      explanation: "Payday loans typically charge 300-400% APR, making them dangerous for financial health.",
      difficulty: "hard"
    },
    {
      id: "fl-20",
      questionText: "What's the first step in creating a financial plan?",
      options: [
        "Investing all your money",
        "Understanding your income and expenses",
        "Taking out big loans",
        "Ignoring your finances"
      ],
      correctAnswer: 1,
      explanation: "Assessing your financial situation is the foundation for any plan.",
      difficulty: "medium"
    },
    {
      id: "fl-21",
      questionText: "How can you build savings on a limited income?",
      options: [
        "You can't",
        "Set a small savings goal and automate transfers, track expenses, cut non-essentials",
        "Only earn more money first",
        "Wait until you're rich"
      ],
      correctAnswer: 1,
      explanation: "Even small, consistent savings builds momentum and financial security.",
      difficulty: "medium"
    },
    {
      id: "fl-22",
      questionText: "What should you do if you become a victim of identity theft?",
      options: [
        "Do nothing",
        "Report it to credit bureaus, banks, and police immediately",
        "Wait and see what happens",
        "Pay the fraudulent charges"
      ],
      correctAnswer: 1,
      explanation: "Quick reporting limits damage and starts the fraud resolution process.",
      difficulty: "hard"
    },
    {
      id: "fl-23",
      questionText: "What's the value of having a side income?",
      options: [
        "It's wasteful",
        "Provides additional income, builds skills, and creates job security",
        "Only necessary for lazy people",
        "Illegal"
      ],
      correctAnswer: 1,
      explanation: "Side income diversifies your earnings and accelerates financial goals.",
      difficulty: "medium"
    },
    {
      id: "fl-24",
      questionText: "How should you handle debt?",
      options: [
        "Ignore it",
        "Create a plan, prioritize high-interest debt, and make consistent payments",
        "Try to pay it all immediately",
        "Declare bankruptcy immediately"
      ],
      correctAnswer: 1,
      explanation: "Strategic debt management prevents financial crisis and builds credit.",
      difficulty: "hard"
    },
    {
      id: "fl-25",
      questionText: "What's the long-term benefit of financial literacy?",
      options: [
        "No real benefit",
        "Greater control over your life, better decisions, and wealth building",
        "Only helps rich people",
        "It's too complicated to matter"
      ],
      correctAnswer: 1,
      explanation: "Financial literacy empowers you to make decisions that transform your future.",
      difficulty: "hard"
    }
  ]
};

/**
 * QUIZ 3: Mental Health & Wellness - 25 Questions
 */
export const mentalHealthQuiz: Quiz = {
  courseId: "mental-health-wellness",
  courseName: "Mental Health & Wellness for Reentry",
  description: "Build resilience and mental wellness strategies for sustainable success",
  totalQuestions: 25,
  passingScore: 70,
  estimatedTime: 45,
  questions: [
    {
      id: "mh-1",
      questionText: "What is mental health?",
      options: [
        "Only about depression or mental illness",
        "Your emotional, psychological, and social well-being",
        "Not as important as physical health",
        "Something only therapists need to think about"
      ],
      correctAnswer: 1,
      explanation: "Mental health encompasses emotional resilience, coping skills, and overall psychological well-being.",
      difficulty: "easy"
    },
    {
      id: "mh-2",
      questionText: "Which of these is a healthy coping mechanism?",
      options: [
        "Using drugs or alcohol to escape",
        "Exercise, journaling, or talking to someone you trust",
        "Isolating yourself",
        "Ignoring problems"
      ],
      correctAnswer: 1,
      explanation: "Healthy coping mechanisms help you process emotions without causing harm.",
      difficulty: "easy"
    },
    {
      id: "mh-3",
      questionText: "What is trauma?",
      options: [
        "A sign of weakness",
        "A response to deeply distressing or threatening events",
        "Only affects some people",
        "Something you should never talk about"
      ],
      correctAnswer: 1,
      explanation: "Trauma is a normal response to abnormal events. It's not weakness—it's a real health issue.",
      difficulty: "medium"
    },
    {
      id: "mh-4",
      questionText: "How can trauma affect reentry?",
      options: [
        "It doesn't",
        "It can impact trust, relationships, and ability to function",
        "Only affects weak people",
        "It disappears immediately after release"
      ],
      correctAnswer: 1,
      explanation: "Understanding trauma's impact helps you seek appropriate support and develop strategies.",
      difficulty: "hard"
    },
    {
      id: "mh-5",
      questionText: "What is anxiety?",
      options: [
        "Just being nervous",
        "A normal response to stress that becomes concerning when excessive",
        "A sign you're weak",
        "Always a mental illness"
      ],
      correctAnswer: 1,
      explanation: "Some anxiety is normal; it becomes concerning when it interferes with daily functioning.",
      difficulty: "medium"
    },
    {
      id: "mh-6",
      questionText: "What's one way to manage anxiety?",
      options: [
        "Avoid all situations that cause anxiety",
        "Use breathing techniques, exercise, or talk to someone",
        "Accept that you'll always be anxious",
        "Never seek help"
      ],
      correctAnswer: 1,
      explanation: "Active management techniques help reduce anxiety and build resilience.",
      difficulty: "medium"
    },
    {
      id: "mh-7",
      questionText: "What is depression?",
      options: [
        "Just being sad",
        "A medical condition involving persistent sadness, low motivation, and loss of interest",
        "A sign of laziness",
        "Something you can fix by 'thinking positive'"
      ],
      correctAnswer: 1,
      explanation: "Depression is a clinical condition requiring professional support and often treatment.",
      difficulty: "medium"
    },
    {
      id: "mh-8",
      questionText: "When should you seek professional help?",
      options: [
        "Only in extreme emergencies",
        "When you're struggling with your mental health, regardless of severity",
        "Never—talking to friends is enough",
        "Only if you're suicidal"
      ],
      correctAnswer: 1,
      explanation: "Professional help is appropriate whenever your mental health significantly impacts your life.",
      difficulty: "medium"
    },
    {
      id: "mh-9",
      questionText: "What is stigma in mental health?",
      options: [
        "Not a real problem",
        "Negative beliefs and discrimination about mental health conditions",
        "Something only other people experience",
        "Helpful for motivation"
      ],
      correctAnswer: 1,
      explanation: "Stigma prevents people from seeking help. Fighting stigma involves education and open dialogue.",
      difficulty: "hard"
    },
    {
      id: "mh-10",
      questionText: "What's a healthy daily routine for mental health?",
      options: [
        "Sleep whenever, eat randomly, never exercise",
        "Regular sleep, nutritious eating, exercise, and social connection",
        "Only important for people with mental illness",
        "Routines don't matter"
      ],
      correctAnswer: 1,
      explanation: "Consistent routines build stability and significantly impact mental health.",
      difficulty: "easy"
    },
    {
      id: "mh-11",
      questionText: "What role does sleep play in mental health?",
      options: [
        "No real role",
        "Poor sleep increases depression and anxiety risk",
        "Sleep is only important for physical health",
        "You can function fine on minimal sleep"
      ],
      correctAnswer: 1,
      explanation: "Sleep is fundamental—lack of sleep dramatically worsens mental health.",
      difficulty: "medium"
    },
    {
      id: "mh-12",
      questionText: "How does exercise benefit mental health?",
      options: [
        "It doesn't",
        "Reduces depression, anxiety, and stress through brain chemistry changes",
        "Only benefits physical health",
        "Takes too much time"
      ],
      correctAnswer: 1,
      explanation: "Exercise is proven to improve mood and reduce mental health symptoms.",
      difficulty: "medium"
    },
    {
      id: "mh-13",
      questionText: "What is self-compassion?",
      options: [
        "Being selfish",
        "Treating yourself with kindness during difficulties, like you'd treat a friend",
        "Letting yourself off the hook for everything",
        "A luxury only for some"
      ],
      correctAnswer: 1,
      explanation: "Self-compassion is essential for resilience and mental health during hard times.",
      difficulty: "medium"
    },
    {
      id: "mh-14",
      questionText: "How can social connections help mental health?",
      options: [
        "They don't—isolation is fine",
        "Reduce loneliness, provide support, and improve overall well-being",
        "Only matter if you like people",
        "Are optional"
      ],
      correctAnswer: 1,
      explanation: "Human connection is fundamental to mental health and recovery.",
      difficulty: "easy"
    },
    {
      id: "mh-15",
      questionText: "What should you do if someone tells you they're suicidal?",
      options: [
        "Tell them they're overreacting",
        "Listen, take them seriously, and help them get professional help",
        "Leave them alone",
        "Argue with them"
      ],
      correctAnswer: 1,
      explanation: "Taking suicidal statements seriously and connecting them to help saves lives.",
      difficulty: "hard"
    },
    {
      id: "mh-16",
      questionText: "What is mindfulness?",
      options: [
        "Complex meditation that takes months to learn",
        "Paying attention to the present moment without judgment",
        "Emptying your mind completely",
        "Only for certain people"
      ],
      correctAnswer: 1,
      explanation: "Simple mindfulness practices reduce anxiety and improve focus.",
      difficulty: "medium"
    },
    {
      id: "mh-17",
      questionText: "How does nutrition affect mental health?",
      options: [
        "Food doesn't affect mood or mental health",
        "Poor nutrition increases depression and anxiety risk",
        "Only extreme diets matter",
        "Mental health is unrelated to food"
      ],
      correctAnswer: 1,
      explanation: "Brain function depends on proper nutrition; diet significantly impacts mental health.",
      difficulty: "medium"
    },
    {
      id: "mh-18",
      questionText: "What's a relapse?",
      options: [
        "Permanent failure",
        "A temporary return to old behaviors or symptoms",
        "A sign you should give up",
        "Something that never happens in recovery"
      ],
      correctAnswer: 1,
      explanation: "Relapses are common in recovery; they're opportunities to learn and adjust strategies.",
      difficulty: "hard"
    },
    {
      id: "mh-19",
      questionText: "How should you handle setbacks in your mental health journey?",
      options: [
        "Give up completely",
        "See them as learning opportunities and adjust your strategy",
        "Never tell anyone",
        "Believe you'll never recover"
      ],
      correctAnswer: 1,
      explanation: "Resilience includes bouncing back from setbacks with self-compassion and adjusted approaches.",
      difficulty: "hard"
    },
    {
      id: "mh-20",
      questionText: "What is a support group?",
      options: [
        "Only for people with serious problems",
        "A gathering of people with similar experiences sharing support and strategies",
        "Admitting defeat",
        "Unnecessary if you have friends"
      ],
      correctAnswer: 1,
      explanation: "Support groups provide community, shared experience, and practical strategies.",
      difficulty: "easy"
    },
    {
      id: "mh-21",
      questionText: "How does reentry-specific trauma differ from other trauma?",
      options: [
        "It doesn't",
        "It often involves loss of freedom, identity disruption, and community challenges",
        "Only affects some people",
        "It's easier to overcome"
      ],
      correctAnswer: 1,
      explanation: "Reentry trauma is unique and requires specialized understanding and support.",
      difficulty: "hard"
    },
    {
      id: "mh-22",
      questionText: "What's the importance of having a crisis plan?",
      options: [
        "Crisis plans aren't necessary",
        "They provide concrete steps for managing mental health emergencies",
        "Only therapists need plans",
        "It's too late once crisis starts"
      ],
      correctAnswer: 1,
      explanation: "Having a plan in advance helps you respond effectively during mental health crises.",
      difficulty: "hard"
    },
    {
      id: "mh-23",
      questionText: "How can community resources help mental health?",
      options: [
        "They can't—you need private therapy only",
        "Provide affordable or free support, groups, and crisis services",
        "Only for people with severe illness",
        "Communities don't help"
      ],
      correctAnswer: 1,
      explanation: "Community mental health resources provide accessible support for everyone.",
      difficulty: "medium"
    },
    {
      id: "mh-24",
      questionText: "What role does hope play in recovery?",
      options: [
        "Hope is unrealistic",
        "Hope is a foundation for motivation, resilience, and sustained recovery",
        "Hope prevents planning",
        "Only for optimistic people"
      ],
      correctAnswer: 1,
      explanation: "Hope is powerful—believing in your ability to recover is essential to actually recovering.",
      difficulty: "hard"
    },
    {
      id: "mh-25",
      questionText: "What's the ultimate goal of mental wellness?",
      options: [
        "Never feeling sad or stressed",
        "Building resilience and the ability to manage life's challenges",
        "Avoiding all difficult emotions",
        "Becoming perfect"
      ],
      correctAnswer: 1,
      explanation: "Mental wellness is about developing the skills and resilience to navigate life's ups and downs.",
      difficulty: "hard"
    }
  ]
};

/**
 * Helper functions for quiz operations
 */
export function getQuizByCourseId(courseId: string): Quiz | undefined {
  const quizzes: Record<string, Quiz> = {
    "job-readiness": jobReadinessQuiz,
    "financial-literacy": financialLiteracyQuiz,
    "mental-health-wellness": mentalHealthQuiz
  };
  return quizzes[courseId];
}

export function calculateScore(attempt: QuizAttempt, quiz: Quiz): number {
  let correct = 0;
  attempt.answers.forEach((answerIndex, questionIndex) => {
    if (answerIndex !== null && answerIndex === quiz.questions[questionIndex]?.correctAnswer) {
      correct++;
    }
  });
  return Math.round((correct / quiz.totalQuestions) * 100);
}

export function isPassing(score: number, passingScore: number): boolean {
  return score >= passingScore;
}

export function getAllQuizzes(): Quiz[] {
  return [jobReadinessQuiz, financialLiteracyQuiz, mentalHealthQuiz];
}
