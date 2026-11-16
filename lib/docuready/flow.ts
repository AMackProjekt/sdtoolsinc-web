/**
 * DocuReady Track A/B prepopulation contract.
 *
 * Pure, client-and-server-safe mapping only. Do not persist identity or case fields
 * to localStorage, query params, analytics, URL fragments, or browser logs.
 */
export const DOCUREADY_STEPS = [
  "CALIFORNIA_ID",
  "PRONTO_TRANSIT",
  "CALFRESH",
  "COMMUNICATION",
  "HOUSING",
  "EMPLOYMENT",
] as const;

export type Milestone = (typeof DOCUREADY_STEPS)[number];
export type DocuReadyTrack = "Track A" | "Track B";

export interface PublicKrucialProgress {
  track: DocuReadyTrack;
  completedMilestones: Milestone[];
  checked72HourTasks: string[];
}

export interface ClientDraft {
  fullName: string;
  dateOfBirth: string;
  callbackPhone: string;
  email: string;
  housing: string;
  releaseOrDpo?: string;
  communityNeed?: string;
  priorityNote?: string;
}

export interface DocuReadyIntakeDraft extends ClientDraft {
  track: DocuReadyTrack;
  completedMilestones: Milestone[];
  checked72HourTasks: string[];
  status: "DRAFT_NOT_SUBMITTED";
}

/**
 * Prepopulate one form in memory, avoiding automatic transmission of personal data.
 * A separate authenticated intake UI can use this result only after verified consent.
 */
export function prepopulateIntakeFromKrucial(
  state: PublicKrucialProgress,
  client: ClientDraft,
): DocuReadyIntakeDraft {
  if (state.track !== "Track A" && state.track !== "Track B") throw new Error("Invalid service track");
  const safeMilestones = Array.from(new Set(state.completedMilestones))
    .filter((item): item is Milestone => DOCUREADY_STEPS.includes(item));
  return {
    track: state.track,
    completedMilestones: safeMilestones,
    checked72HourTasks: state.checked72HourTasks.filter(item => typeof item === "string").slice(0, 30),
    fullName: client.fullName.trim().slice(0, 120),
    dateOfBirth: client.dateOfBirth.trim(),
    callbackPhone: client.callbackPhone.trim().slice(0, 25),
    email: client.email.trim().slice(0, 254),
    housing: client.housing.trim().slice(0, 500),
    releaseOrDpo: state.track === "Track A" ? (client.releaseOrDpo ?? "").trim().slice(0, 500) : undefined,
    communityNeed: state.track === "Track B" ? (client.communityNeed ?? "").trim().slice(0, 500) : undefined,
    priorityNote: (client.priorityNote ?? "").trim().slice(0, 2000),
    status: "DRAFT_NOT_SUBMITTED",
  };
}

/** Public checklist state is not evidence of enrollment or approval. */
export function toPublicProgress(track: "A" | "B", completedIndices: number[]): PublicKrucialProgress {
  return {
    track: track === "A" ? "Track A" : "Track B",
    completedMilestones: Array.from(new Set(completedIndices))
      .filter(index => Number.isInteger(index) && index >= 0 && index < DOCUREADY_STEPS.length)
      .map(index => DOCUREADY_STEPS[index]),
    checked72HourTasks: [],
  };
}
