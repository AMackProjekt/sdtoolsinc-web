"use client";

/**
 * app/desktop-demo/nda/page.tsx
 *
 * NDA gate for the Electron desktop demo. On accept:
 *  - Calls window.electronBridge.acceptNda() to persist acceptance to disk via IPC
 *  - Falls back to localStorage when running in browser (dev mode)
 *  - Redirects to /desktop-demo home
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Shield, X } from "lucide-react";
import { cn } from "@/lib/cn";

// Extend window type for Electron bridge
declare global {
  interface Window {
    electronBridge?: {
      acceptNda: (signerName: string) => Promise<unknown>;
      checkNda: () => Promise<{ accepted?: boolean } | null>;
      clearNda: () => Promise<void>;
      goHome: () => void;
      quit: () => void;
    };
  }
}

export default function DesktopDemoNDAPage() {
  const router = useRouter();
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [checked, setChecked] = useState(false);
  const [signerName, setSignerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check if NDA already accepted
    async function checkPrevious() {
      try {
        if (window.electronBridge) {
          const record = await window.electronBridge.checkNda();
          if (record?.accepted) router.replace("/desktop-demo");
        } else {
          if (localStorage.getItem("desktop_nda_accepted") === "true") {
            router.replace("/desktop-demo");
          }
        }
      } catch {
        // continue to show NDA
      }
    }
    checkPrevious();
  }, [router]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop <= el.clientHeight + 60) {
      setScrolledToBottom(true);
    }
  };

  const canAccept = scrolledToBottom && checked && signerName.trim().length >= 2;

  const handleAccept = async () => {
    if (!canAccept || isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (window.electronBridge) {
        await window.electronBridge.acceptNda(signerName.trim());
      } else {
        localStorage.setItem("desktop_nda_accepted", "true");
        localStorage.setItem("desktop_nda_signer", signerName.trim());
        localStorage.setItem("desktop_nda_date", new Date().toISOString());
      }
      router.push("/desktop-demo");
    } catch {
      setIsSubmitting(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/95 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="flex h-full max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-panel shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border bg-panel/80 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15">
            <Shield className="h-5 w-5 text-sky-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-extrabold tracking-tight text-text">
              Confidentiality Agreement
            </h1>
            <p className="text-xs text-muted">T.O.O.L.S Inc — Desktop Preview · Read carefully before proceeding</p>
          </div>
          <button
            onClick={() => window.electronBridge?.quit?.()}
            className="rounded-lg p-1.5 text-muted hover:bg-slate-700 hover:text-white transition-colors"
            aria-label="Close and exit"
          >
            <X size={16} />
          </button>
        </div>

        {/* Agreement body */}
        <div
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 py-5 text-sm leading-relaxed text-muted"
        >
          <div className="space-y-5">
            <section>
              <h2 className="mb-1 font-bold text-text">1. CONFIDENTIALITY AGREEMENT</h2>
              <p>
                This Confidentiality Agreement (&quot;Agreement&quot;) is entered into as of the date of
                acceptance between T.O.O.L.S Inc (&quot;Company&quot;) and the user
                (&quot;Recipient&quot;) accessing this Desktop Preview Application.
              </p>
            </section>

            <section>
              <h2 className="mb-1 font-bold text-text">2. PROPRIETARY INFORMATION</h2>
              <p>
                The Recipient acknowledges that this Desktop Preview Application contains proprietary,
                confidential, and trade secret information owned exclusively by the Company. This
                includes but is not limited to: software architecture, algorithms, business logic, data
                models, source code structure, UI/UX designs, performance metrics, security
                implementations, and operational procedures.
              </p>
            </section>

            <section>
              <h2 className="mb-1 font-bold text-text">3. OBLIGATIONS OF RECIPIENT</h2>
              <p>The Recipient agrees to:</p>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• Maintain strict confidentiality of all proprietary information</li>
                <li>• Use this preview solely for authorized evaluation purposes</li>
                <li>• Restrict access to authorized personnel only</li>
                <li>• Not reverse engineer, decompile, or extract source code or technical specifications</li>
                <li>• Not copy, reproduce, or create derivative works from any materials</li>
                <li>• Not share screenshots, recordings, or documentation without prior written consent</li>
                <li>• Return or destroy all proprietary information upon termination of access</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-1 font-bold text-text">4. RESTRICTIONS ON USE</h2>
              <p>The Recipient shall NOT use this preview to:</p>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• Compete with the Company or assist competitors</li>
                <li>• Develop similar products or services</li>
                <li>• Solicit Company&apos;s employees, clients, or partners</li>
                <li>• Circumvent any technical protection measures</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-1 font-bold text-text">5. TERM AND TERMINATION</h2>
              <p>
                This Agreement remains in effect for three (3) years from acceptance. The Company
                reserves the right to terminate access at any time for breach of this Agreement.
              </p>
            </section>

            <section>
              <h2 className="mb-1 font-bold text-text">6. REMEDIES</h2>
              <p>
                The Recipient acknowledges that any breach may cause irreparable harm for which
                monetary damages would be inadequate. The Company is entitled to seek injunctive
                relief and any other available legal remedies.
              </p>
            </section>

            <section>
              <h2 className="mb-1 font-bold text-text">7. GOVERNING LAW</h2>
              <p>
                This Agreement is governed by applicable law. Any disputes shall be resolved through
                binding arbitration in the jurisdiction of the Company&apos;s principal place of business.
              </p>
            </section>

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <div className="flex items-start gap-2">
                <AlertCircle size={14} className="mt-0.5 shrink-0 text-amber-400" />
                <p className="text-xs text-amber-300">
                  <strong>IMPORTANT:</strong> By accepting this Agreement, you confirm you have read,
                  understood, and agree to be legally bound by all of its terms.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer — name + checkbox + accept */}
        <div className="border-t border-border bg-panel px-6 py-4 space-y-4">
          {!scrolledToBottom && (
            <p className="text-center text-[11px] text-muted">
              Scroll to the bottom of the agreement to enable acceptance.
            </p>
          )}

          {/* Signer name */}
          <div>
            <label htmlFor="signer-name" className="mb-1.5 block text-xs font-semibold text-text">
              Your Full Name <span className="text-rose-400">*</span>
            </label>
            <input
              id="signer-name"
              type="text"
              autoComplete="name"
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              placeholder="Enter your full legal name"
              className={cn(
                "w-full rounded-lg border bg-bg px-3 py-2 text-sm text-text placeholder:text-muted/50",
                "focus:outline-none focus:ring-2 focus:ring-brand/50",
                "border-border",
              )}
              disabled={!scrolledToBottom}
            />
          </div>

          {/* Checkbox */}
          <label className="flex cursor-pointer items-start gap-3">
            <div className="relative mt-0.5 flex-shrink-0">
              <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                disabled={!scrolledToBottom}
                onChange={(e) => setChecked(e.target.checked)}
              />
              <div
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded border-2 transition-colors",
                  checked
                    ? "border-brand bg-brand/20"
                    : scrolledToBottom
                    ? "border-border bg-transparent hover:border-brand/50"
                    : "border-border/40 bg-transparent opacity-50",
                )}
              >
                {checked && <CheckCircle2 size={12} className="text-brand" />}
              </div>
            </div>
            <span className={cn("text-xs", scrolledToBottom ? "text-muted" : "text-muted/50")}>
              I have read and agree to the full Confidentiality Agreement. I understand this is a
              legally binding document and accept all terms on behalf of myself and my organization.
            </span>
          </label>

          {/* Accept button */}
          <motion.button
            whileHover={canAccept ? { scale: 1.01 } : {}}
            whileTap={canAccept ? { scale: 0.98 } : {}}
            onClick={handleAccept}
            disabled={!canAccept}
            className={cn(
              "w-full rounded-xl py-3 text-sm font-bold transition-all",
              canAccept
                ? "bg-gradient-to-r from-brand to-brand2 text-[#02131a] shadow-glow cursor-pointer"
                : "cursor-not-allowed bg-slate-800 text-slate-500",
            )}
          >
            {isSubmitting ? "Processing…" : "I Accept — Enter Preview"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
