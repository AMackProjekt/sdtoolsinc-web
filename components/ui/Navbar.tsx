"use client";

import { motion } from "framer-motion";
import { Button } from "./Button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-container items-center justify-between px-7 py-4">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="font-extrabold tracking-tight"
        >
          T.O.O.LS Inc
        </motion.div>

        <nav className="hidden items-center gap-6 md:flex">
          <a className="text-sm font-medium text-muted hover:text-text" href="#platform">Platform</a>
          <a className="text-sm font-medium text-muted hover:text-text" href="#solutions">Solutions</a>
          <a className="text-sm font-medium text-muted hover:text-text" href="#dashboard">Dashboard</a>
          <a className="text-sm font-medium text-muted hover:text-text" href="#contact">Contact</a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" className="hidden sm:inline-flex">View Demo</Button>
          <Button variant="primary">Get Started</Button>
        </div>
      </div>
    </header>
  );
}
