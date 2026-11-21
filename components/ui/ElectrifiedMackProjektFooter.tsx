"use client";

import FallingText from "@/components/ui/ReactBitsFallingText";

/** Official MackProjekt footer credit using React Bits FallingText and Matter.js. */
export function ElectrifiedMackProjektFooter() {
  return (
    <footer data-provenance="tools-legacy-2023" className="mack-footer relative isolate overflow-hidden border-t border-sky-400/15 bg-[#090D14] px-5 py-5 text-center text-slate-300">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,rgba(125,211,252,.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(125,211,252,.10)_1px,transparent_1px)] [background-size:46px_46px]" />
      <div className="relative mx-auto max-w-5xl">
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
          <div className="relative z-10 w-full max-w-[760px] rounded-xl border border-sky-300/10 bg-[#090D14]/65 px-1 pb-1 pt-2">
            <a href="https://mackprojekt.com" aria-label="Visit A MackProjekt" className="mx-auto block w-fit rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400">
              <span className="relative block h-9 w-16 overflow-hidden sm:h-10 sm:w-[72px]" aria-hidden="true">
                <img src="/brand/mackprojekt-primary.webp" alt="" className="absolute left-1/2 top-0 w-16 max-w-none -translate-x-1/2 object-contain sm:w-[72px] drop-shadow-[0_0_12px_rgba(56,189,248,.38)]" />
              </span>
            </a>
            <div className="h-20 w-full sm:h-24"><FallingText text="POWERED BY A MACKPROJEKT" highlightWords={["MACKPROJEKT"]} highlightClass="font-black" trigger="hover" variant="text" split="letters" gravity={1} bounciness={0.2} scatter={0.5} stagger={0.03} order="random" cursorPush={0.5} mouseConstraintStiffness={0.2} restoreDelay={2} accentColor="#38bdf8" fontSize="clamp(1rem,3.3vw,1.5rem)" draggable wireframes={false} className="font-black tracking-[.055em] text-sky-200" /></div>
            <p className="pointer-events-none -mt-2 pb-1 text-[9px] font-bold uppercase tracking-[.22em] text-sky-300/70">Hover to scatter, then drag the letters</p>
          </div>
        </div>
        <div className="mx-auto mt-2 h-px w-full max-w-lg bg-gradient-to-r from-transparent via-sky-500/45 to-transparent" />
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-slate-400">
          <span>© 2026 T.O.O.L.S. Inc. All rights reserved.</span><span aria-hidden="true">·</span>
          <span>Technology by independent company</span>
          <a href="https://mackprojekt.com" className="font-bold text-sky-300 underline-offset-4 hover:underline">A MackProjekt</a>
        </div>
        <div className="mt-3 text-center text-[11px] leading-relaxed text-slate-400">
          <p className="font-bold text-amber-300">A MACK — DONALD TERRY MACK&apos;S LEGACY</p>
          <p>Established 2023 · Independent business or DBA · Ownership details maintained in private records</p>
          <p>Proprietary materials — All rights reserved. Intellectual property remains with T.O.O.L.S. Inc. or its respective rights holders.</p>
        </div>
        <nav aria-label="Follow T.O.O.L.S. Inc. on social media" className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold">
          <a href="https://www.instagram.com/sd_t.o.o.ls_inc/" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-fuchsia-300/30 bg-fuchsia-300/10 px-4 py-2 text-fuchsia-200 transition hover:bg-fuchsia-300/20">Instagram</a>
          <a href="https://www.facebook.com/people/TOOLs-Inc/61556483926772/" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-blue-300/30 bg-blue-300/10 px-4 py-2 text-blue-200 transition hover:bg-blue-300/20">Facebook</a>
        </nav>
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
        @keyframes mack-lightning { 0% {stroke-dashoffset:1000;opacity:0} 7%{opacity:1} 78%{opacity:1} 100%{stroke-dashoffset:0;opacity:0} }
        @keyframes mack-flicker { 0%,23%,57%,100%{opacity:.2} 12%,39%,82%{opacity:.95} }
        @media (prefers-reduced-motion:reduce) {.electric-main,.electric-branch{animation:none;opacity:1;transform:none;stroke-dashoffset:0;stroke-dasharray:none;}}
      `}</style>
    </footer>
  );
}
