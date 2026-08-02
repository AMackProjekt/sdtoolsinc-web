'use client'

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />
      
      {/* Transparent T.O.O.L.S Logo - 15% opacity */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none -z-5">
        <img
          src="/tools-logo.png"
          alt="T.O.O.L.S Inc"
          className="opacity-15 max-w-[80%] max-h-[80%] object-contain"
        />
      </div>

      {/* Coming Soon Card */}
      <div className="glass rounded-xl p-12 max-w-2xl text-center relative z-10">
        <div className="mb-8">
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-brand to-brand2 bg-clip-text text-transparent">
            TOOLKIT
          </h1>
          <h2 className="text-3xl font-bold mb-2">Client Portal</h2>
          <p className="text-2xl text-brand font-semibold mb-4">Coming Soon</p>
        </div>

        <div className="space-y-4 mb-8">
          <p className="text-lg text-text">
            We're building something special for you.
          </p>
          <p className="text-muted">
            The T.O.O.L.S Inc Client Portal is currently under development. 
            Soon you'll be able to access personalized resources, track your progress, 
            connect with your case manager, and access educational courses all in one place.
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
          <div className="p-4 rounded-lg bg-panel border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-semibold">Personal Dashboard</h3>
            </div>
            <p className="text-sm text-muted">Track your goals and progress</p>
          </div>

          <div className="p-4 rounded-lg bg-panel border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-brand2/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-brand2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-semibold">Course Catalog</h3>
            </div>
            <p className="text-sm text-muted">Access educational programs</p>
          </div>

          <div className="p-4 rounded-lg bg-panel border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold">AI Coach</h3>
            </div>
            <p className="text-sm text-muted">Receive personalized motivation</p>
          </div>

          <div className="p-4 rounded-lg bg-panel border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold">Case Manager Access</h3>
            </div>
            <p className="text-sm text-muted">Connect with your support team</p>
          </div>
        </div>

        {/* Back Button */}
        <a
          href="/auth/login"
          className="inline-block px-6 py-3 bg-brand text-bg font-semibold rounded-lg hover:bg-brand2 transition"
        >
          Back to Login
        </a>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted mb-2">
            © {new Date().getFullYear()} T.O.O.L.S Inc™. All Rights Reserved.
          </p>
          <div className="flex items-center justify-center gap-2">
            <p className="text-xs text-muted">Powered By</p>
            <img
              src="/amp-logo.jpeg"
              alt="A MackProjekt"
              className="h-5 w-auto opacity-80"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
