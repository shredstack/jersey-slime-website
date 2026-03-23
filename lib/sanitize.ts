import DOMPurify from 'isomorphic-dompurify'

const ALLOWED_TAGS = [
  'p', 'h2', 'h3', 'h4', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'del',
  'a', 'img', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
  'div', 'span', 'figure', 'figcaption', 'hr', 'table', 'thead',
  'tbody', 'tr', 'th', 'td', 'sup', 'sub',
]

const ALLOWED_ATTR = [
  'href', 'target', 'rel', 'title',       // links
  'src', 'alt', 'width', 'height', 'loading', // images
  'class',                                  // styling
  'colspan', 'rowspan',                     // tables
]

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target'],
  })
}
