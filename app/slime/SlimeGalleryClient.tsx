'use client'

import { useState } from 'react'

interface SlimeItem {
  id: string
  name: string
  description: string
  texture_type: string
  color: string
  image_url: string
  is_available: boolean
}

export default function SlimeGalleryClient({
  slimes,
  textureTypes,
}: {
  slimes: SlimeItem[]
  textureTypes: string[]
}) {
  const [activeFilter, setActiveFilter] = useState('All')

  const filteredSlime =
    activeFilter === 'All'
      ? slimes
      : slimes.filter((s) => s.texture_type === activeFilter)

  return (
    <>
      {/* Filter Bar */}
      <section className="border-b border-gray-200 bg-white py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-4">
          {['All', ...textureTypes].map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                activeFilter === type
                  ? 'bg-brand-pink text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-brand-pink/10 hover:text-brand-pink'
              }`}
            >
              {type === 'All' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
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
                  {/* Image or color placeholder */}
                  {slime.image_url ? (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={slime.image_url}
                        alt={slime.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-brand-pink/10">
                      <div className="h-20 w-20 rounded-full bg-brand-pink/30" />
                    </div>
                  )}

                  <div className="p-5">
                    <h3 className="font-display text-lg font-bold text-gray-900 mb-2">
                      {slime.name}
                    </h3>

                    <div className="mb-3 flex items-center gap-2">
                      <span className="rounded-full bg-brand-purple/10 px-2.5 py-0.5 text-xs font-medium text-brand-purple capitalize">
                        {slime.texture_type}
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
