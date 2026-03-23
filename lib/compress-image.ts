/**
 * Compresses an image file using the browser Canvas API.
 * Resizes to fit within maxDimension and converts to WebP.
 * Returns a File that should be under the target size.
 */
export async function compressImage(
  file: File,
  {
    maxDimension = 2048,
    maxSizeMB = 4.5,
    initialQuality = 0.85,
  }: {
    maxDimension?: number
    maxSizeMB?: number
    initialQuality?: number
  } = {}
): Promise<File> {
  const bitmap = await createImageBitmap(file)
  const { width, height } = bitmap

  // Calculate scaled dimensions to fit within maxDimension
  let newWidth = width
  let newHeight = height
  if (width > maxDimension || height > maxDimension) {
    const ratio = Math.min(maxDimension / width, maxDimension / height)
    newWidth = Math.round(width * ratio)
    newHeight = Math.round(height * ratio)
  }

  const canvas = new OffscreenCanvas(newWidth, newHeight)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Failed to get canvas context')

  ctx.drawImage(bitmap, 0, 0, newWidth, newHeight)
  bitmap.close()

  // Try progressively lower quality until under maxSizeMB
  const maxBytes = maxSizeMB * 1024 * 1024
  let quality = initialQuality

  for (let attempt = 0; attempt < 5; attempt++) {
    const blob = await canvas.convertToBlob({ type: 'image/webp', quality })
    if (blob.size <= maxBytes || quality <= 0.3) {
      const name = file.name.replace(/\.[^/.]+$/, '.webp')
      return new File([blob], name, { type: 'image/webp' })
    }
    quality -= 0.15
  }

  // Final fallback at minimum quality
  const blob = await canvas.convertToBlob({ type: 'image/webp', quality: 0.2 })
  const name = file.name.replace(/\.[^/.]+$/, '.webp')
  return new File([blob], name, { type: 'image/webp' })
}
