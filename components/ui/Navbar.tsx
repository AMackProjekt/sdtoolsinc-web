"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./Button";
import { Mail, Phone, ChevronDown } from "lucide-react";

export function Navbar() {
  const [orgName, setOrgName] = useState("T.O.O.LS Inc");
  const [contactOpen, setContactOpen] = useState(false);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/enterprise/org")
      .then((r) => r.json())
      .then((d) => { if (d.settings?.org_name) setOrgName(d.settings.org_name); })
      .catch(() => {});
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (contactRef.current && !contactRef.current.contains(e.target as Node)) {
        setContactOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-container items-center justify-between px-7 py-4">
        <motion.a
          href="/"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-center gap-3"
        >
          <img
            src="/logos/main-logo.png"
            alt={`${orgName} Logo`}
            className="h-10 w-auto object-contain"
          />
          <span className="font-extrabold tracking-tight text-text">
            {orgName}
          </span>
        </motion.a>

        <nav className="hidden items-center gap-6 md:flex">
          <a className="text-sm font-medium text-muted hover:text-text" href="/#platform">Programs</a>
          <a className="text-sm font-medium text-muted hover:text-text" href="/#dashboard">Impact</a>
          <a className="text-sm font-medium text-muted hover:text-text" href="/partnerships">Partnerships</a>
          <a className="text-sm font-medium text-muted hover:text-text" href="/referral">Referral</a>

          {/* Contact dropdown */}
          <div ref={contactRef} className="relative">
            <button
              onClick={() => setContactOpen((o) => !o)}
              className="flex items-center gap-1 text-sm font-medium text-muted hover:text-text transition"
            >
              Contact
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${contactOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {contactOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-full mt-3 w-72 rounded-xl border border-border bg-panel/95 backdrop-blur-xl p-4 shadow-xl z-50"
                >
                  {/* Technical Support */}
                  <div className="mb-4">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-2">Technical Help</p>
                    <a
                      href="mailto:support@sdtoolsinc.org"
                      className="flex items-center gap-2 text-sm text-text hover:text-brand transition"
                      onClick={() => setContactOpen(false)}
                    >
                      <Mail className="h-4 w-4 text-brand shrink-0" />
                      support@sdtoolsinc.org
                    </a>
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-2">Direct Contact</p>
                    <p className="text-sm font-semibold text-text mb-1">
                      Donyale <span className="text-brand">"DThree"</span> Mack
                    </p>
                    <a
                      href="mailto:dmack@sdtoolsinc.org"
                      className="flex items-center gap-2 text-sm text-muted hover:text-text transition mb-1"
                      onClick={() => setContactOpen(false)}
                    >
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      dmack@sdtoolsinc.org
                    </a>
                    <a
                      href="tel:6193507638"
                      className="flex items-center gap-2 text-sm text-muted hover:text-text transition"
                      onClick={() => setContactOpen(false)}
                    >
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      (619) 350-7638
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" className="hidden sm:inline-flex">
            <a href="/portal">Portal</a>
          </Button>
          <Button variant="primary">
            <a href="mailto:support@sdtoolsinc.org">Get Support</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
