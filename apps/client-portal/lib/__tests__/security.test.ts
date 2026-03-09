import { describe, expect, it, vi, beforeEach } from 'vitest'
import {
  getApprovalStatusFromMetadata,
  isAllowedEmailDomain,
  isInviteCodeValid,
} from '../security'

describe('portal security policy', () => {
  beforeEach(() => {
    vi.unstubAllEnvs()
  })

  it('requires valid invite code when invite mode enabled', () => {
    vi.stubEnv('NEXT_PUBLIC_REQUIRE_INVITE_CODE', 'true')
    vi.stubEnv('NEXT_PUBLIC_PORTAL_INVITE_CODES', 'ABC123,TOOLS2026')

    expect(isInviteCodeValid('ABC123')).toBe(true)
    expect(isInviteCodeValid('INVALID')).toBe(false)
  })

  it('allows signup when invite mode disabled', () => {
    vi.stubEnv('NEXT_PUBLIC_REQUIRE_INVITE_CODE', 'false')
    vi.stubEnv('NEXT_PUBLIC_PORTAL_INVITE_CODES', '')

    expect(isInviteCodeValid('anything')).toBe(true)
  })

  it('validates allowed email domains when configured', () => {
    vi.stubEnv('NEXT_PUBLIC_ALLOWED_EMAIL_DOMAINS', 'toolsinc.org,example.com')

    expect(isAllowedEmailDomain('client@toolsinc.org')).toBe(true)
    expect(isAllowedEmailDomain('client@outside.org')).toBe(false)
  })

  it('defaults approval status to approved for legacy users', () => {
    expect(getApprovalStatusFromMetadata(undefined)).toBe('approved')
    expect(getApprovalStatusFromMetadata({})).toBe('approved')
    expect(getApprovalStatusFromMetadata({ approval_status: 'pending' })).toBe('pending')
  })
})
