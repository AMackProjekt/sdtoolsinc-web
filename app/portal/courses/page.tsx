"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CoursesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/portal/participant/courses");
  }, [router]);

  return null;
}
