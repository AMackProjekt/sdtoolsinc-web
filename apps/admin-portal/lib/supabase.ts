import { createClient } from "@supabase/supabase-js";

// Check if environment variables are available (only for build-time)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

if (typeof window !== 'undefined' && (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key')) {
  console.warn('Missing Supabase environment variables. Using placeholders for development.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, role")
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
  };
}
