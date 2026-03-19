-- Create slime-images storage bucket (public, so images can be displayed on the site)
INSERT INTO storage.buckets (id, name, public)
VALUES ('slime-images', 'slime-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated admins to upload/update/delete slime images
CREATE POLICY "Admins can manage slime images"
ON storage.objects
FOR ALL
USING (
  bucket_id = 'slime-images'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  bucket_id = 'slime-images'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Allow public read access to slime images
CREATE POLICY "Public can view slime images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'slime-images');
