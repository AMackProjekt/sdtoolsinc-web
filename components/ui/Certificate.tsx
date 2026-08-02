"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface CertificateProps {
  name: string;
  courseName: string;
  certificateId: string;
  completionDate: string;
  score?: number;
  downloadable?: boolean;
  onDownload?: () => void;
}

export function Certificate({
  name,
  courseName,
  certificateId,
  completionDate,
  score,
  downloadable = true,
  onDownload,
}: CertificateProps) {
  const formattedDate = new Date(completionDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Certificate Display */}
      <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border-2 border-brand/50 shadow-lg bg-gradient-to-br from-[#0c1b2f] to-[#051014]">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1200 800">
            <defs>
              <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="#38bdf8" />
              </pattern>
            </defs>
            <rect width="1200" height="800" fill="url(#dots)" />
          </svg>
        </div>

        {/* Decorative Corners */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-brand/50" />
        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-brand/50" />
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-brand/50" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-brand/50" />

        {/* Content */}
        <div className="relative w-full h-full flex flex-col items-center justify-center px-8 text-center">
          {/* Header */}
          <div className="mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-5xl mb-4"
            >
              🏆
            </motion.div>
            <h1 className="text-4xl font-extrabold text-brand mb-2">
              Certificate of Completion
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-brand to-brand2 mx-auto" />
          </div>

          {/* Body Text */}
          <div className="mb-8 max-w-xl">
            <p className="text-muted mb-6">This is to certify that</p>
            <h2 className="text-3xl font-extrabold text-text mb-6 uppercase tracking-wide">
              {name}
            </h2>
            <p className="text-muted mb-2">has successfully completed the course</p>
            <h3 className="text-2xl font-bold text-brand2 mb-4">
              {courseName}
            </h3>

            {score && (
              <div className="text-muted">
                <p className="mb-1">With a score of</p>
                <p className="text-2xl font-extrabold text-brand">{score}%</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between w-full max-w-2xl mt-auto pt-8 border-t border-brand/30">
            <div className="text-left">
              <p className="text-xs text-muted mb-2">Certificate Number</p>
              <p className="text-sm font-mono text-brand font-bold">{certificateId}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted mb-2">Date Awarded</p>
              <p className="text-sm font-semibold text-brand2">{formattedDate}</p>
            </div>
          </div>

          {/* Signature Line */}
          <div className="text-center mt-8 pt-4 border-t border-brand/30 w-full max-w-2xl">
            <p className="text-xs text-muted">T.O.O.L.S Inc - Together Overcoming Obstacles and Limitations</p>
          </div>
        </div>
      </div>

      {/* Certificate Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-lg bg-panel border border-border space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted mb-1">Course Name</p>
            <p className="font-semibold text-text">{courseName}</p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">Completion Date</p>
            <p className="font-semibold text-text">{formattedDate}</p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">Certificate ID</p>
            <p className="font-mono text-sm text-brand font-bold">{certificateId}</p>
          </div>
          {score && (
            <div>
              <p className="text-xs text-muted mb-1">Final Score</p>
              <p className="font-semibold text-brand">{score}%</p>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted mb-3">
            This certificate verifies completion of coursework and demonstrates achievement in the selected competency area. It may be shared digitally or printed for personal records.
          </p>
        </div>
      </motion.div>

      {/* Download Button */}
      {downloadable && onDownload && (
        <motion.button
          onClick={onDownload}
          whileHover={{ y: -2 }}
          className="w-full px-6 py-3 rounded-lg font-semibold text-sm bg-gradient-to-r from-brand to-brand2 text-[#02131a] hover:shadow-glow transition-all"
        >
          📥 Download Certificate (PDF)
        </motion.button>
      )}

      {/* Share Options */}
      <div className="flex gap-4 justify-center">
        <motion.button
          whileHover={{ y: -2 }}
          className="px-4 py-2 rounded-lg text-sm border border-brand text-brand hover:bg-brand/10 transition-all"
        >
          📋 Copy Share Link
        </motion.button>
        <motion.button
          whileHover={{ y: -2 }}
          className="px-4 py-2 rounded-lg text-sm border border-brand text-brand hover:bg-brand/10 transition-all"
        >
          💼 Add to LinkedIn
        </motion.button>
      </div>
    </motion.div>
  );
}
