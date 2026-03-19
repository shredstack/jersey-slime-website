-- Create blog-images storage bucket (public, so images can be displayed on the site)
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated admins to upload/update/delete blog images
CREATE POLICY "Admins can manage blog images"
ON storage.objects
FOR ALL
USING (
  bucket_id = 'blog-images'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  bucket_id = 'blog-images'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Allow public read access to blog images
CREATE POLICY "Public can view blog images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'blog-images');
