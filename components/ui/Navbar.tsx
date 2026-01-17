"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useCallback } from "react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

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
          <Image
            src="/logos/main-logo.png"
            alt="T.O.O.L.S Inc Logo"
            width={40}
            height={40}
            className="h-8 sm:h-10 w-auto object-contain"
            priority
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

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
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
            <a className="text-sm font-medium text-muted hover:text-text transition py-2" href="/#platform" onClick={closeMobileMenu}>Programs</a>
            <a className="text-sm font-medium text-muted hover:text-text transition py-2" href="/reentry" onClick={closeMobileMenu}>Reentry</a>
            <a className="text-sm font-medium text-muted hover:text-text transition py-2" href="/#dashboard" onClick={closeMobileMenu}>Impact</a>
            <a className="text-sm font-medium text-muted hover:text-text transition py-2" href="/partnerships" onClick={closeMobileMenu}>Partnerships</a>
            <a className="text-sm font-medium text-muted hover:text-text transition py-2" href="/referral" onClick={closeMobileMenu}>Referral</a>
            <a className="text-sm font-medium text-muted hover:text-text transition py-2" href="/#contact" onClick={closeMobileMenu}>Contact</a>
          </nav>
        </motion.div>
      )}
    </header>
  );
}
