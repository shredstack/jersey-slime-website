export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/experiences', label: 'Experiences' },
  { href: '/parties', label: 'Parties' },
  { href: '/slime', label: 'Slime Gallery' },
  { href: '/gallery', label: 'Photos' },
  { href: '/shop', label: 'Shop' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
] as const

export type NavLink = (typeof navLinks)[number]
