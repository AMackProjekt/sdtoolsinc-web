"use client";

import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-border/50 bg-panel/50 backdrop-blur-xl overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 footer-grid-bg" />
      </div>

      {/* Glowing top border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand to-transparent animate-pulse" />

      <div className="relative mx-auto max-w-container px-7 py-12">
        <div className="flex flex-col items-center justify-center gap-6">
          {/* Logo with glow effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 blur-2xl bg-brand/30 animate-pulse" />
            <img
              src="/partnerships/amp-logo.jpeg"
              alt="A MackProjekt"
              className="relative h-16 w-auto object-contain"
            />
          </motion.div>

          {/* Neon text with electric effect */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="text-center">
              <div className="relative inline-block">
                {/* Multiple glowing text layers for cyberpunk effect */}
                <span className="absolute inset-0 text-xl md:text-2xl font-extrabold tracking-wider blur-sm text-brand animate-pulse">
                  POWERED BY A MACKPROJEKT
                </span>
                <span className="absolute inset-0 text-xl md:text-2xl font-extrabold tracking-wider blur-md text-brand2 animate-pulse animation-delay-300">
                  POWERED BY A MACKPROJEKT
                </span>
                <span className="absolute inset-0 text-xl md:text-2xl font-extrabold tracking-wider blur-lg text-accent animate-pulse animation-delay-600">
                  POWERED BY A MACKPROJEKT
                </span>
                <span className="relative text-xl md:text-2xl font-extrabold tracking-wider bg-gradient-to-r from-brand via-brand2 to-accent bg-clip-text text-transparent animate-flicker">
                  POWERED BY A MACKPROJEKT
                </span>
              </div>
            </div>
          </motion.div>

          {/* Electric line decoration */}
          <div className="w-full max-w-xs h-[1px] bg-gradient-to-r from-transparent via-brand to-transparent animate-pulse" />

          {/* Social Media Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-6"
          >
            <motion.a
              href="https://www.instagram.com/sd_t.o.o.ls_inc"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="group relative"
              aria-label="Follow us on Instagram"
            >
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-panel/80 backdrop-blur-sm transition-all duration-300 group-hover:border-[#dd2a7b]">
                <svg className="h-5 w-5 text-muted group-hover:text-text transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
            </motion.a>

            <motion.a
              href="https://www.facebook.com/TOOLsInc"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="group relative"
              aria-label="Follow us on Facebook"
            >
              <div className="absolute inset-0 rounded-lg bg-[#1877f2] opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-panel/80 backdrop-blur-sm transition-all duration-300 group-hover:border-[#1877f2]">
                <svg className="h-5 w-5 text-muted group-hover:text-text transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
            </motion.a>

            <motion.a
              href="https://www.tiktok.com/@toolsinc"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="group relative"
              aria-label="Follow us on TikTok"
            >
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#00f2ea] to-[#ff0050] opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-panel/80 backdrop-blur-sm transition-all duration-300 group-hover:border-[#00f2ea]">
                <svg className="h-5 w-5 text-muted group-hover:text-text transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </div>
            </motion.a>
          </motion.div>

          {/* Copyright */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xs text-muted/60 text-center font-mono"
          >
            © {new Date().getFullYear()} T.O.O.L.S Inc. All rights reserved.
          </motion.p>
        </div>
      </div>

      {/* Animated corner accents */}
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-brand/30 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-brand2/30 animate-pulse animation-delay-500" />
    </footer>
  );
}
