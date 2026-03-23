import sanitize from 'sanitize-html'

const ALLOWED_TAGS = [
  'p', 'h2', 'h3', 'h4', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'del',
  'a', 'img', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
  'div', 'span', 'figure', 'figcaption', 'hr', 'table', 'thead',
  'tbody', 'tr', 'th', 'td', 'sup', 'sub',
]

const ALLOWED_ATTR: Record<string, string[]> = {
  a: ['href', 'target', 'rel', 'title'],
  img: ['src', 'alt', 'width', 'height', 'loading'],
  '*': ['class'],
  td: ['colspan', 'rowspan'],
  th: ['colspan', 'rowspan'],
}

export function sanitizeHtml(dirty: string): string {
  return sanitize(dirty, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTR,
  })
}
