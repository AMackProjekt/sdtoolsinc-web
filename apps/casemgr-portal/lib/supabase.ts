import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Only warn if in development/runtime, don't throw during build
if (typeof window !== 'undefined' && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
  console.warn("Supabase environment variables not configured - using mock auth");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getProfile(userId: string) {
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
