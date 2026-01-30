import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AdminProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "admin" | "case_manager" | "client";
  permissions?: string[];
  created_at?: string;
}

export async function getAdminProfile(userId: string): Promise<AdminProfile> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, role, created_at")
    .eq("id", userId)
    .single();

  if (error) {
    throw error;
  }

  return data as AdminProfile;
}

export async function getPermissionsForRole(
  role: string
): Promise<string[]> {
  const rolePermissionsMap: Record<string, string[]> = {
    super_admin: [
      "manage_users",
      "manage_cases",
      "manage_programs",
      "manage_referrals",
      "view_analytics",
      "manage_settings",
      "manage_admins",
      "audit_logs",
      "export_data",
      "delete_data",
    ],
    admin: [
      "manage_users",
      "manage_cases",
      "manage_programs",
      "manage_referrals",
      "view_analytics",
      "manage_settings",
      "audit_logs",
      "export_data",
    ],
    case_manager: [
      "manage_cases",
      "manage_programs",
      "manage_referrals",
      "view_analytics",
    ],
    client: ["view_analytics"],
  };

  return rolePermissionsMap[role] || [];
}
