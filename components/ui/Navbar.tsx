"use client";

import { motion } from "framer-motion";
import { Button } from "./Button";
import { useState } from "react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-container items-center justify-between px-4 sm:px-7 py-4">
        <motion.a
          href="/"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-center gap-2 sm:gap-3"
        >
          <img
            src="/logos/main-logo.png"
            alt="T.O.O.LS Inc Logo"
            className="h-8 sm:h-10 w-auto object-contain"
          />
          <span className="text-sm sm:text-base font-extrabold tracking-tight text-text">
            T.O.O.LS Inc
          </span>
        </motion.a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          <a className="text-sm font-medium text-muted hover:text-text transition" href="/#platform">Programs</a>
          <a className="text-sm font-medium text-muted hover:text-text transition" href="/reentry">Reentry</a>
          <a className="text-sm font-medium text-muted hover:text-text transition" href="/#dashboard">Impact</a>
          <a className="text-sm font-medium text-muted hover:text-text transition" href="/partnerships">Partnerships</a>
          <a className="text-sm font-medium text-muted hover:text-text transition" href="/referral">Referral</a>
          <a className="text-sm font-medium text-muted hover:text-text transition" href="/#contact">Contact</a>
          <a className="text-sm font-medium text-muted hover:text-text transition" href="/#founder-contact">Founder</a>
          <a className="text-sm font-medium text-brand hover:text-brand2 transition flex items-center gap-2" href="/portal/portals">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            My Portals
          </a>
          
          {/* Portal Sign In Dropdown */}
          <div className="relative group">
            <button className="text-sm font-medium text-muted hover:text-text transition flex items-center gap-1">
              Sign In
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute right-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="glass rounded-lg shadow-xl border border-border overflow-hidden">
                <a 
                  href="https://toolsinc-client-portal.azurestaticapps.net"
                  className="block px-4 py-3 text-sm text-text hover:bg-brand/10 transition"
                >
                  <div className="font-medium">Client Portal</div>
                  <div className="text-xs text-muted mt-0.5">Access your dashboard</div>
                </a>
                <div className="border-t border-border" />
                <a 
                  href="https://toolsinc-casemgr-portal.azurestaticapps.net"
                  className="block px-4 py-3 text-sm text-text hover:bg-brand/10 transition"
                >
                  <div className="font-medium">Case Manager Portal</div>
                  <div className="text-xs text-muted mt-0.5">Manage your clients</div>
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-text hover:text-brand transition"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden border-t border-border bg-bg/95 backdrop-blur-xl"
        >
          <nav className="flex flex-col px-4 py-4 space-y-3">
            <a className="text-sm font-medium text-muted hover:text-text transition py-2" href="/#platform" onClick={() => setMobileMenuOpen(false)}>Programs</a>
            <a className="text-sm font-medium text-muted hover:text-text transition py-2" href="/reentry" onClick={() => setMobileMenuOpen(false)}>Reentry</a>
            <a className="text-sm font-medium text-muted hover:text-text transition py-2" href="/#dashboard" onClick={() => setMobileMenuOpen(false)}>Impact</a>
            <a className="text-sm font-medium text-muted hover:text-text transition py-2" href="/partnerships" onClick={() => setMobileMenuOpen(false)}>Partnerships</a>
            <a className="text-sm font-medium text-muted hover:text-text transition py-2" href="/referral" onClick={() => setMobileMenuOpen(false)}>Referral</a>
            <a className="text-sm font-medium text-muted hover:text-text transition py-2" href="/#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
            <a className="text-sm font-medium text-muted hover:text-text transition py-2" href="/#founder-contact" onClick={() => setMobileMenuOpen(false)}>Founder</a>
            
            {/* My Portals - Prominent Link */}
            <div className="pt-3 border-t border-border">
              <a 
                href={process.env.NEXT_PUBLIC_HUB_URL || 'https://portal.sdtoolsinc.org'}
                className="flex items-center gap-2 px-2 py-3 text-sm font-semibold text-brand hover:text-brand2 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                My Portals Hub
              </a>
            </div>
            
            {/* Mobile Portal Sign In */}
            <div className="pt-2 border-t border-border space-y-2">
              <div className="text-xs uppercase tracking-wider text-muted px-2 py-1">Direct Sign In</div>
              <a 
                href="https://toolsinc-client-portal.azurestaticapps.net" 
                className="block px-2 py-2 text-sm font-medium text-muted hover:text-text transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Client Portal →
              </a>
              <a 
                href="https://toolsinc-casemgr-portal.azurestaticapps.net" 
                className="block px-2 py-2 text-sm font-medium text-muted hover:text-text transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Case Manager Portal →
              </a>
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  );
}
