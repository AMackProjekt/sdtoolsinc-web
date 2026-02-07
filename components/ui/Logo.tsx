'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/cn'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  animated?: boolean
  href?: string
}

const sizeClasses = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-3xl'
}

export function Logo({ size = 'md', className, animated = true, href = '/' }: LogoProps) {
  const content = (
    <span className={cn(
      'font-extrabold bg-gradient-to-r from-brand to-brand2 bg-clip-text text-transparent',
      sizeClasses[size],
      className
    )}>
      T.O.O.L.S Inc
    </span>
  )

  if (animated) {
    return href ? (
      <Link href={href}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="cursor-pointer"
        >
          {content}
        </motion.div>
      </Link>
    ) : (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {content}
      </motion.div>
    )
  }

  return href ? (
    <Link href={href} className="cursor-pointer hover:opacity-80 transition-opacity">
      {content}
    </Link>
  ) : (
    <div>{content}</div>
  )
}
