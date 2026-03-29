import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { getSiteSettings } from '@/lib/site-settings'

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

const DAY_ABBREV = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const h = hours % 12 || 12
  return minutes === 0 ? `${h} ${ampm}` : `${h}:${String(minutes).padStart(2, '0')} ${ampm}`
}

export default async function Footer() {
  const supabase = await createClient()
  const siteSettings = await getSiteSettings()
  const { data: studioHours } = await supabase
    .from('studio_hours')
    .select('day_of_week, open_time, close_time, is_closed')
    .order('day_of_week')
  return (
    <footer className="bg-gradient-to-b from-purple-50 to-pink-50 border-t border-purple-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image
                src="/jersey_slime_web_logo.png"
                alt="Jersey Slime Studio 38 logo"
                width={108}
                height={36}
                className="object-contain"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-pink-500 via-purple-400 to-teal-400 bg-clip-text text-transparent font-display tracking-tight">
                Jersey Slime Studio 38
              </span>
            </Link>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed max-w-xs">
              Utah&apos;s most colorful slime-making experience studio. Stretch
              your creativity, squish your stress, and make memories that stick!
            </p>
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
                <p className="font-medium text-gray-800">Studio Hours</p>
                {studioHours?.sort((a, b) => {
                  const orderA = a.day_of_week === 0 ? 7 : a.day_of_week
                  const orderB = b.day_of_week === 0 ? 7 : b.day_of_week
                  return orderA - orderB
                }).reduce<{ label: string; time: string }[]>((lines, h) => {
                  if (h.is_closed) {
                    lines.push({ label: DAY_ABBREV[h.day_of_week], time: 'Closed' })
                    return lines
                  }
                  const time = `${formatTime(h.open_time)} \u2013 ${formatTime(h.close_time)}`
                  const prev = lines[lines.length - 1]
                  if (prev && prev.time === time && prev.time !== 'Closed') {
                    // Extend the range
                    const dash = prev.label.indexOf(' \u2013 ')
                    const startDay = dash >= 0 ? prev.label.slice(0, dash) : prev.label
                    prev.label = `${startDay} \u2013 ${DAY_ABBREV[h.day_of_week]}`
                  } else {
                    lines.push({ label: DAY_ABBREV[h.day_of_week], time })
                  }
                  return lines
                }, []).map((line, i) => (
                  <p key={i} className={i === 0 ? 'mt-1' : undefined}>
                    {line.label}: {line.time}
                  </p>
                ))}
              </div>
              <div>
                <p className="font-medium text-gray-800">Address</p>
                <p className="mt-1">
                  {siteSettings.address_street}
                  <br />
                  {siteSettings.address_city}, {siteSettings.address_state} {siteSettings.address_zip}
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
