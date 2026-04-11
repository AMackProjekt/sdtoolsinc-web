"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { ExternalLink, BookOpen, GraduationCap, Star, Clock, Tag } from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────
type Provider = "Niche Academy" | "Coursera" | "Khan Academy" | "Microsoft Learn" | "Google" | "Verizon";
type Topic = "Social Work" | "Case Management" | "Trauma-Informed Care" | "Mental Health"
  | "Leadership" | "Public Health" | "Psychology" | "Life Skills" | "Career Readiness"
  | "Financial Literacy" | "Technology" | "Data Analytics" | "Cybersecurity" | "Digital Marketing";

interface Course {
  id: string;
  title: string;
  provider: Provider;
  topic: Topic;
  description: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  ceus?: number;
  isFree: true;
  url: string;
}

// ─── Course Catalog ─────────────────────────────────────────────────────────────
const COURSES: Course[] = [
  // ── Niche Academy ────────────────────────────────────────────────────────────
  {
    id: "na-01",
    title: "Trauma-Informed Care: Foundations for Social Workers",
    provider: "Niche Academy",
    topic: "Trauma-Informed Care",
    description: "Evidence-based principles for supporting clients who have experienced trauma. Covers ACEs, safety planning, and trauma-sensitive communication.",
    duration: "2h 30m",
    level: "Beginner",
    ceus: 2,
    isFree: true,
    url: "https://nicheacademy.com",
  },
  {
    id: "na-02",
    title: "Case Management Essentials",
    provider: "Niche Academy",
    topic: "Case Management",
    description: "Core skills for effective case coordination, client assessment, goal setting, and documentation best practices in human services.",
    duration: "3h",
    level: "Beginner",
    ceus: 3,
    isFree: true,
    url: "https://nicheacademy.com",
  },
  {
    id: "na-03",
    title: "Motivational Interviewing in Social Services",
    provider: "Niche Academy",
    topic: "Social Work",
    description: "Learn motivational interviewing techniques to support behavior change, build rapport, and empower clients toward their goals.",
    duration: "1h 45m",
    level: "Intermediate",
    ceus: 1.5,
    isFree: true,
    url: "https://nicheacademy.com",
  },
  {
    id: "na-04",
    title: "Crisis Intervention Strategies",
    provider: "Niche Academy",
    topic: "Mental Health",
    description: "Practical protocols for de-escalation, safety assessment, and connecting clients in crisis to appropriate resources.",
    duration: "2h",
    level: "Intermediate",
    ceus: 2,
    isFree: true,
    url: "https://nicheacademy.com",
  },
  {
    id: "na-05",
    title: "Cultural Humility in Service Delivery",
    provider: "Niche Academy",
    topic: "Social Work",
    description: "Building self-awareness, reducing implicit bias, and delivering equitable services across diverse communities.",
    duration: "1h 30m",
    level: "Beginner",
    ceus: 1.5,
    isFree: true,
    url: "https://nicheacademy.com",
  },
  {
    id: "na-06",
    title: "Substance Use Disorders: A Primer for Care Workers",
    provider: "Niche Academy",
    topic: "Mental Health",
    description: "Understanding addiction as a health condition, stages of change, and harm-reduction frameworks for human service professionals.",
    duration: "2h",
    level: "Beginner",
    ceus: 2,
    isFree: true,
    url: "https://nicheacademy.com",
  },

  // ── Coursera ─────────────────────────────────────────────────────────────────
  {
    id: "co-01",
    title: "The Science of Well-Being",
    provider: "Coursera",
    topic: "Psychology",
    description: "Yale's top-rated course on the psychology of happiness. Learn science-backed practices to improve personal and professional wellbeing.",
    duration: "19h",
    level: "Beginner",
    isFree: true,
    url: "https://www.coursera.org/learn/the-science-of-well-being",
  },
  {
    id: "co-02",
    title: "Social Work Practice: Advocating Social Justice & Change",
    provider: "Coursera",
    topic: "Social Work",
    description: "Michigan's course on macro-level social work, community advocacy, and systemic change strategies.",
    duration: "14h",
    level: "Intermediate",
    isFree: true,
    url: "https://www.coursera.org/learn/social-work-practice",
  },
  {
    id: "co-03",
    title: "Introduction to Psychology",
    provider: "Coursera",
    topic: "Psychology",
    description: "Yale's survey of the major topics within psychology including perception, communication, learning, memory, and development.",
    duration: "22h",
    level: "Beginner",
    isFree: true,
    url: "https://www.coursera.org/learn/introduction-psychology",
  },
  {
    id: "co-04",
    title: "Inspiring and Motivating Individuals",
    provider: "Coursera",
    topic: "Leadership",
    description: "Michigan's leadership course on goal-setting, performance management, and inspiring teams in complex organizations.",
    duration: "10h",
    level: "Intermediate",
    isFree: true,
    url: "https://www.coursera.org/learn/motivating-people",
  },
  {
    id: "co-05",
    title: "Introduction to Public Health",
    provider: "Coursera",
    topic: "Public Health",
    description: "Johns Hopkins course covering public health principles, social determinants of health, epidemiology, and community health frameworks.",
    duration: "18h",
    level: "Beginner",
    isFree: true,
    url: "https://www.coursera.org/learn/public-health",
  },
  {
    id: "co-06",
    title: "Excel Skills for Business: Essentials",
    provider: "Coursera",
    topic: "Technology",
    description: "Master Excel fundamentals for reporting, data management, and productivity in professional settings.",
    duration: "26h",
    level: "Beginner",
    isFree: true,
    url: "https://www.coursera.org/learn/excel-essentials",
  },

  // ── Khan Academy ─────────────────────────────────────────────────────────────
  {
    id: "ka-01",
    title: "Personal Finance",
    provider: "Khan Academy",
    topic: "Financial Literacy",
    description: "Budgeting, saving, investing, taxes, and retirement planning — practical financial skills for everyday life.",
    duration: "Self-paced",
    level: "Beginner",
    isFree: true,
    url: "https://www.khanacademy.org/college-careers-more/personal-finance",
  },
  {
    id: "ka-02",
    title: "Career Readiness",
    provider: "Khan Academy",
    topic: "Career Readiness",
    description: "Resume writing, interview preparation, workplace communication, and networking strategies for career-ready professionals.",
    duration: "Self-paced",
    level: "Beginner",
    isFree: true,
    url: "https://www.khanacademy.org/college-careers-more/career-content",
  },
  {
    id: "ka-03",
    title: "Growth Mindset and Skills for Learning",
    provider: "Khan Academy",
    topic: "Life Skills",
    description: "Develop a growth mindset, overcome imposter syndrome, and build effective learning habits for continuous professional development.",
    duration: "Self-paced",
    level: "Beginner",
    isFree: true,
    url: "https://www.khanacademy.org/college-careers-more/learnstorm-growth-mindset",
  },
  {
    id: "ka-04",
    title: "Statistics and Probability",
    provider: "Khan Academy",
    topic: "Technology",
    description: "Foundational statistics for data-informed decision-making in case management and program evaluation.",
    duration: "Self-paced",
    level: "Beginner",
    isFree: true,
    url: "https://www.khanacademy.org/math/statistics-probability",
  },

  // ── Microsoft Learn ────────────────────────────────────────────────────────
  {
    id: "ms-01",
    title: "Azure Fundamentals (AZ-900 Learning Path)",
    provider: "Microsoft Learn",
    topic: "Technology",
    description: "Explore cloud concepts, core Azure services, security, compliance, and pricing — the foundation for any Microsoft cloud role.",
    duration: "10h",
    level: "Beginner",
    isFree: true,
    url: "https://learn.microsoft.com/en-us/training/paths/azure-fundamentals/",
  },
  {
    id: "ms-02",
    title: "Introduction to AI on Microsoft Azure",
    provider: "Microsoft Learn",
    topic: "Technology",
    description: "Discover how AI and machine learning work, explore Azure AI services, and apply responsible AI principles in real-world scenarios.",
    duration: "5h",
    level: "Beginner",
    isFree: true,
    url: "https://learn.microsoft.com/en-us/training/modules/get-started-ai-fundamentals/",
  },
  {
    id: "ms-03",
    title: "Cybersecurity Fundamentals",
    provider: "Microsoft Learn",
    topic: "Cybersecurity",
    description: "Learn core cybersecurity concepts including threat types, attack vectors, identity protection, and safe data practices for everyday professionals.",
    duration: "3h",
    level: "Beginner",
    isFree: true,
    url: "https://learn.microsoft.com/en-us/training/modules/describe-basic-cybersecurity-threats-attacks-mitigations/",
  },
  {
    id: "ms-04",
    title: "Power BI: Build Reports & Dashboards",
    provider: "Microsoft Learn",
    topic: "Data Analytics",
    description: "Create interactive reports and dashboards with Power BI to visualize program data, track KPIs, and drive data-informed decisions.",
    duration: "8h",
    level: "Beginner",
    isFree: true,
    url: "https://learn.microsoft.com/en-us/training/paths/create-use-analytics-reports-power-bi/",
  },
  {
    id: "ms-05",
    title: "Microsoft 365 Productivity Essentials",
    provider: "Microsoft Learn",
    topic: "Technology",
    description: "Master Teams, Outlook, SharePoint, and OneDrive to improve collaboration, communication, and document management across your organization.",
    duration: "4h",
    level: "Beginner",
    isFree: true,
    url: "https://learn.microsoft.com/en-us/training/paths/m365-teams-associate/",
  },

  // ── Google ─────────────────────────────────────────────────────────────────
  {
    id: "goog-01",
    title: "Fundamentals of Digital Marketing",
    provider: "Google",
    topic: "Digital Marketing",
    description: "Google's IAB-certified course covering SEO, analytics, social media, content marketing, and advertising fundamentals — 26 practical modules.",
    duration: "40h",
    level: "Beginner",
    isFree: true,
    url: "https://learndigital.withgoogle.com/digitalgarage/course/digital-marketing",
  },
  {
    id: "goog-02",
    title: "Google Data Analytics Certificate",
    provider: "Google",
    topic: "Data Analytics",
    description: "Learn data cleaning, analysis, and visualization using spreadsheets, SQL, Tableau, and R. Audit free on Coursera — no payment required.",
    duration: "6 months",
    level: "Beginner",
    isFree: true,
    url: "https://grow.google/certificates/data-analytics/",
  },
  {
    id: "goog-03",
    title: "Google Project Management Certificate",
    provider: "Google",
    topic: "Leadership",
    description: "Build project management skills using Agile and traditional frameworks. Audit free via Coursera — covers planning, execution, and stakeholder management.",
    duration: "6 months",
    level: "Beginner",
    isFree: true,
    url: "https://grow.google/certificates/project-management/",
  },
  {
    id: "goog-04",
    title: "Google AI Essentials",
    provider: "Google",
    topic: "Technology",
    description: "Understand how generative AI works, use AI tools to boost productivity, and apply responsible AI practices in professional settings.",
    duration: "Self-paced",
    level: "Beginner",
    isFree: true,
    url: "https://grow.google/certificates/ai-essentials/",
  },
  {
    id: "goog-05",
    title: "Google Workspace: Collaboration & Productivity",
    provider: "Google",
    topic: "Technology",
    description: "Get hands-on with Gmail, Docs, Sheets, Slides, Drive, and Meet. Official Google training to boost team productivity and remote collaboration.",
    duration: "Self-paced",
    level: "Beginner",
    isFree: true,
    url: "https://workspace.google.com/learning-center/",
  },

  // ── Verizon ────────────────────────────────────────────────────────────────
  {
    id: "vzn-01",
    title: "Small Business Digital Ready",
    provider: "Verizon",
    topic: "Technology",
    description: "Verizon's free platform offering courses on e-commerce, digital marketing, finance, and cybersecurity tailored for community organizations and small businesses.",
    duration: "Self-paced",
    level: "Beginner",
    isFree: true,
    url: "https://business.verizon.com/resources/small-business-digital-ready/",
  },
  {
    id: "vzn-02",
    title: "Skill Forward: Career & Tech Upskilling",
    provider: "Verizon",
    topic: "Career Readiness",
    description: "Free job-ready training in cybersecurity, cloud computing, and data skills through Verizon's workforce development platform. Certificates included.",
    duration: "Self-paced",
    level: "Beginner",
    isFree: true,
    url: "https://www.verizon.com/about/responsibility/digital-inclusion/skill-forward",
  },
  {
    id: "vzn-03",
    title: "Digital Inclusion: Closing the Digital Divide",
    provider: "Verizon",
    topic: "Life Skills",
    description: "Explore Verizon's digital equity resources including internet access tools, device programs, and digital literacy training for underserved communities.",
    duration: "Self-paced",
    level: "Beginner",
    isFree: true,
    url: "https://www.verizon.com/about/responsibility/digital-inclusion",
  },
];

