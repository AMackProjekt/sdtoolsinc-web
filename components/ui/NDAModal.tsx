"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/cn";

interface NDAModalProps {
  onAccept: () => void;
  title?: string;
}

export function NDAModal({ onAccept, title = "Confidentiality Agreement" }: NDAModalProps) {
  const [accepted, setAccepted] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;
    setScrolledToBottom(atBottom);
  };

  const handleAccept = () => {
    if (accepted) {
      localStorage.setItem("nda_accepted", "true");
      localStorage.setItem("nda_accepted_date", new Date().toISOString());
      onAccept();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="flex h-full max-h-screen max-w-2xl w-full flex-col rounded-2xl bg-white shadow-2xl md:max-h-[90vh]">
        {/* Header */}
        <div className="border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-blue-50 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100">
              <AlertCircle className="text-cyan-600" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-500">T.O.O.L.S Inc — Enterprise Demo Portal</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div onScroll={handleScroll} className="flex-1 overflow-y-auto px-6 py-6 text-sm leading-relaxed text-gray-700">
          <div className="space-y-4 text-justify">
            <section>
              <h2 className="font-bold text-gray-900">1. CONFIDENTIALITY AGREEMENT</h2>
              <p>
                This Confidentiality Agreement ("Agreement") is entered into as of the date of acceptance between T.O.O.L.S Inc ("Company") and the user ("Recipient") accessing this Enterprise Demo Portal.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-gray-900">2. PROPRIETARY INFORMATION</h2>
              <p>
                The Recipient acknowledges that the Enterprise Demo Portal contains proprietary, confidential, and trade secret information owned exclusively by the Company. This includes but is not limited to: software architecture, algorithms, business logic, data models, source code structure, UI/UX designs, performance metrics, security implementations, and operational procedures.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-gray-900">3. OBLIGATIONS OF RECIPIENT</h2>
              <p>The Recipient agrees to:</p>
              <ul className="ml-4 space-y-1">
                <li>• Maintain strict confidentiality of all proprietary information disclosed through this portal</li>
                <li>• Use this demo solely for authorized evaluation purposes</li>
                <li>• Restrict access to authorized personnel only with explicit written permission</li>
                <li>• Implement reasonable security measures to prevent unauthorized disclosure</li>
                <li>• Not reverse engineer, decompile, or attempt to extract source code or technical specifications</li>
                <li>• Not copy, reproduce, or create derivative works from any materials within this portal</li>
                <li>• Not share screenshots, recordings, or documentation without prior written consent</li>
                <li>• Return or destroy all proprietary information upon termination of access</li>
              </ul>
            </section>

            <section>
              <h2 className="font-bold text-gray-900">4. RESTRICTIONS ON USE</h2>
              <p>The Recipient shall NOT:</p>
              <ul className="ml-4 space-y-1">
                <li>• Sublicense, resell, or allow third parties to access this demo portal</li>
                <li>• Use this portal for competitive purposes or benchmarking against competitor solutions</li>
                <li>• Extract data or perform load testing without explicit authorization</li>
                <li>• Attempt to bypass, circumvent, or disable security controls</li>
                <li>• Use this portal for any unlawful, harassing, or malicious purpose</li>
                <li>• Access systems or data beyond what is provided in the demo interface</li>
              </ul>
            </section>

            <section>
              <h2 className="font-bold text-gray-900">5. TERM AND TERMINATION</h2>
              <p>
                This Agreement remains in effect for the duration of the demo access period. The Company reserves the right to terminate access immediately and without notice if: (a) this Agreement is violated; (b) suspicious activity is detected; or (c) at the Company's sole discretion. Obligations regarding confidentiality survive termination indefinitely.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-gray-900">6. INTELLECTUAL PROPERTY</h2>
              <p>
                All intellectual property rights, including but not limited to patents, copyrights, trademarks, and trade secrets, remain the exclusive property of T.O.O.L.S Inc. No license or ownership rights are granted to the Recipient except for the limited right to evaluate the demo.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-gray-900">7. NO WARRANTY & LIABILITY LIMITATION</h2>
              <p>
                This demo portal is provided "AS IS" without warranties of any kind, express or implied. The Company shall not be liable for any damages, including direct, indirect, incidental, special, or consequential damages, arising from use of this portal or inability to use it.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-gray-900">8. MONITORING & AUDIT RIGHTS</h2>
              <p>
                The Company reserves the right to: (a) monitor user activity within the portal; (b) audit compliance with this Agreement; (c) record usage patterns and system interactions; (d) enforce restrictions through technical or legal means. All monitoring is conducted in accordance with applicable laws.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-gray-900">9. GOVERNING LAW</h2>
              <p>
                This Agreement shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Both parties consent to exclusive jurisdiction in federal and state courts located in the Company's principal place of business.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-gray-900">10. ENTIRE AGREEMENT</h2>
              <p>
                This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, and agreements. No waiver of any provision is effective unless in writing signed by both parties.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-gray-900">11. ACKNOWLEDGMENT</h2>
              <p>
                By accepting this Agreement, the Recipient acknowledges that: (a) they have read and understand all terms; (b) they are authorized to agree on behalf of any organization they represent; (c) they consent to monitoring and audit; (d) they understand the legal consequences of breach; (e) they accept all limitations of liability.
              </p>
            </section>

            <p className="mt-6 border-t border-gray-200 pt-6 font-semibold text-gray-900">
              For questions regarding this Agreement, contact: legal@sdtoolsinc.org
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-cyan-600"
            />
            <span className="text-sm font-medium text-gray-700">
              I have read and agree to the Confidentiality Agreement above
            </span>
          </label>

          {!scrolledToBottom && (
            <p className="text-xs text-amber-600 font-medium">📜 Please scroll down to read the full agreement</p>
          )}

          <button
            onClick={handleAccept}
            disabled={!accepted || !scrolledToBottom}
            className={cn(
              "w-full rounded-lg px-4 py-3 font-semibold text-white transition-all",
              accepted && scrolledToBottom
                ? "bg-cyan-600 hover:bg-cyan-700 active:scale-95"
                : "cursor-not-allowed bg-gray-300 text-gray-500"
            )}
          >
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 size={18} />
              Accept & Continue to Demo
            </div>
          </button>

          <p className="text-[11px] text-gray-500 text-center">
            By clicking Accept, you certify that you have authority to agree to this Confidentiality Agreement on behalf of yourself and any organization you represent.
          </p>
        </div>
      </div>
    </div>
  );
}
