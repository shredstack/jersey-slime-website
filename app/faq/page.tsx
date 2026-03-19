import type { Metadata } from 'next'
import FAQContent from './faq-content'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Jersey Slime Studio 38',
  description:
    'Find answers to common questions about Jersey Slime Studio 38 — ages, what to wear, session length, group sizes, booking, and more.',
}

export default function FAQPage() {
  return <FAQContent />
}