// ─── Constants ───────────────────────────────────────────────────────────────────
const ALL_PROVIDERS: Provider[] = ["Niche Academy", "Coursera", "Khan Academy", "Microsoft Learn", "Google", "Verizon"];
const ALL_TOPICS: Topic[] = [
  "Social Work", "Case Management", "Trauma-Informed Care", "Mental Health",
  "Leadership", "Public Health", "Psychology", "Life Skills", "Career Readiness",
  "Financial Literacy", "Technology", "Data Analytics", "Cybersecurity", "Digital Marketing",
];

const PROVIDER_COLOR: Record<Provider, string> = {
  "Niche Academy":   "bg-purple-500/15 text-purple-300 border border-purple-400/20",
  "Coursera":        "bg-sky-500/15 text-sky-300 border border-sky-400/20",
  "Khan Academy":    "bg-teal-500/15 text-teal-300 border border-teal-400/20",
  "Microsoft Learn": "bg-blue-500/15 text-blue-300 border border-blue-400/20",
  "Google":          "bg-yellow-500/15 text-yellow-300 border border-yellow-400/20",
  "Verizon":         "bg-red-500/15 text-red-300 border border-red-400/20",
};

const LEVEL_COLOR: Record<Course["level"], string> = {
  Beginner:     "bg-green-500/15 text-green-300",
  Intermediate: "bg-amber-500/15 text-amber-300",
  Advanced:     "bg-rose-500/15 text-rose-300",
};

