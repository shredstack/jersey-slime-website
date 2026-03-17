import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'My Account',
}

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, phone, role')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-display font-bold text-gray-900 mb-8">My Account</h1>

      {/* Profile Section */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-gray-900 font-medium">{profile?.full_name || 'Not set'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-gray-900 font-medium">{profile?.email || user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="text-gray-900 font-medium">{profile?.phone || 'Not set'}</p>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Links</h2>
        <div className="space-y-2">
          <Link
            href="/account/bookings"
            className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">My Bookings</span>
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          {profile?.role === 'admin' && (
            <Link
              href="/admin"
              className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900">Admin Dashboard</span>
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
