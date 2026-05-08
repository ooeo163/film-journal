import fs from "node:fs/promises";
import path from "node:path";
import { NextRequest } from "next/server";

const LOCAL_MEDIA_ROOT =
  process.env.LOCAL_MEDIA_ROOT ??
  path.join(process.cwd(), "storage", "local-media");

const mimeTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  let relativePath = url.searchParams.get("path");

  if (!relativePath) {
    const pathname = url.pathname;
    const prefix = "/api/local-media/";
    if (pathname.startsWith(prefix)) {
      relativePath = pathname.slice(prefix.length);
    }
  }

  if (!relativePath) {
    return new Response("Missing path", { status: 400 });
  }

  try {
    const normalized = relativePath.replace(/\//g, path.sep);
    const filePath = path.resolve(LOCAL_MEDIA_ROOT, normalized);
    const root = path.resolve(LOCAL_MEDIA_ROOT);

    if (!filePath.startsWith(root)) {
      return new Response("Invalid path", { status: 400 });
    }

    const buffer = await fs.readFile(filePath);
    const extension = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extension] ?? "application/octet-stream";

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