const PROVIDER_ICON: Record<Provider, string> = {
  "Niche Academy":   "🎓",
  "Coursera":        "📘",
  "Khan Academy":    "🟢",
  "Microsoft Learn": "🪟",
  "Google":          "🌐",
  "Verizon":         "📡",
};

// ─── Component ──────────────────────────────────────────────────────────────────
export default function ProDevPage() {
  const [providerFilter, setProviderFilter] = useState<Provider | "All">("All");
  const [topicFilter, setTopicFilter] = useState<Topic | "All">("All");

  const filtered = COURSES.filter((c) => {
    const matchProvider = providerFilter === "All" || c.provider === providerFilter;
    const matchTopic    = topicFilter    === "All" || c.topic    === topicFilter;
    return matchProvider && matchTopic;
  });

  const stats = {
    total:  COURSES.length,
    ceus:   COURSES.reduce((s, c) => s + (c.ceus ?? 0), 0),
    providers: ALL_PROVIDERS.length,
  };

  return (
    <div className="mx-auto max-w-container px-7 py-8">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-1">
          <GraduationCap className="h-7 w-7 text-brand" />
          <h1 className="text-3xl font-extrabold tracking-tight text-text">
            Professional Development
          </h1>
        </div>
        <p className="text-muted mt-1">
          Free continuing education and career growth resources for staff — curated from top providers.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-8 grid grid-cols-3 gap-4"
      >
        {[
          { label: "Free Courses",  value: stats.total,     icon: BookOpen,      color: "text-brand" },
          { label: "CEU Hours",     value: `${stats.ceus}+`, icon: Star,          color: "text-amber-400" },
          { label: "Providers",     value: stats.providers, icon: GraduationCap, color: "text-brand2" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <GlowCard key={s.label} className="p-5 flex items-center gap-4">
              <div className={`rounded-full bg-border p-2.5 ${s.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-extrabold tracking-tight text-text">{s.value}</p>
                <p className="text-xs text-muted">{s.label}</p>
              </div>
            </GlowCard>
          );
        })}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6 space-y-3"
      >
        {/* Provider filter */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted self-center mr-1 font-semibold">Provider:</span>
          {(["All", ...ALL_PROVIDERS] as const).map((p) => (
            <button
              key={p}
              onClick={() => setProviderFilter(p as Provider | "All")}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                providerFilter === p
                  ? "bg-brand text-[#02131a]"
                  : "glass text-muted hover:text-text"
              }`}
            >
              {p !== "All" && <span className="mr-1">{PROVIDER_ICON[p as Provider]}</span>}
              {p}
            </button>
          ))}
        </div>

        {/* Topic filter */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted self-center mr-1 font-semibold">Topic:</span>
          {(["All", ...ALL_TOPICS] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTopicFilter(t as Topic | "All")}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                topicFilter === t
                  ? "bg-[#38bdf8] text-[#02131a]"
                  : "glass text-muted hover:text-text"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Results count */}
      <p className="text-xs text-muted mb-4">
        Showing <span className="text-brand font-semibold">{filtered.length}</span> of {COURSES.length} courses
      </p>

      {/* Course grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <GlowCard className="p-6 flex flex-col h-full">
              {/* Top badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${PROVIDER_COLOR[course.provider]}`}>
                  {PROVIDER_ICON[course.provider]} {course.provider}
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${LEVEL_COLOR[course.level]}`}>
                  {course.level}
                </span>
                <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                  Free
                </span>
                {course.ceus && (
                  <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {course.ceus} CEU{course.ceus !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-base font-extrabold tracking-tight text-text mb-2">
                {course.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted flex-1 mb-4">{course.description}</p>

              {/* Meta + action */}
              <div className="flex items-center justify-between gap-3 mt-auto">
                <div className="flex items-center gap-3 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5" />
                    {course.topic}
                  </span>
                </div>
                <a
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-brand to-brand2 px-4 py-2 text-xs font-bold text-[#02131a] hover:opacity-90 transition shrink-0"
                >
                  Launch
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </GlowCard>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-2 py-16 text-center text-muted">
            No courses match the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}
