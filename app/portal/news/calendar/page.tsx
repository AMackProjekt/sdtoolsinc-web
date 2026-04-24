import Link from "next/link";

export default function NewsCalendarPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-text">Editorial Calendar</h1>
      <p className="mt-2 text-sm text-muted">Calendar scheduling is being prepared for newsroom workflows.</p>
      <div className="mt-6 text-sm">
        <Link className="text-rose-400 hover:text-rose-300" href="/portal/news/dashboard">Back to News Dashboard</Link>
      </div>
    </div>
  );
}
