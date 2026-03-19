import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import SlimeGalleryClient from './SlimeGalleryClient'

export const metadata: Metadata = {
  title: 'Slime Gallery | Jersey Slime Studio 38',
  description:
    'Browse our colorful collection of handmade slimes at Jersey Slime Studio 38. From crunchy to cloud, butter to clear — find your perfect slime texture.',
}

export default async function SlimePage() {
  const supabase = createServiceClient()
  const { data: slimes } = await supabase
    .from('slime_inventory')
    .select('*')
    .eq('is_available', true)
    .order('sort_order')
    .order('created_at')

  // Derive unique texture types from the data
  const textureTypes = Array.from(new Set((slimes ?? []).map((s) => s.texture_type)))

  return (
    <>
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

      <SlimeGalleryClient slimes={slimes ?? []} textureTypes={textureTypes} />
    </>
  )
}
