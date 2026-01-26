export const PORTAL_DEFINITIONS = {
  client: {
    id: 'client',
    name: 'Client Portal',
    description: 'Access your courses, journal, and personal progress tracking.',
    url: process.env.NEXT_PUBLIC_CLIENT_PORTAL_URL || 'https://client.sdtoolsinc.org',
    icon: '👤',
    color: 'bg-blue-500/20',
    gradient: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    requiredRoles: ['client'],
  },
  casemgr: {
    id: 'casemgr',
    name: 'Case Manager Portal',
    description: 'Manage clients, schedule meetings, and track case progress.',
    url: process.env.NEXT_PUBLIC_CASEMGR_PORTAL_URL || 'https://staff.sdtoolsinc.org',
    icon: '📋',
    color: 'bg-purple-500/20',
    gradient: 'bg-gradient-to-br from-purple-500 to-pink-500',
    requiredRoles: ['case_manager'],
    badge: 'Staff',
  },
  admin: {
    id: 'admin',
    name: 'Admin Portal',
    description: 'Full system oversight, user management, and analytics.',
    url: process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL || 'https://admin.sdtoolsinc.org',
    icon: '⚙️',
    color: 'bg-red-500/20',
    gradient: 'bg-gradient-to-br from-red-500 to-orange-500',
    requiredRoles: ['admin'],
    badge: 'Admin Only',
  },
  learning: {
    id: 'learning',
    name: 'Learning Hub',
    description: 'Browse courses, earn certificates, and grow your skills.',
    url: process.env.NEXT_PUBLIC_LEARNING_PORTAL_URL || '/portal/dashboard',
    icon: '📚',
    color: 'bg-green-500/20',
    gradient: 'bg-gradient-to-br from-green-500 to-emerald-500',
    requiredRoles: ['client', 'case_manager', 'admin'], // All roles
  },
  reports: {
    id: 'reports',
    name: 'Reports & Analytics',
    description: 'View detailed reports and performance analytics.',
    url: '/reports',
    icon: '📊',
    color: 'bg-yellow-500/20',
    gradient: 'bg-gradient-to-br from-yellow-500 to-amber-500',
    requiredRoles: ['case_manager', 'admin', 'auditor'],
  },
}

export function getAvailablePortals(userRoles: string[]) {
  return Object.values(PORTAL_DEFINITIONS).filter(portal => 
    portal.requiredRoles.some(role => userRoles.includes(role))
  )
}

export function hasPortalAccess(portalId: string, userRoles: string[]) {
  const portal = PORTAL_DEFINITIONS[portalId as keyof typeof PORTAL_DEFINITIONS]
  if (!portal) return false
  return portal.requiredRoles.some(role => userRoles.includes(role))
}
