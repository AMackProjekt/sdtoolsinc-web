import { Phone, MessageSquare, Heart, ShieldAlert, Building2, Users, AlertCircle } from "lucide-react";

const HOTLINES = [
  {
    category: "Mental Health & Crisis",
    icon: Heart,
    color: "bg-rose-50 border-rose-200",
    iconColor: "text-rose-500",
    items: [
      {
        name: "988 Suicide & Crisis Lifeline",
        contact: "Call or text 988",
        hours: "24/7",
        description: "Free, confidential support for people in distress or mental health crisis.",
        link: "https://988lifeline.org",
      },
      {
        name: "Crisis Text Line",
        contact: "Text HOME to 741741",
        hours: "24/7",
        description: "Free, confidential crisis counseling via text message.",
        link: "https://www.crisistextline.org",
      },
      {
        name: "NAMI Helpline",
        contact: "1-800-950-6264",
        hours: "Mon–Fri 10am–10pm ET",
        description: "National Alliance on Mental Illness — information, referrals, and support.",
        link: "https://www.nami.org/help",
      },
    ],
  },
  {
    category: "Safety & Violence",
    icon: ShieldAlert,
    color: "bg-amber-50 border-amber-200",
    iconColor: "text-amber-500",
    items: [
      {
        name: "National Domestic Violence Hotline",
        contact: "1-800-799-7233",
        hours: "24/7",
        description: "Confidential support for survivors of domestic violence and abuse.",
        link: "https://www.thehotline.org",
      },
      {
        name: "RAINN Sexual Assault Hotline",
        contact: "1-800-656-4673",
        hours: "24/7",
        description: "National Sexual Assault Hotline — connects to a local crisis center.",
        link: "https://www.rainn.org",
      },
      {
        name: "Ventura County Crisis Line",
        contact: "1-866-998-2243",
        hours: "24/7",
        description: "Local county crisis intervention and emergency mental health services.",
        link: null,
      },
    ],
  },
  {
    category: "Workplace & HR",
    icon: Building2,
    color: "bg-violet-50 border-violet-200",
    iconColor: "text-violet-500",
    items: [
      {
        name: "DFC HR Department",
        contact: "hr@dreamsforchange.org",
        hours: "Mon–Fri 9am–5pm",
        description: "Internal HR contacts for workplace concerns, accommodation requests, and policy questions.",
        link: "mailto:hr@dreamsforchange.org",
      },
      {
        name: "EEOC (Discrimination / Harassment)",
        contact: "1-800-669-4000",
        hours: "Mon–Fri 8am–8pm ET",
        description: "U.S. Equal Employment Opportunity Commission — for discrimination complaints.",
        link: "https://www.eeoc.gov",
      },
      {
        name: "California DFEH",
        contact: "1-800-884-1684",
        hours: "Mon–Fri 8am–5pm",
        description: "CA Dept. of Fair Employment & Housing — state-level civil rights and workplace protections.",
        link: "https://calcivilrights.ca.gov",
      },
    ],
  },
  {
    category: "Employee Assistance",
    icon: Users,
    color: "bg-emerald-50 border-emerald-200",
    iconColor: "text-emerald-500",
    items: [
      {
        name: "Employee Assistance Program (EAP)",
        contact: "Check your benefits portal",
        hours: "24/7 crisis line available",
        description: "Free, confidential counseling sessions, financial coaching, and legal referrals for DFC employees.",
        link: null,
      },
      {
        name: "CA Workers' Compensation",
        contact: "1-800-736-7401",
        hours: "Mon–Fri 8am–5pm",
        description: "Report workplace injuries and access workers' comp benefits.",
        link: "https://www.dir.ca.gov/dwc",
      },
      {
        name: "Wage & Hour Division",
        contact: "1-866-487-9243",
        hours: "Mon–Fri 8am–8pm ET",
        description: "U.S. Dept. of Labor — for questions about wages, overtime, and FMLA.",
        link: "https://www.dol.gov/agencies/whd",
      },
    ],
  },
];

export default function HotlinesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Phone className="w-5 h-5 text-violet-500" /> Workplace Hotlines
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Emergency contacts, crisis lines, and workplace support resources for DFC staff
        </p>
      </div>

      {/* Emergency Banner */}
      <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-red-800 text-sm">Emergency — Call 911</p>
          <p className="text-red-600 text-xs mt-0.5">
            For any immediate threat to life or safety, always call 911 first. These resources are for non-emergency support and crisis intervention.
          </p>
        </div>
      </div>

      {/* Hotline Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {HOTLINES.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.category} className={`rounded-2xl border p-5 ${section.color}`}>
              <div className="flex items-center gap-2 mb-4">
                <Icon className={`w-5 h-5 ${section.iconColor}`} />
                <h2 className="font-bold text-slate-800">{section.category}</h2>
              </div>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <div key={item.name} className="bg-white rounded-xl border border-white/80 p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm">{item.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                      </div>
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                          title="Open link"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                        <Phone className="w-3 h-3" />
                        {item.contact}
                      </span>
                      <span className="text-[11px] text-slate-400">{item.hours}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="text-xs text-center text-slate-400">
        All hotlines listed are external services. DFC is not affiliated with these organizations. Hours and availability subject to change.
      </p>
    </div>
  );
}
