import Link from 'next/link'

const navItems = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Bookings', href: '/admin/bookings' },
  { label: 'Parties', href: '/admin/parties' },
  { label: 'Inventory', href: '/admin/inventory' },
  { label: 'Experiences', href: '/admin/experiences' },
  { label: 'Blog', href: '/admin/blog' },
  { label: 'Settings', href: '/admin/settings' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex-shrink-0">
        <div className="p-6">
          <h2 className="text-lg font-display font-bold text-brand-pink">Admin Dashboard</h2>
        </div>
        <nav className="px-4 pb-6 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-8 overflow-auto">{children}</main>
    </div>
  )
}
