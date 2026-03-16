'use client'

import { useState } from 'react'
import Link from 'next/link'
import { navLinks } from './Navigation'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-purple-100 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center gap-2 group">
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

          {/* Right side: Login + Mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/account"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105 hover:shadow-lg"
            >
              <UserIcon className="h-4 w-4" />
              Login
            </Link>

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
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-purple-100">
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

        <div className="px-4 pt-2">
          <Link
            href="/account"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105"
          >
            <UserIcon className="h-4 w-4" />
            Login / Account
          </Link>
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
