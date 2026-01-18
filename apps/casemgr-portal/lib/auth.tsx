'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface User {
  username: string
  email?: string
  fullName?: string
  name?: string
  id?: string
  caseManagerId?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('portal_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        localStorage.removeItem('portal_user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    // TODO: Replace with actual API call
    // For now, simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const userData: User = {
      username,
      email: `${username}@example.com`,
      fullName: username.charAt(0).toUpperCase() + username.slice(1),
      name: username.charAt(0).toUpperCase() + username.slice(1),
      id: Math.random().toString(36).substring(7),
      caseManagerId: '3' // Default to D.Mack for demo
    }
    
    localStorage.setItem('portal_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('portal_user')
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
