export function normalizeUrl(url: string): string {
  const isFullUrl = /^https?:\/\//i.test(url);
  return isFullUrl ? url : `https://${url}`;
}