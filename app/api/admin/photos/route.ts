import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sanitizeMediaSegment,
  saveUploadedLocalMedia,
} from "@/lib/local-media-server";

async function ensureUniquePhotoSlug(baseSlug: string) {
  let candidate = baseSlug || "photo";
  let counter = 1;

  while (await prisma.photo.findUnique({ where: { slug: candidate } })) {
    counter += 1;
    candidate = `${baseSlug || "photo"}-${counter}`;
  }

  return candidate;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file");
  const title = String(formData.get("title") || "").trim();
  const customSlug = String(formData.get("slug") || "").trim();
  const albumId = String(formData.get("albumId") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const camera = String(formData.get("camera") || "").trim();
  const lens = String(formData.get("lens") || "").trim();
  const filmStock = String(formData.get("filmStock") || "").trim();
  const shotAtValue = String(formData.get("shotAt") || "").trim();
  const isPublished = formData.get("isPublished") === "on";
  const redirectTo =
    String(formData.get("redirectTo") || "").trim() || "/admin/photos";

  function buildRedirect(path: string, error?: string) {
    const url = new URL(path, request.url);

    if (error) {
      url.searchParams.set("error", error);
    }

    return NextResponse.redirect(url);
  }

  if (!(file instanceof File)) {
    if (request.headers.get("x-admin-form") === "1") {
      return NextResponse.json({ error: "missing-file" }, { status: 400 });
    }

    return buildRedirect("/admin/photos/new", "missing-file");
  }

  if (!title) {
    if (request.headers.get("x-admin-form") === "1") {
      return NextResponse.json({ error: "missing-title" }, { status: 400 });
    }

    return buildRedirect("/admin/photos/new", "missing-title");
  }

  try {
    const upload = await saveUploadedLocalMedia(file, "photos-manual");
    const slug = await ensureUniquePhotoSlug(
      sanitizeMediaSegment(customSlug || title),
    );

    const photo = await prisma.$transaction(async (tx) => {
      const createdPhoto = await tx.photo.create({
        data: {
          title,
          slug,
          description: description || null,
          imageUrl: upload.url,
          thumbUrl: upload.url,
          location: location || null,
          camera: camera || null,
          lens: lens || null,
          filmStock: filmStock || null,
          shotAt: shotAtValue ? new Date(shotAtValue) : null,
          isPublished,
        },
        select: {
          id: true,
          slug: true,
        },
      });

      if (albumId) {
        const sortOrder = await tx.albumPhoto.count({
          where: {
            albumId,
          },
        });

        await tx.albumPhoto.create({
          data: {
            albumId,
            photoId: createdPhoto.id,
            sortOrder,
          },
        });

        const selectedAlbum = await tx.album.findUnique({
          where: {
            id: albumId,
          },
          select: {
            imageCount: true,
            coverImageUrl: true,
          },
        });

        if (selectedAlbum) {
          await tx.album.update({
            where: {
              id: albumId,
            },
            data: {
              imageCount: selectedAlbum.imageCount + 1,
              coverImageUrl: selectedAlbum.coverImageUrl || upload.url,
            },
          });
        }
      }

      return createdPhoto;
    });

    const successUrl = new URL(redirectTo, request.url);
    successUrl.searchParams.set("created", photo.slug);

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
      "/admin/photos/new",
      error instanceof Error ? error.message : "create-failed",
    );
  }
}
