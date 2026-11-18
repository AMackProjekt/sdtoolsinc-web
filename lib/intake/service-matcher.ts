import type { IntakeEligibilityAnswers, RequestedService } from "./assessment";

/**
 * T.O.O.L.S. Service Navigation Engine v1.
 * Independent, transparent rule-based prioritization of practical services.
 * This is NOT a clinical assessment, validated risk instrument, GAIN screener,
 * or recidivism prediction. Never use this ranking for acceptance or denial.
 */
export type ServicePriority = "immediate" | "priority" | "planned";
export interface MatchedService {
  id: RequestedService;
  title: string;
  priority: ServicePriority;
  rationale: string;
  suggestedActions: string[];
  clientGoal?: string;
}
export interface ServiceNavigationResult {
  status: "STAFF_REVIEW_REQUIRED";
  strengths: string[];
  barriers: string[];
  matches: MatchedService[];
  overview: string;
  caveat: string;
}
const titles:Record<RequestedService,string>={
 identification:"Identity and vital-document readiness",
 transportation:"Transportation and PRONTO access",
 housing:"Housing navigation and stabilization",
 employment:"Employment placement and preparation",
 resume:"Resume and career portfolio",
 benefits:"Benefits enrollment and navigation",
 education:"Education and career training",
 banking:"Banking and financial access",
 reentry:"Community reentry coordination",
 other:"Individualized support"
};
const actions: Record<RequestedService,string[]>={
 identification:["Confirm which core documents are held or missing","Identify appropriate issuing agencies and fee assistance","Prepare an appointment and document checklist"],
 transportation:["Confirm existing PRONTO or other reliable transport","Check program or supervision-based transit assistance if available","Plan the route to the next essential appointment"],
 housing:["Identify immediate shelter or housing needs","Connect with authorized housing navigation resources"],
 employment:["Assess employment interests, availability and barriers","Connect to workforce services and prepare an application plan"],
 resume:["Check existing resume, experience and credentials","Develop a resume and supporting portfolio"],
 benefits:["Identify benefits the applicant wants to explore","Refer to official benefits eligibility and application resources"],
 education:["Review prior education and training interests","Identify suitable workshops or credential programs"],
 banking:["Identify ID and other documents needed by the chosen financial institution","Explore accessible banking options and account costs"],
 reentry:["Discuss any requested coordination with supervising professionals","Identify community reentry resources and appointment obligations"],
 other:["Clarify the client's requested support with a staff member"]
};
export function matchServices(a:IntakeEligibilityAnswers):ServiceNavigationResult {
  const selected = new Set<RequestedService>(a.requestedServices);
  const barriers: string[] = [];
  const strengths: string[] = [];
  const priority = new Set<RequestedService>();
  const immediate = new Set<RequestedService>();

  if (a.situation.housing === "unsheltered" || a.situation.housing === "sheltered") {
    selected.add("housing"); immediate.add("housing"); barriers.push("Immediate housing instability reported");
  } else if (a.situation.housing === "temporary") {
    selected.add("housing"); priority.add("housing"); barriers.push("Temporary housing reported");
  } else if (a.situation.housing === "stable") strengths.push("Stable housing reported");

  if (a.situation.transportation === "none" || a.situation.transportation === "limited") {
    selected.add("transportation"); priority.add("transportation");
    barriers.push(a.situation.transportation === "none" ? "No transportation reported" : "Limited transportation reported");
  } else if (a.situation.transportation === "available") strengths.push("Transportation access reported");

  if (a.situation.employment === "seeking") {
    selected.add("employment"); priority.add("employment"); barriers.push("Seeking employment");
  } else if (a.situation.employment === "employed") strengths.push("Employment reported");

  if (a.situation.financialBarrier === "yes") {
    barriers.push("Financial barrier reported");
    for (const key of ["identification","transportation","housing","benefits"] as RequestedService[]) {
      if (selected.has(key)) priority.add(key);
    }
  }
  if (a.situation.supportNetwork === "yes") strengths.push("Support network reported");
  if (a.justiceInvolvement === "yes" && a.justiceContext?.needsCoordination === "yes") {
    selected.add("reentry"); priority.add("reentry");
    barriers.push("Requested justice-system coordination");
  }
  if (a.docuReady?.completedMilestones.includes("CALIFORNIA_ID")) strengths.push("California ID milestone marked complete (self-reported)");
  if (a.docuReady?.completedMilestones.includes("PRONTO_TRANSIT")) strengths.push("PRONTO transit milestone marked complete (self-reported)");
  if (a.docuReady && !a.docuReady.completedMilestones.includes("CALIFORNIA_ID")) {
    if (selected.has("identification")) priority.add("identification");
  }
  const order:Record<ServicePriority,number>={immediate:0,priority:1,planned:2};
  const matches=[...selected].map(id=>{
    const level:ServicePriority=immediate.has(id)?"immediate":priority.has(id)?"priority":"planned";
    return {
      id,title:titles[id],priority:level,
      rationale:immediate.has(id)?"Immediate stabilization concern identified":priority.has(id)?"Client-reported barrier or active goal":"Service requested by applicant",
      suggestedActions:actions[id],
      clientGoal: a.immediatePriority.trim() || undefined
    } satisfies MatchedService;
  }).sort((x,y)=>order[x.priority]-order[y.priority] || x.title.localeCompare(y.title));
  return {
    status:"STAFF_REVIEW_REQUIRED",
    strengths,barriers,matches,
    overview:matches.length ? `Identified ${matches.length} service area(s) for staff review.` : "No service areas selected; staff should clarify the applicant's goals.",
    caveat:"Service navigation suggestions are based on self-reported information. They are not eligibility determinations, clinical diagnoses, validated risk scores, or recidivism predictions. Staff must review before any decision or referral."
  };
}
