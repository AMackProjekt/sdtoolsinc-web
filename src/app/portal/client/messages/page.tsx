import PortalChat from "@/components/PortalChat";

export default function ClientMessages() {
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-black text-charcoal-900 tracking-tight">
          Messaging <span className="text-teal-500">Channel</span>.
        </h1>
        <p className="text-slate-500 mt-2 font-medium">
          Use the Champions Channel to message staff directly from your portal in real time.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <section className="rounded-[2rem] border border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-6 shadow-sm">
          <div className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-[11px] font-black uppercase tracking-[0.24em] text-teal-700">
            Live Support
          </div>
          <h2 className="mt-4 text-2xl font-black text-charcoal-900">Champions Channel</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            This conversation stays inside CaseFlow. Messages sync instantly with the staff portal so you can ask questions,
            send updates, and stay connected without leaving your portal.
          </p>
          <div className="mt-6 space-y-3 rounded-2xl border border-teal-100 bg-white/80 p-4 text-sm text-slate-600">
            <p className="font-bold text-teal-700">What you can do here</p>
            <p>Send secure direct messages to the staff team.</p>
            <p>Share image attachments when you need to show documents or screenshots.</p>
            <p>Keep everything in the same portal where you manage goals and requests.</p>
          </div>
        </section>

        <PortalChat role="client" variant="embedded" />
      </div>
    </div>
  );
}
