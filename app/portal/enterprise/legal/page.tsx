"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Shield, Eye, Cookie, Users, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

interface Tab {
  id: string;
  label: string;
  icon: React.ElementType;
  lastUpdated: string;
}

const TABS: Tab[] = [
  { id: "terms", label: "Terms of Service", icon: FileText, lastUpdated: "Nov 15, 2024" },
  { id: "privacy", label: "Privacy Policy", icon: Eye, lastUpdated: "Nov 15, 2024" },
  { id: "hipaa", label: "HIPAA Notice", icon: Shield, lastUpdated: "Oct 1, 2024" },
  { id: "acceptable", label: "Acceptable Use", icon: Users, lastUpdated: "Sep 20, 2024" },
  { id: "cookies", label: "Cookie Policy", icon: Cookie, lastUpdated: "Nov 15, 2024" },
];

const CONTENT: Record<string, { sections: { heading: string; text: string }[] }> = {
  terms: {
    sections: [
      {
        heading: "1. Acceptance of Terms",
        text: "By accessing or using the T.O.O.LS Inc platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.",
      },
      {
        heading: "2. Use License",
        text: "Permission is granted to temporarily access the materials on T.O.O.LS Inc's platform for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not modify or copy the materials, use the materials for any commercial purpose, attempt to decompile or reverse engineer any software contained on the platform, or remove any copyright or other proprietary notations from the materials.",
      },
      {
        heading: "3. Disclaimer",
        text: "The materials on T.O.O.LS Inc's platform are provided on an 'as is' basis. T.O.O.LS Inc makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.",
      },
      {
        heading: "4. Limitations",
        text: "In no event shall T.O.O.LS Inc or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the platform, even if T.O.O.LS Inc or an authorized representative has been notified orally or in writing of the possibility of such damage.",
      },
      {
        heading: "5. Governing Law",
        text: "These terms and conditions are governed by and construed in accordance with the laws of the State of Georgia and you irrevocably submit to the exclusive jurisdiction of the courts in that State.",
      },
    ],
  },
  privacy: {
    sections: [
      {
        heading: "Information We Collect",
        text: "We collect information you provide directly to us, such as when you create an account, update your profile, use interactive features of our services, participate in programs, request support, or otherwise communicate with us. This includes name, email address, organization affiliation, and usage data.",
      },
      {
        heading: "How We Use Your Information",
        text: "We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, respond to your comments and questions, and send you information about programs, services, and events offered by T.O.O.LS Inc.",
      },
      {
        heading: "Information Sharing",
        text: "We do not share, sell, rent, or trade your personal information with third parties for their commercial purposes. We may share your information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.",
      },
      {
        heading: "Data Retention",
        text: "We retain personal information we collect for as long as necessary to fulfill the purpose for which it was collected, including for the purposes of satisfying any legal, accounting, or reporting requirements, and to the extent permitted by law.",
      },
      {
        heading: "Your Rights",
        text: "You have certain rights regarding the personal information we hold about you. These include the right to access, correct, update or request deletion of your personal information. To exercise these rights, please contact our Privacy Team.",
      },
    ],
  },
  hipaa: {
    sections: [
      {
        heading: "Notice of Privacy Practices",
        text: "T.O.O.LS Inc is committed to protecting the privacy and security of your protected health information (PHI) as required by the Health Insurance Portability and Accountability Act of 1996 (HIPAA). This notice describes how health information about you may be used and disclosed and how you can get access to this information.",
      },
      {
        heading: "Uses and Disclosures of PHI",
        text: "We may use and disclose your PHI for treatment purposes, to obtain payment, and for health care operations. With your authorization, we may also use and disclose PHI for other purposes. We will not sell your PHI without your express written authorization.",
      },
      {
        heading: "Your HIPAA Rights",
        text: "You have the right to: inspect and copy your PHI; request amendments to your PHI; request an accounting of disclosures; request restrictions on uses or disclosures; request confidential communications; file a complaint if you believe your rights have been violated.",
      },
      {
        heading: "Safeguards",
        text: "T.O.O.LS Inc maintains administrative, technical, and physical safeguards to protect the privacy and security of your PHI. All staff who have access to PHI are trained on privacy and security requirements. We use industry-standard encryption for all data transmission and storage.",
      },
      {
        heading: "Contact & Complaints",
        text: "If you have questions about this Notice or our privacy practices, contact our Privacy Officer at privacy@sdtoolsinc.org. You may also file a complaint with the U.S. Department of Health & Human Services Office for Civil Rights. We will not retaliate against you for filing a complaint.",
      },
    ],
  },
  acceptable: {
    sections: [
      {
        heading: "Permitted Use",
        text: "The T.O.O.LS Inc platform is provided for legitimate program participation, professional development, and organizational purposes. You may use the platform only in ways that comply with these guidelines and all applicable laws.",
      },
      {
        heading: "Prohibited Activities",
        text: "You may not use the platform to: transmit spam or unsolicited communications; upload viruses or malicious code; attempt to gain unauthorized access to any part of the platform; harass, threaten, or impersonate any person; collect or harvest personal information about other users without consent; engage in any illegal activity.",
      },
      {
        heading: "Content Standards",
        text: "All content you submit must be accurate, not misleading, comply with applicable laws, not infringe any intellectual property rights, not contain material which is defamatory or discriminatory, and not contain any advertising or promotional material without explicit permission.",
      },
      {
        heading: "Account Responsibility",
        text: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify T.O.O.LS Inc immediately of any unauthorized use of your account or any other breach of security.",
      },
      {
        heading: "Enforcement",
        text: "Violation of this Acceptable Use Policy may result in immediate account suspension or termination without notice, and may be reported to appropriate law enforcement authorities. T.O.O.LS Inc reserves the right to investigate suspected violations.",
      },
    ],
  },
  cookies: {
    sections: [
      {
        heading: "What Are Cookies",
        text: "Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work efficiently, to provide analytics, and to remember user preferences. We use both session cookies (which expire when you close your browser) and persistent cookies (which remain until deleted).",
      },
      {
        heading: "How We Use Cookies",
        text: "We use cookies to: keep you signed in to your account; remember your preferences and settings; understand how you use our platform through analytics; improve the performance and personalization of our services; prevent fraudulent activity and improve security.",
      },
      {
        heading: "Types of Cookies We Use",
        text: "Essential Cookies: Required for the platform to function. Cannot be disabled. Analytics Cookies: Help us understand usage patterns (e.g., pages visited, time on site). Preference Cookies: Remember your settings such as language and display preferences. Security Cookies: Used to authenticate users and prevent fraudulent use.",
      },
      {
        heading: "Third-Party Cookies",
        text: "Some cookies are placed by third-party services that appear on our pages. We use services such as analytics providers and authentication providers who may set their own cookies. We do not control these third-party cookies and recommend reviewing their privacy policies.",
      },
      {
        heading: "Managing Cookies",
        text: "You can control and manage cookies via your browser settings. Note that disabling cookies may affect the functionality of our platform. Most browsers allow you to refuse cookies, delete existing cookies, or be notified when a new cookie is placed. Refer to your browser's help documentation for specific instructions.",
      },
    ],
  },
};

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState("terms");

  const active = TABS.find((t) => t.id === activeTab)!;
  const ActiveIcon = active.icon;
  const sections = CONTENT[activeTab]?.sections ?? [];

  return (
    <div className="min-h-screen px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-2xl font-extrabold tracking-tight text-text">Legal & Policies</h1>
          <p className="text-sm text-muted mt-1">
            T.O.O.LS Inc legal documents — last reviewed by our Legal team
          </p>
        </motion.div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar tabs */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col gap-1 lg:w-56 lg:flex-shrink-0"
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all",
                    activeTab === tab.id
                      ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                      : "text-muted hover:bg-white/5 hover:text-text border border-transparent"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="leading-tight">{tab.label}</span>
                  {activeTab === tab.id && <ChevronRight className="ml-auto h-3.5 w-3.5" />}
                </button>
              );
            })}
          </motion.div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 rounded-2xl border border-border bg-panel/60 p-6 space-y-6"
          >
            {/* Section header */}
            <div className="flex items-start gap-4 border-b border-border pb-5">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-violet-500/20">
                <ActiveIcon className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold tracking-tight text-text">{active.label}</h2>
                <p className="text-xs text-muted mt-0.5">Last updated: {active.lastUpdated}</p>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-5">
              {sections.map((section, i) => (
                <motion.div
                  key={section.heading}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.35 }}
                >
                  <h3 className="text-sm font-bold text-text mb-2">{section.heading}</h3>
                  <p className="text-sm text-muted leading-relaxed">{section.text}</p>
                </motion.div>
              ))}
            </div>

            {/* Footer note */}
            <div className="border-t border-border pt-4 mt-4">
              <p className="text-xs text-muted/60">
                Questions? Contact{" "}
                <a href="mailto:legal@sdtoolsinc.org" className="text-violet-400 hover:underline">
                  legal@sdtoolsinc.org
                </a>
                {" "}· T.O.O.LS Inc Legal Team
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
