import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Jersey Slime Studio 38',
  description:
    'Privacy policy for Jersey Slime Studio 38. Learn how we collect, use, and protect your personal information.',
  openGraph: {
    title: 'Privacy Policy | Jersey Slime Studio 38',
    description:
      'Privacy policy for Jersey Slime Studio 38. Learn how we collect, use, and protect your personal information.',
  },
}

export default function PrivacyPolicyPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-purple via-brand-pink to-brand-blue py-24 px-6 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-5xl font-bold sm:text-6xl">
            Privacy Policy
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
              Introduction
            </h2>
            <p className="mt-4">
              Jersey Slime Studio 38 (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
              &ldquo;our&rdquo;) respects your privacy and is committed to
              protecting your personal information. This Privacy Policy explains
              how we collect, use, and safeguard information when you visit our
              website at jerseyslimestudio.com or interact with our services.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
              Information We Collect
            </h2>
            <p className="mt-4">
              We may collect the following types of information:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                <strong>Account information:</strong> name, email address, and
                password when you create an account.
              </li>
              <li>
                <strong>Booking and reservation details:</strong> date, time,
                party size, and any special requests when you book an experience
                or party.
              </li>
              <li>
                <strong>Contact form submissions:</strong> name, email, and
                message content when you reach out to us.
              </li>
              <li>
                <strong>Payment information:</strong> payment details are
                processed securely by our third-party payment processor and are
                not stored on our servers.
              </li>
              <li>
                <strong>Usage data:</strong> pages visited, time spent on pages,
                and other analytics data collected through Google Analytics.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
              How We Use Your Information
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>To process bookings, reservations, and orders.</li>
              <li>
                To send booking confirmations and important updates about your
                reservations via email.
              </li>
              <li>To respond to your inquiries and provide customer support.</li>
              <li>To improve our website, services, and customer experience.</li>
              <li>To comply with legal obligations.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
              Cookies and Analytics
            </h2>
            <p className="mt-4">
              We use cookies and similar technologies to enhance your browsing
              experience. We also use Google Analytics to understand how visitors
              interact with our website. Google Analytics collects information
              such as how often users visit the site, what pages they visit, and
              what other sites they used prior to coming to our site. You can
              opt out of Google Analytics by installing the{' '}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-purple underline hover:text-brand-pink"
              >
                Google Analytics Opt-out Browser Add-on
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
              How We Protect Your Information
            </h2>
            <p className="mt-4">
              We implement appropriate technical and organizational security
              measures to protect your personal information against unauthorized
              access, alteration, disclosure, or destruction. However, no method
              of transmission over the Internet or electronic storage is 100%
              secure.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
              Third-Party Services
            </h2>
            <p className="mt-4">
              We use trusted third-party services to operate our business,
              including:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                <strong>Supabase</strong> for secure data storage and
                authentication.
              </li>
              <li>
                <strong>Resend</strong> for sending transactional emails such as
                booking confirmations.
              </li>
              <li>
                <strong>Google Analytics</strong> for website usage analytics.
              </li>
            </ul>
            <p className="mt-4">
              These services have their own privacy policies governing how they
              handle your data.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
              Children&rsquo;s Privacy
            </h2>
            <p className="mt-4">
              Our website is not directed to children under 13. We do not
              knowingly collect personal information from children under 13. If
              you are a parent or guardian and believe your child has provided us
              with personal information, please contact us so we can take
              appropriate action.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
              Your Rights
            </h2>
            <p className="mt-4">You have the right to:</p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Access the personal information we hold about you.</li>
              <li>Request correction of inaccurate information.</li>
              <li>Request deletion of your personal information.</li>
              <li>Opt out of marketing communications at any time.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
              Changes to This Policy
            </h2>
            <p className="mt-4">
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page with an updated &ldquo;Last
              updated&rdquo; date.
            </p>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 sm:text-3xl">
              Contact Us
            </h2>
            <p className="mt-4">
              If you have any questions about this Privacy Policy or how we
              handle your data, please reach out through our{' '}
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
