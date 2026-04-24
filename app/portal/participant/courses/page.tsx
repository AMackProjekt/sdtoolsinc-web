"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { ExternalLink } from "lucide-react";

type Category =
  | "All"
  | "Anger Management"
  | "Peer Support"
  | "AOD"
  | "Mental Health"
  | "Life Skills"
  | "Career Readiness"
  | "Financial Literacy"
  | "Digital Skills";

type Provider =
  | "Coursera"
  | "Khan Academy"
  | "SAMHSA"
  | "NAMI"
  | "Google"
  | "FDIC"
  | "DigitalLearn";

interface Course {
  id: string;
  title: string;
  provider: Provider;
  category: Exclude<Category, "All">;
  description: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  url: string;
  ceus?: string;
}

const COURSES: Course[] = [
  {
    id: "c1",
    title: "The Science of Well-Being",
    provider: "Coursera",
    category: "Anger Management",
    description:
      "Yale's most popular course teaches emotional regulation, stress management, and building lasting happiness. Free to audit.",
    duration: "10 weeks",
    level: "Beginner",
    url: "https://www.coursera.org/learn/the-science-of-well-being",
    ceus: "2 CEU",
  },
  {
    id: "c2",
    title: "Emotional & Social Intelligence",
    provider: "Coursera",
    category: "Anger Management",
    description:
      "Build self-awareness, empathy, and emotional regulation skills for healthier relationships and better conflict management.",
    duration: "4 weeks",
    level: "Beginner",
    url: "https://www.coursera.org/learn/emotional-intelligence-cultivating-immensely-human-interactions",
  },
  {
    id: "c3",
    title: "What is Social Work? Practical Introduction",
    provider: "Coursera",
    category: "Peer Support",
    description:
      "Explore the principles of social work, peer advocacy, and how to support individuals in your community. Free to audit.",
    duration: "6 weeks",
    level: "Beginner",
    url: "https://www.coursera.org/learn/what-is-social-work",
    ceus: "1 CEU",
  },
  {
    id: "c4",
    title: "NAMI Peer Support Programs",
    provider: "NAMI",
    category: "Peer Support",
    description:
      "NAMI's peer-led education programs for individuals living with mental illness. Connection, recovery, and community support resources.",
    duration: "Self-paced",
    level: "Beginner",
    url: "https://www.nami.org/Support-Education/NAMI-Programs",
  },
  {
    id: "c5",
    title: "SAMHSA Recovery Support Tools",
    provider: "SAMHSA",
    category: "Peer Support",
    description:
      "Comprehensive peer recovery support resources, toolkits, and training materials to aid individuals on their journey to wellness.",
    duration: "Self-paced",
    level: "Beginner",
    url: "https://www.samhsa.gov/brss-tacs/recovery-support-tools/peers",
  },
  {
    id: "c6",
    title: "Addiction Treatment: Clinical Skills",
    provider: "Coursera",
    category: "AOD",
    description:
      "Yale School of Medicine course covering evidence-based interventions for substance use disorders. Free to audit.",
    duration: "8 weeks",
    level: "Intermediate",
    url: "https://www.coursera.org/learn/addiction-treatment",
    ceus: "2 CEU",
  },
  {
    id: "c7",
    title: "Substance Use Prevention Resources",
    provider: "SAMHSA",
    category: "AOD",
    description:
      "Evidence-based prevention resources, educational campaigns, and training for substance use disorder awareness and recovery.",
    duration: "Self-paced",
    level: "Beginner",
    url: "https://www.samhsa.gov/prevention",
  },
  {
    id: "c8",
    title: "Understanding Drug Use & Addiction",
    provider: "SAMHSA",
    category: "AOD",
    description:
      "NIDA's comprehensive learning resources on the science of addiction, how drugs affect the brain, and pathways to recovery.",
    duration: "Self-paced",
    level: "Beginner",
    url: "https://nida.nih.gov/publications/drugs-brains-behavior-science-addiction",
  },
  {
    id: "c9",
    title: "Mental Health and Nutrition",
    provider: "Coursera",
    category: "Mental Health",
    description:
      "Explore the link between diet, lifestyle, and mental health. Learn practical strategies for emotional and psychological wellness.",
    duration: "5 weeks",
    level: "Beginner",
    url: "https://www.coursera.org/learn/mental-health-and-nutrition",
  },
  {
    id: "c10",
    title: "Managing Your Mental Health",
    provider: "Coursera",
    category: "Mental Health",
    description:
      "Evidence-based skills to manage stress, anxiety, and day-to-day mental health challenges. Offered by University of Toronto.",
    duration: "4 weeks",
    level: "Beginner",
    url: "https://www.coursera.org/learn/manage-health-covid-19",
  },
  {
    id: "c11",
    title: "NAMI Mental Health Education",
    provider: "NAMI",
    category: "Mental Health",
    description:
      "Free programs from the National Alliance on Mental Illness including family support, wellness planning, and mental health first aid concepts.",
    duration: "Self-paced",
    level: "Beginner",
    url: "https://www.nami.org/Support-Education",
  },
  {
    id: "c12",
    title: "Learning How to Learn",
    provider: "Coursera",
    category: "Life Skills",
    description:
      "McMaster University's #1 most popular MOOC. Master memory, habit formation, and overcoming procrastination. Fully free to audit.",
    duration: "4 weeks",
    level: "Beginner",
    url: "https://www.coursera.org/learn/learning-how-to-learn",
  },
  {
    id: "c13",
    title: "Growth Mindset",
    provider: "Khan Academy",
    category: "Life Skills",
    description:
      "Develop a growth mindset with free interactive lessons on resilience, perseverance, and achieving your personal goals.",
    duration: "2 hours",
    level: "Beginner",
    url: "https://www.khanacademy.org/college-careers-more/learnstorm-growth-mindset-activities-us",
  },
  {
    id: "c14",
    title: "Life Skills & Independent Living",
    provider: "Khan Academy",
    category: "Life Skills",
    description:
      "Practical skills for independent living covering health decisions, civic responsibilities, and everyday problem-solving.",
    duration: "Self-paced",
    level: "Beginner",
    url: "https://www.khanacademy.org",
  },
  {
    id: "c15",
    title: "Career Exploration",
    provider: "Khan Academy",
    category: "Career Readiness",
    description:
      "Discover career paths, build job skills, and prepare your resume and interview skills — all free through Khan Academy.",
    duration: "Self-paced",
    level: "Beginner",
    url: "https://www.khanacademy.org/college-careers-more/career-content",
  },
  {
    id: "c16",
    title: "Google Career Certificates",
    provider: "Google",
    category: "Career Readiness",
    description:
      "Google's free career training covers resume writing, interview techniques, and professional communication for entry-level roles.",
    duration: "6 months",
    level: "Beginner",
    url: "https://grow.google/certificates/",
  },
  {
    id: "c17",
    title: "Introduction to Project Management",
    provider: "Coursera",
    category: "Career Readiness",
    description:
      "Fundamentals of project management including time management, goal setting, and workplace collaboration skills.",
    duration: "6 weeks",
    level: "Beginner",
    url: "https://www.coursera.org/learn/project-management-foundations",
  },
  {
    id: "c18",
    title: "Personal Finance",
    provider: "Khan Academy",
    category: "Financial Literacy",
    description:
      "Comprehensive free personal finance curriculum covering budgeting, saving, taxes, loans, insurance, and retirement planning.",
    duration: "Self-paced",
    level: "Beginner",
    url: "https://www.khanacademy.org/college-careers-more/personal-finance",
  },
  {
    id: "c19",
    title: "FDIC Money Smart Program",
    provider: "FDIC",
    category: "Financial Literacy",
    description:
      "The FDIC's free financial education program for adults covers banking, budgeting, credit, and building financial stability.",
    duration: "Self-paced",
    level: "Beginner",
    url: "https://www.fdic.gov/consumers/consumer/moneysmart/",
  },
  {
    id: "c20",
    title: "Financial Markets",
    provider: "Coursera",
    category: "Financial Literacy",
    description:
      "Yale's Nobel Prize-winning professor Robert Shiller teaches an overview of ideas and institutions that help people manage financial risk.",
    duration: "7 weeks",
    level: "Intermediate",
    url: "https://www.coursera.org/learn/financial-markets-global",
  },
  {
    id: "c21",
    title: "Digital Literacy Essentials",
    provider: "DigitalLearn",
    category: "Digital Skills",
    description:
      "Free online courses to build basic computer, internet, and smartphone skills — perfect for those starting their digital journey.",
    duration: "Self-paced",
    level: "Beginner",
    url: "https://digitallearn.org",
  },
  {
    id: "c22",
    title: "Google Digital Garage",
    provider: "Google",
    category: "Digital Skills",
    description:
      "Google's free training platform teaches digital marketing, data fundamentals, and career development with globally recognized certificates.",
    duration: "Self-paced",
    level: "Beginner",
    url: "https://learndigital.withgoogle.com/digitalgarage",
  },
  {
    id: "c23",
    title: "Google IT Support Certificate",
    provider: "Coursera",
    category: "Digital Skills",
    description:
      "Learn the skills needed to succeed in an entry-level IT support role. Developed by Google. Audit all content for free.",
    duration: "6 months",
    level: "Beginner",
    url: "https://www.coursera.org/professional-certificates/google-it-support",
  },
  {
    id: "c24",
    title: "Introduction to Computers & the Internet",
    provider: "Khan Academy",
    category: "Digital Skills",
    description:
      "Khan Academy's free intro to computers — how they work, how to protect yourself online, and basic programming concepts.",
    duration: "Self-paced",
    level: "Beginner",
    url: "https://www.khanacademy.org/computing/computers-and-internet",
  },
];

