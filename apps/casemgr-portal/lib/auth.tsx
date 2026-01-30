'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase, getProfile } from '@/lib/supabase'

interface User {
  id: string
  email: string
  fullName?: string
  name?: string
  role?: string
  caseManagerId?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          const profile = await getProfile(session.user.id)
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: profile.full_name || session.user.email || 'User',
            fullName: profile.full_name || session.user.email || 'User',
            role: profile.role,
            caseManagerId: session.user.id
          }
          setUser(userData)
        }
      } catch (error) {
        console.error('Failed to load session', error)
      } finally {
        setLoading(false)
      }
    }

    loadSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          const profile = await getProfile(session.user.id)
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: profile.full_name || session.user.email || 'User',
            fullName: profile.full_name || session.user.email || 'User',
            role: profile.role,
            caseManagerId: session.user.id
          }
          setUser(userData)
        } catch (error) {
          console.error('Failed to load profile', error)
          setUser(null)
        }
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        const profile = await getProfile(data.user.id)
        const userData: User = {
          id: data.user.id,
          email: data.user.email || '',
          name: profile.full_name || data.user.email || 'User',
          fullName: profile.full_name || data.user.email || 'User',
          role: profile.role,
          caseManagerId: data.user.id
        }
        setUser(userData)
      }
    } catch (error) {
      console.error('Login error', error)
      throw error
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/auth/login')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Protected Route Wrapper
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !isAuthenticated && !pathname.startsWith('/auth')) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, loading, pathname, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-muted">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated && !pathname.startsWith('/auth')) {
    return null
  }

  return <>{children}</>
}
