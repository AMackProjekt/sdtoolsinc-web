"use client";

import { useEffect, useState } from "react";

export function useNDAAccepted() {
  const [accepted, setAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if NDA was accepted
    const ndaAccepted = localStorage.getItem("nda_accepted") === "true";
    setAccepted(ndaAccepted);
    setIsLoading(false);
  }, []);

  return { accepted, isLoading };
}
