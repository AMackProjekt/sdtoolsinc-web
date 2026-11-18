"use client";

import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { CloudSun, Cloud, MoonStar, Sunset, RefreshCw } from "lucide-react";
import { getLiveSanDiegoLighting, sanDiegoClockLighting } from "@/lib/sanDiegoLighting";
import type { LightingPhase, SanDiegoLighting } from "@/lib/sanDiegoLighting";

type Selection = LightingPhase | "auto";
const modes: { phase: LightingPhase; label: string; icon: typeof CloudSun }[] = [
  { phase: "clear_day", label: "Daylight", icon: CloudSun },
  { phase: "overcast_day", label: "Marine layer", icon: Cloud },
  { phase: "golden_hour", label: "Golden hour", icon: Sunset },
  { phase: "night", label: "Night", icon: MoonStar },
];

export function HeroLighting({ children }: { children: ReactNode }) {
  // Deterministic SSR markup. The correct San Diego clock fallback is applied immediately on mount.
  const [lighting, setLighting] = useState<SanDiegoLighting>({
    phase: "clear_day", isDay: true, cloudCover: 0,
    weatherCode: -1, sunElevationFactor: 0.7, source: "clock-fallback",
  });
  const [selection, setSelection] = useState<Selection>("auto");

  useEffect(() => {
    let active = true;
    let controller: AbortController | undefined;
    const refresh = async () => {
      controller?.abort();
      controller = new AbortController();
      const fallback = sanDiegoClockLighting();
      if (active) setLighting(current => current.source === "open-meteo" ? current : fallback);
      try {
        const live = await getLiveSanDiegoLighting(controller.signal);
        if (active) setLighting(live);
      } catch {
        if (active) setLighting(sanDiegoClockLighting());
      }
    };
    void refresh();
    const interval = window.setInterval(() => { void refresh(); }, 10 * 60_000);
    const onVisible = () => { if (document.visibilityState === "visible") void refresh(); };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      active = false; controller?.abort(); window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const phase = selection === "auto" ? lighting.phase : selection;
  const style = { "--sun-elevation": String(lighting.sunElevationFactor) } as CSSProperties;
  const activeLabel = modes.find(mode => mode.phase === phase)?.label ?? "Daylight";

  return (
    <section id="home" className="hero-skyline relative isolate overflow-hidden border-b border-white/10 bg-[#060D1A]"
      data-phase={phase} data-lighting-source={lighting.source} style={style}>
      <div aria-hidden="true" className="skyline-bg pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 top-3 z-20 flex justify-center px-4 sm:justify-end sm:pr-8">
        <div className="pointer-events-auto flex max-w-full flex-wrap items-center gap-1 rounded-xl border border-white/25 bg-[#071120]/90 px-2 py-1.5 text-xs font-semibold text-white backdrop-blur-md"
          aria-label="San Diego skyline lighting controls">
          <span className="mr-1 hidden sm:inline" aria-live="polite">San Diego: {activeLabel}{selection === "auto" && lighting.source === "clock-fallback" ? " · clock estimate" : ""}</span>
          <button type="button" onClick={() => setSelection("auto")} aria-pressed={selection === "auto"}
            className={`rounded-md px-2 py-1.5 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300 ${selection === "auto" ? "bg-amber-400 text-[#071120]" : "text-white"}`}>
            Auto
          </button>
          {modes.map(({ phase: mode, label, icon: Icon }) => (
            <button type="button" key={mode} aria-label={`Preview San Diego ${label}`} title={label}
              aria-pressed={selection === mode} onClick={() => setSelection(mode)}
              className={`rounded-md p-1.5 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300 ${selection === mode ? "bg-amber-400 text-[#071120]" : "text-white"}`}>
              <Icon size={16} />
            </button>
          ))}
          {selection === "auto" && lighting.source === "open-meteo" && <span className="sr-only">Live solar and weather conditions active</span>}
          <span className="sr-only"><RefreshCw size={12} /> Updated automatically every ten minutes</span>
        </div>
      </div>
      <div className="relative z-10">{children}</div>
    </section>
  );
}
