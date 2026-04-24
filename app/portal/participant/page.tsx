"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ParticipantPortalRoot() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/portal/participant/dashboard");
  }, [router]);
  return null;
}
