"use client";

import { useEffect, useMemo, useState } from "react";

type FallingTextProps = {
  text: string;
  highlightWords?: string[];
  trigger?: "hover" | "click";
  fontSize?: string;
  gravity?: number;
  restoreDelay?: number;
  className?: string;
};

export function FallingText({ text, highlightWords = [], trigger = "hover", fontSize = "2rem", gravity = 1, restoreDelay = 2, className = "" }: FallingTextProps) {
  const [active, setActive] = useState(false);
  const [cycle, setCycle] = useState(0);
  const highlights = new Set(highlightWords.map(w => w.toLowerCase()));
  const parts = useMemo(() => text.split(/(\s+)/), [text]);
  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(() => setActive(false), Math.max(0, restoreDelay) * 1000);
    return () => clearTimeout(timer);
  }, [active, cycle, restoreDelay]);
  const fall = () => { setCycle(n => n + 1); setActive(true); };
  return <div
    className={`rb-falling group relative flex h-full w-full flex-wrap content-center items-center justify-center gap-y-2 overflow-hidden text-center font-black leading-tight ${className}`}
    style={{ fontSize }}
    onMouseEnter={trigger === "hover" ? fall : undefined}
    onClick={trigger === "click" ? fall : undefined}
    role="button"
    tabIndex={0}
    aria-label={`${text}. ${trigger === "hover" ? "Hover or press Enter" : "Click or press Enter"} to animate.`}
    onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fall(); } }}
  >
    <span className="sr-only">{text}</span>
    {parts.map((part, wi) => part.trim() ? <span aria-hidden="true" key={wi} className="inline-flex whitespace-nowrap">
      {Array.from(part).map((letter, li) => {
        const delay = ((wi * 5 + li * 3) % 17) * 0.037;
        const sign = ((wi + li) % 2 ? -1 : 1);
        return <span key={li} className={`rb-falling-char inline-block ${highlights.has(part.replace(/[^\w]/g, "").toLowerCase()) ? "text-amber-400" : "text-sky-100"} ${active ? "is-falling" : ""}`}
          style={{ "--fall-delay": `${delay}s`, "--fall-distance": `${Math.min(140, 50 + gravity * 58 + (li % 4) * 7)}px`, "--fall-angle": `${sign * (17 + (wi % 3) * 11)}deg` } as React.CSSProperties}>{letter}</span>;
      })}
    </span> : <span aria-hidden="true" key={wi} className="whitespace-pre">{" "}</span>)}
    <style jsx>{`
      .rb-falling-char { filter:drop-shadow(0 2px 10px rgba(56,189,248,.36)); }
      .rb-falling-char.is-falling { animation:rb-falling-drop 1.35s cubic-bezier(.18,.76,.25,1) var(--fall-delay) both; }
      @keyframes rb-falling-drop { 0% {transform:translateY(-26px) rotate(0);opacity:.5} 30% {transform:translateY(var(--fall-distance)) rotate(var(--fall-angle));opacity:1} 56%{transform:translateY(25px) rotate(calc(var(--fall-angle) * -.35))} 76%{transform:translateY(-10px) rotate(5deg)} 100%{transform:translateY(0) rotate(0);opacity:1} }
      @media(prefers-reduced-motion:reduce){.rb-falling-char.is-falling{animation:none}}
    `}</style>
  </div>;
}

export function Topography({ className = "" }: { className?: string }) {
  const paths = useMemo(() => Array.from({ length: 19 }, (_, i) => {
    const y = 60 + i * 26;
    return `M -80 ${y} C 65 ${y - 95 + i * 2}, 100 ${y + 140 - i * 2}, 270 ${y + 15} S 510 ${y - 130 + i}, 680 ${y - 15} S 945 ${y + 125 - i * 2}, 1120 ${y - 25}`;
  }), []);
  return <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
    <svg viewBox="0 0 1040 650" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs><linearGradient id="tools-topo" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#38bdf8"/><stop offset="55%" stopColor="#a78bfa"/><stop offset="100%" stopColor="#facc15"/></linearGradient></defs>
      <g fill="none" stroke="url(#tools-topo)" strokeWidth="1.4">{paths.map((path, index) => <path key={index} d={path} className="rb-topo-path" style={{animationDelay:`${index * -.19}s`,opacity:.11 + index * .012}} />)}</g>
    </svg>
    <style jsx>{`
      .rb-topo-path {stroke-dasharray:18 14;animation:rb-contour 28s linear infinite;}
      @keyframes rb-contour{to{stroke-dashoffset:-640}}
      @media(prefers-reduced-motion:reduce){.rb-topo-path{animation:none}}
    `}</style>
  </div>;
}

export function SplitFlap({ words = ["STABILITY", "OPPORTUNITY", "COMMUNITY"], className = "" }: { words?: string[]; className?: string }) {
  const [index, setIndex] = useState(0);
  const [flip, setFlip] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => { setFlip(true); setIndex(i => (i + 1) % words.length); }, 3400);
    return () => clearInterval(timer);
  }, [words.length]);
  useEffect(() => { if (!flip) return; const timer = setTimeout(() => setFlip(false), 700); return () => clearTimeout(timer); }, [flip, index]);
  const word = words[index] ?? "";
  return <div aria-label={`Our focus: ${word}`} className={`inline-flex flex-wrap items-center gap-[2px] ${className}`}>
    {Array.from(word).map((letter, i) => <span key={`${index}-${i}`} aria-hidden="true" className={`rb-flap relative inline-flex h-9 min-w-6 items-center justify-center overflow-hidden rounded-[3px] border border-amber-300/30 bg-[#101E33] px-1 font-mono text-base font-black text-amber-200 shadow-md sm:h-11 sm:min-w-8 sm:text-xl`} style={{animationDelay:`${i * 55}ms`}}>
      <span className="absolute left-0 right-0 top-1/2 h-px bg-black/60"/>{letter}
      <style jsx>{`
        .rb-flap{transform-origin:center;animation:rb-flap-turn .65s ease-in-out both}
        @keyframes rb-flap-turn{0%{transform:rotateX(-87deg);filter:brightness(2)}55%{transform:rotateX(21deg)}100%{transform:rotateX(0);filter:brightness(1)}}
        @media(prefers-reduced-motion:reduce){.rb-flap{animation:none}}
      `}</style>
    </span>)}
  </div>;
}
