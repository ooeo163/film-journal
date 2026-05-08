import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { getLocalMediaUrl } from "@/lib/local-media";

export const LOCAL_MEDIA_ROOT =
  process.env.LOCAL_MEDIA_ROOT ??
  path.join(/*turbopackIgnore: true*/ process.cwd(), "storage", "local-media");

export const LOCAL_IMPORT_SOURCE_ROOT =
  process.env.LOCAL_IMPORT_SOURCE_ROOT ?? "D:\\workspace\\film-journal-img";

export function resolveLocalMediaPath(relativePath: string) {
  const normalized = relativePath.replace(/\//g, path.sep);
  const resolved = path.resolve(LOCAL_MEDIA_ROOT, normalized);
  const root = path.resolve(LOCAL_MEDIA_ROOT);

  if (!resolved.startsWith(root)) {
    throw new Error("Invalid local media path.");
  }

  return resolved;
}

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export function sanitizeMediaSegment(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

const MAX_ORIGINAL_SIZE = 1024 * 1024; // 1MB
const MAX_THUMB_SIZE = 200 * 1024; // 200KB
const THUMB_MAX_WIDTH = 400;
const THUMB_MAX_HEIGHT = 400;

async function compressImage(buffer: Buffer, mimeType: string): Promise<Buffer> {
  const image = sharp(buffer);

  if (mimeType === "image/png") {
    return image.png({ quality: 80 }).toBuffer();
  }

  if (mimeType === "image/webp") {
    return image.webp({ quality: 80 }).toBuffer();
  }

  return image.jpeg({ quality: 80 }).toBuffer();
}

async function generateThumbnail(buffer: Buffer, mimeType: string): Promise<Buffer> {
  const image = sharp(buffer);

  const resized = image.resize(THUMB_MAX_WIDTH, THUMB_MAX_HEIGHT, {
    fit: "inside",
    withoutEnlargement: true,
  });

  if (mimeType === "image/png") {
    return resized.png({ quality: 70 }).toBuffer();
  }

  if (mimeType === "image/webp") {
    return resized.webp({ quality: 70 }).toBuffer();
  }

  return resized.jpeg({ quality: 70 }).toBuffer();
}

export async function saveUploadedLocalMedia(
  file: File,
  targetFolder: string,
) {
  if (!allowedMimeTypes.has(file.type)) {
    throw new Error("Unsupported file type");
  }

  const extension = path.extname(file.name).toLowerCase() || ".jpg";
  const baseName = sanitizeMediaSegment(path.parse(file.name).name) || "image";
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const folderName = sanitizeMediaSegment(targetFolder) || "manual-uploads";
  const relativeDir = path.posix.join(folderName, year, month);
  const uniqueId = randomUUID().slice(0, 8);

  const arrayBuffer = await file.arrayBuffer();
  let imageBuffer = Buffer.from(arrayBuffer);

  let isCompressed = false;
  if (imageBuffer.length > MAX_ORIGINAL_SIZE) {
    imageBuffer = await compressImage(imageBuffer, file.type);
    isCompressed = true;
  }

  const originalFileName = `${baseName}-${uniqueId}${extension}`;
  const originalRelativePath = path.posix.join(relativeDir, originalFileName);
  const originalFilePath = path.join(LOCAL_MEDIA_ROOT, ...originalRelativePath.split("/"));

  await fs.mkdir(path.dirname(originalFilePath), { recursive: true });
  await fs.writeFile(originalFilePath, imageBuffer);

  let thumbBuffer = await generateThumbnail(imageBuffer, file.type);

  let thumbQuality = 70;
  while (thumbBuffer.length > MAX_THUMB_SIZE && thumbQuality > 20) {
    thumbQuality -= 10;
    const image = sharp(imageBuffer).resize(THUMB_MAX_WIDTH, THUMB_MAX_HEIGHT, {
      fit: "inside",
      withoutEnlargement: true,
    });

    if (file.type === "image/png") {
      thumbBuffer = await image.png({ quality: thumbQuality }).toBuffer();
    } else if (file.type === "image/webp") {
      thumbBuffer = await image.webp({ quality: thumbQuality }).toBuffer();
    } else {
      thumbBuffer = await image.jpeg({ quality: thumbQuality }).toBuffer();
    }
  }

  const thumbFileName = `${baseName}-${uniqueId}-thumb${extension}`;
  const thumbRelativePath = path.posix.join(relativeDir, thumbFileName);
  const thumbFilePath = path.join(LOCAL_MEDIA_ROOT, ...thumbRelativePath.split("/"));

  await fs.writeFile(thumbFilePath, thumbBuffer);

  return {
    fileName: originalFileName,
    relativePath: originalRelativePath,
    size: imageBuffer.length,
    url: getLocalMediaUrl(originalRelativePath),
    thumbUrl: getLocalMediaUrl(thumbRelativePath),
    isCompressed,
    originalSize: file.size,
  };
}
