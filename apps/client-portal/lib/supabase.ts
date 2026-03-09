import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const hasSupabaseEnv = Boolean(supabaseUrl && supabaseAnonKey);

if (!hasSupabaseEnv) {
  console.warn("Missing Supabase environment variables in client portal. Using placeholder values for build.");
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);

export async function getProfile(userId: string) {
  if (!hasSupabaseEnv) {
    throw new Error("Missing Supabase environment variables");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, role, email")
    .eq("id", userId)
    .single();

  if (error) {
    throw error;
  }

  return data as {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    role: "admin" | "case_manager" | "client";
    email: string | null;
  };
}
