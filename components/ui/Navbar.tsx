"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const mainLinks = [
  { href: "/#platform", label: "Programs" },
  { href: "/reentry", label: "Reentry" },
  { href: "/resources", label: "Resources" },
  { href: "/partnerships", label: "Partnerships" },
];

const moreLinks = [
  { href: "/#dashboard", label: "Impact" },
  { href: "/demos", label: "Demos" },
  { href: "/referral", label: "Referral & Contact" },
  {
    href: "mailto:news@sdtoolsinc.org?subject=Subscribe%20to%20Newsletter",
    label: "Newsletter",
  },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-container items-center justify-between gap-5 px-4 py-3 sm:px-7">
        <motion.a
          href="/"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex shrink-0 items-center gap-2.5"
          aria-label="T.O.O.L.S. Inc. home"
        >
          <img
            src="/logos/main-logo.png"
            alt=""
            className="h-9 w-auto object-contain sm:h-10"
          />
          <span className="hidden text-sm font-extrabold tracking-tight text-text sm:block">
            T.O.O.L.S. Inc.
          </span>
        </motion.a>

        <div className="hidden min-w-0 flex-1 items-center justify-end gap-5 xl:flex">
          <nav className="flex items-center gap-5" aria-label="Primary navigation">
            {mainLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="whitespace-nowrap text-sm font-medium text-muted transition hover:text-text"
              >
                {link.label}
              </a>
            ))}

            <details className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-1 whitespace-nowrap text-sm font-medium text-muted transition hover:text-text [&::-webkit-details-marker]:hidden">
                More
                <svg className="h-3.5 w-3.5 transition group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <div className="absolute right-0 top-full mt-3 w-52 rounded-xl border border-border bg-bg/95 p-2 shadow-[0_18px_50px_rgba(0,0,0,.45)] backdrop-blur-xl">
                {moreLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-white/5 hover:text-text"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </details>
          </nav>

          <div className="flex items-center gap-2 border-l border-border pl-5">
            <a
              href="/first-steps"
              className="whitespace-nowrap rounded-lg border border-brand/40 px-3.5 py-2 text-sm font-semibold text-brand transition hover:border-brand hover:bg-brand/10 hover:text-brand2"
            >
              New to Reentry?
            </a>
            <a
              href="/portal/portals"
              className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-gradient-to-br from-brand to-brand2 px-3.5 py-2 text-sm font-semibold text-[#02131a] shadow-[0_8px_24px_rgba(0,0,0,.3)] transition hover:-translate-y-0.5"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Zm10 0a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V6ZM4 16a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2Zm10 0a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2Z" />
              </svg>
              Portals
            </a>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="rounded-lg border border-border p-2 text-text transition hover:border-brand/50 hover:text-brand xl:hidden"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {mobileMenuOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <motion.div
          id="mobile-navigation"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="border-t border-border bg-bg/95 backdrop-blur-xl xl:hidden"
        >
          <nav className="mx-auto max-w-container px-4 py-5 sm:px-7" aria-label="Mobile navigation">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[...mainLinks, ...moreLinks].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted transition hover:bg-white/5 hover:text-text"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
              <a
                href="/first-steps"
                onClick={closeMobileMenu}
                className="rounded-lg border border-brand/40 px-4 py-3 text-center text-sm font-semibold text-brand transition hover:bg-brand/10"
              >
                New to Reentry?
              </a>
              <a
                href="/portal/portals"
                onClick={closeMobileMenu}
                className="rounded-lg bg-gradient-to-br from-brand to-brand2 px-4 py-3 text-center text-sm font-semibold text-[#02131a]"
              >
                Open My Portals
              </a>
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  );
}
