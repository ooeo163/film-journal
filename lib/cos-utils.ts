import { getCosClient, cosConfig, isCosEnabled } from "./cos-config";

export { isCosEnabled };

export function getCosSignedUrl(key: string, expires = 300): string {
  if (!isCosEnabled()) {
    throw new Error("COS is not configured");
  }

  const client = getCosClient();
  return client.getObjectUrl({
    Bucket: cosConfig.bucket,
    Region: cosConfig.region,
    Key: key,
    Expires: expires,
  });
}

export function getCosPublicUrl(key: string): string {
  if (!isCosEnabled()) {
    throw new Error("COS is not configured");
  }

  return `https://${cosConfig.bucket}.cos.${cosConfig.region}.myqcloud.com/${key}`;
}

export function parseCosKey(imageUrl: string): string | null {
  if (!imageUrl) return null;

  if (imageUrl.startsWith("cos://")) {
    return imageUrl.replace("cos://", "");
  }

  if (imageUrl.includes(".cos.") && imageUrl.includes(".myqcloud.com/")) {
    const url = new URL(imageUrl);
    return url.pathname.substring(1);
  }

  return null;
}

export function isCosUrl(url: string): boolean {
  if (!url) return false;
  return url.startsWith("cos://") || (url.includes(".cos.") && url.includes(".myqcloud.com/"));
}

export function generateCosKey(
  targetFolder: string,
  fileName: string
): string {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const uniqueId = crypto.randomUUID().slice(0, 8);
  const ext = fileName.split(".").pop() || "jpg";
  const baseName = fileName
    .replace(/\.[^/.]+$/, "")
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase() || "image";

  return `${targetFolder}/${year}/${month}/${baseName}-${uniqueId}.${ext}`;
}

export function resolveCosUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("cos://")) {
    const key = url.replace("cos://", "");
    return getCosPublicUrl(key);
  }
  return url;
}
