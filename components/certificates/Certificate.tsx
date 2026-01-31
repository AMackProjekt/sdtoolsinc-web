"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface CertificateProps {
  userName: string;
  courseName: string;
  programName?: string;
  completionDate: string;
  certificateNumber: string;
  onDownload?: () => void;
}

export function Certificate({
  userName,
  courseName,
  programName,
  completionDate,
  certificateNumber,
  onDownload,
}: CertificateProps) {
  const formattedDate = new Date(completionDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white text-gray-900 rounded-2xl overflow-hidden shadow-2xl"
        style={{
          aspectRatio: "1.414 / 1", // A4 aspect ratio
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        {/* Decorative Border */}
        <div className="absolute inset-0 border-[16px] border-double border-amber-600 rounded-2xl" />
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
          {/* Logo/Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-4xl shadow-lg">
              🏆
            </div>
          </div>

          {/* Organization Name */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-wider text-amber-700 mb-2">
              T.O.O.L.S INC
            </h1>
            <div className="text-sm text-gray-600 font-semibold uppercase tracking-widest">
              Certificate of Completion
            </div>
          </div>

          {/* Decorative Line */}
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 via-amber-600 to-amber-400 mb-8" />

          {/* Recipient */}
          <div className="mb-6">
            <div className="text-sm text-gray-600 mb-2 uppercase tracking-wide">
              This certifies that
            </div>
            <div className="text-4xl font-serif font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              {userName}
            </div>
          </div>

          {/* Achievement */}
          <div className="mb-8 max-w-lg">
            <div className="text-sm text-gray-600 mb-3 uppercase tracking-wide">
              has successfully completed
            </div>
            <div className="text-xl font-bold text-gray-800 mb-2">
              {courseName}
            </div>
            {programName && (
              <div className="text-sm text-gray-600 italic">
                as part of the {programName}
              </div>
            )}
          </div>

          {/* Date */}
          <div className="mb-8">
            <div className="text-sm text-gray-600 mb-1 uppercase tracking-wide">
              Date of Completion
            </div>
            <div className="text-lg font-semibold text-gray-800">
              {formattedDate}
            </div>
          </div>

          {/* Decorative Line */}
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 via-amber-600 to-amber-400 mb-6" />

          {/* Signature Section */}
          <div className="grid grid-cols-2 gap-12 mb-8 w-full max-w-md">
            <div className="text-center">
              <div className="border-t-2 border-gray-400 pt-2 mb-1">
                <div className="font-cursive text-xl text-gray-800" style={{ fontFamily: "'Dancing Script', cursive" }}>
                  Executive Director
                </div>
              </div>
              <div className="text-xs text-gray-600">Authorized Signature</div>
            </div>
            <div className="text-center">
              <div className="border-t-2 border-gray-400 pt-2 mb-1">
                <div className="font-cursive text-xl text-gray-800" style={{ fontFamily: "'Dancing Script', cursive" }}>
                  Program Director
                </div>
              </div>
              <div className="text-xs text-gray-600">Authorized Signature</div>
            </div>
          </div>

          {/* Certificate Number */}
          <div className="text-xs text-gray-500 font-mono">
            Certificate No: {certificateNumber}
          </div>

          {/* Verification Seal */}
          <div className="absolute bottom-8 right-12">
            <div className="w-24 h-24 rounded-full border-4 border-amber-600 bg-amber-50 flex flex-col items-center justify-center shadow-lg transform rotate-12">
              <div className="text-amber-700 font-bold text-xs">VERIFIED</div>
              <div className="text-amber-600 text-2xl">✓</div>
              <div className="text-amber-700 font-bold text-xs">AUTHENTIC</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Download Button */}
      {onDownload && (
        <div className="text-center mt-6">
          <button
            onClick={onDownload}
            className={cn(
              "px-8 py-4 rounded-lg font-semibold transition-all",
              "bg-gradient-to-br from-amber-500 to-orange-600 text-white",
              "hover:shadow-xl hover:scale-105 active:scale-95"
            )}
          >
            📥 Download Certificate
          </button>
        </div>
      )}

      {/* Add Google Fonts for better typography */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Dancing+Script:wght@600&display=swap');
      `}</style>
    </div>
  );
}
