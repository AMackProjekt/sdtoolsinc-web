'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { isInviteRequired } from '@/lib/security'

export default function SignupPage() {
  const router = useRouter()
  const { signUp, resendVerificationEmail } = useAuth()
  const [step, setStep] = useState(1) // 1: Initial form, 2: Verification instructions
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    inviteCode: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const inviteRequired = isInviteRequired()

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (inviteRequired && !formData.inviteCode.trim()) {
      setError('Invite code is required for portal onboarding')
      return
    }

    setLoading(true)

    try {
      await signUp(formData.email, formData.password, formData.username, formData.inviteCode)
      setSuccess('Verification email sent. After verification, your account will remain pending until staff approval.')
      setStep(2)
    } catch (err: any) {
      setError(err?.message || 'Failed to send verification email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-dash-glow" />
      
      {/* Transparent T.O.O.L.S Logo - 15% opacity */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none -z-5">
        <img
          src="/tools-logo.png"
          alt="T.O.O.L.S Inc"
          className="opacity-15 max-w-[80%] max-h-[80%] object-contain"
        />
      </div>

      {/* Signup Card */}
      <div className="glass rounded-xl p-8 w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Create Account</h2>
          <p className="text-muted">
            {step === 1 ? 'Join T.O.O.L.S Inc Portal' : 'Confirm your email to unlock portal access'}
          </p>
        </div>

        {/* Step 1: Initial Form */}
        {step === 1 && (
          <form onSubmit={handleInitialSubmit} className="space-y-6">
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
                placeholder="Choose a username"
                required
              />
            </div>

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
                placeholder="your.email@example.com"
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
                placeholder="At least 8 characters"
                required
                minLength={8}
              />
            </div>

            {inviteRequired && (
              <div>
                <label htmlFor="inviteCode" className="block text-sm font-medium mb-2">
                  Invite Code
                </label>
                <input
                  id="inviteCode"
                  type="text"
                  value={formData.inviteCode}
                  onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-panel border border-border text-text focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition"
                  placeholder="Enter your staff-issued code"
                  required
                />
              </div>
            )}

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-panel border border-border text-text focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition"
                placeholder="Re-enter your password"
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
              {loading ? 'Sending verification...' : 'Continue'}
            </button>

            {/* Sign In Link */}
            <div className="text-center text-sm text-muted">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-brand hover:text-brand2 transition">
                Sign In
              </Link>
            </div>
          </form>
        )}

        {/* Step 2: Email Verification Instructions */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand/20 mb-4">
                <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm text-muted">
                We've sent a verification link to<br />
                <span className="text-text font-medium">{formData.email}</span>
              </p>
              <p className="text-xs text-muted mt-3">
                After verification, your account enters pending approval until a staff member activates it.
              </p>
            </div>

            {success && (
              <div className="px-4 py-3 rounded-lg bg-brand/10 border border-brand/30 text-brand text-sm">
                {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Continue to Login */}
            <button
              type="button"
              onClick={() => router.push('/auth/login?verify=check_email')}
              className="w-full px-6 py-3 bg-brand text-bg font-semibold rounded-lg hover:bg-brand2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Go to Sign In
            </button>

            {/* Resend Verification Email */}
            <div className="text-center">
              <button
                type="button"
                onClick={async () => {
                  setError('')
                  setSuccess('')
                  setLoading(true)
                  try {
                    await resendVerificationEmail(formData.email)
                    setSuccess('Verification email resent. Check your inbox and spam folder.')
                  } catch (err: any) {
                    setError(err?.message || 'Failed to resend verification email.')
                  } finally {
                    setLoading(false)
                  }
                }}
                disabled={loading}
                className="text-sm text-brand hover:text-brand2 transition"
              >
                {loading ? 'Sending...' : 'Resend verification email'}
              </button>
            </div>

            {/* Back Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setStep(1)
                  setError('')
                  setSuccess('')
                }}
                className="text-sm text-muted hover:text-text transition"
              >
                ← Back to registration
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
