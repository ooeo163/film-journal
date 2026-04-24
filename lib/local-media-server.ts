import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
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
  const fileName = `${baseName}-${randomUUID().slice(0, 8)}${extension}`;
  const relativePath = path.posix.join(relativeDir, fileName);
  const filePath = path.join(LOCAL_MEDIA_ROOT, ...relativePath.split("/"));

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const arrayBuffer = await file.arrayBuffer();
  await fs.writeFile(filePath, Buffer.from(arrayBuffer));

  return {
    fileName,
    relativePath,
    size: file.size,
    url: getLocalMediaUrl(relativePath),
  };
}
