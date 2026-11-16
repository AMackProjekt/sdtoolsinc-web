"use client";

import { AuthProvider } from "@/lib/auth";
import { PortalAdmissionGuard } from "@/components/ui/PortalAdmissionGuard";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PortalAdmissionGuard>{children}</PortalAdmissionGuard>
    </AuthProvider>
  );
}
