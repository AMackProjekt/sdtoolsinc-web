"use client";

/**
 * lib/demo-auth.tsx — Mock authentication provider for demo mode.
 *
 * Provides the same useAuth() interface as lib/auth.tsx but always
 * returns an authenticated demo user — no real sign-in required.
 * Used exclusively by the /demo/* route tree.
 */

import { ReactNode, useEffect, useMemo, useState } from "react";
import { AuthContext, AuthContextType, User } from "@/lib/auth";
import { initDemoMocks } from "@/lib/demo-msw";

export const DEMO_USER: User = {
  id: "demo-001",
  email: "alex.rivera@sdtoolsinc.org",
  name: "Alex Rivera",
  avatar: undefined,
  role: "demo_admin",
  provider: "demo",
};

const DEMO_STORAGE_USER = "demo_user_profile";
const DEMO_STORAGE_TOKEN = "demo_auth_token";

export function DemoAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      await initDemoMocks();
      if (!active) return;

      try {
        const raw = localStorage.getItem(DEMO_STORAGE_USER);
        if (raw) {
          setUser(JSON.parse(raw) as User);
        } else {
          localStorage.setItem(DEMO_STORAGE_USER, JSON.stringify(DEMO_USER));
          localStorage.setItem(DEMO_STORAGE_TOKEN, "mock-jwt-token");
          setUser(DEMO_USER);
        }
      } catch {
        setUser(DEMO_USER);
      } finally {
        setIsLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<AuthContextType>(() => ({
    user,
    login: async (email?: string, password?: string) => {
      await initDemoMocks();

      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) return false;

      const data = await response.json();
      const profile: User = {
        id: data?.user?.id ?? DEMO_USER.id,
        name: data?.user?.name ?? DEMO_USER.name,
        email: data?.user?.email ?? email ?? DEMO_USER.email,
        role: data?.user?.role ?? DEMO_USER.role,
        provider: "demo",
        avatar: undefined,
      };

      localStorage.setItem(DEMO_STORAGE_USER, JSON.stringify(profile));
      localStorage.setItem(DEMO_STORAGE_TOKEN, data?.token ?? "mock-jwt-token");
      setUser(profile);
      return true;
    },
    signup: async (email?: string, password?: string, name?: string) => {
      return (await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      }).then(async (r) => {
        if (!r.ok) return false;
        const data = await r.json();
        const profile: User = {
          id: data?.user?.id ?? DEMO_USER.id,
          name: name ?? data?.user?.name ?? DEMO_USER.name,
          email: data?.user?.email ?? email ?? DEMO_USER.email,
          role: data?.user?.role ?? DEMO_USER.role,
          provider: "demo",
          avatar: undefined,
        };
        localStorage.setItem(DEMO_STORAGE_USER, JSON.stringify(profile));
        localStorage.setItem(DEMO_STORAGE_TOKEN, data?.token ?? "mock-jwt-token");
        setUser(profile);
        return true;
      }));
    },
    logout: () => {
      localStorage.removeItem(DEMO_STORAGE_USER);
      localStorage.removeItem(DEMO_STORAGE_TOKEN);
      setUser(null);
      window.location.href = "/demo";
    },
    updateProfile: (updates: Partial<User>) => {
      if (!user) return;
      const next = { ...user, ...updates };
      localStorage.setItem(DEMO_STORAGE_USER, JSON.stringify(next));
      setUser(next);
    },
    isAuthenticated: !!user,
    isLoading,
  }), [user, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
