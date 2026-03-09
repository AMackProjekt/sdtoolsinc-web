'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from './supabase'
import { getProfile } from './supabase'
import { checkAndRestoreSSOToken, restoreSessionFromToken } from '../../../lib/sso'
import {
  buildDeviceFingerprint,
  getApprovalStatusFromMetadata,
  getSessionTimeoutMs,
  isAllowedEmailDomain,
  isInviteCodeValid,
} from './security'
import { logAuditEvent } from './audit'

export interface UserProfile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  role: 'admin' | 'case_manager' | 'client'
}

export interface AuthState {
  user: {
    id: string
    email?: string
    user_metadata?: Record<string, any>
    created_at?: string
    last_sign_in_at?: string
    email_confirmed_at?: string
  } | null
  profile: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthContextType extends AuthState {
  signInWithPassword: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string, inviteCode: string) => Promise<void>
  signInWithMicrosoft: () => Promise<void>
  signInWithMagicLink: (email: string) => Promise<void>
  resendVerificationEmail: (email: string) => Promise<void>
  requestPasswordReset: (email: string) => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  signOut: () => Promise<void>
}

const LAST_ACTIVITY_KEY = 'portal_last_activity_at'
const LAST_DEVICE_KEY = 'portal_last_device_fingerprint'
const SECURITY_NOTICE_KEY = 'portal_security_notice'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  })

  const isEmailVerified = (user: { email_confirmed_at?: string } | null) => {
    return Boolean(user?.email_confirmed_at)
  }

  const isApproved = (user: { user_metadata?: Record<string, unknown> } | null) => {
    return getApprovalStatusFromMetadata(user?.user_metadata) === 'approved'
  }

  const guardAuthenticatedUser = async (user: any) => {
    if (!isEmailVerified(user)) {
      await supabase.auth.signOut()
      await logAuditEvent('auth.unverified.blocked', { userId: user?.id, email: user?.email }, 'warning')
      throw new Error('Please verify your email before accessing the portal.')
    }

    if (!isApproved(user)) {
      await supabase.auth.signOut()
      await logAuditEvent('auth.unapproved.blocked', { userId: user?.id, email: user?.email }, 'warning')
      throw new Error('Your account is pending staff approval. You will receive an email once approved.')
    }

    return user
  }

  useEffect(() => {
    const initAuth = async () => {
      try {
        const ssoToken = checkAndRestoreSSOToken()
        if (ssoToken) {
          await restoreSessionFromToken(ssoToken)
        }

        const { data, error } = await supabase.auth.getSession()
        if (error) throw error

        if (data?.session?.user) {
          const safeUser = await guardAuthenticatedUser(data.session.user)
          const userProfile = await getProfile(safeUser.id)

          if (userProfile.role !== 'client') {
            await supabase.auth.signOut()
            throw new Error('Access denied. This portal is for approved client accounts only.')
          }

          const fingerprint = buildDeviceFingerprint()
          const lastDevice = window.localStorage.getItem(LAST_DEVICE_KEY)
          if (lastDevice && lastDevice !== fingerprint) {
            window.localStorage.setItem(SECURITY_NOTICE_KEY, 'New device sign-in detected for your account.')
            await logAuditEvent('security.new_device', { userId: safeUser.id }, 'warning')
          }
          window.localStorage.setItem(LAST_DEVICE_KEY, fingerprint)

          setAuthState({
            user: safeUser,
            profile: userProfile,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }))
        }
      } catch (error: any) {
        console.error('Failed to load session:', error)
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: error?.message
        }))
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        try {
          const safeUser = await guardAuthenticatedUser(session.user)
          const userProfile = await getProfile(safeUser.id)

          if (userProfile.role !== 'client') {
            await supabase.auth.signOut()
            throw new Error('Access denied. This portal is for approved client accounts only.')
          }

          setAuthState({
            user: safeUser,
            profile: userProfile,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
        } catch (error: any) {
          console.error('Failed to load profile:', error)
          setAuthState({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
            error: error?.message
          })
        }
      } else {
        setAuthState({
          user: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        })
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  useEffect(() => {
    if (!authState.isAuthenticated) {
      return
    }

    const markActivity = () => {
      window.localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString())
    }

    markActivity()
    const events = ['click', 'keydown', 'mousemove', 'touchstart', 'scroll']
    events.forEach((eventName) => window.addEventListener(eventName, markActivity, { passive: true }))

    const timeoutMs = getSessionTimeoutMs()
    const interval = window.setInterval(async () => {
      const lastActivity = Number(window.localStorage.getItem(LAST_ACTIVITY_KEY) || '0')
      if (!lastActivity) {
        return
      }

      const elapsed = Date.now() - lastActivity
      if (elapsed >= timeoutMs) {
        try {
          await supabase.auth.signOut()
          await logAuditEvent('auth.session.timeout', { elapsedMs: elapsed }, 'warning')
        } finally {
          setAuthState({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Session expired due to inactivity. Please sign in again.'
          })
        }
      }
    }, 30000)

    return () => {
      events.forEach((eventName) => window.removeEventListener(eventName, markActivity))
      window.clearInterval(interval)
    }
  }, [authState.isAuthenticated])

  const signInWithPassword = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      if (data?.user) {
        const safeUser = await guardAuthenticatedUser(data.user)
        const userProfile = await getProfile(safeUser.id)

        if (userProfile.role !== 'client') {
          await supabase.auth.signOut()
          throw new Error('Access denied. This portal is for approved client accounts only.')
        }

        await logAuditEvent('auth.signin.success', { userId: safeUser.id })

        setAuthState({
          user: safeUser,
          profile: userProfile,
          isAuthenticated: true,
          isLoading: false,
          error: null
        })
      }
    } catch (error: any) {
      await logAuditEvent('auth.signin.failed', { email, reason: error?.message }, 'warning')
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error?.message || 'Failed to sign in'
      }))
      throw error
    }
  }

  const signUp = async (email: string, password: string, fullName: string, inviteCode: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
    try {
      if (!isInviteCodeValid(inviteCode)) {
        throw new Error('Invite code is invalid. Contact your case manager for a valid invitation.')
      }

      if (!isAllowedEmailDomain(email)) {
        throw new Error('This email domain is not permitted for portal onboarding.')
      }

      await logAuditEvent('auth.signup.started', { email })

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
            approval_status: 'pending'
          }
        }
      })

      if (error) throw error

      if (data?.user) {
        await logAuditEvent('auth.signup.pending', { userId: data.user.id, email })
      }

      setAuthState({
        user: null,
        profile: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      })
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error?.message || 'Failed to sign up'
      }))
      throw error
    }
  }

  const signInWithMicrosoft = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error?.message || 'Failed to sign in with Microsoft'
      }))
      throw error
    }
  }

  const signInWithMagicLink = async (email: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error

      setAuthState(prev => ({ ...prev, isLoading: false }))
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error?.message || 'Failed to send magic link'
      }))
      throw error
    }
  }

  const resendVerificationEmail = async (email: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error

      await logAuditEvent('verification.resend.requested', { email })
      setAuthState(prev => ({ ...prev, isLoading: false, error: null }))
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error?.message || 'Failed to resend verification email'
      }))
      throw error
    }
  }

  const requestPasswordReset = async (email: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) throw error

      await logAuditEvent('password.reset.requested', { email })
      setAuthState(prev => ({ ...prev, isLoading: false }))
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error?.message || 'Failed to send reset email'
      }))
      throw error
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!authState.user) throw new Error('No user logged in')

    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', authState.user.id)

      if (error) throw error

      const userProfile = await getProfile(authState.user.id)
      setAuthState(prev => ({ ...prev, profile: userProfile, isLoading: false }))
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error?.message || 'Failed to update profile'
      }))
      throw error
    }
  }

  const signOut = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      await logAuditEvent('auth.signout', { userId: authState.user?.id })
      setAuthState({
        user: null,
        profile: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      })
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error?.message || 'Failed to sign out'
      }))
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        signInWithPassword,
        signUp,
        signInWithMicrosoft,
        signInWithMagicLink,
        resendVerificationEmail,
        requestPasswordReset,
        updateProfile,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
