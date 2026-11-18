/**
 * Original T.O.O.L.S. intake and staff-review schema, informed by the public
 * domains described in GMU ACE CJ-TRAK Assess an Individual documentation.
 * Not GMU ACE, CJ-TRAK, or GAIN licensed scoring software.
 *
 * Sources: https://tools.gmuace.org/assessindividual.php
 *          https://tools.gmuace.org/files/IndividualAssessmentQuestions.pdf
 * The record-specific GMU report/GAIN URLs were inaccessible; no claims of
 * score compatibility or exact question reproduction are made.
 */
import type { PublicKrucialProgress } from "@/lib/docuready/flow";

export type OptionalAnswer = "yes" | "no" | "unsure" | "prefer_not_to_answer";
export type StaffDecision = "pending_review" | "more_information" | "approved" | "warm_referral";
export type RequestedService =
  | "identification" | "transportation" | "housing" | "employment" | "resume"
  | "benefits" | "education" | "banking" | "reentry" | "other";

export interface IntakeEligibilityAnswers {
  fullName: string;
  preferredName: string;
  email: string;
  phone: string;
  city: string;
  postalCode: string;
  contactPreference: "email" | "phone" | "text" | "no_safe_contact";
  age18OrOlder: OptionalAnswer;
  demographics: {
    raceEthnicity: string;
    gender: string;
    veteranStatus: OptionalAnswer;
    language: string;
  };
  situation: {
    housing: "stable" | "temporary" | "sheltered" | "unsheltered" | "other" | "prefer_not_to_answer" | "";
    employment: "employed" | "seeking" | "training" | "not_seeking" | "prefer_not_to_answer" | "";
    transportation: "available" | "limited" | "none" | "prefer_not_to_answer" | "";
    supportNetwork: OptionalAnswer;
    financialBarrier: OptionalAnswer;
  };
  justiceInvolvement: OptionalAnswer;
  justiceContext?: {
    setting: "recently_released" | "probation" | "parole" | "pretrial" | "other" | "prefer_not_to_answer" | "";
    needsCoordination: OptionalAnswer;
  };
  requestedServices: RequestedService[];
  immediatePriority: string;
  additionalContext: string;
  consentToProcessing: boolean;
  consentToReferral: boolean;
  docuReady?: PublicKrucialProgress;
}

export type InternalNeedDomain =
  | "housing" | "employment" | "education" | "transportation" | "financial_obligations"
  | "community_support" | "substance_use_referral" | "behavioral_health_referral"
  | "supervision_coordination" | "other";

export interface StaffScreening {
  /** Staff only, supported by authorized source records; never client self-classification */
  documentedRiskLevel?: "not_assessed" | "very_low" | "low" | "moderate" | "high" | "very_high";
  instrumentName?: string;
  assessmentDate?: string;
  needDomains: InternalNeedDomain[];
  clinicalReferralSuggested: OptionalAnswer;
  behavioralHealthReferralSuggested: OptionalAnswer;
  protectiveSupports: string[];
  barriers: string[];
  staffNarrative: string;
  staffDecision: StaffDecision;
  decisionReason: string;
  followUpDate?: string;
  staffReviewerId?: string;
}

export interface IndividualEligibilityReport {
  applicationId: string;
  submittedAt: string;
  application: IntakeEligibilityAnswers;
  screening?: StaffScreening;
}

export const DEMOGRAPHIC_DECLINE = "Prefer not to answer";
export const NEED_LABELS: Record<InternalNeedDomain,string> = {
  housing: "Housing stability",
  employment: "Employment and income",
  education: "Education and training",
  transportation: "Transportation",
  financial_obligations: "Financial obligations",
  community_support: "Positive support network",
  substance_use_referral: "Substance-use service referral",
  behavioral_health_referral: "Behavioral-health service referral",
  supervision_coordination: "Justice supervision coordination",
  other: "Additional individualized need",
};
export const SERVICE_LABELS: Record<RequestedService,string> = {
  identification: "Identification / vital documents",
  transportation: "Transit and mobility",
  housing: "Housing navigation",
  employment: "Employment assistance",
  resume: "Resume and career portfolio",
  benefits: "Public benefits",
  education: "Education or workshops",
  banking: "Banking / financial readiness",
  reentry: "Reentry navigation",
  other: "Other services",
};

/** Staff must validate and decide; no eligibility or recidivism scoring. */
export function needsSummary(report: IndividualEligibilityReport) {
  return {
    caseReference: report.applicationId,
    dateReceived: report.submittedAt,
    applicantName: report.application.fullName,
    programTrack: report.application.docuReady?.track ?? "Not selected",
    services: report.application.requestedServices.map(s => SERVICE_LABELS[s]),
    completedDocuReadyMilestones: report.application.docuReady?.completedMilestones ?? [],
    identifiedNeeds: report.screening?.needDomains.map(n => NEED_LABELS[n]) ?? [],
    decision: report.screening?.staffDecision ?? "pending_review",
    decisionReason: report.screening?.decisionReason ?? "",
  };
}
