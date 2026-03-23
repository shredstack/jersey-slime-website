-- Create gallery_photos table for studio photo gallery
CREATE TABLE IF NOT EXISTS public.gallery_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  alt_text TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'studio',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;

-- Public can view visible photos
CREATE POLICY "Public can view visible gallery photos"
ON public.gallery_photos
FOR SELECT
USING (is_visible = true);

-- Admins have full access
CREATE POLICY "Admins can manage gallery photos"
ON public.gallery_photos
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Create gallery-images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery-images', 'gallery-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated admins to manage gallery images
CREATE POLICY "Admins can manage gallery images"
ON storage.objects
FOR ALL
USING (
  bucket_id = 'gallery-images'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  bucket_id = 'gallery-images'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Allow public read access to gallery images
CREATE POLICY "Public can view gallery images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'gallery-images');
