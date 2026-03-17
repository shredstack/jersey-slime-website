import type { Metadata } from 'next'
import ContactForm from './contact-form'

export const metadata: Metadata = {
  title: 'Get In Touch | Jersey Slime Studio 38',
  description:
    'Contact Jersey Slime Studio 38 in Utah. Reach out for questions about slime parties, walk-in experiences, group events, or custom orders.',
}

export default function ContactPage() {
  return <ContactForm />
}
