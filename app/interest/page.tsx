import { Navbar } from "@/components/ui/Navbar";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export default function InterestPage() {
  return (
    <main className="min-h-screen bg-bg">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      <Navbar />

      <section className="mx-auto max-w-container px-7 pt-24 pb-16">
        <div className="text-center">
          <div className="mb-3 text-xs font-semibold tracking-[0.18em] text-brand2 uppercase">
            Connect With Us
          </div>
          <h1 className="h1">Interest Form</h1>
        </div>

        <div className="mx-auto mt-12 max-w-[900px]">
          <GlowCard className="p-8 md:p-10">
            {/* Header Notice */}
            <div className="mb-8 text-center px-2">
              <p className="text-base sm:text-lg text-text mb-2">
                Are you an <span className="font-bold text-brand">organization or program</span> looking to add our portal to your services?
              </p>
              <a 
                href="/apps/client-portal/app/program-interest"
                className="inline-block px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-accent to-brand2 text-bg font-semibold rounded-lg hover:opacity-90 transition"
              >
                📋 Schedule a Live Demo for Your Program
              </a>
              <p className="text-xs sm:text-sm text-muted mt-4 px-2">
                Otherwise, continue below to submit an individual interest form
              </p>
            </div>

            <div className="border-t border-border my-8"></div>

            {/* Important Notice */}
            <div className="mb-8 rounded-lg border border-brand/30 bg-brand/5 p-6">
              <p className="text-sm text-text leading-relaxed">
                If filling this form out for a loved one, friend or family member please be sure to put all information 
                so that contact can be made. If the individual is currently incarcerated please fill out this form with 
                your contact information and someone will reach out to you within <span className="font-semibold">48 hours</span>.
              </p>
              <p className="mt-3 text-sm font-semibold text-brand2">
                Thank You for Your Support!
              </p>
            </div>

            {/* QR Code and Mobile Access - Side by Side */}
            <div className="mb-8 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
              {/* QR Code */}
              <div className="flex-shrink-0">
                <div className="rounded-xl bg-white p-3 sm:p-4 shadow-lg">
                  <Image
                    src="/qr-interest-form.webp"
                    alt="QR Code for Interest Form"
                    width={192}
                    height={192}
                    className="h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48"
                    unoptimized
                  />
                </div>
              </div>

              {/* Alternative Text */}
              <div className="flex items-center px-4">
                <p className="text-xs sm:text-sm text-muted text-center md:text-left">
                  If you are having trouble clicking the link or are on a mobile device{" "}
                  <a
                    href="https://forms.cloud.microsoft/r/G0kkRW4F7q"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand hover:text-brand2 transition-colors font-semibold underline"
                  >
                    click here
                  </a>
                </p>
              </div>
            </div>

            {/* Form Preview Image */}
            <div className="mb-6 rounded-lg border border-border overflow-hidden bg-panel/50">
              <div className="aspect-video relative bg-gradient-to-br from-brand/5 to-brand2/5 flex items-center justify-center">
                <div className="text-center p-6">
                  <svg className="w-16 h-16 mx-auto mb-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm font-semibold text-text">Microsoft Forms</p>
                  <p className="text-xs text-muted mt-1">Secure & Easy to Complete</p>
                </div>
              </div>
            </div>

            {/* Start Now Button */}
            <div className="text-center">
              <a
                href="https://forms.cloud.microsoft/r/G0kkRW4F7q"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button>
                  📝 Start Now
                </Button>
              </a>
              <p className="text-xs text-muted mt-3">Opens in a new secure window</p>
            </div>
          </GlowCard>

          {/* Additional Help */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted">
              Need immediate assistance? <a href="/#contact" className="text-brand hover:text-brand2 transition-colors">Contact us directly</a>
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
