import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | Jersey Slime Studio 38',
  description:
    'Jersey Slime Studio 38 is a family-owned, kid-founded handmade slime shop in Utah built on resilience, creativity, and meaningful sensory play.',
  openGraph: {
    title: 'About Us | Jersey Slime Studio 38',
    description:
      'Jersey Slime Studio 38 is a family-owned, kid-founded handmade slime shop in Utah built on resilience, creativity, and meaningful sensory play.',
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
            A family-owned, kid-founded handmade slime shop built on resilience,
            creativity, and meaningful play.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-3xl space-y-6 text-lg leading-relaxed text-gray-700">
          <p>
            Our journey began at a kitchen table when Jersey struggled with fine
            motor skills and sensory regulation. Slime became a therapeutic tool
            that strengthened her hands, improved focus, and built confidence.
            What started as sensory support quickly grew into entrepreneurship
            — from markets and pop-ups to opening our Utah slime studio and
            online slime shop.
          </p>
        </div>
      </section>

      {/* Mascot */}
      <section className="bg-gradient-to-b from-brand-teal/10 to-brand-yellow/10 py-20 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
            Meet Max
          </h2>
          <div className="mx-auto mt-8 flex h-48 w-48 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-teal shadow-lg">
            <span className="text-7xl">🐻‍❄️</span>
          </div>
          <p className="mt-6 text-lg leading-relaxed text-gray-700">
            Our polar bear mascot, Max, is named in honor of Jersey&rsquo;s
            great-grandmother — the first female broker in Utah — a trailblazer
            who broke barriers in business. Her courage and leadership continue
            to inspire everything we build.
          </p>
        </div>
      </section>

      {/* Heritage */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-3xl space-y-6 text-lg leading-relaxed text-gray-700">
          <h2 className="font-display text-center text-3xl font-bold text-gray-900 sm:text-4xl">
            Our Heritage
          </h2>
          <p className="mt-6">
            Our Northern Lights branding reflects Jersey&rsquo;s Norwegian
            heritage and the strength of her grandparents on both sides, who
            proudly served in the United States military. Service, resilience,
            diversity, and leadership are woven into our family story.
          </p>
        </div>
      </section>

      {/* What We Do */}
      <section className="bg-gradient-to-b from-brand-purple/5 to-brand-pink/5 py-20 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
            What We Do
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-gray-700">
            We specialize in premium handmade sensory slime and slime kits
            designed to support:
          </p>
          <ul className="mt-6 space-y-3 text-lg text-gray-700">
            <li>Fine motor development</li>
            <li>Stress relief</li>
            <li>Emotional regulation</li>
            <li>Focus and creativity</li>
            <li>Intentional screen-free time for all ages</li>
          </ul>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-white py-20 px-6">
        <div className="mx-auto max-w-3xl space-y-6 text-lg leading-relaxed text-gray-700">
          <h2 className="font-display text-center text-3xl font-bold text-gray-900 sm:text-4xl">
            Our Mission
          </h2>
          <p className="mt-6">
            In a world filled with screens and distractions, our goal is simple:
            create space for families to unplug, connect, and build real memories
            together.
          </p>
          <p>
            Jersey Slime Studio 38 stands for resilience, inclusion, leadership,
            and meaningful sensory play.
          </p>
          <p>
            When you support our slime shop, you&rsquo;re not just buying slime
            — you&rsquo;re supporting a young entrepreneur, a woman-led legacy,
            military family values, and screen-free moments that matter.
          </p>
          <p className="text-center font-display text-xl font-semibold text-gray-900">
            One jar at a time.
          </p>
        </div>
      </section>
    </main>
  )
}
