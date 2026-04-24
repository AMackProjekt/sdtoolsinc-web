import Link from "next/link";

export default function NewsSettingsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-text">News Settings</h1>
      <p className="mt-2 text-sm text-muted">Newsroom settings are being finalized.</p>
      <div className="mt-6 text-sm">
        <Link className="text-rose-400 hover:text-rose-300" href="/portal/news/dashboard">Back to News Dashboard</Link>
      </div>
    </div>
  );
}
