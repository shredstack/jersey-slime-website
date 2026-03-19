'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { navLinks } from './Navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    function fetchRole(userId: string) {
      supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()
        .then(({ data }) => setRole(data?.role ?? null))
    }

    // Listen for auth changes (includes INITIAL_SESSION event)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user ?? null
      setUser(newUser)
      if (newUser) {
        fetchRole(newUser.id)
      } else {
        setRole(null)
      }
    })

    // Validate session with the server (more reliable than getSession for SSR cookie setups)
    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (authUser) {
        setUser(authUser)
        fetchRole(authUser.id)
      }
    })

    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  async function handleSignOut() {
    await supabase.auth.signOut()
    setUser(null)
    setRole(null)
    setDropdownOpen(false)
    router.push('/')
    router.refresh()
  }

  const isAdmin = role === 'admin'

  // Derive initials for the avatar
  const displayName = user?.user_metadata?.full_name as string | undefined
  const initials = displayName
    ? displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <header className="sticky top-0 z-50 bg-white lg:bg-white/90 lg:backdrop-blur-md border-b border-purple-100 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/jersey-slime-logo.png"
              alt="Jersey Slime Studio 38 logo"
              width={40}
              height={40}
              className="rounded-full"
              priority
            />
            <span className="text-xl font-bold bg-gradient-to-r from-pink-500 via-purple-400 to-teal-400 bg-clip-text text-transparent font-display tracking-tight">
              Jersey Slime Studio 38
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-gray-700 rounded-lg transition-colors hover:text-pink-600 hover:bg-pink-50"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side: Auth + Mobile toggle */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                {/* Profile dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    aria-label="Open profile menu"
                    aria-expanded={dropdownOpen}
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 p-0.5 shadow-md transition-transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-purple-600 select-none">
                      {initials}
                    </span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black/5 z-50 overflow-hidden">
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        {displayName && (
                          <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
                        )}
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>

                      {/* Links */}
                      <div className="py-1">
                        <Link
                          href="/account"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                        >
                          <UserIcon className="h-4 w-4 shrink-0" />
                          My Profile
                        </Link>
                        <Link
                          href="/account/bookings"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                        >
                          <CalendarIcon className="h-4 w-4 shrink-0" />
                          My Bookings
                        </Link>
                        <Link
                          href="/account/events"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                        >
                          <PartyIcon className="h-4 w-4 shrink-0" />
                          My Events
                        </Link>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                          >
                            <ShieldIcon className="h-4 w-4 shrink-0" />
                            Admin Dashboard
                          </Link>
                        )}
                      </div>

                      {/* Sign out */}
                      <div className="border-t border-gray-100 py-1">
                        <button
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <LogOutIcon className="h-4 w-4 shrink-0" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105 hover:shadow-lg"
              >
                <UserIcon className="h-4 w-4" />
                Login
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              type="button"
              className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile slide-out menu */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity lg:hidden ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-out panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-xl transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-purple-100 shrink-0">
          <span className="text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent font-display">
            Menu
          </span>
          <button
            type="button"
            className="rounded-lg p-2 text-gray-500 hover:bg-pink-50 hover:text-pink-600 transition-colors"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
        <nav className="flex flex-col px-4 py-4 gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 transition-colors hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 hover:text-pink-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="px-4 pt-2 pb-4 space-y-2">
          {user ? (
            <>
              {/* User info */}
              <div className="flex items-center gap-3 px-3 py-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl mb-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-sm font-bold text-white select-none">
                  {initials}
                </span>
                <div className="min-w-0">
                  {displayName && (
                    <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
                  )}
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>

              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 w-full rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
              >
                <UserIcon className="h-4 w-4 shrink-0" />
                My Profile
              </Link>
              <Link
                href="/account/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 w-full rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
              >
                <CalendarIcon className="h-4 w-4 shrink-0" />
                My Bookings
              </Link>
              <Link
                href="/account/events"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 w-full rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
              >
                <PartyIcon className="h-4 w-4 shrink-0" />
                My Events
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 w-full rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                >
                  <ShieldIcon className="h-4 w-4 shrink-0" />
                  Admin Dashboard
                </Link>
              )}
              <div className="pt-1 border-t border-gray-100">
                <button
                  onClick={() => { setMobileMenuOpen(false); handleSignOut() }}
                  className="flex items-center gap-2.5 w-full rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <LogOutIcon className="h-4 w-4 shrink-0" />
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105"
            >
              <UserIcon className="h-4 w-4" />
              Login / Sign Up
            </Link>
          )}
        </div>
        </div>
      </div>
    </header>
  )
}

/* ---------- Inline SVG icons ---------- */

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  )
}

function PartyIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a1 1 0 011 1v1.07A8.001 8.001 0 0119.93 11H21a1 1 0 010 2h-1.07A8.001 8.001 0 0113 19.93V21a1 1 0 01-2 0v-1.07A8.001 8.001 0 014.07 13H3a1 1 0 010-2h1.07A8.001 8.001 0 0111 4.07V3a1 1 0 011-1zm0 4a6 6 0 100 12A6 6 0 0012 6zm0 2a4 4 0 110 8 4 4 0 010-8z" />
    </svg>
  )
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  )
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  )
}

function LogOutIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
    </svg>
  )
}
