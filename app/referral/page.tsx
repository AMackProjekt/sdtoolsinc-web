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
          <h1 className="h1">Referral & Contact</h1>
          <p className="mx-auto mt-6 max-w-[760px] p-lead">
            Submit a referral for justice-involved individuals or get in touch with our team
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-[800px]">
          <GlowCard className="p-8 md:p-12">
            <div className="space-y-8">
              {/* QR Code Section */}
              <div className="flex flex-col items-center gap-6">
                <div className="rounded-xl bg-panel border border-border p-8 shadow-glow">
                  <div className="rounded-lg bg-white p-4">
                    <img
                      src="/referral-qr.png"
                      alt="QR Code for Referral Form"
                      className="h-48 w-48 object-contain"
                    />
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-lg font-semibold text-text">
                    Scan the QR code and fill out the form
                  </p>
                  <p className="mt-4 text-sm text-muted leading-relaxed">
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
                <a
                  href="https://forms.office.com/r/G0kkRW4F7q"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button variant="primary">
                    Open Referral Form
                  </Button>
                </a>
                <p className="text-xs text-muted font-mono break-all">
                  https://forms.office.com/r/G0kkRW4F7q
                </p>
              </div>
            </div>
          </GlowCard>

          {/* Contact Information */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlowCard className="p-6 text-center">
              <div className="text-2xl mb-3">📧</div>
              <div className="text-sm font-semibold text-brand2 uppercase tracking-wider mb-2">
                For More Information
              </div>
              <a href="mailto:info@sdtoolsinc.org" className="text-text hover:text-brand transition-colors">
                info@sdtoolsinc.org
              </a>
            </GlowCard>

            <GlowCard className="p-6 text-center">
              <div className="text-2xl mb-3">📰</div>
              <div className="text-sm font-semibold text-brand2 uppercase tracking-wider mb-2">
                Subscribe to Newsletter
              </div>
              <a href="mailto:news@sdtoolsinc.org?subject=Subscribe%20to%20Newsletter" className="text-text hover:text-brand transition-colors">
                news@sdtoolsinc.org
              </a>
            </GlowCard>

            <GlowCard className="p-6 text-center">
              <div className="text-2xl mb-3">🤝</div>
              <div className="text-sm font-semibold text-brand2 uppercase tracking-wider mb-2">
                Partnership
              </div>
              <a href="mailto:partner@sdtoolsinc.org" className="text-text hover:text-brand transition-colors">
                partner@sdtoolsinc.org
              </a>
            </GlowCard>
          </div>

          {/* Founder Contact */}
          <div className="mt-12">
            <GlowCard className="p-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-xs font-semibold tracking-[0.18em] text-brand2 uppercase mb-4">
                  Leadership
                </div>
                <h3 className="text-2xl font-extrabold tracking-tight text-text mb-2">
                  Founder & CEO
                </h3>
                <p className="text-lg font-semibold text-text mb-1">Mack</p>
                <p className="text-sm text-muted mb-6">
                  Founder & Chief Executive Officer, T.O.O.L.S Inc
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted">📞</span>
                    <a 
                      href="tel:+16193507638" 
                      className="text-text hover:text-brand transition-colors font-medium"
                    >
                      +1 (619) 350-7638
                    </a>
                  </div>
                  <span className="hidden sm:block text-border">|</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted">✉️</span>
                    <a 
                      href="mailto:dmack@sdtoolsinc.org" 
                      className="text-text hover:text-brand transition-colors font-medium"
                    >
                      dmack@sdtoolsinc.org
                    </a>
                  </div>
                </div>
              </div>
            </GlowCard>
          </div>

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
