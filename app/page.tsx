import { Navbar } from "@/components/ui/Navbar";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";
import { DashboardSection } from "@/components/ui/DashboardSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InteractiveTiles } from "@/components/ui/InteractiveTiles";
import { ChatBot } from "@/components/ui/ChatBot";
import { CookieConsent } from "@/components/ui/CookieConsent";

export default function Page() {
  const AMZN_URL = "https://www.amazon.com/Navigating-Spiritual-Warfare-UNDERSTANDING-OVERCOMING-ebook/dp/B0CW1JNJBZ";

  const handleAmazonClick = () => {
    // Helper to open link exactly once
    let opened = false;
    const openLink = () => {
      if (opened) return;
      opened = true;
      try {
        window.open(AMZN_URL, "_blank", "noopener,noreferrer");
      } catch (e) {
        window.location.href = AMZN_URL;
      }
    };

    try {
      // GA4: use select_content with event_callback to ensure analytics is sent
      if (typeof (window as any).gtag === "function") {
        (window as any).gtag("event", "select_content", {
          content_type: "outbound",
          item_id: AMZN_URL,
          method: "button",
          event_callback: openLink,
        });

        // Fallback: open after 500ms if callback doesn't fire
        setTimeout(openLink, 500);
      } else {
        // If no gtag, open immediately
        openLink();
      }

      // dataLayer (GTM) push for compatibility
      if (Array.isArray((window as any).dataLayer)) {
        (window as any).dataLayer.push({
          event: "outbound_click",
          label: "view_on_amazon",
          url: AMZN_URL,
        });
      }

      // Application Insights
      const ai = (window as any).appInsights;
      if (ai && typeof ai.trackEvent === "function") {
        ai.trackEvent({ name: "ViewOnAmazonClick" }, { url: AMZN_URL });
      }
    } catch (e) {
      // swallow analytics errors and ensure link opens
      openLink();
    }
  };
  return (
    <main id="top" className="min-h-screen bg-bg">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      <Navbar />

      {/* HERO */}
      <section className="mx-auto max-w-container px-7 pt-24 pb-16 text-center">
        <h1 className="h1">
          Empowering Individuals.
          <br />
          <span className="bg-gradient-to-r from-brand to-brand2 bg-clip-text text-transparent">
            Unlocking Potential.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-[760px] p-lead">
          At T.O.O.L.S Inc, we provide support and opportunities for individuals looking to start over. 
          Through comprehensive programs and lived experience, we help people unlock their full potential.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary">Get Started</Button>
          <Button variant="ghost">View Platform</Button>
        </div>

        {/* KPI band */}
        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-4">
          {[
            ["Support", "Comprehensive Programs"],
            ["Growth", "Job Readiness Training"],
            ["Empathy", "Lived Experience Team"],
            ["Access", "Continued Education"]
          ].map(([v, t]) => (
            <GlowCard key={t} className="p-5 text-left">
              <div className="text-2xl font-extrabold tracking-tight">{v}</div>
              <div className="mt-2 text-sm text-muted">{t}</div>
            </GlowCard>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="platform" className="mx-auto max-w-container px-7 pt-8 pb-20">
        <SectionHeading
          eyebrow="How We Help"
          title="Comprehensive Support Programs"
          subtitle="We recognize and address the diverse challenges individuals face, providing the tools and support necessary to unlock their full potential."
        />

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["Job Readiness", "Professional development programs including resume building, mock interviews, and career planning to prepare for success."],
            ["Continued Education", "Access to educational resources and training programs that open doors to new opportunities and skill development."],
            ["Lived Experience", "Our team shares lived experiences with the challenges our clients face, creating genuine understanding and effective support."],
            ["Personal Growth", "Holistic programs addressing both immediate needs and long-term goals for sustainable personal and professional growth."]
          ].map(([h, p]) => (
            <GlowCard key={h}>
              <div className="text-lg font-extrabold tracking-tight">{h}</div>
              <div className="mt-2 text-sm text-muted leading-relaxed">{p}</div>
            </GlowCard>
          ))}
        </div>
      </section>

      {/* INTERACTIVE TILES */}
      <InteractiveTiles />

      {/* FOUNDER STORY */}
      <section className="mx-auto max-w-container px-7 py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 items-center">
          <div>
            <div className="text-xs font-semibold tracking-[0.18em] text-brand2 uppercase">
              Leadership
            </div>
            <h2 className="h2 mt-4">
              Donyale &quot;DThree&quot; Mack
            </h2>
            <div className="mt-2 text-lg font-semibold text-muted">
              Owner/Founder
            </div>
            
            <div className="mt-6 space-y-4 text-text/90 leading-relaxed">
              <p>
                A compassionate advocate and the driving force behind T.O.O.L.S Inc, Donyale Mack is dedicated to 
                providing support and opportunities to those seeking a second chance in life.
              </p>
              <p>
                Born out of lived experience and personal challenges, Donyale&apos;s journey is marked by resilience, 
                overcoming adversity, and an unwavering passion to help others facing similar struggles.
              </p>
              <p className="text-brand font-semibold">
                &quot;Every individual deserves the opportunity to unlock their full potential.&quot;
              </p>
            </div>
          </div>
          
          <GlowCard className="p-8 lg:p-10">
            <div className="space-y-6">
              <div>
                <div className="text-sm font-semibold text-brand2 uppercase tracking-wider">Mission</div>
                <p className="mt-2 text-text/90">
                  Creating pathways for individuals to transform their lives through empathy, 
                  understanding, and comprehensive support programs.
                </p>
              </div>
              <div>
                <div className="text-sm font-semibold text-brand2 uppercase tracking-wider">Vision</div>
                <p className="mt-2 text-text/90">
                  Building a community where lived experience becomes the foundation for 
                  genuine connection and lasting change.
                </p>
              </div>
              <div>
                <div className="text-sm font-semibold text-brand2 uppercase tracking-wider">Approach</div>
                <p className="mt-2 text-text/90">
                  Combining personal understanding with professional expertise to provide 
                  support that goes beyond sympathy to true empowerment.
                </p>
              </div>
            </div>
          </GlowCard>
        </div>
      </section>

      {/* DASHBOARD */}
      <DashboardSection />

      {/* BOOK / SUPPORT SECTION */}
      <section className="mx-auto max-w-container px-7 py-20">
        <GlowCard className="p-10 text-center">
          <div className="text-xs font-semibold tracking-[0.18em] text-brand2 uppercase">
            Support Our Mission
          </div>
          <h2 className="h2 mt-4">
            Go Check It Out
          </h2>
          <div className="mt-2 text-lg font-semibold text-brand">
            Available Now On Amazon Platform
          </div>
          
          <div className="mx-auto mt-6 max-w-[680px] space-y-4 text-text/90 leading-relaxed">
            <p>
              A portion of the proceeds go to helping program participants with immediate needs such as 
              but not limited to: bus/transit passes, gas cards, work boots and clothing for work.
            </p>
            <p className="text-base font-semibold text-brand2">
              We appreciate Your Support
            </p>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] items-center">
            <div className="mx-auto max-w-[220px] overflow-hidden rounded-3xl border border-border bg-[#07090f] shadow-glow aspect-[3/4]">
              <img
                src="/images/Book.jpg"
                alt="Navigating Spiritual Warfare book cover"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-4 text-left">
              <p className="text-text/85 leading-relaxed">
                Grab the book on Amazon to support the mission and help fund vital resources for people rebuilding their lives.
              </p>
              <Button variant="primary" onClick={handleAmazonClick}>View on Amazon</Button>
              <div className="text-sm text-muted">
                <strong className="text-text">Donyale Mack</strong>
                <div className="mt-1">CEO/Author</div>
              </div>
            </div>
          </div>
        </GlowCard>
      </section>

      {/* INTEREST FORM */}
      <section id="contact" className="mx-auto max-w-container px-7 py-20">
        <div className="text-center mb-10">
          <div className="text-xs font-semibold tracking-[0.18em] text-brand2 uppercase">
            Get Started
          </div>
          <h2 className="h2 mt-4">
            Ready to Start Your Journey?
          </h2>
          <p className="mx-auto mt-4 max-w-[680px] text-muted">
            Let us know how we can support you. Fill out the form below and we&apos;ll respond within 48 hours.
          </p>
        </div>

        <GlowCard className="p-8">
          <iframe
            src="https://forms.cloud.microsoft/r/G0kkRW4F7q"
            width="100%"
            height="800"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            className="rounded-lg"
          >
            Loading…
          </iframe>
        </GlowCard>
      </section>

      {/* FOOTER CTA */}
      <section className="mx-auto max-w-container px-7 py-16 text-center">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <a href="#top">
            <Button variant="primary">Back to Top</Button>
          </a>

          <div className="flex flex-col items-center gap-3">
            <div className="text-sm font-semibold text-text">Submit Referral</div>
            <div className="rounded-xl bg-panel border border-border p-4 shadow-glow">
              <div className="rounded-lg bg-white p-3">
                <img
                  src="/referral-qr.png"
                  alt="Scan to Submit Referral"
                  className="h-32 w-32 object-contain"
                />
              </div>
            </div>
            <p className="text-xs text-muted">Scan to access referral form</p>
          </div>
        </div>

        <div className="mt-10 text-xs text-muted">
          © {new Date().getFullYear()} T.O.O.L.S Inc · Empowering individuals To Step Into Their Purpose
        </div>
      </section>

      {/* ChatBot */}
      <ChatBot />
      
      {/* Cookie Consent */}
      <CookieConsent />
    </main>
  );
}
