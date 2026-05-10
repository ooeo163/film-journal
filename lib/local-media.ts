export function getLocalMediaUrl(relativePath: string) {
  return `/api/local-media?path=${encodeURIComponent(relativePath)}`;
}

export function getImageSrc(url: string | null | undefined): string {
  if (!url) return "";
  
  if (url.startsWith("cos://")) {
    const key = url.replace("cos://", "");
    const bucket = process.env.COS_BUCKET || "";
    const region = process.env.COS_REGION || "ap-guangzhou";
    return `https://${bucket}.cos.${region}.myqcloud.com/${key}`;
  }
  
  return url;
}
