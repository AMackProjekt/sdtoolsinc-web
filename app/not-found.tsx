"use client";

import { Navbar } from "@/components/ui/Navbar";
import { Button } from "@/components/ui/Button";
import { GlowCard } from "@/components/ui/GlowCard";
import { ChatBot } from "@/components/ui/ChatBot";
import { CookieConsent } from "@/components/ui/CookieConsent";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />
      
      <Navbar />

      <section className="mx-auto max-w-container px-4 sm:px-7 pt-24 pb-16 text-center">
        <div className="mb-8">
          <div className="text-6xl sm:text-8xl font-extrabold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-brand to-brand2 bg-clip-text text-transparent">404</span>
          </div>
          <h1 className="h1">Page Not Found</h1>
          <p className="mt-4 text-muted max-w-lg mx-auto">
            We couldn't find the page you're looking for. Use the button below to return to the home page.
          </p>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="primary" href="/">Back to Home</Button>
          <Button variant="ghost" href="/portal/portals">View Portals</Button>
        </div>

        <div className="mt-16 pt-16 border-t border-border">
          <h2 className="h2 mb-10">Popular Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Get Started", href: "/interest", desc: "Fill out interest form" },
              { title: "Referral", href: "/referral", desc: "Submit a referral" },
              { title: "Programs", href: "/#platform", desc: "Learn about programs" },
              { title: "Partnerships", href: "/partnerships", desc: "Partnership opportunities" }
            ].map((link) => (
              <a key={link.href} href={link.href} className="group">
                <GlowCard className="p-6 h-full transition-all duration-300 group-hover:border-brand/50">
                  <div className="text-lg font-extrabold text-text group-hover:text-brand transition-colors">
                    {link.title}
                  </div>
                  <div className="mt-2 text-sm text-muted">{link.desc}</div>
                </GlowCard>
              </a>
            ))}
          </div>
        </div>
      </section>

      <ChatBot />
      <CookieConsent />
    </main>
  );
}
