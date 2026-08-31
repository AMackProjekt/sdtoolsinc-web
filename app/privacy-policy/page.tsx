import { Navbar } from "@/components/ui/Navbar";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-bg">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />
      <Navbar />

      <article className="mx-auto max-w-4xl px-7 pt-24 pb-16">
        <h1 className="text-4xl font-extrabold text-text mb-4">Privacy Policy</h1>
        <p className="text-sm text-muted mb-8">Last Updated: February 2, 2026</p>

        <div className="glass rounded-xl p-8 space-y-8 text-text">
          <section>
            <h2 className="text-2xl font-bold mb-4">Our Commitment to Your Privacy</h2>
            <p className="text-muted leading-relaxed">
              At T.O.O.L.S. Inc., we understand the importance of privacy and confidentiality, especially for individuals in the justice system. This Privacy Policy explains how we collect, use, protect, and share your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">What Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mb-3">Information You Provide</h3>
            <ul className="list-disc list-inside space-y-2 text-muted mb-4">
              <li><strong>Account Information:</strong> Name, email, phone number, mailing address</li>
              <li><strong>Profile Data:</strong> Educational background, employment history, program interests</li>
              <li><strong>Progress Data:</strong> Course completions, certificates earned, goal tracking</li>
              <li><strong>Communication:</strong> Messages with case managers, support requests</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Automatically Collected Information</h3>
            <ul className="list-disc list-inside space-y-2 text-muted">
              <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent, features used</li>
              <li><strong>Cookies:</strong> Session management, preferences (see Cookie Policy)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
            <p className="text-muted leading-relaxed mb-3">We use your information to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted">
              <li>Provide reentry support services and case management</li>
              <li>Track your progress and provide personalized recommendations</li>
              <li>Communicate with your assigned case manager (with your consent)</li>
              <li>Improve our services and develop new features</li>
              <li>Generate anonymized reports for grant funding (no personal identifiers)</li>
              <li>Comply with legal obligations when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Data Protection & Security</h2>
            
            <h3 className="text-xl font-semibold mb-3">Encryption</h3>
            <ul className="list-disc list-inside space-y-2 text-muted mb-4">
              <li><strong>SSL/TLS Encryption:</strong> All data transmitted between your device and our servers is encrypted</li>
              <li><strong>At-Rest Encryption:</strong> Your data is encrypted when stored in our databases</li>
              <li><strong>Secure Authentication:</strong> Industry-standard OAuth 2.0 and Azure Active Directory</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Access Controls</h3>
            <ul className="list-disc list-inside space-y-2 text-muted">
              <li><strong>Role-Based Access:</strong> Only authorized staff can view your information</li>
              <li><strong>Audit Logs:</strong> All data access is logged and monitored</li>
              <li><strong>Regular Security Audits:</strong> Third-party penetration testing and vulnerability assessments</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Law Enforcement & Data Sharing</h2>
            
            <div className="bg-brand/10 border border-brand/30 rounded-lg p-4 mb-4">
              <h3 className="text-xl font-semibold mb-2">Our Policy</h3>
              <p className="text-muted leading-relaxed">
                <strong className="text-brand">We do NOT share your information with law enforcement without your explicit written consent</strong>, except in the following limited circumstances required by law:
              </p>
            </div>

            <ol className="list-decimal list-inside space-y-2 text-muted mb-4">
              <li><strong>Court Order or Subpoena:</strong> When legally compelled by a valid court order</li>
              <li><strong>Imminent Threat:</strong> If we believe disclosure is necessary to prevent serious harm or death</li>
              <li><strong>Child Abuse:</strong> As mandated reporters, we must report suspected child abuse</li>
            </ol>

            <h3 className="text-xl font-semibold mb-3">What We Do Share (With Your Consent)</h3>
            <ul className="list-disc list-inside space-y-2 text-muted">
              <li><strong>Case Managers:</strong> Information necessary to provide support services</li>
              <li><strong>Program Partners:</strong> Verified employers, educational institutions, housing providers</li>
              <li><strong>Grant Funders:</strong> Anonymized, aggregated data with no personal identifiers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Your Rights & Controls</h2>
            <p className="text-muted leading-relaxed mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted mb-4">
              <li><strong>Access:</strong> Request a copy of all data we hold about you</li>
              <li><strong>Correct:</strong> Update inaccurate or incomplete information</li>
              <li><strong>Delete:</strong> Request deletion of your account and all associated data</li>
              <li><strong>Opt-Out:</strong> Decline data sharing with specific partners</li>
              <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">How to Exercise Your Rights</h3>
            <div className="bg-panel rounded-lg p-4 space-y-1 text-muted">
              <p><strong>Email:</strong> privacy@sdtoolsinc.org</p>
              <p><strong>Phone:</strong> (619) 350-7638</p>
              <p><strong>Mail:</strong> T.O.O.L.S. Inc., Privacy Officer, San Diego, CA</p>
            </div>
            <p className="text-muted mt-3">We will respond to requests within <strong>30 days</strong>.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
            <ul className="list-disc list-inside space-y-2 text-muted">
              <li><strong>Active Accounts:</strong> Data retained while your account is active</li>
              <li><strong>Inactive Accounts:</strong> Deleted after <strong>2 years</strong> of inactivity</li>
              <li><strong>Legal Requirements:</strong> Some records may be retained longer to comply with legal obligations</li>
              <li><strong>Your Request:</strong> You may request immediate deletion at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
            <p className="text-muted leading-relaxed mb-3">We use the following trusted partners:</p>
            <ul className="list-disc list-inside space-y-2 text-muted mb-3">
              <li><strong>Azure (Microsoft):</strong> Cloud hosting and authentication</li>
              <li><strong>Supabase:</strong> Database and authentication services</li>
              <li><strong>Google Analytics:</strong> Anonymous usage statistics (opt-out available)</li>
            </ul>
            <p className="text-muted">These partners comply with GDPR, CCPA, and other privacy regulations.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
            <p className="text-muted leading-relaxed">
              Our services are not intended for individuals under 18 without parental consent. If we discover we have collected data from a minor without consent, we will delete it immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">California Privacy Rights (CCPA)</h2>
            <p className="text-muted leading-relaxed mb-3">California residents have additional rights:</p>
            <ul className="list-disc list-inside space-y-2 text-muted mb-3">
              <li>Right to know what personal information is collected</li>
              <li>Right to know if personal information is sold or disclosed</li>
              <li>Right to opt-out of sale of personal information</li>
              <li>Right to non-discrimination for exercising CCPA rights</li>
            </ul>
            <p className="text-brand font-semibold">We do NOT sell your personal information.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
            <p className="text-muted leading-relaxed mb-3">We will notify you of material changes by:</p>
            <ul className="list-disc list-inside space-y-2 text-muted">
              <li>Email to your registered address</li>
              <li>Prominent notice on our website</li>
              <li>In-app notification</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-muted leading-relaxed mb-3">
              If you have questions about this Privacy Policy or our data practices:
            </p>
            <div className="bg-panel rounded-lg p-4 space-y-1 text-muted">
              <p><strong>T.O.O.L.S. Inc. (Together Overcoming Obstacles &amp; Limitations)</strong></p>
              <p><strong>Email:</strong> info@sdtoolsinc.org</p>
              <p><strong>Phone:</strong> (619) 350-7638</p>
              <p><strong>Website:</strong> www.sdtoolsinc.org</p>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
