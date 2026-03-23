import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import GalleryClient from './GalleryClient'

export const metadata: Metadata = {
  title: 'Photo Gallery | Jersey Slime Studio 38',
  description:
    'Take a look inside Jersey Slime Studio 38! Browse photos from our studio, parties, events, and behind-the-scenes slime making in Utah.',
}

export default async function GalleryPage() {
  const supabase = createServiceClient()
  const { data: photos } = await supabase
    .from('gallery_photos')
    .select('*')
    .eq('is_visible', true)
    .order('sort_order')
    .order('created_at')

  const categories = Array.from(new Set((photos ?? []).map((p) => p.category)))

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-purple/20 via-brand-pink/10 to-brand-teal/20 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
            Photo Gallery
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Step inside Jersey Slime Studio 38! Check out our studio, parties, events, and
            all the colorful slime creations we make.
          </p>
        </div>
      </section>

      <GalleryClient photos={photos ?? []} categories={categories} />
    </>
  )
}
