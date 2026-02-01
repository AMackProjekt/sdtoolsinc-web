'use client'

import { motion } from 'framer-motion'

interface CaseManager {
  id: string
  name: string
  initials: string
  email?: string
  phone?: string
}

export const CASE_MANAGERS: CaseManager[] = [
  { id: '1', name: 'T.F', initials: 'TF', email: '', phone: '' },
  { id: '2', name: 'J.R.', initials: 'JR', email: '', phone: '' },
  { id: '3', name: 'D.Mack', initials: 'DM', email: 'dmack@sdtoolsinc.org', phone: '+16193507638' },
  { id: '4', name: 'D.H', initials: 'DH', email: '', phone: '' },
  { id: '5', name: 'L.S.', initials: 'LS', email: '', phone: '' },
  { id: 'none', name: 'Not Assigned', initials: 'NA', email: '', phone: '' }
]

interface CaseManagerCardProps {
  caseManagerId?: string
  compact?: boolean
}

export function CaseManagerCard({ caseManagerId, compact = false }: CaseManagerCardProps) {
  const caseManager = CASE_MANAGERS.find(cm => cm.id === caseManagerId) || CASE_MANAGERS[5]

  if (caseManager.id === 'none') {
    return (
      <div className="text-xs text-muted">
        <span>CaseMgr: Not Assigned</span>
      </div>
    )
  }

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-lg p-3 text-xs min-w-[200px]"
      >
        <div className="flex items-start gap-2">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-brand">{caseManager.initials}</span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-text mb-1">
              CaseMgr: {caseManager.name}
            </div>
            
            {caseManager.email && (
              <a
                href={`mailto:${caseManager.email}`}
                className="text-brand hover:text-brand2 transition-colors flex items-center gap-1 mb-1"
              >
                <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="truncate">{caseManager.email}</span>
              </a>
            )}
            
            {caseManager.phone && (
              <a
                href={`tel:${caseManager.phone}`}
                className="text-brand hover:text-brand2 transition-colors flex items-center gap-1"
              >
                <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{caseManager.phone.replace('+1', '(619) ').replace(/(\d{3})(\d{4})/, '$1-$2')}</span>
              </a>
            )}
            
            {!caseManager.email && !caseManager.phone && (
              <div className="text-muted italic">Contact info pending</div>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  // Full card version
  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-brand">{caseManager.initials}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="text-sm text-muted mb-1">Your Case Manager</div>
          <div className="font-bold text-lg mb-3">{caseManager.name}</div>
          
          {caseManager.email && (
            <a
              href={`mailto:${caseManager.email}`}
              className="text-sm text-brand hover:text-brand2 transition-colors flex items-center gap-2 mb-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {caseManager.email}
            </a>
          )}
          
          {caseManager.phone && (
            <a
              href={`tel:${caseManager.phone}`}
              className="text-sm text-brand hover:text-brand2 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {caseManager.phone.replace('+1', '(619) ').replace(/(\d{3})(\d{4})/, '$1-$2')}
            </a>
          )}
          
          {!caseManager.email && !caseManager.phone && (
            <div className="text-sm text-muted italic">Contact information coming soon</div>
          )}
        </div>
      </div>
    </div>
  )
}
