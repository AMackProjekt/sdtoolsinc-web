import { Navbar } from "@/components/ui/Navbar";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";

export default function PortalInterestPage() {
  return (
    <main className="min-h-screen bg-bg">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      <Navbar />

      <section className="mx-auto max-w-container px-7 pt-24 pb-16">
        <div className="text-center">
          <div className="mb-3 text-xs font-semibold tracking-[0.18em] text-brand2 uppercase">
            Client Portal
          </div>
          <h1 className="h1">
            <span className="bg-gradient-to-r from-brand to-brand2 bg-clip-text text-transparent">
              Early Access Request
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-[760px] p-lead">
            Be among the first to experience our new Client Portal. 
            Get personalized access to resources, track your progress, and connect with your support team.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-[900px]">
          <GlowCard className="p-8 md:p-10">
            {/* Important Notice */}
            <div className="mb-8 rounded-lg border border-brand/30 bg-brand/5 p-6">
              <div className="space-y-3">
                <p className="text-sm text-text leading-relaxed">
                  The T.O.O.L.S Inc Client Portal is currently in development and will be available soon. 
                  By submitting this form, you&apos;ll be notified when early access becomes available.
                </p>
                <p className="text-sm text-text leading-relaxed">
                  Early access users will receive:
                </p>
                <ul className="text-sm text-text leading-relaxed list-disc list-inside space-y-1 ml-4">
                  <li>Priority onboarding assistance</li>
                  <li>Direct feedback channel to our development team</li>
                  <li>Exclusive access to beta features</li>
                  <li>One-on-one portal training session</li>
                </ul>
              </div>
              <p className="mt-4 text-sm font-semibold text-brand2">
                We&apos;ll respond within 48 hours!
              </p>
            </div>

            {/* Portal Features Preview */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-xl">📊</div>
                  <h3 className="text-sm font-bold">Personal Dashboard</h3>
                </div>
                <p className="text-xs text-muted">
                  Track goals, milestones, and progress in one place
                </p>
              </div>

              <div className="glass p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-xl">📚</div>
                  <h3 className="text-sm font-bold">Educational Resources</h3>
                </div>
                <p className="text-xs text-muted">
                  Access courses and training programs tailored for you
                </p>
              </div>

              <div className="glass p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-xl">🤝</div>
                  <h3 className="text-sm font-bold">Case Manager Connection</h3>
                </div>
                <p className="text-xs text-muted">
                  Stay connected with your support team
                </p>
              </div>

              <div className="glass p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-xl">🎯</div>
                  <h3 className="text-sm font-bold">AI Motivation Coach</h3>
                </div>
                <p className="text-xs text-muted">
                  Receive personalized encouragement and support
                </p>
              </div>
            </div>

            {/* Request Access Button */}
            <div className="text-center space-y-4">
              <a
                href="https://forms.cloud.microsoft/r/G0kkRW4F7q"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary">
                  Request Early Access
                </Button>
              </a>
              <p className="text-xs text-muted">
                Please include &quot;Portal Early Access&quot; in your message
              </p>
            </div>
          </GlowCard>

          {/* Additional Help */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted">
              Have questions? <a href="/#contact" className="text-brand hover:text-brand2 transition-colors">Contact us directly</a>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-container px-7 py-8 text-center">
        <div className="text-xs text-muted">
          © {new Date().getFullYear()} T.O.O.L.S Inc · Empowering individuals to start over and unlock their full potential
        </div>
      </footer>
    </main>
  );
}
