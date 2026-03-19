import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Jersey Slime Studio 38',
  description:
    'Terms of service for Jersey Slime Studio 38. Review the terms and conditions for using our website and services.',
  openGraph: {
    title: 'Terms of Service | Jersey Slime Studio 38',
    description:
      'Terms of service for Jersey Slime Studio 38. Review the terms and conditions for using our website and services.',
  },
}

export default function TermsOfServicePage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-purple via-brand-pink to-brand-blue py-24 px-6 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-5xl font-bold sm:text-6xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-lg text-white/90">
            Last updated: March 19, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-3xl space-y-10 text-lg leading-relaxed text-gray-700">
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
              Agreement to Terms
            </h2>
            <p className="mt-4">
              By accessing or using the Jersey Slime Studio 38 website at
              jerseyslimestudio.com, you agree to be bound by these Terms of
              Service. If you do not agree to these terms, please do not use our
              website or services.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
              Use of Our Services
            </h2>
            <p className="mt-4">
              You may use our website and services for lawful purposes only. You
              agree not to:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                Use the site in any way that violates applicable laws or
                regulations.
              </li>
              <li>
                Attempt to gain unauthorized access to any part of the website
                or its systems.
              </li>
              <li>
                Interfere with or disrupt the website or servers connected to
                it.
              </li>
              <li>
                Use automated tools to scrape, crawl, or extract data from the
                website without permission.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
              Accounts
            </h2>
            <p className="mt-4">
              When you create an account with us, you are responsible for
              maintaining the confidentiality of your login credentials and for
              all activities that occur under your account. Please notify us
              immediately if you suspect any unauthorized use of your account.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
              Bookings and Reservations
            </h2>
            <p className="mt-4">
              All bookings and reservations made through our website are subject
              to availability. By completing a booking, you agree to the
              following:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                You will provide accurate and complete information when making a
                reservation.
              </li>
              <li>
                Cancellations and rescheduling are subject to our cancellation
                policy, which will be communicated at the time of booking.
              </li>
              <li>
                We reserve the right to cancel or modify bookings if necessary,
                in which case we will notify you and provide a full refund.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
              Parties and Events
            </h2>
            <p className="mt-4">
              Party and event bookings require advance reservation and may
              require a deposit. Specific terms regarding party packages,
              pricing, guest counts, and cancellation policies will be provided
              during the booking process.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
              Products and Shop
            </h2>
            <p className="mt-4">
              Products available through our online shop are subject to
              availability. We make every effort to accurately display product
              colors and descriptions, but slight variations may occur. All
              sales are final unless otherwise stated at the time of purchase.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
              Intellectual Property
            </h2>
            <p className="mt-4">
              All content on this website — including text, images, logos,
              graphics, and design — is the property of Jersey Slime Studio 38
              and is protected by applicable intellectual property laws. You may
              not reproduce, distribute, or use any content from this site
              without our written permission.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
              Assumption of Risk
            </h2>
            <p className="mt-4">
              Slime-making activities may involve materials that can stain
              clothing or surfaces. By participating in our experiences, you
              acknowledge this risk. We recommend wearing clothes you don&rsquo;t
              mind getting messy. Jersey Slime Studio 38 is not responsible for
              damage to personal property during activities.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
              Limitation of Liability
            </h2>
            <p className="mt-4">
              To the fullest extent permitted by law, Jersey Slime Studio 38
              shall not be liable for any indirect, incidental, special, or
              consequential damages arising from your use of our website or
              services. Our total liability for any claim shall not exceed the
              amount you paid for the specific service giving rise to the claim.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
              Changes to These Terms
            </h2>
            <p className="mt-4">
              We may update these Terms of Service from time to time. Changes
              will be posted on this page with an updated &ldquo;Last
              updated&rdquo; date. Your continued use of the website after
              changes are posted constitutes your acceptance of the revised
              terms.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
              Governing Law
            </h2>
            <p className="mt-4">
              These Terms of Service are governed by and construed in accordance
              with the laws of the State of Utah, without regard to its conflict
              of law provisions.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
              Contact Us
            </h2>
            <p className="mt-4">
              If you have any questions about these Terms of Service, please
              reach out through our{' '}
              <a
                href="/contact"
                className="text-brand-purple underline hover:text-brand-pink"
              >
                contact page
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
