import Link from "next/link";

export default function HRSettingsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-text">HR Settings</h1>
      <p className="mt-2 text-sm text-muted">
        HR settings are being finalized. Core HR features remain available in the portal.
      </p>
      <div className="mt-6 rounded-xl border border-border bg-panel p-5">
        <p className="text-sm text-text">Use the quick links below while this section is completed.</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link className="text-amber-400 hover:text-amber-300" href="/portal/hr/dashboard">HR Dashboard</Link>
          <Link className="text-amber-400 hover:text-amber-300" href="/portal/hr/staff">Staff</Link>
          <Link className="text-amber-400 hover:text-amber-300" href="/portal/hr/compliance">Compliance</Link>
        </div>
      </div>
    </div>
  );
}
