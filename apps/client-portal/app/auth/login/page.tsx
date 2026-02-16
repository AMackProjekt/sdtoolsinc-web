'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, signInWithPassword, signInWithAzure, signInWithMagicLink } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showMagicLink, setShowMagicLink] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  const markRedirectStart = () => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('portal_redirect_start_ms', Date.now().toString())
  }

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      markRedirectStart()
      await signInWithPassword(formData.email, formData.password)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please try again.')
      setLoading(false)
    }
  }

  const handleAzureSignIn = async () => {
    setError('')
    setLoading(true)
    try {
      markRedirectStart()
      await signInWithAzure()
    } catch (err: any) {
      setError(err?.message || 'Azure sign-in failed. Please try again.')
      setLoading(false)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signInWithMagicLink(formData.email)
      setMagicLinkSent(true)
    } catch (err: any) {
      setError(err?.message || 'Magic link failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />
      
      {/* Loading Screen - Welcome Back */}
      {loading && formData.email && formData.password && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/95 backdrop-blur-sm">
          <div className="text-center">
            <div className="mb-6">
              <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-muted">Loading your profile...</p>
          </div>
        </div>
      )}
      
      {/* Transparent T.O.O.L.S Logo - 15% opacity */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none -z-5">
        <img
          src="/tools-logo.png"
          alt="T.O.O.L.S Inc"
          className="opacity-15 max-w-[80%] max-h-[80%] object-contain"
        />
      </div>

      {/* Login Card */}
      <div className="glass rounded-xl p-8 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-brand to-brand2 bg-clip-text text-transparent">
            TOOLKIT
          </h2>
          <p className="text-xl font-semibold mb-2">Access Your Purpose</p>
          <p className="text-sm text-muted">Sign in to continue</p>
        </div>

        {/* Magic Link Success Message */}
        {magicLinkSent ? (
          <div className="space-y-4">
            <div className="px-4 py-3 rounded-lg bg-brand/10 border border-brand/30 text-brand text-sm text-center">
              Magic link sent! Check your email for a sign-in link.
            </div>
            <button
              onClick={() => {
                setMagicLinkSent(false)
                setFormData({ email: '', password: '' })
              }}
              className="w-full px-6 py-3 bg-brand/10 text-brand font-semibold rounded-lg hover:bg-brand/20 transition"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={showMagicLink ? handleMagicLink : handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-panel border border-border text-text focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password */}
              {!showMagicLink && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-panel border border-border text-text focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-brand text-bg font-semibold rounded-lg hover:bg-brand2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : (showMagicLink ? 'Send Magic Link' : 'Sign In')}
              </button>

              {/* Magic Link Toggle */}
              {!showMagicLink && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowMagicLink(true)}
                    className="text-sm text-brand hover:text-brand2 transition"
                  >
                    Sign in with magic link instead
                  </button>
                </div>
              )}

              {/* Forgot Password */}
              {!showMagicLink && (
                <div className="text-center">
                  <Link href="/auth/forgot-password" className="text-sm text-brand hover:text-brand2 transition">
                    Forgot password?
                  </Link>
                </div>
              )}
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-panel text-muted">Or continue with</span>
              </div>
            </div>

            {/* Azure Sign In Button */}
            <button
              onClick={handleAzureSignIn}
              disabled={loading}
              className="w-full px-6 py-3 bg-panel border border-border text-text font-semibold rounded-lg hover:bg-panel/80 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6v-11.4H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" />
              </svg>
              Sign in with Azure
            </button>

            {/* Sign Up Link */}
            <div className="text-center border-t border-border pt-6">
              <p className="text-sm text-muted mb-4">Don't have an account?</p>
              <Link
                href="/coming-soon"
                className="inline-block px-6 py-3 border border-brand text-brand font-semibold rounded-lg hover:bg-brand/10 transition"
              >
                Create Account
              </Link>
            </div>
          </>
        )}
      </div>

        {/* Legal Print */}
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-xs text-muted text-center mb-4 leading-relaxed">
            By accessing this portal, you agree to our Terms of Service and Privacy Policy. 
            Your information will be kept confidential and used solely for program purposes. 
            T.O.O.L.S Inc is committed to protecting your privacy and supporting your journey.
          </p>
          
          {/* Copyright & Branding */}
          <div className="text-center">
            <p className="text-xs text-muted">
              © {new Date().getFullYear()} T.O.O.L.S Inc™. All Rights Reserved.
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <p className="text-xs text-muted">Powered By</p>
              <img
                src="/amp-logo.jpeg"
                alt="A MackProjekt"
                className="h-6 w-auto opacity-80 hover:opacity-100 transition"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
