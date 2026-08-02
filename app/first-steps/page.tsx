import { FirstStepsChecklist } from "@/components/ui/FirstStepsChecklist";
import { ChatBot } from "@/components/ui/ChatBot";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { Navbar } from "@/components/ui/Navbar";

export default function FirstStepsPage() {
  return (
    <main className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />
      <Navbar />
      <FirstStepsChecklist />
      <ChatBot />
      <CookieConsent />
    </main>
  );
}
