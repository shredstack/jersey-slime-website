'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/account'

  const supabase = createClient()

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const fullName = formData.get('full_name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirm_password') as string

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSignupSuccess(true)
    setLoading(false)
  }

  async function handleGoogleSignIn() {
    setError(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
      },
    })

    if (error) {
      setError(error.message)
    }
  }

  if (signupSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="rounded-xl bg-green-50 border border-green-200 p-6">
            <h2 className="text-xl font-semibold text-green-800">Check your email</h2>
            <p className="mt-2 text-sm text-green-700">
              We sent a confirmation link to your email address. Please click it to activate your account.
            </p>
          </div>
          <button
            onClick={() => { setSignupSuccess(false); setActiveTab('signin') }}
            className="text-sm text-brand-purple hover:text-brand-pink transition-colors"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Jersey Slime Studio 38
          </h1>
          <p className="mt-2 text-gray-600">
            {activeTab === 'signin'
              ? 'Welcome back! Sign in to your account.'
              : 'Create an account to get started.'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => { setActiveTab('signin'); setError(null) }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'signin'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveTab('signup'); setError(null) }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'signup'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Google OAuth */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-gray-50 px-2 text-gray-500">or</span>
          </div>
        </div>

        {/* Sign In Form */}
        {activeTab === 'signin' && (
          <form className="space-y-4" onSubmit={handleSignIn}>
            <div>
              <label htmlFor="signin-email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="signin-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="signin-password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="signin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
                placeholder="Your password"
              />
            </div>
            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-brand-purple hover:text-brand-pink transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-brand-pink px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-pink/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Sign Up Form */}
        {activeTab === 'signup' && (
          <form className="space-y-4" onSubmit={handleSignUp}>
            <div>
              <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700">
                Full name
              </label>
              <input
                id="signup-name"
                name="full_name"
                type="text"
                autoComplete="name"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="signup-password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
                placeholder="Create a password"
              />
            </div>
            <div>
              <label
                htmlFor="signup-confirm-password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm password
              </label>
              <input
                id="signup-confirm-password"
                name="confirm_password"
                type="password"
                autoComplete="new-password"
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-brand-pink focus:outline-none focus:ring-1 focus:ring-brand-pink"
                placeholder="Confirm your password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-brand-pink px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-pink/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
