"use client";

import { useEffect } from "react";
import { useBgAgents } from "@/lib/agents/use-bg-agents";

export default function BackgroundAgentsBootstrap() {
  // Ensure the background agents are bootstrapped even when UI widgets are hidden
  // Calling the hook mounts the agents; nothing needs to be rendered.
  const _ = useBgAgents();

  useEffect(() => {
    // no-op; hook runs on mount
  }, []);

  return null;
}
