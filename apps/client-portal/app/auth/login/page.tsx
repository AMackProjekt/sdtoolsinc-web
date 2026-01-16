'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // TODO: Replace with actual API call
    try {
      // Simulate API call and loading delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      if (formData.username && formData.password) {
        // Store user session (temporary - replace with proper auth)
        localStorage.setItem('portal_user', JSON.stringify({ username: formData.username }))
        router.push('/dashboard')
      } else {
        setError('Please enter both username and password')
        setLoading(false)
      }
    } catch (err) {
      setError('Login failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />
      
      {/* Loading Screen - Welcome Back */}
      {loading && formData.username && formData.password && (
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-panel border border-border text-text focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition"
              placeholder="Enter your username"
              required
            />
          </div>

          {/* Password */}
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
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          {/* Forgot Password */}
          <div className="text-center">
            <Link href="/auth/forgot-password" className="text-sm text-brand hover:text-brand2 transition">
              Forgot password?
            </Link>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-panel text-muted">Don't have an account?</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <Link
              href="/coming-soon"
              className="inline-block px-6 py-3 border border-brand text-brand font-semibold rounded-lg hover:bg-brand/10 transition"
            >
              Create Account
            </Link>
          </div>
        </form>

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
