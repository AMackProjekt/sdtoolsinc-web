"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPortalRoot() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/portal/admin/dashboard");
  }, [router]);
  return null;
}
