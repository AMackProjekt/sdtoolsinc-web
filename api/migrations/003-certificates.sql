-- Add certificates table and idempotent progress constraints

-- Ensure pgcrypto for UUID generation
create extension if not exists "pgcrypto";

-- Certificates table
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  course_id text not null,
  course_name text not null,
  completion_date date not null,
  certificate_id text not null,
  score integer,
  created_at timestamptz not null default now()
);

-- Unique certificate id
create unique index if not exists certificates_certificate_id_key on public.certificates (certificate_id);

-- Idempotent constraints
create unique index if not exists enrollments_user_course_key on public.enrollments (user_id, course_id);
create unique index if not exists lesson_completions_user_lesson_key on public.lesson_completions (user_id, lesson_id);

-- RLS (enable and allow owners)
alter table public.certificates enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_completions enable row level security;

create policy if not exists "Certificates are readable by owner"
  on public.certificates for select
  using (auth.uid() = user_id);

create policy if not exists "Certificates are insertable by owner"
  on public.certificates for insert
  with check (auth.uid() = user_id);

create policy if not exists "Enrollments are readable by owner"
  on public.enrollments for select
  using (auth.uid() = user_id);

create policy if not exists "Enrollments are insertable by owner"
  on public.enrollments for insert
  with check (auth.uid() = user_id);

create policy if not exists "Lesson completions are readable by owner"
  on public.lesson_completions for select
  using (auth.uid() = user_id);

create policy if not exists "Lesson completions are insertable by owner"
  on public.lesson_completions for insert
  with check (auth.uid() = user_id);
