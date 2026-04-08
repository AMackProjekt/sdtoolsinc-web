import { createClient } from "@supabase/supabase-js";

// Guard against placeholder values during build — createClient requires a valid http(s) URL
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseUrl = rawUrl.startsWith("http") ? rawUrl : "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Browser / client-side client (anon key, RLS enforced)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side admin client (service role key, bypasses RLS)
// Only import/use in API routes — never ship to the browser bundle
export function createSupabaseAdmin() {
  if (!supabaseServiceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ─── Typed helpers ────────────────────────────────────────────────────────────

export type PortalStat = {
  id: string;
  label: string;
  value: string | number;
  trend?: number;
  updated_at: string;
};

export type ActivityEntry = {
  id: string;
  user_name: string;
  action: string;
  resource: string;
  timestamp: string;
  severity?: "info" | "warning" | "error";
};

export type EnterpriseUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  department?: string;
  status: "active" | "inactive" | "pending";
  last_active?: string;
  created_at: string;
};

export type AuditLog = {
  id: string;
  user_email: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: string;
  ip_address?: string;
  timestamp: string;
  severity: "info" | "warning" | "error" | "critical";
};

export type OrgSettings = {
  id: string;
  org_name: string;
  domain: string;
  logo_url?: string;
  sso_enabled: boolean;
  mfa_required: boolean;
  session_timeout_minutes: number;
  allowed_ip_ranges?: string[];
  updated_at: string;
};

export type Integration = {
  id: string;
  name: string;
  provider: string;
  status: "connected" | "disconnected" | "error";
  last_sync?: string;
  config?: Record<string, unknown>;
  created_at: string;
};

export type StaffMember = {
  id: string;
  email: string;
  name: string;
  title: string;
  department: string;
  status: "active" | "on_leave" | "terminated";
  hire_date: string;
  manager_id?: string;
};

export type PressRelease = {
  id: string;
  title: string;
  summary: string;
  content?: string;
  published_at?: string;
  status: "draft" | "published" | "archived";
  author_email: string;
  created_at: string;
};

export type MetricKPI = {
  id: string;
  metric_name: string;
  value: number;
  unit: string;
  period: string;
  change_pct?: number;
  recorded_at: string;
};

// ─── Query helpers (server-side — use createSupabaseAdmin()) ─────────────────

export async function getPortalStats() {
  const db = createSupabaseAdmin();
  const { data, error } = await db
    .from("portal_stats")
    .select("*")
    .order("label");
  if (error) throw error;
  return data as PortalStat[];
}

export async function getRecentActivity(limit = 10) {
  const db = createSupabaseAdmin();
  const { data, error } = await db
    .from("activity_log")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as ActivityEntry[];
}

export async function getEnterpriseUsers() {
  const db = createSupabaseAdmin();
  const { data, error } = await db
    .from("enterprise_users")
    .select("*")
    .order("name");
  if (error) throw error;
  return data as EnterpriseUser[];
}

export async function getAuditLogs(limit = 50, offset = 0) {
  const db = createSupabaseAdmin();
  const { data, error, count } = await db
    .from("audit_logs")
    .select("*", { count: "exact" })
    .order("timestamp", { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return { logs: data as AuditLog[], total: count ?? 0 };
}

export async function getOrgSettings() {
  const db = createSupabaseAdmin();
  const { data, error } = await db
    .from("org_settings")
    .select("*")
    .single();
  if (error) throw error;
  return data as OrgSettings;
}

export async function upsertOrgSettings(settings: Partial<OrgSettings>) {
  const db = createSupabaseAdmin();
  const { data, error } = await db
    .from("org_settings")
    .upsert(settings, { onConflict: "id" })
    .select()
    .single();
  if (error) throw error;
  return data as OrgSettings;
}

export async function getIntegrations() {
  const db = createSupabaseAdmin();
  const { data, error } = await db
    .from("integrations")
    .select("*")
    .order("name");
  if (error) throw error;
  return data as Integration[];
}

export async function getStaff() {
  const db = createSupabaseAdmin();
  const { data, error } = await db
    .from("staff")
    .select("*")
    .order("name");
  if (error) throw error;
  return data as StaffMember[];
}

export async function getPressReleases() {
  const db = createSupabaseAdmin();
  const { data, error } = await db
    .from("press_releases")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as PressRelease[];
}

export async function getMetrics(period?: string) {
  const db = createSupabaseAdmin();
  let query = db.from("metrics").select("*").order("recorded_at", { ascending: false });
  if (period) query = query.eq("period", period);
  const { data, error } = await query;
  if (error) throw error;
  return data as MetricKPI[];
}
