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
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Button variant="ghost">
            <a href="/referral">Submit Referral</a>
          </Button>
          <Button variant="primary">
            <a href="/#contact">Get Support</a>
          </Button>
        </div>

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
            <div className="pt-4 space-y-2 border-t border-border">
              <Button variant="ghost" className="w-full">
                <a href="/referral">Submit Referral</a>
              </Button>
              <Button variant="primary" className="w-full">
                <a href="/#contact">Get Support</a>
              </Button>
            </div>
          </nav>
        </motion.div>
      )}
    </header>
  );
}
