/** Exact four-module curriculum transcribed from owner-provided DocuReady frontend.
 * Chapters are interactive text timelines, NOT playable video media.
 */
export interface WorkshopModule {
 num: number; badge:string; badgeColor:string; title:string;subtitle:string;duration:string;
 videoChapters: {time:string;heading:string;body:string}[];
 worksheetTitle:string; worksheetContent:string;
 quiz:{q:string;options:string[];answer:number;explanation:string}[];
}
export const WORKSHOP_MODULES: WorkshopModule[] = [
      {
        num: 1,
        badge: 'MODULE 01 • ASSIGNMENT 1',
        badgeColor: 'text-blue-700',
        title: 'Digital Literacy, Email & Calendar Readiness',
        subtitle: 'Setting up professional email, Google Meet, and daily scheduling.',
        duration: '6 Min Interactive Lesson',
        videoChapters: [
          { time: '00:00', heading: '1. Professional Email Setup', body: 'Create a clean firstname.lastname@gmail.com address. Employers and case managers check email daily for interview confirmations and DocuReady updates.' },
          { time: '02:15', heading: '2. Joining Google Meet Orientations', body: 'Click your T.O.O.L.S. Inc. Google Meet link 5 minutes early, test microphone/camera on San Diego library or LifeLine phone Wi-Fi, and mute when listening.' },
          { time: '04:30', heading: '3. Calendar & 72-Hour Alerts', body: 'Set 24-hour and 1-hour phone reminders for DMV ID visits, DHHS CalFresh interviews, DPO check-ins, and employer interviews.' }
        ],
        worksheetTitle: 'T.O.O.L.S. Inc. Module 01 Worksheet — Digital & Schedule Action Plan',
        worksheetContent:
`T.O.O.L.S. INC. — WORK READINESS ASSIGNMENT 1 (MODULE 01 WORKSHEET)
Direct Program Line: (619) 350-7638 (Mon–Fri, 9am–5pm) | San Diego, CA
======================================================================

PART 1: DIGITAL CONTACT & ESSENTIALS CHECK
1. New Professional Email Address: ____________________________________
2. Active 619/858 Callback Number: ____________________________________
   [ ] Google Voice configured   [ ] CA LifeLine Smartphone activated
3. Voicemail Greeting Checked:
   "Hello, you've reached [Your Name]. Please leave your name, number, and message, and I will return your call promptly."

PART 2: GOOGLE MEET & TECH READINESS
- Nearest Free Wi-Fi / Computer Access (e.g., San Diego Central Library, 330 Park Blvd):
  Location: ___________________________________________________________
- Google Meet Orientation Date & Time: ________________________________

PART 3: WEEKLY APPOINTMENT & FOLLOW-UP TRACKER
- Monday:    __________________________________________________________
- Tuesday:   __________________________________________________________
- Wednesday: __________________________________________________________
- Thursday:  __________________________________________________________
- Friday:    __________________________________________________________
`,
        quiz: [
          {
            q: 'Which email format is best for job applications and case management?',
            options: ['partyking619@email.com', 'jordan.taylor.sd@gmail.com', 'noemail@none.com'],
            answer: 1,
            explanation: 'A clean first-and-last name email address builds immediate credibility with employers and agencies.'
          },
          {
            q: 'How early should you test your audio and join a Google Meet orientation?',
            options: ['5 minutes before the scheduled start time', '15 minutes after it starts', 'Only if someone calls you first'],
            answer: 0,
            explanation: 'Joining 5 minutes early ensures your microphone, speaker, and Wi-Fi connection work smoothly.'
          },
          {
            q: 'Why is setting up a working 619 or 858 phone number with voicemail a Day-1 priority?',
            options: ['It is optional for job hunting', 'Case managers, CalFresh workers, and employers need to reach you directly', 'Only for social media'],
            answer: 1,
            explanation: 'Employers and DHHS/T.O.O.L.S. Inc. staff cannot approve benefits or schedule interviews without a working callback number.'
          }
        ]
      },
      {
        num: 2,
        badge: 'MODULE 02',
        badgeColor: 'text-emerald-700',
        title: 'Financial Basics, Budgeting & Benefits Management',
        subtitle: 'Managing CalFresh EBT, PRONTO transit savings, and no-fee banking.',
        duration: '7 Min Interactive Lesson',
        videoChapters: [
          { time: '00:00', heading: '1. Maximizing CalFresh & Medi-Cal', body: 'Use your EBT card at grocery stores and San Diego farmers markets (Market Match doubles produce dollars). Keep your mailing address updated to prevent benefit interruptions.' },
          { time: '02:40', heading: '2. Transit Savings with MTS PRONTO', body: 'Using a $2 PRONTO card with ELEVATE low-income discounts saves $40–$80/month compared to single fares or rideshares.' },
          { time: '05:00', heading: '3. Second-Chance & No-Fee Banking', body: 'Open a no-overdraft checking account (Bank On San Diego certified credit unions/banks) so paychecks arrive via direct deposit with zero check-cashing fees.' }
        ],
        worksheetTitle: 'T.O.O.L.S. Inc. Module 02 Worksheet — 30-Day Stabilization Budget',
        worksheetContent:
`T.O.O.L.S. INC. — MODULE 02 WORKSHEET: 30-DAY STABILIZATION BUDGET
Direct Program Line: (619) 350-7638 | San Diego, CA
======================================================================

PART 1: MONTHLY RESOURCES & INCOME
- CalFresh Food Assistance (EBT):       $______________
- Day Labor / Part-Time / Wages:        $______________
- General Relief / Other Support:       $______________
TOTAL MONTHLY RESOURCES:                $______________

PART 2: ESSENTIAL MONTHLY EXPENSES
- Housing / Transitional Program Fee:   $______________
- MTS PRONTO Transit Pass:              $______________
- Phone / Connectivity:                 $______________
- Hygiene / Work Clothing / Laundry:    $______________
- Savings / Emergency Reserve (10%):    $______________
TOTAL MONTHLY EXPENSES:                 $______________

PART 3: BANK ON SAN DIEGO CHECKLIST
[ ] CA ID / Alternate ID ready for Bank On no-fee checking account
[ ] Direct deposit routing & account numbers saved for employer onboarding
`,
        quiz: [
          {
            q: 'How can you prevent unexpected interruptions to your CalFresh or Medi-Cal benefits?',
            options: ['Ignore county mail', 'Keep a reliable mailing address (or shelter mailing address) updated with SD HHSA', 'Reapply every week'],
            answer: 1,
            explanation: 'Maintaining an active mailing address ensures you receive recertification notices and EBT replacement cards.'
          },
          {
            q: 'What is a key benefit of opening a Bank On San Diego certified checking account?',
            options: ['High monthly maintenance fees', 'No overdraft fees and free direct deposit for paychecks', 'Requires a 750 credit score'],
            answer: 1,
            explanation: 'Bank On certified accounts offer safe, low/no-fee banking without predatory overdraft charges.'
          },
          {
            q: 'How much does an initial MTS PRONTO transit card cost to purchase?',
            options: ['$2 one-time card fee', '$25 activation fee', '$50 deposit'],
            answer: 0,
            explanation: 'A physical PRONTO card costs $2 one-time at any Trolley station or the MTS Transit Store (1255 Imperial Ave).'
          }
        ]
      },
      {
        num: 3,
        badge: 'MODULE 03',
        badgeColor: 'text-indigo-700',
        title: 'California Fair Chance Act (AB 1008) & Interview Prep',
        subtitle: 'Know your rights under California law and practice confident employer responses.',
        duration: '8 Min Interactive Lesson',
        videoChapters: [
          { time: '00:00', heading: '1. California Fair Chance Act (AB 1008)', body: 'Under California law, employers with 5+ employees CANNOT ask about conviction history on a job application or before making a conditional job offer.' },
          { time: '03:10', heading: '2. Individualized Assessment & Your 5-Day Right', body: 'If an employer considers rescinding an offer after a background check, they must give you written notice and at least 5 business days to provide rehabilitation evidence.' },
          { time: '05:45', heading: '3. Crafting Your 30-Second Forward-Looking Pitch', body: 'Focus 80% on your skills, reliability, certifications (OSHA-10, forklift, customer service), and T.O.O.L.S. Inc. readiness.' }
        ],
        worksheetTitle: 'T.O.O.L.S. Inc. Module 03 Worksheet — Fair Chance & Interview Builder',
        worksheetContent:
`T.O.O.L.S. INC. — MODULE 03 WORKSHEET: FAIR CHANCE ACT & INTERVIEW PREP
Direct Program Line: (619) 350-7638 | San Diego, CA
======================================================================

PART 1: CALIFORNIA FAIR CHANCE ACT (AB 1008) QUICK FACTS
- Employers with 5+ employees cannot ask about criminal history until AFTER a conditional job offer.
- If a background issue arises, you have at least 5 business days to submit evidence of rehabilitation, training, and references.

PART 2: YOUR 30-SECOND STRENGTHS PITCH
"Hi, I'm [Name]. I bring hands-on experience in [Skill/Industry], strong reliability, and recent work-readiness training through T.O.O.L.S. Inc. in San Diego. I'm ready to contribute immediately to your team."

Write your customized pitch below:
______________________________________________________________________
______________________________________________________________________

PART 3: REHABILITATION & READINESS PORTFOLIO CHECKLIST
[ ] T.O.O.L.S. Inc. Workshop Enrollment / Completion Record
[ ] Updated Resume from Client Resume Studio
[ ] 2 Professional or Case Manager References
`,
        quiz: [
          {
            q: 'Under the California Fair Chance Act (AB 1008), when can an employer with 5+ employees ask about conviction history?',
            options: ['On the initial online job application', 'Only AFTER making a conditional offer of employment', 'During the first phone screen'],
            answer: 1,
            explanation: 'California law prohibits conviction history inquiries until after a conditional job offer has been extended.'
          },
          {
            q: 'If an employer sends a preliminary notice to rescind an offer based on a background check, how many business days do you have to respond?',
            options: ['At least 5 business days', '24 hours', '0 days (decision is final)'],
            answer: 0,
            explanation: 'You have at least 5 business days to respond with evidence of rehabilitation, certificates, or inaccuracies.'
          },
          {
            q: 'What should make up the majority of your interview answer when discussing your background?',
            options: ['Your current skills, accountability, and readiness to work today', 'Long legal details', 'Criticizing past employers'],
            answer: 0,
            explanation: 'Employers hire for reliability and skill—keep answers brief, accountable, and focused on your current strengths.'
          }
        ]
      },
      {
        num: 4,
        badge: 'MODULE 04',
        badgeColor: 'text-amber-700',
        title: 'Workplace Communication & Retention',
        subtitle: 'Conflict resolution, reliability, and long-term career growth.',
        duration: '6 Min Interactive Lesson',
        videoChapters: [
          { time: '00:00', heading: '1. The First 90 Days: Reliability Habits', body: 'Arrive 10–15 minutes early, confirm shift schedules in writing, and notify supervisors at least 2 hours ahead if transit or emergencies occur.' },
          { time: '02:20', heading: '2. De-Escalating Workplace Stress', body: 'Use the Pause-Clarify-Solve method: take a breath, ask clarifying questions respectfully, and bring solutions rather than frustration.' },
          { time: '04:35', heading: '3. Advancing From Entry-Level to Career Track', body: 'Pair steady employment with industry credentials, community college upskilling, and ongoing T.O.O.L.S. Inc. mentorship.' }
        ],
        worksheetTitle: 'T.O.O.L.S. Inc. Module 04 Worksheet — 90-Day Job Retention Plan',
        worksheetContent:
`T.O.O.L.S. INC. — MODULE 04 WORKSHEET: 90-DAY JOB RETENTION PLAN
Direct Program Line: (619) 350-7638 | San Diego, CA
======================================================================

PART 1: SHIFT & TRANSIT BACKUP PLAN
- Primary Transit Route (MTS Bus / Trolley): __________________________
- Backup Route / Early Departure Time: ________________________________
- Supervisor Direct Phone / Text Line: ________________________________

PART 2: PROFESSIONAL COMMUNICATION SCRIPTS
- Running Late (Call at least 60–90 mins prior):
  "Hi [Supervisor], this is [Name]. Due to an unexpected transit delay, my new arrival time is [Time]. I will check in with you as soon as I arrive."

PART 3: 90-DAY CAREER GROWTH GOALS
- Day 30 Goal: ________________________________________________________
- Day 60 Goal: ________________________________________________________
- Day 90 Goal: ________________________________________________________
`,
        quiz: [
          {
            q: 'What is the best practice if an unexpected MTS trolley or bus delay is going to make you late for a shift?',
            options: ['Say nothing and explain later', 'Call or message your supervisor as early as possible with your exact ETA', 'Skip the entire shift'],
            answer: 1,
            explanation: 'Proactive early communication shows professionalism and protects your standing during your first 90 days.'
          },
          {
            q: 'Which approach works best when receiving corrective feedback from a supervisor?',
            options: ['Listen calmly, ask how to improve, and apply the adjustment immediately', 'Argue in front of coworkers', 'Walk off the job'],
            answer: 0,
            explanation: 'Coachability is one of the top traits supervisors look for when promoting entry-level employees.'
          },
          {
            q: 'How far ahead of your scheduled shift start should you aim to arrive at the worksite?',
            options: ['10 to 15 minutes early', '5 minutes late', 'Right at the exact second'],
            answer: 0,
            explanation: 'Arriving 10–15 minutes early gives you buffer time for transit and lets you start calmly and prepared.'
          }
        ]
      }
    ];
