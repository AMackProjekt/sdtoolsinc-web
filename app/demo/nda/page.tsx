"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NDAModal } from "@/components/ui/NDAModal";

export default function NDAPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleAccept = () => {
    // NDA acceptance is handled in NDAModal
    // Redirect to demo home after storing acceptance
    router.push("/demo");
  };

  if (!isClient) {
    return null;
  }

  return <NDAModal onAccept={handleAccept} />;
}