const CATEGORIES: Category[] = [
  "All",
  "Anger Management",
  "Peer Support",
  "AOD",
  "Mental Health",
  "Life Skills",
  "Career Readiness",
  "Financial Literacy",
  "Digital Skills",
];

const PROVIDER_COLOR: Record<Provider, string> = {
  Coursera: "bg-blue-500/15 text-blue-300",
  "Khan Academy": "bg-green-500/15 text-green-300",
  SAMHSA: "bg-purple-500/15 text-purple-300",
  NAMI: "bg-teal-500/15 text-teal-300",
  Google: "bg-yellow-500/15 text-yellow-300",
  FDIC: "bg-orange-500/15 text-orange-300",
  DigitalLearn: "bg-cyan-500/15 text-cyan-300",
};

const LEVEL_COLOR = {
  Beginner: "bg-emerald-500/10 text-emerald-400",
  Intermediate: "bg-amber-500/10 text-amber-400",
  Advanced: "bg-red-500/10 text-red-400",
};

export default function ParticipantCoursesPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [category, setCategory] = useState<Category>("All");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/portal/participant/auth");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) return null;

  const filtered =
    category === "All" ? COURSES : COURSES.filter((c) => c.category === category);

  return (
    <div className="mx-auto max-w-container px-7 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-extrabold tracking-tight text-text">Free Learning Catalog</h1>
        <p className="mt-2 text-muted">
          {COURSES.length} free courses from Coursera, Khan Academy, SAMHSA, NAMI, Google &amp; more
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {[
          { label: "Total Courses", value: COURSES.length },
          { label: "Free Providers", value: 7 },
          { label: "Categories", value: CATEGORIES.length - 1 },
          { label: "CEU-Eligible", value: COURSES.filter((c) => c.ceus).length },
        ].map(({ label, value }) => (
          <GlowCard key={label} className="p-4 text-center">
            <div className="text-2xl font-extrabold text-brand">{value}</div>
            <div className="mt-1 text-xs text-muted">{label}</div>
          </GlowCard>
        ))}
      </motion.div>

      {/* Category filter */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 flex flex-wrap gap-2"
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
              category === cat
                ? "bg-brand text-[#02131a]"
                : "bg-panel border border-border text-muted hover:text-text"
            }`}
          >
            {cat}
            {cat !== "All" && (
              <span className="ml-1.5 opacity-60">
                ({COURSES.filter((c) => c.category === cat).length})
              </span>
            )}
          </button>
        ))}
      </motion.div>

      {/* Results count */}
      <p className="mb-4 text-sm text-muted">
        Showing <span className="font-semibold text-text">{filtered.length}</span> course{filtered.length !== 1 ? "s" : ""}
        {category !== "All" && <> in <span className="text-brand">{category}</span></>}
      </p>

      {/* Course grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
          >
            <GlowCard className="p-5 flex flex-col h-full">
              {/* Badges */}
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${PROVIDER_COLOR[course.provider]}`}>
                  {course.provider}
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${LEVEL_COLOR[course.level]}`}>
                  {course.level}
                </span>
                <span className="rounded-full bg-emerald-600/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                  Free
                </span>
                {course.ceus && (
                  <span className="rounded-full bg-sky-500/10 px-2.5 py-0.5 text-xs font-semibold text-sky-300">
                    {course.ceus}
                  </span>
                )}
              </div>

              <h3 className="mb-2 text-base font-extrabold tracking-tight text-text leading-snug">
                {course.title}
              </h3>

              <p className="text-sm text-muted flex-1 leading-relaxed">{course.description}</p>

              <div className="mt-3 flex items-center gap-3 text-xs text-muted">
                <span>⏱ {course.duration}</span>
                <span className="text-border">·</span>
                <span>{course.category}</span>
              </div>

              <a
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-teal-500 to-brand py-2.5 text-sm font-semibold text-[#02131a] transition-all hover:opacity-90 active:opacity-75"
              >
                Start Learning <ExternalLink size={14} />
              </a>
            </GlowCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
