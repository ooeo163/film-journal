export interface CosUploadResult {
  key: string;
  thumbKey: string;
  url: string;
  thumbUrl: string;
}

export async function uploadToCos(
  file: File,
  targetFolder = "photos"
): Promise<CosUploadResult> {
  const { generateThumbnail } = await import("./client-image");

  const presignResponse = await fetch("/api/admin/cos/sts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      targetFolder,
    }),
  });

  if (!presignResponse.ok) {
    throw new Error("Failed to get upload URLs");
  }

  const { originalUrl, thumbUrl, key, thumbKey } = await presignResponse.json();

  const thumbBlob = await generateThumbnail(file);

  await Promise.all([
    uploadFileWithPresignedUrl(originalUrl, file),
    uploadFileWithPresignedUrl(thumbUrl, thumbBlob),
  ]);

  const publicUrl = originalUrl.split("?")[0];
  const thumbPublicUrl = thumbUrl.split("?")[0];

  return {
    key,
    thumbKey,
    url: publicUrl,
    thumbUrl: thumbPublicUrl,
  };
}

async function uploadFileWithPresignedUrl(
  presignedUrl: string,
  file: File | Blob
): Promise<void> {
  const response = await fetch(presignedUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
  }
}

export async function registerPhoto(
  imageUrl: string,
  thumbUrl: string,
  albumId?: string,
  fileName?: string
): Promise<void> {
  const response = await fetch("/api/admin/photos/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      imageUrl,
      thumbUrl,
      storageType: "cos",
      albumId,
      fileName,
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Failed to register photo");
  }
}
