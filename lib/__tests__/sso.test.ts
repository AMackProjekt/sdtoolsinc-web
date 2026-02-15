import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getSSOToken, getPortalRedirectUrl, checkAndRestoreSSOToken } from '../sso'

describe('SSO Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getPortalRedirectUrl', () => {
    it('should return client portal URL for client role', async () => {
      const profile = {
        id: 'user-123',
        full_name: 'Test User',
        avatar_url: null,
        role: 'client' as const,
        created_at: new Date().toISOString(),
      }

      const url = await getPortalRedirectUrl(profile)
      expect(url).toContain('toolsinc-client-portal.azurestaticapps.net')
      expect(url).toContain('dashboard')
    })

    it('should return case manager portal URL for case_manager role', async () => {
      const profile = {
        id: 'user-123',
        full_name: 'Test Manager',
        avatar_url: null,
        role: 'case_manager' as const,
        created_at: new Date().toISOString(),
      }

      const url = await getPortalRedirectUrl(profile)
      expect(url).toContain('toolsinc-casemgr-portal.azurestaticapps.net')
      expect(url).toContain('dashboard')
    })

    it('should return admin portal URL for admin role', async () => {
      const profile = {
        id: 'user-123',
        full_name: 'Admin User',
        avatar_url: null,
        role: 'admin' as const,
        created_at: new Date().toISOString(),
      }

      const url = await getPortalRedirectUrl(profile)
      expect(url).toContain('toolsinc-admin-portal.azurestaticapps.net')
      expect(url).toContain('dashboard')
    })

    it('should include SSO token in URL when available', async () => {
      const profile = {
        id: 'user-123',
        full_name: 'Test User',
        avatar_url: null,
        role: 'client' as const,
        created_at: new Date().toISOString(),
      }

      const url = await getPortalRedirectUrl(profile)
      expect(url).toContain('sso_token=')
    })

    it('should return null for invalid profile', async () => {
      const url = await getPortalRedirectUrl(null)
      expect(url).toBeNull()
    })
  })

  describe('checkAndRestoreSSOToken', () => {
    it('should extract token from URL params', () => {
      const mockUrl = 'http://localhost:3000/dashboard?sso_token=abc123xyz'
      
      // Mock window.location
      delete (window as any).location
      window.location = new URL(mockUrl) as any
      
      const token = checkAndRestoreSSOToken()
      expect(token).toBe('abc123xyz')
    })

    it('should return null if no token in URL', () => {
      const mockUrl = 'http://localhost:3000/dashboard'
      
      delete (window as any).location
      window.location = new URL(mockUrl) as any
      
      const token = checkAndRestoreSSOToken()
      expect(token).toBeNull()
    })
  })
})
