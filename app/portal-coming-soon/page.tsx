import { Navbar } from "@/components/ui/Navbar";
import { Button } from "@/components/ui/Button";

export default function PortalComingSoon() {
  return (
    <main className="min-h-screen bg-bg">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      <Navbar />

      {/* Coming Soon Section */}
      <section className="mx-auto max-w-container px-7 pt-24 pb-16 min-h-[80vh] flex items-center justify-center">
        <div className="text-center max-w-3xl">
          <div className="mb-8 inline-block px-4 py-2 rounded-full bg-brand/10 border border-brand/30">
            <span className="text-sm font-semibold text-brand">Coming Soon</span>
          </div>
          
          <h1 className="h1 mb-6">
            <span className="bg-gradient-to-r from-brand to-brand2 bg-clip-text text-transparent">
              Client Portal
            </span>
          </h1>

          <p className="p-lead max-w-2xl mx-auto mb-8">
            We're building a powerful new platform to help you access resources, track your progress, 
            and connect with your support team. The T.O.O.L.S Inc Client Portal will provide 
            personalized tools for your journey to success.
          </p>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 text-left">
            <div className="glass p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Personal Dashboard</h3>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                Track your goals, milestones, and progress all in one centralized location.
              </p>
            </div>

            <div className="glass p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-brand2/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-brand2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Educational Resources</h3>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                Access courses, training programs, and materials tailored to your interests.
              </p>
            </div>

            <div className="glass p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">AI Motivation Coach</h3>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                Receive personalized encouragement and support throughout your journey.
              </p>
            </div>

            <div className="glass p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold">Case Manager Connection</h3>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                Stay connected with your support team and access assistance when you need it.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-4">
            <p className="text-muted font-medium">
              Interested in early access? Get in touch with our team.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button variant="primary" href="/interest">
                Submit Interest Form
              </Button>
              <Button variant="ghost" href="/">
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
