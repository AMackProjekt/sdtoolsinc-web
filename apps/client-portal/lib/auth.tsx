'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from './supabase'
import { getProfile } from './supabase'
import { checkAndRestoreSSOToken, restoreSessionFromToken } from '../../../lib/sso'

export interface UserProfile {
  id: string
  email?: string
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
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signInWithAzure: () => Promise<void>
  signInWithMagicLink: (email: string) => Promise<void>
  requestPasswordReset: (email: string) => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  })

  // Load session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for SSO token in URL first
        const ssoToken = checkAndRestoreSSOToken()
        
        if (ssoToken) {
          // Restore session from SSO token
          await restoreSessionFromToken(ssoToken)
        }

        const { data, error } = await supabase.auth.getSession()
        
        if (error) throw error

        if (data?.session?.user) {
          const userProfile = await getProfile(data.session.user.id)
          setAuthState({
            user: data.session.user,
            profile: userProfile,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
        } else {
          setAuthState(prev => ({
            ...prev,
            isLoading: false
          }))
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

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          try {
            const userProfile = await getProfile(session.user.id)
            setAuthState({
              user: session.user,
              profile: userProfile,
              isAuthenticated: true,
              isLoading: false,
              error: null
            })
          } catch (error: any) {
            console.error('Failed to load profile:', error)
            setAuthState({
              user: session.user,
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
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const signInWithPassword = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      if (data?.user) {
        const userProfile = await getProfile(data.user.id)
        setAuthState({
          user: data.user,
          profile: userProfile,
          isAuthenticated: true,
          isLoading: false,
          error: null
        })
      }
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error?.message || 'Failed to sign in'
      }))
      throw error
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })

      if (error) throw error

      if (data?.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            full_name: fullName,
            role: 'client'
          })

        if (profileError) throw profileError

        const userProfile = await getProfile(data.user.id)
        setAuthState({
          user: data.user,
          profile: userProfile,
          isAuthenticated: true,
          isLoading: false,
          error: null
        })
      }
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error?.message || 'Failed to sign up'
      }))
      throw error
    }
  }

  const signInWithAzure = async () => {
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
        error: error?.message || 'Failed to sign in with Azure'
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

      setAuthState(prev => ({
        ...prev,
        isLoading: false
      }))
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error?.message || 'Failed to send magic link'
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

      setAuthState(prev => ({
        ...prev,
        isLoading: false
      }))
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
      setAuthState(prev => ({
        ...prev,
        profile: userProfile,
        isLoading: false
      }))
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
        signInWithAzure,
        signInWithMagicLink,
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
