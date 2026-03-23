/**
 * Converts legacy plaintext blog content to HTML paragraphs.
 * Splits on double newlines for paragraphs, converts single newlines to <br>.
 */
export function legacyPlaintextToHtml(text: string): string {
  return text
    .split(/\n\n+/)
    .filter(para => para.trim().length > 0)
    .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
    .join('')
}
