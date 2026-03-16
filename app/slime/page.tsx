'use client'

import { useState } from 'react'
import type { Metadata } from 'next'

// Note: metadata must be exported from a server component.
// For a client component page, we define it but Next.js will not use it.
// To fix this properly, split into a server wrapper + client component.
// For now, SEO metadata is set via the head approach below.

type TextureType = 'All' | 'Butter' | 'Cloud' | 'Crunchy' | 'Clear' | 'Foam'

interface SlimeItem {
  id: number
  name: string
  texture: Exclude<TextureType, 'All'>
  color: string
  colorHex: string
  description: string
  available: boolean
}

const slimeData: SlimeItem[] = [
  {
    id: 1,
    name: 'Galaxy Crunch',
    texture: 'Crunchy',
    color: 'Purple',
    colorHex: '#C084FC',
    description: 'A sparkly, crunchy slime swirled with deep purples and glitter that looks like a galaxy in your hands.',
    available: true,
  },
  {
    id: 2,
    name: 'Cotton Candy Cloud',
    texture: 'Cloud',
    color: 'Pink',
    colorHex: '#FF6B9D',
    description: 'Fluffy and dreamy, this cloud slime smells just like cotton candy at the fair.',
    available: true,
  },
  {
    id: 3,
    name: 'Ocean Breeze',
    texture: 'Clear',
    color: 'Blue',
    colorHex: '#7DD3FC',
    description: 'Crystal clear slime with tiny ocean-themed charms and a fresh scent.',
    available: true,
  },
  {
    id: 4,
    name: 'Sunshine Butter',
    texture: 'Butter',
    color: 'Yellow',
    colorHex: '#FDE047',
    description: 'Smooth and spreadable butter slime in a cheerful sunshine yellow.',
    available: false,
  },
  {
    id: 5,
    name: 'Mint Chip Crunch',
    texture: 'Crunchy',
    color: 'Teal',
    colorHex: '#5EEAD4',
    description: 'Satisfying crunchy slime loaded with foam beads in a cool mint color.',
    available: true,
  },
  {
    id: 6,
    name: 'Strawberry Foam',
    texture: 'Foam',
    color: 'Pink',
    colorHex: '#FF6B9D',
    description: 'Light and airy foam slime with a sweet strawberry scent and micro foam beads.',
    available: true,
  },
  {
    id: 7,
    name: 'Lavender Dreams',
    texture: 'Butter',
    color: 'Purple',
    colorHex: '#C084FC',
    description: 'Silky smooth butter slime infused with calming lavender fragrance.',
    available: true,
  },
  {
    id: 8,
    name: 'Crystal Lake',
    texture: 'Clear',
    color: 'Teal',
    colorHex: '#5EEAD4',
    description: 'Perfectly transparent clear slime with iridescent glitter flakes throughout.',
    available: false,
  },
]

const textureTypes: TextureType[] = ['All', 'Butter', 'Cloud', 'Crunchy', 'Clear', 'Foam']

export default function SlimePage() {
  const [activeFilter, setActiveFilter] = useState<TextureType>('All')

  const filteredSlime =
    activeFilter === 'All'
      ? slimeData
      : slimeData.filter((s) => s.texture === activeFilter)

  return (
    <>
      <head>
        <title>Slime Gallery | Jersey Slime Studio 38</title>
        <meta
          name="description"
          content="Browse our colorful collection of handmade slimes at Jersey Slime Studio 38. From crunchy to cloud, butter to clear — find your perfect slime texture."
        />
      </head>

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-purple/20 via-brand-pink/10 to-brand-teal/20 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
            Slime Gallery
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Explore our handmade slime collection. Each slime is crafted with love at Jersey Slime
            Studio 38 using premium ingredients and irresistible scents.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="border-b border-gray-200 bg-white py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-4">
          {textureTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                activeFilter === type
                  ? 'bg-brand-pink text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-brand-pink/10 hover:text-brand-pink'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          {filteredSlime.length === 0 ? (
            <p className="text-center text-gray-500">No slimes found for this texture type.</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredSlime.map((slime) => (
                <div
                  key={slime.id}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-lg"
                >
                  {/* Image placeholder */}
                  <div
                    className="flex h-48 items-center justify-center"
                    style={{ backgroundColor: slime.colorHex + '40' }}
                  >
                    <div
                      className="h-20 w-20 rounded-full"
                      style={{ backgroundColor: slime.colorHex }}
                    />
                  </div>

                  <div className="p-5">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-display text-lg font-bold text-gray-900">
                        {slime.name}
                      </h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          slime.available
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {slime.available ? 'Available' : 'Sold Out'}
                      </span>
                    </div>

                    <div className="mb-3 flex items-center gap-2">
                      <span className="rounded-full bg-brand-purple/10 px-2.5 py-0.5 text-xs font-medium text-brand-purple">
                        {slime.texture}
                      </span>
                      <span className="text-xs text-gray-500">{slime.color}</span>
                    </div>

                    <p className="text-sm leading-relaxed text-gray-600">{slime.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
