"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, getCurrentProfile } from "@/lib/supabase";
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
          const profile = await getCurrentProfile(session.user.id);
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
        const profile = await getCurrentProfile(session.user.id);
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

        const userId = data.user?.id;
        if (userId) {
          const profile = await getCurrentProfile(userId);
          const role = (profile as UserProfile | null)?.role;

          if (role === "admin") {
            router.push("/admin/dashboard");
          } else if (role === "case_manager") {
            router.push("/portal/manager/dashboard");
          } else if (role === "client") {
            router.push("/portal/client/dashboard");
          } else {
            router.push("/portal/dashboard");
          }
        } else {
          router.push("/portal/dashboard");
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Login failed";
        authState = { ...authState, isLoading: false, error: message };
        notifyListeners();
        throw error;
      }
    },
    [router]
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

        router.push("/auth/verify-email");
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

  return {
    ...state,
    signInWithAzure,
    signInWithMagicLink,
    signInWithPassword,
    signUp,
    requestPasswordReset,
    signOut,
  };
}
