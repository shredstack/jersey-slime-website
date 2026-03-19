'use client'

import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'What ages is Jersey Slime Studio 38 appropriate for?',
    answer:
      'Our slime-making experiences are designed for kids ages 4 and up, though children of all ages are welcome with a participating adult. We offer different experience levels to match various age groups — our Little Slimers program (ages 4-6) is simplified and extra hands-on, while our standard experiences work great for ages 7 and up. Adults love making slime too!',
  },
  {
    question: 'What should we wear to the studio?',
    answer:
      'We recommend wearing clothes that you don\'t mind getting a little messy. While we provide aprons and do our best to keep things tidy, slime-making can involve glue, glitter, and colorful pigments. Avoid wearing expensive or delicate clothing. Closed-toe shoes are also recommended.',
  },
  {
    question: 'How long does a slime-making session last?',
    answer:
      'Our standard walk-in slime experience lasts approximately 45-60 minutes. Private party sessions run about 90 minutes, which includes setup time, slime making, and a short celebration period. Custom events may vary in length — contact us for specific timing.',
  },
  {
    question: 'What are the group size options for parties and events?',
    answer:
      'Our private slime parties accommodate groups of 6 to 24 guests. For smaller groups (under 6), we recommend our walk-in experience or a mini-party package. For larger groups of 25 or more, we offer custom event packages — please reach out to discuss your needs. Corporate and school events are also available.',
  },
  {
    question: 'What is your booking and cancellation policy?',
    answer:
      'We recommend booking parties and events at least 2 weeks in advance, though we can sometimes accommodate last-minute requests. A 50% deposit is required to secure your booking. Cancellations made 72+ hours in advance receive a full refund of the deposit. Cancellations within 72 hours forfeit the deposit but can be rescheduled once at no extra charge, subject to availability.',
  },
  {
    question: 'How messy does it actually get?',
    answer:
      'We keep things fun but manageable! Our studio is designed for easy cleanup, and we provide aprons, table covers, and all necessary supplies. Most slime ingredients wash out of clothing with warm water and soap. That said, glitter has a mind of its own — so plan accordingly! Our staff handles all studio cleanup so you can just focus on the fun.',
  },
  {
    question: 'Can we bring food and drinks to the studio?',
    answer:
      'Yes! For private party bookings, you\'re welcome to bring your own food, drinks, cake, and decorations. We have a designated party area separate from the slime-making stations. For walk-in sessions, we ask that food and drinks stay in our lobby area to keep the slime-making tables clean. We do not provide food or beverages.',
  },
  {
    question: 'Is the studio accessible for guests with disabilities?',
    answer:
      'Absolutely. Jersey Slime Studio 38 is fully ADA accessible with ground-floor entry, wide aisles, and accessible restrooms. Our slime-making tables can accommodate wheelchairs, and we\'re happy to make additional accommodations upon request. If you have specific accessibility needs, please let us know when booking so we can ensure the best experience for everyone.',
  },
]

export default function FAQContent() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-teal/20 via-brand-blue/10 to-brand-purple/20 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Everything you need to know about visiting Jersey Slime Studio 38. Can&apos;t find your
            answer? Reach out to us directly!
          </p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white shadow-sm">
            {faqs.map((faq, index) => (
              <div key={index}>
                <button
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-gray-50"
                  aria-expanded={openIndex === index}
                >
                  <span className="pr-4 font-display text-base font-semibold text-gray-900 md:text-lg">
                    {faq.question}
                  </span>
                  <svg
                    className={`h-5 w-5 flex-shrink-0 text-brand-pink transition-transform duration-200 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    openIndex === index ? 'max-h-96 pb-5' : 'max-h-0'
                  }`}
                >
                  <p className="px-6 text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-2xl bg-gradient-to-r from-brand-pink/10 to-brand-purple/10 p-8 text-center">
            <h2 className="font-display text-xl font-bold text-gray-900">
              Still have questions?
            </h2>
            <p className="mt-2 text-gray-600">
              We&apos;re happy to help! Reach out to our team and we&apos;ll get back to you as
              soon as possible.
            </p>
            <a
              href="/contact"
              className="mt-4 inline-block rounded-full bg-brand-pink px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-purple"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
