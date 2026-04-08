"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { GlowCard } from "@/components/ui/GlowCard";
import { ShieldCheck, Wrench } from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/portal/admin/auth");
  }, [isAuthenticated, router]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <GlowCard className="flex flex-col items-center justify-center gap-5 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-400">
          <ShieldCheck size={32} />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-text">Admin Dashboard</h1>
        <div className="flex items-center gap-2 rounded-lg bg-violet-900/30 px-4 py-2 text-sm font-semibold text-violet-300">
          <Wrench size={15} />
          Coming Soon — Under Construction
        </div>
        <p className="max-w-sm text-sm text-muted">
          The admin control panel is being built. User management, content controls, analytics, and
          system settings will live here.
        </p>
      </GlowCard>
    </div>
  );
}
