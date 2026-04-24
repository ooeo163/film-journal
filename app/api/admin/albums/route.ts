import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sanitizeMediaSegment,
  saveUploadedLocalMedia,
} from "@/lib/local-media-server";

async function ensureUniqueAlbumSlug(baseSlug: string) {
  let candidate = baseSlug || "album";
  let counter = 1;

  while (await prisma.album.findUnique({ where: { slug: candidate } })) {
    counter += 1;
    candidate = `${baseSlug || "album"}-${counter}`;
  }

  return candidate;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const title = String(formData.get("title") || "").trim();
  const customSlug = String(formData.get("slug") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const sourceUrl = String(formData.get("sourceUrl") || "").trim();
  const isPublished = formData.get("isPublished") === "on";
  const redirectTo =
    String(formData.get("redirectTo") || "").trim() || "/admin/albums";
  const coverFile = formData.get("coverFile");

  function buildRedirect(path: string, error?: string) {
    const url = new URL(path, request.url);

    if (error) {
      url.searchParams.set("error", error);
    }

    return NextResponse.redirect(url);
  }

  if (!title) {
    if (request.headers.get("x-admin-form") === "1") {
      return NextResponse.json({ error: "missing-title" }, { status: 400 });
    }

    return buildRedirect("/admin/albums/new", "missing-title");
  }

  try {
    const slug = await ensureUniqueAlbumSlug(
      sanitizeMediaSegment(customSlug || title),
    );

    let coverImageUrl: string | null = null;

    if (coverFile instanceof File && coverFile.size > 0) {
      const upload = await saveUploadedLocalMedia(coverFile, "albums-manual");
      coverImageUrl = upload.url;
    }

    const album = await prisma.album.create({
      data: {
        title,
        slug,
        description: description || null,
        sourceUrl: sourceUrl || null,
        coverImageUrl,
        imageCount: 0,
        isPublished,
      },
      select: {
        id: true,
        slug: true,
      },
    });

    const successUrl = new URL(redirectTo, request.url);
    successUrl.searchParams.set("created", album.slug);

    if (request.headers.get("x-admin-form") === "1") {
      return NextResponse.json({
        ok: true,
        redirectTo: successUrl.pathname + successUrl.search,
      });
    }

    return NextResponse.redirect(successUrl);
  } catch (error) {
    if (request.headers.get("x-admin-form") === "1") {
      return NextResponse.json(
        {
          error:
            error instanceof Error ? error.message : "create-failed",
        },
        { status: 400 },
      );
    }

    return buildRedirect(
      "/admin/albums/new",
      error instanceof Error ? error.message : "create-failed",
    );
  }
}
