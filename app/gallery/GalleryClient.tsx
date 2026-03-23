'use client'

import { useState } from 'react'

interface GalleryPhoto {
  id: string
  title: string
  alt_text: string
  image_url: string
  category: string
}

export default function GalleryClient({
  photos,
  categories,
}: {
  photos: GalleryPhoto[]
  categories: string[]
}) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhoto | null>(null)

  const filteredPhotos =
    activeFilter === 'All'
      ? photos
      : photos.filter((p) => p.category === activeFilter)

  return (
    <>
      {/* Filter Bar */}
      {categories.length > 1 && (
        <section className="border-b border-gray-200 bg-white py-6">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-4">
            {['All', ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  activeFilter === cat
                    ? 'bg-brand-pink text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-brand-pink/10 hover:text-brand-pink'
                }`}
              >
                {cat === 'All'
                  ? 'All'
                  : cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ')}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Photo Grid */}
      <section className="bg-gray-50 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          {filteredPhotos.length === 0 ? (
            <p className="text-center text-gray-500">No photos found.</p>
          ) : (
            <div className="columns-2 gap-4 sm:columns-3 lg:columns-4">
              {filteredPhotos.map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => setLightboxPhoto(photo)}
                  className="mb-4 block w-full overflow-hidden rounded-xl shadow-sm transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-pink focus:ring-offset-2"
                >
                  <img
                    src={photo.image_url}
                    alt={photo.alt_text || photo.title || 'Jersey Slime Studio 38 photo'}
                    className="w-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightboxPhoto(null)}
        >
          <button
            onClick={() => setLightboxPhoto(null)}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={lightboxPhoto.image_url}
            alt={lightboxPhoto.alt_text || lightboxPhoto.title || 'Jersey Slime Studio 38 photo'}
            className="max-h-[85vh] max-w-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {lightboxPhoto.title && (
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-lg bg-black/50 px-4 py-2 text-sm text-white">
              {lightboxPhoto.title}
            </p>
          )}
        </div>
      )}
    </>
  )
}
