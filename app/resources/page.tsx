import { FirstStepsChecklist } from "@/components/ui/FirstStepsChecklist";
import { SecondChanceEmployers } from "@/components/ui/SecondChanceEmployers";
import { ChatBot } from "@/components/ui/ChatBot";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { Navbar } from "@/components/ui/Navbar";

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />
      <Navbar />
      
      <div className="mx-auto max-w-container px-7 pt-24 pb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-text mb-4">
          Reentry Resources
        </h1>
        <p className="text-lg text-muted mb-12">
          Everything you need to succeed after release - from first steps to employment.
        </p>
      </div>

      <FirstStepsChecklist />
      <SecondChanceEmployers />
      
      <ChatBot />
      <CookieConsent />
    </main>
  );
}
