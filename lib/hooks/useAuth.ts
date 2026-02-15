"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, getCurrentProfile, updateProfile as updateSupabaseProfile, createProfile } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export type AuthRole = "admin" | "case_manager" | "client";

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: AuthRole;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  signInWithAzure: () => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: { full_name?: string; avatar_url?: string }) => Promise<void>;
}

let authState: AuthState = {
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

let listeners: Set<(state: AuthState) => void> = new Set();

function notifyListeners() {
  listeners.forEach((listener) => listener(authState));
}

export function useAuth(): AuthContextType {
  const router = useRouter();
  const [state, setState] = useState<AuthState>(authState);

  useEffect(() => {
    const listener = (newState: AuthState) => {
      setState(newState);
    };
    listeners.add(listener);

    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          let profile = await getCurrentProfile(session.user.id);
          if (!profile) {
            profile = await createProfile(session.user.id, {
              full_name: session.user.user_metadata?.full_name || session.user.email || "User",
              role: "client",
            });
          }
          authState = {
            user: session.user,
            profile: profile as UserProfile | null,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          };
          notifyListeners();
        } else {
          authState = {
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          };
          notifyListeners();
        }
      } catch (error) {
        console.error("Auth check error:", error);
        authState = {
          user: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
          error: "Failed to check authentication",
        };
        notifyListeners();
      }
    };

    checkAuth();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        let profile = await getCurrentProfile(session.user.id);
        if (!profile) {
          profile = await createProfile(session.user.id, {
            full_name: session.user.user_metadata?.full_name || session.user.email || "User",
            role: "client",
          });
        }
        authState = {
          user: session.user,
          profile: profile as UserProfile | null,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        };
      } else {
        authState = {
          user: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        };
      }
      notifyListeners();
    });

    return () => {
      listeners.delete(listener);
      subscription?.unsubscribe();
    };
  }, []);

  const signInWithAzure = useCallback(async () => {
    try {
      authState = { ...authState, isLoading: true, error: null };
      notifyListeners();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "azure",
        options: {
          scopes: "email profile",
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Azure login failed";
      authState = { ...authState, isLoading: false, error: message };
      notifyListeners();
      throw error;
    }
  }, []);

  const signInWithMagicLink = useCallback(async (email: string) => {
    try {
      authState = { ...authState, isLoading: true, error: null };
      notifyListeners();

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      authState = {
        ...authState,
        isLoading: false,
        error: null,
      };
      notifyListeners();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Magic link failed";
      authState = { ...authState, isLoading: false, error: message };
      notifyListeners();
      throw error;
    }
  }, []);

  const signInWithPassword = useCallback(
    async (email: string, password: string) => {
      try {
        authState = { ...authState, isLoading: true, error: null };
        notifyListeners();

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Auth state will be updated via onAuthStateChange subscription
        // Login page will handle the redirect via useEffect
      } catch (error) {
        const message = error instanceof Error ? error.message : "Login failed";
        authState = { ...authState, isLoading: false, error: message };
        notifyListeners();
        throw error;
      }
    },
    []
  );

  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      try {
        authState = { ...authState, isLoading: true, error: null };
        notifyListeners();

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;

        router.push(`/auth/check-email?email=${encodeURIComponent(email)}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Signup failed";
        authState = { ...authState, isLoading: false, error: message };
        notifyListeners();
        throw error;
      }
    },
    [router]
  );

  const requestPasswordReset = useCallback(async (email: string) => {
    try {
      authState = { ...authState, isLoading: true, error: null };
      notifyListeners();

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      authState = { ...authState, isLoading: false, error: null };
      notifyListeners();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Reset request failed";
      authState = { ...authState, isLoading: false, error: message };
      notifyListeners();
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      authState = { ...authState, isLoading: true, error: null };
      notifyListeners();

      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      authState = {
        user: null,
        profile: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
      notifyListeners();
      router.push("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Logout failed";
      authState = { ...authState, isLoading: false, error: message };
      notifyListeners();
      throw error;
    }
  }, [router]);

  const updateProfile = useCallback(async (updates: { full_name?: string; avatar_url?: string }) => {
    if (!authState.user) {
      throw new Error("No authenticated user");
    }

    try {
      authState = { ...authState, isLoading: true, error: null };
      notifyListeners();

      const updated = await updateSupabaseProfile(authState.user.id, updates);
      authState = {
        ...authState,
        profile: updated as UserProfile | null,
        isLoading: false,
        error: null,
      };
      notifyListeners();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Profile update failed";
      authState = { ...authState, isLoading: false, error: message };
      notifyListeners();
      throw error;
    }
  }, []);

  return {
    ...state,
    signInWithAzure,
    signInWithMagicLink,
    signInWithPassword,
    signUp,
    requestPasswordReset,
    signOut,
    updateProfile,
  };
}
