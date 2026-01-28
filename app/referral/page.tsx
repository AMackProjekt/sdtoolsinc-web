import { Navbar } from "@/components/ui/Navbar";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";

export default function ReferralPage() {
  return (
    <main className="min-h-screen bg-bg">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      <Navbar />

      <section className="mx-auto max-w-container px-7 pt-24 pb-16">
        <div className="text-center">
          <div className="mb-3 text-xs font-semibold tracking-[0.18em] text-brand2 uppercase">
            Get Started
          </div>
          <h1 className="h1">Referral Form</h1>
          <p className="mx-auto mt-6 max-w-[760px] p-lead">
            Justice Involved
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-[800px]">
          <GlowCard className="p-8 md:p-12">
            <div className="space-y-6 sm:space-y-8">
              {/* QR Code Section */}
              <div className="flex flex-col items-center gap-4 sm:gap-6">
                <div className="rounded-xl bg-panel border border-border p-6 sm:p-8 shadow-glow">
                  <div className="rounded-lg bg-white p-3 sm:p-4">
                    <img
                      src="/referral-qr.png"
                      alt="QR Code for Referral Form"
                      className="h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 object-contain"
                    />
                  </div>
                </div>

                <div className="text-center px-4">
                  <p className="text-base sm:text-lg font-semibold text-text">
                    Scan the QR code and fill out the form
                  </p>
                  <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-muted leading-relaxed">
                    Non-Referral Agents please input <span className="font-semibold text-text">N/A</span> in the fields that do not apply to you.
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-panel px-4 text-muted">Or</span>
                </div>
              </div>

              {/* Direct Link Section */}
              <div className="text-center space-y-4">
                <p className="text-sm text-muted">
                  If unable to scan QR code, please visit:
                </p>
                
                {/* Form Preview Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/20">
                  <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-xs font-semibold text-brand">Secure Microsoft Form</span>
                </div>
                
                <a
                  href="https://forms.office.com/r/G0kkRW4F7q"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button variant="primary">
                    📋 Open Referral Form
                  </Button>
                </a>
                <p className="text-xs text-muted font-mono break-all">
                  https://forms.office.com/r/G0kkRW4F7q
                </p>
              </div>
            </div>
          </GlowCard>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted">
              Need assistance? <a href="/#contact" className="text-brand hover:text-brand2 transition-colors">Contact us</a>
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
