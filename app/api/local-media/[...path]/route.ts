import fs from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { isCosUrl, getCosSignedUrl, isCosEnabled } from "@/lib/cos-utils";

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

  if (isCosUrl(relativePath)) {
    if (!isCosEnabled()) {
      return new Response("COS is not configured", { status: 500 });
    }

    try {
      const key = relativePath.replace("cos://", "");
      const signedUrl = getCosSignedUrl(key, 300);
      return NextResponse.redirect(signedUrl);
    } catch {
      return new Response("Failed to generate signed URL", { status: 500 });
    }
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
