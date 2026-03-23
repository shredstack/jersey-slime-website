import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'
import GalleryManager from './GalleryManager'

export const metadata: Metadata = {
  title: 'Photo Gallery',
}

export default async function AdminGalleryPage() {
  const supabase = createServiceClient()
  const { data: photos } = await supabase
    .from('gallery_photos')
    .select('*')
    .order('sort_order')
    .order('created_at')

  return <GalleryManager initialPhotos={photos ?? []} />
}
