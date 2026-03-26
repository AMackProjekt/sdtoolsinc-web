"use client";

import { useEffect, useState } from "react";
import PortalChat from "@/components/PortalChat";

export default function StaffMessages() {
  const [initialClientName, setInitialClientName] = useState<string | null>(null);
  const [initialClientId, setInitialClientId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setInitialClientName(params.get("client"));
    setInitialClientId(params.get("clientEmail"));
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-black text-charcoal-900 tracking-tight">
          Champions <span className="text-slate-600">Channel</span>.
        </h1>
        <p className="text-slate-500 mt-2 font-medium">
          Monitor live participant conversations and respond from the staff portal in real time.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-[0.24em] text-slate-700">
            Staff Inbox
          </div>
          <h2 className="mt-4 text-2xl font-black text-charcoal-900">Direct participant messaging</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Every message sent from the client portal lands here instantly. Open a participant conversation, reply from the
            shared Champions inbox, and keep communication in one audited workflow.
          </p>
          <div className="mt-6 space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-bold text-slate-700">Channel behavior</p>
            <p>Participants appear as separate threads in the left rail.</p>
            <p>Image attachments stay inside the portal thread for follow-up context.</p>
            <p>Links from caseload profiles can open the matching participant conversation here.</p>
          </div>
        </section>

        <PortalChat
          role="staff"
          variant="embedded"
          initialContactId={initialClientId}
          initialContactName={initialClientName}
        />
      </div>
    </div>
  );
}
