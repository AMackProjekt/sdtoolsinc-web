import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env.local file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function createProfile(
  userId: string,
  profile: {
    full_name?: string;
    avatar_url?: string;
    role?: "admin" | "case_manager" | "client";
  }
) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        role: profile.role || "client",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating profile:", error);
    throw error;
  }
}

export async function getCurrentProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, role, created_at")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

export async function updateProfile(
  userId: string,
  updates: {
    full_name?: string;
    avatar_url?: string;
  }
) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}
