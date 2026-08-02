"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function PrivacyBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed
    const dismissed = localStorage.getItem("privacyBannerDismissed");
    if (!dismissed) {
      setIsVisible(true);
    } else {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("privacyBannerDismissed", "true");
    setIsVisible(false);
    setIsDismissed(true);
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-brand/95 to-brand2/95 backdrop-blur-xl border-b border-white/20 shadow-2xl"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="text-2xl flex-shrink-0">🔒</div>
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-bold text-white mb-1">
                    Your Privacy is Protected
                  </h3>
                  <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                    <span className="font-semibold">🛡️ Encrypted:</span> All data transmitted via SSL/TLS encryption. 
                    <span className="mx-2">•</span>
                    <span className="font-semibold">🤐 Confidential:</span> We do NOT share your information with law enforcement without your explicit written consent.
                    <span className="mx-2">•</span>
                    <span className="font-semibold">✓ Your Control:</span> Request data deletion anytime.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href="/privacy-policy"
                  className="text-xs sm:text-sm text-white hover:text-white/80 underline transition-colors whitespace-nowrap"
                >
                  Privacy Policy
                </a>
                <button
                  onClick={handleDismiss}
                  className="px-3 sm:px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap"
                  aria-label="Dismiss privacy banner"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
