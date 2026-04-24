-- ============================================================
-- InterviewReady AI Coach — Supabase migration
-- Run this in your Supabase SQL editor or via supabase db push
-- ============================================================

create table if not exists interview_ready_sessions (
  id                        text        primary key,
  session_id                text,
  tenant_id                 text        not null default 'toolsinc',
  client_id                 text        not null,
  client_name               text        not null,
  tent_uid                  text        not null,
  case_manager              text        not null,
  industry_path             text,
  interview_type            text        not null,
  job_type                  text        not null,
  question_asked            text        not null,
  transcript_json           text,
  client_answer             text        not null,
  ai_improved_answer        text        not null,
  clarity_score             numeric     not null,
  professionalism_score     numeric     not null,
  job_relevance_score       numeric     not null,
  growth_mindset_score      numeric     not null,
  confidence_score          numeric,
  completeness_score        numeric,
  average_readiness_score   numeric,
  barrier_flag              boolean     not null default false,
  cm_reviewed               boolean     not null default false,
  export_pdf_url            text,
  virtual_high_five         boolean     not null default false,
  cm_comment                text,
  feedback_summary          text        not null,
  created_date              timestamptz not null default now(),
  submitted_to_case_manager boolean     not null default false,
  case_manager_notes        text        not null default '',
  follow_up_needed          boolean     not null default false
);

-- Index for per-client lookups (participant page)
create index if not exists idx_irs_client_id on interview_ready_sessions (client_id);

-- Index for CM review panel (all records for a tenant, newest first)
create index if not exists idx_irs_tenant_date on interview_ready_sessions (tenant_id, created_date desc);

-- ─── Row-Level Security ────────────────────────────────────────────────────

alter table interview_ready_sessions enable row level security;

-- Participants: read and insert their own records only
create policy "participants_read_own"
  on interview_ready_sessions for select
  using (client_id = auth.uid()::text);

create policy "participants_insert_own"
  on interview_ready_sessions for insert
  with check (client_id = auth.uid()::text);

-- Staff: read all records in their tenant
-- (extend with a staff_profiles table join when tenancy is multi-tenant)
create policy "staff_read_all"
  on interview_ready_sessions for select
  using (true);  -- tighten once tenant membership tables exist

-- Staff: update CM review fields only
create policy "staff_cm_update"
  on interview_ready_sessions for update
  using (true)   -- same note as above
  with check (true);

-- Service-role key (used in API routes) bypasses all RLS automatically.
