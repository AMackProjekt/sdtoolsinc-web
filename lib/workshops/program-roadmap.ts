/**
 * Proposed DocuReady 30/60/90-day work-readiness curriculum, graduation and mentorship.
 * Schedules are individualized with a case manager; no dates imply guaranteed services.
 * A workshop quiz does not constitute phase completion, graduation, or mentor assignment.
 */
export type ProgramPhaseId = "days-1-30" | "days-31-60" | "days-61-90" | "completion" | "mentorship";
export interface WeeklyPlan {
  week: string;
  focus: string;
  lessons: string[];
  assignment: string;
  evidence: string;
}
export interface ProgramPhase {
  id: ProgramPhaseId;
  label: string;
  subtitle: string;
  objective: string;
  weeks: WeeklyPlan[];
  review: string[];
  nextStep: string;
}
export const PROGRAM_PHASES: ProgramPhase[] = [
  {
    id: "days-1-30",label: "Days 1–30",subtitle: "Stabilize & establish foundations",
    objective: "Build a practical stabilization and readiness plan. Individualize goals for Track A (justice-involved/reentry) or Track B (displaced veterans and community members).",
    weeks: [
      {week:"Week 1",focus:"Immediate needs & 72-hour follow-through",lessons:["Complete the DocuReady PrePlan checklist; identify food, safe housing, documents, transit and reliable contact.","Make a personal safety and support map; identify the most urgent barriers."],assignment:"Create a prioritized 30-day action plan with three achievable goals and a backup contact method.",evidence:"30-day action plan; resource/referral follow-up log"},
      {week:"Week 2",focus:"Digital literacy & self-advocacy",lessons:["Practice professional email, secure passwords, video meetings and appointment reminders.","Practice requesting services, asking questions and following up respectfully."],assignment:"Draft a professional email and prepare a sample meeting invitation and calendar reminder.",evidence:"Email draft and appointment plan"},
      {week:"Week 3",focus:"Financial stability & benefits navigation",lessons:["Distinguish earned income from non-cash benefits; plan a basic monthly budget.","Explore banking, budgeting, safe debt practices and available financial assistance without promising eligibility."],assignment:"Prepare a realistic spending plan using estimated income, transport, food and housing costs.",evidence:"30-day budget and benefits-document checklist"},
      {week:"Week 4",focus:"Strengths, employment interests & first review",lessons:["Identify transferable skills, workplace supports and employment barriers.","Practice a strengths-based introduction and choose training or employment goals."],assignment:"Submit a strengths inventory and a first-draft job-readiness roadmap.",evidence:"Strengths inventory; goals and case-manager review notes"}
    ],
    review:["Revisit urgent needs and follow-up referrals","Verify four weekly assignments or approved alternatives","Review attendance, barriers and reasonable accommodations","Agree on individualized days 31–60 goals"],
    nextStep:"Case-manager-approved 30-day review; proceed to skills-building phase"
  },
  {
    id:"days-31-60",label:"Days 31–60",subtitle:"Build skills & prepare for opportunities",
    objective:"Develop employment materials, interviewing confidence, practical problem-solving and an actionable opportunity pipeline.",
    weeks:[
      {week:"Week 5",focus:"Resume & transferable skills",lessons:["Translate paid, volunteer, military and lived experience into skills without forcing disclosure of sensitive history.","Use clear accomplishment statements, professional references and accessible document formats."],assignment:"Build a targeted one-page resume and an editable master experience list.",evidence:"Resume draft and strengths-to-skills crosswalk"},
      {week:"Week 6",focus:"Job search and application strategy",lessons:["Identify realistic openings or training, verify job-posting legitimacy and prepare application responses.","Practice email follow-up, document organization and safe online application habits."],assignment:"Create a weekly job-search or training tracker with opportunities, next actions and response dates.",evidence:"Opportunity tracker with at least three researched options"},
      {week:"Week 7",focus:"Fair-chance employment & interviews",lessons:["Review California fair-chance principles; practice responding to employment questions consistent with current law.","Conduct a mock interview emphasizing readiness, strengths, accountability and boundaries."],assignment:"Write answers to five interview prompts and complete a practice interview or accessibility alternative.",evidence:"Interview reflection and practice feedback"},
      {week:"Week 8",focus:"Workplace communication & 60-day review",lessons:["Practice feedback conversations, scheduling, workplace rights, stress regulation and conflict resolution.","Plan transportation, childcare/caregiving contingencies and accommodation requests as relevant."],assignment:"Produce a workplace communication and reliability plan with two backup strategies.",evidence:"Communication plan and case-manager review notes"}
    ],
    review:["Review resume quality and interview feedback","Check opportunity tracker and appropriate referrals","Confirm support needs and barriers without penalizing unavoidable hardship","Approve individualized 61–90-day capstone plan"],
    nextStep:"Case-manager-approved 60-day review; move into applied readiness phase"
  },
  {
    id:"days-61-90",label:"Days 61–90",subtitle:"Apply skills & demonstrate independence",
    objective:"Put job-readiness skills into practice, create an achievable 90-day retention plan and prepare a portfolio for completion review.",
    weeks:[
      {week:"Week 9",focus:"Work-based practice & pathways",lessons:["Explore apprenticeships, education, certificates, volunteer opportunities and fair-chance hiring options.","Map the steps, costs, access supports and timelines required for a chosen pathway."],assignment:"Build a 60–90-day employment or training pathway map with milestones.",evidence:"Pathway map and verified resource contacts"},
      {week:"Week 10",focus:"Workplace problem-solving & resilience",lessons:["Role-play shift communication, conflict resolution and proactive supervisor check-ins.","Develop personal coping, support and transportation contingency plans."],assignment:"Complete three workplace scenarios and write a practical first-90-days reliability plan.",evidence:"Scenario responses and workplace retention plan"},
      {week:"Week 11",focus:"Career portfolio & financial next steps",lessons:["Refine resume, introduction, interview responses, portfolio and reference requests.","Review budget adjustments for work income and potential benefit changes with qualified resources."],assignment:"Assemble a career portfolio; update the budget and identify ongoing benefits questions.",evidence:"Portfolio checklist and revised budget"},
      {week:"Week 12",focus:"Capstone presentation & transition",lessons:["Explain skills gained, barriers navigated, next steps and a support strategy.","Present a portfolio or accessible alternative to program staff and receive actionable feedback."],assignment:"Complete a short capstone presentation and an individualized 90-day continuation plan.",evidence:"Capstone rubric, portfolio and continuation plan"}
    ],
    review:["Check all agreed work products and skills demonstrations","Review attendance/support needs with reasonable alternatives","Agree on next-step employment, education or stabilization goals","Prepare an evidence-based graduation decision"],
    nextStep:"Formal program-completion review; not an automatic certificate"
  },
  {
    id:"completion",label:"Program completion",subtitle:"Verified review & recognition",
    objective:"Confirm demonstrated progress through a documented staff review, not just four quiz passes.",
    weeks:[
      {week:"Completion review",focus:"Portfolio and competency assessment",lessons:["Review individualized 30-, 60- and 90-day goals, assignments and evidence.","Use a transparent rubric covering digital readiness, financial planning, job search, communication and capstone."],assignment:"Present the final portfolio and a realistic next-90-days action plan.",evidence:"Signed staff rubric, completion decision and support/referral plan"},
      {week:"Transition meeting",focus:"Recognition and next services",lessons:["Discuss strengths, remaining barriers, referral options and consent for follow-up.","Offer accessible options for missed or adapted assignments."],assignment:"Confirm future contact preferences and opt in separately to mentorship if desired.",evidence:"Completion notice (only if staff approved); optional mentorship consent"}
    ],
    review:["Assigned staff verifies evidence and identity in protected portal","Record decision, reviewer and date; document accommodations","Issue certificate only after approved completion","Discuss mentorship without promising a placement"],
    nextStep:"Certificate on approved completion; optional mentor matching"
  },
  {
    id:"mentorship",label:"Mentorship",subtitle:"Post-program support & growth",
    objective:"Provide optional, consent-based continued support after completion; participants may receive other services even if no mentor is available.",
    weeks:[
      {week:"Month 4",focus:"Mentor matching & goals",lessons:["Agree on mutual expectations, confidentiality boundaries and a communication cadence.","Choose employment, education, housing stability or entrepreneurship goals as applicable."],assignment:"Create a 90-day mentorship plan with three measurable goals and two support contacts.",evidence:"Mentorship consent, matching status and personal goals"},
      {week:"Month 5",focus:"Accountability & practical opportunities",lessons:["Review interviews, workplace challenges, academic progress or other goals.","Practice networking, feedback, follow-ups and referral navigation."],assignment:"Record agreed action steps and progress during check-ins.",evidence:"Optional contact summaries and next-step plan"},
      {week:"Month 6",focus:"Growth review & continued connection",lessons:["Assess progress, revise goals and celebrate achievements.","Explore peer support, alumni participation and future leadership opportunities when available."],assignment:"Complete a mentorship reflection and define the next quarter's priorities.",evidence:"Mentorship outcome review and continuation choice"}
    ],
    review:["Mentor participation is voluntary and depends on staff availability","Use secure staff systems for sensitive client records","No guaranteed job placement, benefits award or housing outcome","Document consent and allow opting out without affecting service eligibility"],
    nextStep:"Optional alumni support and continued resource access"
  }
];
