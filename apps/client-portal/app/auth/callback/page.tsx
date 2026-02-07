'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Handle email confirmation
        const token_hash = searchParams.get('token_hash')
        const type = searchParams.get('type')
        
        if (token_hash && type === 'email') {
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: 'email'
          })
          
          if (error) throw error
          
          // Email verified successfully
          router.push('/dashboard?verified=true')
        } else {
          // Regular OAuth callback
          const { error } = await supabase.auth.getSession()
          
          if (error) throw error
          
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        router.push('/auth/login?error=callback_failed')
      }
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-brand/30 border-t-brand rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted">Completing authentication...</p>
      </div>
    </div>
  )
}
