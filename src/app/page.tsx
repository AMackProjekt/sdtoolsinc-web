import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="text-center space-y-6 max-w-2xl px-4">
        <h1 className="text-5xl font-bold text-charcoal-900">
          CaseFlow Command
        </h1>
        <p className="text-lg text-slate-600">
          A modern, secure, and professional case-management platform.
        </p>
        
        <div className="flex gap-4 justify-center mt-8">
          <Link href="/login/staff" className="px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition">
            Staff Portal
          </Link>
          <Link href="/login/client" className="px-6 py-3 bg-white text-teal-700 border border-teal-200 font-medium rounded-lg hover:bg-teal-50 transition">
            Client Portal
          </Link>
        </div>
      </div>
    </main>
  );
}
