"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/ui/Navbar";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

export default function PortalsPage() {
  const [hoveredPortal, setHoveredPortal] = useState<string | null>(null);
  
  const portals = [
    {
      id: "client",
      name: "Client Portal",
      tagline: "Your Journey, Your Progress",
      description: "Track your case, access resources, and stay connected with your case manager.",
      url: "https://client.sdtoolsinc.org",
      icon: "👤",
      gradient: "from-blue-500/20 via-cyan-500/20 to-blue-600/20",
      textGradient: "from-blue-400 to-cyan-400",
      stats: [
        { label: "Active Users", value: "1,247" },
        { label: "Resources", value: "500+" }
      ],
      features: ["Case Dashboard", "Progress Tracking", "Resource Library", "Messaging", "Appointments"]
    },
    {
      id: "staff",
      name: "Staff Portal",
      tagline: "Empowering Case Management",
      description: "Comprehensive tools for managing clients, tracking outcomes, and coordinating services.",
      url: "https://staff.sdtoolsinc.org",
      icon: "📋",
      gradient: "from-teal-500/20 via-emerald-500/20 to-teal-600/20",
      textGradient: "from-teal-400 to-emerald-400",
      stats: [
        { label: "Case Managers", value: "87" },
        { label: "Active Cases", value: "2,450" }
      ],
      features: ["Client Management", "Case Notes", "Reporting", "Task Tracking", "Analytics"]
    },
    {
      id: "admin",
      name: "Admin Portal",
      tagline: "Strategic Oversight",
      description: "Complete system control with user management, analytics, and organization-wide insights.",
      url: "https://admin.sdtoolsinc.org",
      icon: "⚙️",
      gradient: "from-purple-500/20 via-pink-500/20 to-purple-600/20",
      textGradient: "from-purple-400 to-pink-400",
      stats: [
        { label: "Organizations", value: "12" },
        { label: "Total Users", value: "3,847" }
      ],
      features: ["User Management", "System Config", "Audit Logs", "Compliance", "Reports"]
    }
  ];

  return (
    <main className="min-h-screen bg-bg">
      {/* Animated background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.08),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(45,212,191,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
      </div>
      
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/20 mb-6"
          >
            <span className="text-2xl">🚀</span>
            <span className="text-sm font-semibold text-brand">T.O.O.L.S Portal Hub</span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight2 mb-6">
            <span className="bg-gradient-to-r from-text to-muted bg-clip-text text-transparent">
              Access Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-brand via-brand2 to-accent bg-clip-text text-transparent">
              Personalized Portal
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Choose your portal below to access tailored tools, resources, and dashboards designed for your role.
          </p>
        </motion.div>

        {/* Portal Cards - Stacked Layout */}
        <div className="space-y-6 max-w-5xl mx-auto">
          {portals.map((portal, index) => (
            <motion.div
              key={portal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              onMouseEnter={() => setHoveredPortal(portal.id)}
              onMouseLeave={() => setHoveredPortal(null)}
              className="relative group"
            >
              <div className={`relative overflow-hidden rounded-2xl border border-border transition-all duration-300 ${
                hoveredPortal === portal.id ? 'border-brand/40 shadow-2xl shadow-brand/10' : ''
              }`}>
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${portal.gradient} opacity-50 transition-opacity duration-300 ${
                  hoveredPortal === portal.id ? 'opacity-100' : ''
                }`} />
                
                {/* Glass effect */}
                <div className="relative backdrop-blur-xl bg-panel/80 p-6 sm:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Left side - Icon & Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start gap-4">
                        <motion.div
                          animate={{
                            scale: hoveredPortal === portal.id ? 1.1 : 1,
                            rotate: hoveredPortal === portal.id ? 5 : 0
                          }}
                          transition={{ duration: 0.3 }}
                          className="text-5xl"
                        >
                          {portal.icon}
                        </motion.div>
                        
                        <div className="flex-1">
                          <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight2 mb-2 bg-gradient-to-r ${portal.textGradient} bg-clip-text text-transparent`}>
                            {portal.name}
                          </h2>
                          <p className="text-sm sm:text-base font-medium text-brand2 mb-2">
                            {portal.tagline}
                          </p>
                          <p className="text-muted text-sm leading-relaxed">
                            {portal.description}
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex gap-6">
                        {portal.stats.map((stat) => (
                          <div key={stat.label} className="flex flex-col">
                            <span className="text-xl sm:text-2xl font-bold text-text">{stat.value}</span>
                            <span className="text-xs text-muted">{stat.label}</span>
                          </div>
                        ))}
                      </div>

                      {/* Features pills */}
                      <div className="flex flex-wrap gap-2">
                        {portal.features.map((feature) => (
                          <span
                            key={feature}
                            className="px-3 py-1 rounded-full text-xs font-medium bg-glass border border-border text-muted"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right side - CTA */}
                    <div className="lg:w-48 flex lg:justify-end">
                      <Button
                        onClick={() => window.location.href = portal.url}
                        className="w-full lg:w-auto px-8 py-4 text-base font-semibold"
                      >
                        <span>Access Portal</span>
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Hover glow effect */}
                <motion.div
                  animate={{
                    opacity: hoveredPortal === portal.id ? 0.3 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className={`absolute inset-0 bg-gradient-to-r ${portal.textGradient} blur-2xl`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-wrap justify-center gap-4 sm:gap-6">
            <a href="/" className="text-sm text-muted hover:text-brand transition-colors">
              ← Back to Home
            </a>
            <span className="text-muted">·</span>
            <a href="/interest" className="text-sm text-muted hover:text-brand transition-colors">
              Get Started
            </a>
            <span className="text-muted">·</span>
            <a href="/referral" className="text-sm text-muted hover:text-brand transition-colors">
              Submit Referral
            </a>
            <span className="text-muted">·</span>
            <a href="mailto:support@sdtoolsinc.org" className="text-sm text-muted hover:text-brand transition-colors">
              Need Help?
            </a>
          </div>
        </motion.div>

        {/* Security Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-glass border border-border">
            <svg className="w-4 h-4 text-brand2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-xs text-muted">Secured with Azure Entra ID · HIPAA Compliant</span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
