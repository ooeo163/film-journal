export function getLocalMediaUrl(relativePath: string) {
  return `/api/local-media?path=${encodeURIComponent(relativePath)}`;
}

export function getImageSrc(url: string | null | undefined): string {
  if (!url) return "";
  
  if (url.startsWith("cos://")) {
    return `/api/local-media?path=${encodeURIComponent(url)}`;
  }
  
  return url;
}
