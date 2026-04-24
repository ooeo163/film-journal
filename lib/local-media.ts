export function getLocalMediaUrl(relativePath: string) {
  return `/api/local-media?path=${encodeURIComponent(relativePath)}`;
}
