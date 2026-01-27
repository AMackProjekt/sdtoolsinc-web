/**
 * Portal URL Configuration
 * Centralized portal URLs that can be used across all applications
 */

interface PortalUrls {
  main: string
  client: string
  casemgr: string
  admin: string
  hub: string
  learning: string
}

const getPortalUrls = (): PortalUrls => {
  const isDevelopment = process.env.NODE_ENV === 'development'
  const isStaging = process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'

  if (isDevelopment) {
    return {
      main: 'http://localhost:3000',
      client: 'http://localhost:3001',
      casemgr: 'http://localhost:3002',
      admin: 'http://localhost:3003',
      hub: 'http://localhost:3004',
      learning: 'http://localhost:3000/portal',
    }
  }

  if (isStaging) {
    return {
      main: process.env.NEXT_PUBLIC_MAIN_URL || 'https://staging.sdtoolsinc.org',
      client: process.env.NEXT_PUBLIC_CLIENT_PORTAL_URL || 'https://client-staging.sdtoolsinc.org',
      casemgr: process.env.NEXT_PUBLIC_CASEMGR_PORTAL_URL || 'https://staff-staging.sdtoolsinc.org',
      admin: process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL || 'https://admin-staging.sdtoolsinc.org',
      hub: process.env.NEXT_PUBLIC_HUB_URL || 'https://portal-staging.sdtoolsinc.org',
      learning: process.env.NEXT_PUBLIC_LEARNING_URL || 'https://staging.sdtoolsinc.org/portal',
    }
  }

  // Production
  return {
    main: 'https://www.sdtoolsinc.org',
    client: 'https://client.sdtoolsinc.org',
    casemgr: 'https://staff.sdtoolsinc.org',
    admin: 'https://admin.sdtoolsinc.org',
    hub: 'https://portal.sdtoolsinc.org',
    learning: 'https://www.sdtoolsinc.org/portal',
  }
}

export const PORTAL_URLS = getPortalUrls()

/**
 * Helper function to get portal URL by type
 */
export function getPortalUrl(type: keyof PortalUrls): string {
  return PORTAL_URLS[type]
}

/**
 * Redirect to another portal
 */
export function redirectToPortal(type: keyof PortalUrls, path = '') {
  if (typeof window !== 'undefined') {
    window.location.href = `${getPortalUrl(type)}${path}`
  }
}
