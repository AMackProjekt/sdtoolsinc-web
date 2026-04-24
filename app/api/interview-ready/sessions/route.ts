import { NextRequest, NextResponse } from "next/server";
import type { InterviewAttemptRecord } from "@/lib/interview-ready";
import { createSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

// ─── helpers ─────────────────────────────────────────────────────────────────

function db() {
  return createSupabaseAdmin();
}

// Map JS camelCase record → Supabase snake_case row
function toRow(record: InterviewAttemptRecord) {
  return {
    id: record.id,
    session_id: record.sessionId ?? null,
    tenant_id: record.tenantId ?? "toolsinc",
    client_id: record.clientId,
    client_name: record.clientName,
    tent_uid: record.tentUID,
    case_manager: record.caseManager,
    industry_path: record.industryPath ?? null,
    interview_type: record.interviewType,
    job_type: record.jobType,
    question_asked: record.questionAsked,
    transcript_json: record.transcriptJson ?? null,
    client_answer: record.clientAnswer,
    ai_improved_answer: record.aiImprovedAnswer,
    clarity_score: record.clarityScore,
    professionalism_score: record.professionalismScore,
    job_relevance_score: record.jobRelevanceScore,
    growth_mindset_score: record.growthMindsetScore,
    confidence_score: record.confidenceScore ?? null,
    completeness_score: record.completenessScore ?? null,
    average_readiness_score: record.averageReadinessScore ?? null,
    barrier_flag: record.barrierFlag ?? false,
    cm_reviewed: record.cmReviewed ?? false,
    export_pdf_url: record.exportPdfUrl ?? null,
    virtual_high_five: record.virtualHighFive ?? false,
    cm_comment: record.cmComment ?? null,
    feedback_summary: record.feedbackSummary,
    created_date: record.createdDate || new Date().toISOString(),
    submitted_to_case_manager: record.submittedToCaseManager,
    case_manager_notes: record.caseManagerNotes,
    follow_up_needed: record.followUpNeeded,
  };
}

// Map Supabase snake_case row → JS camelCase record
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromRow(row: any): InterviewAttemptRecord {
  return {
    id: row.id,
    sessionId: row.session_id,
    tenantId: row.tenant_id,
    clientId: row.client_id,
    clientName: row.client_name,
    tentUID: row.tent_uid,
    caseManager: row.case_manager,
    industryPath: row.industry_path,
    interviewType: row.interview_type,
    jobType: row.job_type,
    questionAsked: row.question_asked,
    transcriptJson: row.transcript_json,
    clientAnswer: row.client_answer,
    aiImprovedAnswer: row.ai_improved_answer,
    clarityScore: row.clarity_score,
    professionalismScore: row.professionalism_score,
    jobRelevanceScore: row.job_relevance_score,
    growthMindsetScore: row.growth_mindset_score,
    confidenceScore: row.confidence_score,
    completenessScore: row.completeness_score,
    averageReadinessScore: row.average_readiness_score,
    barrierFlag: row.barrier_flag,
    cmReviewed: row.cm_reviewed,
    exportPdfUrl: row.export_pdf_url,
    virtualHighFive: row.virtual_high_five,
    cmComment: row.cm_comment,
    feedbackSummary: row.feedback_summary,
    createdDate: row.created_date,
    submittedToCaseManager: row.submitted_to_case_manager,
    caseManagerNotes: row.case_manager_notes,
    followUpNeeded: row.follow_up_needed,
  };
}

// ─── GET /api/interview-ready/sessions ───────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId");

  let query = db()
    .from("interview_ready_sessions")
    .select("*")
    .order("created_date", { ascending: false });

  if (clientId) {
    query = query.eq("client_id", clientId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json((data ?? []).map(fromRow));
}

// ─── POST /api/interview-ready/sessions ──────────────────────────────────────

export async function POST(request: NextRequest) {
  const body = (await request.json()) as InterviewAttemptRecord | InterviewAttemptRecord[];
  const records = Array.isArray(body) ? body : [body];

  const rows = records.map((r) =>
    toRow({ ...r, createdDate: r.createdDate || new Date().toISOString() })
  );

  const { error } = await db().from("interview_ready_sessions").upsert(rows);

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, saved: rows.length });
}

// ─── PATCH /api/interview-ready/sessions ─────────────────────────────────────

export async function PATCH(request: NextRequest) {
  const body = (await request.json()) as {
    id: string;
    followUpNeeded?: boolean;
    caseManagerNotes?: string;
    cmReviewed?: boolean;
    cmComment?: string;
    virtualHighFive?: boolean;
  };

  const patch: Record<string, unknown> = {};
  if (body.followUpNeeded !== undefined) patch.follow_up_needed = body.followUpNeeded;
  if (body.caseManagerNotes !== undefined) patch.case_manager_notes = body.caseManagerNotes;
  if (body.cmReviewed !== undefined) patch.cm_reviewed = body.cmReviewed;
  if (body.cmComment !== undefined) patch.cm_comment = body.cmComment;
  if (body.virtualHighFive !== undefined) patch.virtual_high_five = body.virtualHighFive;

  const { data, error } = await db()
    .from("interview_ready_sessions")
    .update(patch)
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 404 });
  }

  return NextResponse.json({ ok: true, record: fromRow(data) });
}
