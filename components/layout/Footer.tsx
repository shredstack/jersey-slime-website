import Link from 'next/link'

const exploreLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/experiences', label: 'Experiences' },
  { href: '/parties', label: 'Parties' },
]

const resourceLinks = [
  { href: '/faq', label: 'FAQ' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
  { href: '/shop', label: 'Shop' },
]

const socialLinks = [
  { href: '#', label: 'Instagram' },
  { href: '#', label: 'TikTok' },
  { href: '#', label: 'Facebook' },
  { href: '#', label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-purple-50 to-pink-50 border-t border-purple-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-xl font-bold bg-gradient-to-r from-pink-500 via-purple-400 to-teal-400 bg-clip-text text-transparent font-display tracking-tight">
                Jersey Slime Studio 38
              </span>
            </Link>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed max-w-xs">
              Utah&apos;s most colorful slime-making experience studio. Stretch
              your creativity, squish your stress, and make memories that stick!
            </p>

            {/* Social links */}
            <div className="mt-5 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white shadow-sm border border-purple-100 text-gray-500 transition-colors hover:text-pink-500 hover:border-pink-200 hover:shadow-md"
                  aria-label={social.label}
                >
                  <span className="text-xs font-semibold">
                    {social.label.charAt(0)}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Explore column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-purple-600">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-pink-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-purple-600">
              Resources
            </h3>
            <ul className="mt-4 space-y-2.5">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-pink-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-purple-600">
              Visit Us
            </h3>
            <div className="mt-4 space-y-4 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-800">Business Hours</p>
                <p className="mt-1">Mon &ndash; Fri: 10 AM &ndash; 7 PM</p>
                <p>Sat: 10 AM &ndash; 8 PM</p>
                <p>Sun: 11 AM &ndash; 5 PM</p>
              </div>
              <div>
                <p className="font-medium text-gray-800">Address</p>
                <p className="mt-1">
                  123 Slime Street
                  <br />
                  Salt Lake City, UT 84101
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-purple-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Jersey Slime Studio 38. All rights
            reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-pink-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-pink-600 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
