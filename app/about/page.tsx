import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | Jersey Slime Studio 38',
  description:
    'Learn about Jersey Slime Studio 38 — our story, our mission, and the passion behind Utah\'s favorite slime-making studio.',
  openGraph: {
    title: 'About Us | Jersey Slime Studio 38',
    description:
      'Learn about Jersey Slime Studio 38 — our story, our mission, and the passion behind Utah\'s favorite slime-making studio.',
  },
}

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-purple via-brand-pink to-brand-blue py-24 px-6 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-5xl font-bold sm:text-6xl">
            Our Story
          </h1>
          <p className="mt-4 text-lg text-white/90">
            How a love for all things slimy turned into Utah&rsquo;s most
            colorful creative studio.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-3xl space-y-6 text-lg leading-relaxed text-gray-700">
          <p>
            Jersey Slime Studio 38 was born out of a simple idea: everyone
            deserves a place to get creative, get messy, and have fun. What
            started as a kitchen-table hobby quickly grew into a full-blown
            passion — and before we knew it, we were opening our doors right
            here in Utah.
          </p>
          <p>
            We believe slime is more than just a trend. It&rsquo;s a sensory
            experience, a creative outlet, and an absolute blast for kids and
            adults alike. From butter slime to cloud slime, crunchy slime to
            glitter slime — we&rsquo;ve spent years perfecting our recipes so
            every creation feels (and sounds!) just right.
          </p>
          <p>
            Our studio is a place where families come together, friends make
            memories, and birthday kids feel like superstars. We pour love into
            every batch and every experience we offer, because we know
            that&rsquo;s what makes the difference.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-gradient-to-b from-brand-teal/10 to-brand-yellow/10 py-20 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
            Our Mission
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-gray-700">
            To spark joy, creativity, and connection through the magical world
            of slime. We&rsquo;re here to create a welcoming space where
            everyone — no matter their age — can explore, experiment, and leave
            with a smile (and some really cool slime).
          </p>
        </div>
      </section>

      {/* Mascot */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
            Meet Our Mascot
          </h2>
          <div className="mx-auto mt-8 flex h-48 w-48 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-teal shadow-lg">
            <span className="text-7xl">🐻‍❄️</span>
          </div>
          <p className="mt-6 text-lg leading-relaxed text-gray-700">
            Say hello to our polar bear mascot! You&rsquo;ll spot this cuddly
            friend throughout the studio, on our packaging, and maybe even
            giving high-fives at our events. The polar bear represents the cool,
            stretchy, icy fun that slime brings to everyone who visits.
          </p>
        </div>
      </section>

      {/* Photo Grid */}
      <section className="bg-gradient-to-b from-brand-purple/5 to-brand-pink/5 py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-center text-3xl font-bold text-gray-900 sm:text-4xl">
            Inside the Studio
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex h-56 items-center justify-center rounded-2xl bg-gray-200 text-gray-500 shadow-sm"
              >
                Photo coming soon
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
