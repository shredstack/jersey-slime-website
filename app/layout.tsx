import type { Metadata } from 'next'
import { Inter, Fredoka } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import LayoutShell from '@/components/layout/LayoutShell'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const fredoka = Fredoka({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fredoka',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://jerseyslimestudio.com'),
  title: {
    template: '%s | Jersey Slime Studio 38',
    default: 'Jersey Slime Studio 38 | Slime Making Experience in Utah',
  },
  description:
    'Jersey Slime Studio 38 is Utah\'s premier hands-on slime making experience studio. Book slime parties, walk-in slime experiences, and kids activities. The ultimate slime studio for birthday parties and group events.',
  keywords: [
    'slime experience Utah',
    'slime studio',
    'kids activities',
    'slime making',
    'slime party',
    'birthday party Utah',
    'kids birthday party',
    'slime workshop',
    'things to do in Utah',
    'family activities Utah',
  ],
  authors: [{ name: 'Jersey Slime Studio 38' }],
  creator: 'Jersey Slime Studio 38',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://jerseyslimestudio.com',
    siteName: 'Jersey Slime Studio 38',
    title: 'Jersey Slime Studio 38 | Slime Making Experience in Utah',
    description:
      'Utah\'s premier hands-on slime making experience studio. Book slime parties, walk-in experiences, and more.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jersey Slime Studio 38 | Slime Making Experience in Utah',
    description:
      'Utah\'s premier hands-on slime making experience studio. Book slime parties, walk-in experiences, and more.',
  },
  icons: {
    icon: '/jersey-slime-logo.png',
    apple: '/jersey-slime-logo.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Jersey Slime Studio 38',
  description: 'Hands-on slime making experience studio in Utah',
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'UT',
    addressCountry: 'US',
  },
  url: 'https://jerseyslimestudio.com',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fredoka.variable}`}>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LayoutShell header={<Header />} footer={<Footer />}>
          {children}
        </LayoutShell>
      </body>
    </html>
  )
}
