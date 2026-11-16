"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Electrified MackProjekt credit. A small, self-contained animation inspired by
 * React Bits Falling Text: glyphs tumble on demand and settle back in place.
 * Pure SVG/CSS; no remote JavaScript or heavy physics dependency.
 */
export function ElectrifiedMackProjektFooter() {
  const [falling, setFalling] = useState(false);
    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const slogan = "POWERED BY A MACKPROJEKT";

  useEffect(() => () => { if (timeout.current) clearTimeout(timeout.current); }, []);

  function trigger() {
    if (timeout.current) clearTimeout(timeout.current);
    setFalling(false);
    requestAnimationFrame(() => setFalling(true));
    timeout.current = setTimeout(() => setFalling(false), 1800);
  }

  return (
    <footer className="mack-footer relative isolate overflow-hidden border-t border-sky-400/15 bg-[#090D14] px-5 py-5 text-center text-slate-300">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,rgba(125,211,252,.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(125,211,252,.10)_1px,transparent_1px)] [background-size:46px_46px]" />
      <div className="relative mx-auto max-w-5xl">
        <a href="https://mackprojekt.com" aria-label="Visit A MackProjekt" className="mx-auto mb-2 block w-fit rounded-xl p-1 transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400">
          <img src="/partnerships/amp-logo.jpeg" alt="A MackProjekt logo" className="mx-auto h-12 w-auto max-w-[140px] object-contain drop-shadow-[0_0_16px_rgba(56,189,248,.30)]" />
        </a>
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[.24em] text-amber-300">Empowering Individuals. Unlocking Potential.</p>
        <div className="relative mx-auto flex max-w-full items-center justify-center overflow-visible py-2">
          <svg aria-hidden="true" viewBox="0 0 1000 110" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
            <defs>
              <linearGradient id="mack-electro" x1="0" x2="1"><stop offset="0%" stopColor="#38bdf8"/><stop offset="48%" stopColor="#e0f2fe"/><stop offset="72%" stopColor="#818cf8"/><stop offset="100%" stopColor="#22d3ee"/></linearGradient>
              <filter id="mack-glow"><feGaussianBlur stdDeviation="6" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            <path className="electric-main" d="M0 77 L120 77 L160 53 L198 92 L240 72 L289 76 L335 40 L360 104 L400 69 L460 78 L506 43 L550 100 L601 71 L658 77 L706 49 L740 94 L792 66 L844 80 L883 58 L930 81 L1000 76" stroke="url(#mack-electro)" strokeWidth="3" fill="none" strokeLinejoin="round" strokeLinecap="round" filter="url(#mack-glow)" />
            <path className="electric-branch" d="M335 40 L305 20 L290 28 M550 100 L576 124 L593 119 M706 49 L724 21 L743 32 M883 58 L912 33" stroke="#7dd3fc" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
          <button aria-label="Replay falling text and electric bolt animation" title="Electrify the footer" type="button" onClick={trigger} className="group relative z-10 max-w-full cursor-pointer rounded-2xl border border-sky-300/10 bg-[#090D14]/85 px-3 py-2 transition hover:border-sky-300/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400 sm:px-8">
            <span aria-hidden="true" className="absolute -inset-3 -z-10 rounded-3xl bg-sky-400/5 blur-xl transition group-hover:bg-sky-400/15" />
            <span aria-label={slogan} className="flex flex-wrap items-center justify-center text-lg font-black tracking-[.07em] sm:text-xl md:text-2xl" >
              {slogan.split(" ").map((word, wi) => <span key={wi} className="inline-flex whitespace-nowrap px-[.18em]">{Array.from(word).map((letter, li) => <span aria-hidden="true" key={li} className={`mack-letter inline-block bg-gradient-to-r from-sky-300 via-blue-300 to-violet-300 bg-clip-text text-transparent ${falling ? "is-falling" : ""}`} style={{ "--letter-delay": `${((wi * 7 + li) % 19) * 45}ms`, "--letter-angle": `${((wi + li) % 2 ? 1 : -1) * (12 + (li % 3) * 7)}deg` } as React.CSSProperties}>{letter}</span>)}</span>)}
            </span>
            <span className="mt-1 block text-[9px] font-bold uppercase tracking-[.22em] text-sky-300/70">Tap to electrify</span>
          </button>
        </div>
        <div className="mx-auto mt-2 h-px w-full max-w-lg bg-gradient-to-r from-transparent via-sky-500/45 to-transparent" />
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-slate-400">
          <span>© 2026 T.O.O.L.S. Inc. All rights reserved.</span><span aria-hidden="true">·</span>
          <span>Technology by independent company</span>
          <a href="https://mackprojekt.com" className="font-bold text-sky-300 underline-offset-4 hover:underline">A MackProjekt</a>
        </div>
        <nav aria-label="Website policies" className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] text-slate-400">
          <a className="hover:text-sky-200" href="/privacy">Privacy</a>
          <a className="hover:text-sky-200" href="/terms">Terms</a>
          <a className="hover:text-sky-200" href="/accessibility">Accessibility</a>
          <a className="hover:text-sky-200" href="/legal">Legal Notices</a>
        </nav>
      </div>
      <style jsx>{`
        .electric-main { stroke-dasharray: 180 820; stroke-dashoffset: 1000; animation: mack-lightning 3.8s linear infinite; }
        .electric-branch { opacity: .6; animation: mack-flicker 2.6s ease-in-out infinite alternate; }
        .mack-letter { filter: drop-shadow(0 0 8px rgba(56,189,248,.35)); }
        .mack-letter.is-falling { animation: mack-fall 1100ms cubic-bezier(.2,.75,.32,1) both; animation-delay: var(--letter-delay); }
        @keyframes mack-lightning { 0% {stroke-dashoffset:1000;opacity:0} 7%{opacity:1} 78%{opacity:1} 100%{stroke-dashoffset:0;opacity:0} }
        @keyframes mack-flicker { 0%,23%,57%,100%{opacity:.2} 12%,39%,82%{opacity:.95} }
        @keyframes mack-fall { 0%{transform:translateY(-70px) rotate(var(--letter-angle)) scale(.86);opacity:0} 48%{opacity:1} 70%{transform:translateY(13px) rotate(-5deg) scale(1.06)} 85%{transform:translateY(-5px) rotate(3deg)} 100%{transform:translateY(0) rotate(0) scale(1);opacity:1} }
        @media (prefers-reduced-motion:reduce) {.electric-main,.electric-branch,.mack-letter.is-falling{animation:none;opacity:1;transform:none;stroke-dashoffset:0;stroke-dasharray:none;}}
      `}</style>
    </footer>
  );
}
