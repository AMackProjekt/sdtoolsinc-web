"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface CertificateProps {
  userName: string;
  courseName: string;
  completionDate: string;
  courseId: string;
  certificateId: string;
  instructorName?: string;
  credits?: number;
}

export function Certificate({
  userName,
  courseName,
  completionDate,
  courseId,
  certificateId,
  instructorName = "T.O.O.L.S Inc Faculty",
  credits,
}: CertificateProps) {
  const formattedDate = new Date(completionDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="relative w-full aspect-[1.414/1] bg-white overflow-hidden"
      style={{ maxWidth: "800px" }}
    >
      {/* Decorative Border */}
      <div className="absolute inset-0 p-8">
        <div className="w-full h-full border-8 border-double border-[#1e40af] rounded-lg" />
      </div>

      {/* Decorative Corners */}
      <div className="absolute top-6 left-6 w-24 h-24 border-t-4 border-l-4 border-[#38bdf8] rounded-tl-lg" />
      <div className="absolute top-6 right-6 w-24 h-24 border-t-4 border-r-4 border-[#38bdf8] rounded-tr-lg" />
      <div className="absolute bottom-6 left-6 w-24 h-24 border-b-4 border-l-4 border-[#38bdf8] rounded-bl-lg" />
      <div className="absolute bottom-6 right-6 w-24 h-24 border-b-4 border-r-4 border-[#38bdf8] rounded-br-lg" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-16 py-12">
        {/* Logo/Header */}
        <div className="mb-6">
          <div className="text-4xl font-extrabold text-[#1e40af] mb-2">
            T.O.O.L.S Inc
          </div>
          <div className="text-sm text-gray-600 tracking-widest uppercase">
            Together Overcoming Obstacles and Limitations
          </div>
        </div>

        {/* Certificate Title */}
        <div className="mb-8">
          <div className="text-xl text-gray-600 tracking-wide uppercase mb-4">
            Certificate of Completion
          </div>
          <div className="w-64 h-1 bg-gradient-to-r from-transparent via-[#38bdf8] to-transparent mx-auto" />
        </div>

        {/* Recipient */}
        <div className="mb-6">
          <div className="text-sm text-gray-600 mb-2">This certifies that</div>
          <div className="text-4xl font-serif font-bold text-[#1e40af] mb-2 border-b-2 border-gray-300 pb-2 px-8">
            {userName}
          </div>
        </div>

        {/* Achievement */}
        <div className="mb-8 max-w-2xl">
          <div className="text-sm text-gray-600 mb-3">
            has successfully completed the course
          </div>
          <div className="text-2xl font-semibold text-gray-800 mb-4">
            {courseName}
          </div>
          {credits && (
            <div className="text-sm text-gray-600">
              Earning {credits} continuing education {credits === 1 ? "credit" : "credits"}
            </div>
          )}
        </div>

        {/* Date and Signatures */}
        <div className="flex items-end justify-around w-full max-w-lg mt-auto">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-800 mb-1">
              {formattedDate}
            </div>
            <div className="w-48 border-t-2 border-gray-400 pt-1">
              <div className="text-xs text-gray-600">Date</div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-lg font-serif italic text-gray-800 mb-1">
              {instructorName}
            </div>
            <div className="w-48 border-t-2 border-gray-400 pt-1">
              <div className="text-xs text-gray-600">Instructor</div>
            </div>
          </div>
        </div>

        {/* Certificate ID */}
        <div className="mt-8 text-xs text-gray-400 font-mono">
          Certificate ID: {certificateId}
        </div>
      </div>

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <div className="text-9xl font-extrabold text-gray-800 transform rotate-[-30deg]">
          T.O.O.L.S
        </div>
      </div>
    </div>
  );
}

export function CertificatePreview({
  userName,
  courseName,
  completionDate,
  courseId,
  certificateId,
  instructorName,
  credits,
  onDownload,
}: CertificateProps & { onDownload?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-extrabold tracking-tight text-text">
          Course Certificate
        </h2>
        {onDownload && (
          <button
            onClick={onDownload}
            className={cn(
              "px-6 py-3 rounded-lg font-semibold transition-all",
              "bg-gradient-to-br from-brand to-brand2 text-[#02131a]",
              "hover:shadow-glow flex items-center gap-2"
            )}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Certificate
          </button>
        )}
      </div>

      <div className="bg-panel border-2 border-border rounded-xl p-8 shadow-2xl">
        <Certificate
          userName={userName}
          courseName={courseName}
          completionDate={completionDate}
          courseId={courseId}
          certificateId={certificateId}
          instructorName={instructorName}
          credits={credits}
        />
      </div>

      <div className="mt-4 p-4 rounded-lg bg-brand/10 border border-brand/30">
        <p className="text-sm text-text">
          🎓 Congratulations on completing this course! Your certificate is now available for download.
          Share your achievement on LinkedIn or add it to your professional portfolio.
        </p>
      </div>
    </motion.div>
  );
}
