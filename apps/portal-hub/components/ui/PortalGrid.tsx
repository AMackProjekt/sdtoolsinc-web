'use client'

import { PortalCard } from './PortalCard'

export function PortalGrid({ portals }: { portals: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {portals.map((portal) => (
        <PortalCard key={portal.id} portal={portal} />
      ))}
    </div>
  )
}
