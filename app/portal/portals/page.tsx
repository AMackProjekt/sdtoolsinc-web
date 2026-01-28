"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { Button } from "@/components/ui/Button";

interface PortalInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  url: string;
  roles: string[];
}

const portals: PortalInfo[] = [
  {
    id: "client",
    name: "Client Portal",
    description: "Access your personal dashboard, track progress, enroll in courses, and manage your profile.",
    icon: "👤",
    color: "from-blue-500 to-cyan-500",
    url: "http://localhost:3001",
    roles: ["client", "user"]
  },
  {
    id: "casemgr",
    name: "Case Manager Portal",
    description: "Manage client cases, track outcomes, coordinate services, and generate reports.",
    icon: "👥",
    color: "from-purple-500 to-pink-500",
    url: "http://localhost:3002",
    roles: ["casemgr", "coordinator"]
  },
  {
    id: "admin",
    name: "Admin Portal",
    description: "Manage users, configure settings, access analytics, and oversee system operations.",
    icon: "⚙️",
    color: "from-amber-500 to-orange-500",
    url: "http://localhost:3003",
    roles: ["admin", "superadmin"]
  }
];

export default function PortalsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/portal/auth");
    }
  }, [isAuthenticated, router]);

  if (!user) return null;

  const handlePortalClick = (portalUrl: string) => {
    window.open(portalUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Fixed background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />

      {/* Header */}
      <header className="border-b border-border bg-panel/50 backdrop-blur-xl">
        <div className="mx-auto max-w-container px-7 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="text-xl font-extrabold tracking-tight text-text">
              T.O.O.L.S Inc
            </a>
            <span className="text-muted">|</span>
            <span className="text-sm text-muted">My Portals</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/portal/profile")}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted hover:text-text transition-colors"
            >
              <span>{user.name}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-container px-7 pt-24 pb-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h1 className="h1 mb-4">My Portals</h1>
          <p className="p-lead mx-auto max-w-2xl">
            Access different portals based on your role in the T.O.O.L.S Inc ecosystem. Each portal is tailored to your specific needs and responsibilities.
          </p>
        </motion.div>

        {/* Sign In Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <GlowCard className="bg-gradient-to-br from-brand/5 to-brand2/5">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-text mb-2">🔐 Sign In to Your Portal</h2>
              <p className="text-sm text-muted">
                Choose your portal below to access your account
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <a 
                href="https://toolsinc-client-portal.azurestaticapps.net"
                target="_blank"
                rel="noopener noreferrer"
                className="glass rounded-lg px-6 py-4 hover:bg-brand/10 transition-all hover:-translate-y-1 hover:shadow-glow"
              >
                <div className="font-semibold text-text mb-1">Client Portal</div>
                <div className="text-xs text-muted">Access your dashboard</div>
              </a>
              <a 
                href="https://toolsinc-casemgr-portal.azurestaticapps.net"
                target="_blank"
                rel="noopener noreferrer"
                className="glass rounded-lg px-6 py-4 hover:bg-brand/10 transition-all hover:-translate-y-1 hover:shadow-glow"
              >
                <div className="font-semibold text-text mb-1">Case Manager Portal</div>
                <div className="text-xs text-muted">Manage your clients</div>
              </a>
            </div>
          </GlowCard>
        </motion.div>

        {/* Portal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {portals.map((portal, index) => (
            <motion.div
              key={portal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlowCard className="h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{portal.icon}</div>
                  <span className="text-xs px-3 py-1 rounded-full bg-brand/10 text-brand font-semibold">
                    {portal.roles[0]}
                  </span>
                </div>

                <h3 className="h2 text-xl mb-2">{portal.name}</h3>
                <p className="text-muted text-sm leading-relaxed mb-6 flex-grow">
                  {portal.description}
                </p>

                {/* Features List */}
                <div className="space-y-2 mb-6 pb-6 border-b border-border/50">
                  {portal.id === "client" && (
                    <>
                      <div className="flex items-center gap-2 text-sm text-muted">
                        <span>✨</span> Personal Dashboard
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted">
                        <span>📚</span> Course Enrollment
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted">
                        <span>📊</span> Progress Tracking
                      </div>
                    </>
                  )}
                  {portal.id === "casemgr" && (
                    <>
                      <div className="flex items-center gap-2 text-sm text-muted">
                        <span>👥</span> Client Management
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted">
                        <span>📋</span> Case Coordination
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted">
                        <span>📈</span> Outcome Tracking
                      </div>
                    </>
                  )}
                  {portal.id === "admin" && (
                    <>
                      <div className="flex items-center gap-2 text-sm text-muted">
                        <span>👨‍💼</span> User Management
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted">
                        <span>⚙️</span> System Configuration
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted">
                        <span>📊</span> Analytics & Reports
                      </div>
                    </>
                  )}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handlePortalClick(portal.url)}
                  className="w-full inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition will-change-transform glass text-text hover:shadow-glow hover:-translate-y-1"
                >
                  Access Portal →
                </button>
              </GlowCard>
            </motion.div>
          ))}
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <GlowCard className="bg-gradient-to-br from-panel to-panel/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold text-text mb-2">🔐 Secure Access</h3>
                <p className="text-sm text-muted">
                  All portals are secured with authentication and role-based access control.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-text mb-2">🔄 Integrated System</h3>
                <p className="text-sm text-muted">
                  All portals share synchronized data for seamless collaboration.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-text mb-2">📱 Responsive Design</h3>
                <p className="text-sm text-muted">
                  Access portals from any device with full functionality.
                </p>
              </div>
            </div>
          </GlowCard>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-12 pt-12 border-t border-border text-center"
        >
          <p className="text-muted mb-6">Need help? Visit these resources:</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/portal/courses" variant="ghost">
              📚 View Courses
            </Button>
            <Button href="/portal/dashboard" variant="ghost">
              📊 Dashboard
            </Button>
            <Button href="/portal/profile" variant="ghost">
              👤 Profile Settings
            </Button>
            <Button href="/" variant="ghost">
              🏠 Home
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
