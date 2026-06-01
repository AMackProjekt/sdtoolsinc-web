"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { GlowCard } from "@/components/ui/GlowCard";
import { MessagingWidget } from "@/components/ui/MessagingWidget";
import { User, ShieldCheck, Lock, FolderOpen } from "lucide-react";

export default function ClientDashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || user?.role !== "client") {
      router.replace("/portal/client/auth");
      return;
    }
    if (user?.firstLogin || user?.mustChangePassword) {
      router.replace("/portal/client/change-password");
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading || !isAuthenticated || user?.role !== "client") {
    return null;
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Client Portal</p>
          <h1 className="text-3xl font-extrabold text-text">Welcome, {user.name || user.username}</h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-400">
            Your client account is secured with mandatory password rotation after initial sign-in.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <GlowCard className="p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-brand/10 p-3 text-brand">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Username</p>
                <p className="mt-1 font-semibold text-text">{user.username}</p>
              </div>
            </div>
          </GlowCard>

          <GlowCard className="p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-sky-500/10 p-3 text-sky-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Security Status</p>
                <p className="mt-1 font-semibold text-text">Protected</p>
              </div>
            </div>
          </GlowCard>

          <GlowCard className="p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-300">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Password</p>
                <p className="mt-1 font-semibold text-text">Change required once</p>
              </div>
            </div>
          </GlowCard>
        </div>

        <MessagingWidget className="max-w-3xl" />

        <div className="grid gap-6 lg:grid-cols-2">
          <GlowCard className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <FolderOpen className="h-5 w-5 text-brand" />
              <h2 className="text-lg font-semibold text-text">Client Resources</h2>
            </div>
            <p className="text-sm leading-6 text-slate-400">
              Access your assigned portal resources, secure documents, and client support materials.
            </p>
          </GlowCard>

          <GlowCard className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-sky-300" />
              <h2 className="text-lg font-semibold text-text">Account Security</h2>
            </div>
            <p className="text-sm leading-6 text-slate-400">
              Your portal session is protected by secure HTTP-only cookies and server-side authorization.
            </p>
          </GlowCard>
        </div>
      </div>
    </main>
  );
}
