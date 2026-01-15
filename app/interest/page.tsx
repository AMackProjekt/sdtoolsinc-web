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
            <div className="mb-8 flex flex-col md:flex-row items-center justify-center gap-8">
              {/* QR Code */}
              <div className="flex-shrink-0">
                <div className="rounded-xl bg-white p-4 shadow-lg">
                  <Image
                    src="/qr-interest-form.webp"
                    alt="QR Code for Interest Form"
                    width={192}
                    height={192}
                    className="h-48 w-48"
                    unoptimized
                  />
                </div>
              </div>

              {/* Alternative Text */}
              <div className="flex items-center">
                <p className="text-sm text-muted text-center md:text-left">
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

            {/* Start Now Button */}
            <div className="text-center">
              <a
                href="https://forms.cloud.microsoft/r/G0kkRW4F7q"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button>
                  Start Now
                </Button>
              </a>
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
