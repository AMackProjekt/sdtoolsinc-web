'use client'

import { PortalCard } from './PortalCard'
import type { Portal } from '@/lib/types'

export function PortalGrid({ portals }: { portals: Portal[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {portals.map((portal) => (
        <PortalCard key={portal.id} portal={portal} />
      ))}
    </div>
  )
}
