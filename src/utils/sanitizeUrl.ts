/**
 * URL sanitization and verification utilities to prevent DOM-based XSS (CodeQL js/xss-through-dom).
 * Strictly restricts URLs to safe protocols and escapes HTML meta-characters (<, >, ", ').
 */

/**
 * Validates if a URL is a safe image source (blob:, data:image/, https:, http:).
 * Disallows javascript:, vbscript:, data:text/html, and other potential script injection vectors.
 */
export function isSafeImageUrl(url: unknown): url is string {
  if (typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;

  return (
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('data:image/') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://')
  );
}

/**
 * Sanitizes an image URL by escaping HTML meta-characters (<, >, ", ') and URI-encoding
 * to satisfy CodeQL's MetacharEscapeSanitizer and UriEncodingSanitizer (rule js/xss-through-dom).
 */
export function getSafeImageUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (
    !trimmed.startsWith('blob:') &&
    !trimmed.startsWith('data:image/') &&
    !trimmed.startsWith('https://') &&
    !trimmed.startsWith('http://')
  ) {
    return null;
  }
  // CodeQL MetacharEscapeSanitizer: globally strip <, >, ", and ' meta-characters
  const escaped = trimmed.replace(/[<>"']/g, '');
  // CodeQL UriEncodingSanitizer: encode URI
  return encodeURI(escaped);
}
