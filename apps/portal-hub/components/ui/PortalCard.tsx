'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Portal } from '@/lib/types'

export function PortalCard({ portal }: { portal: Portal }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={portal.url}
        className="block glass rounded-2xl p-8 hover:border-brand/40 transition-all group relative overflow-hidden"
        style={{
          background: 'rgba(255,255,255,.06)',
          border: '1px solid rgba(255,255,255,.12)',
        }}
      >
        {/* Background gradient */}
        <div 
          className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${portal.gradient}`}
        />
        
        {/* Badge */}
        {portal.badge && (
          <div className="absolute top-4 right-4 px-3 py-1 bg-brand/20 text-brand text-xs font-semibold rounded-full">
            {portal.badge}
          </div>
        )}

        {/* Icon */}
        <div className={`w-16 h-16 rounded-xl ${portal.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
          <span className="text-3xl">{portal.icon}</span>
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-text mb-3 group-hover:text-brand transition-colors">
          {portal.name}
        </h3>
        <p className="text-muted mb-6">
          {portal.description}
        </p>

        {/* Arrow */}
        <div className="flex items-center gap-2 text-brand font-medium">
          <span>Open Portal</span>
          <svg 
            className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </Link>
    </motion.div>
  )
}
