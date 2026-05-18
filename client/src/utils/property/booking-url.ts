/**
 * Build the Guesty booking deep-link.
 * Returns null when the booking base URL is not configured, so the UI can
 * disable the CTA instead of generating a broken link.
 */
export function buildBookingUrl(baseUrl: string | undefined, guestyId: string): string | null {
  if (!baseUrl) return null;
  return `${baseUrl.replace(/\/$/, "")}/${guestyId}`;
}
