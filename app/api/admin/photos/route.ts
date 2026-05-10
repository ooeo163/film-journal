import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sanitizeMediaSegment,
  saveUploadedLocalMedia,
} from "@/lib/local-media-server";
import { requireAuth } from "@/lib/require-admin";

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
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const customSlug = String(formData.get("slug") || "").trim();
  const albumId = String(formData.get("albumId") || "").trim();
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

  try {
    const upload = await saveUploadedLocalMedia(file, "photos-manual");
    const slug = await ensureUniquePhotoSlug(
      sanitizeMediaSegment(customSlug || file.name.replace(/\.[^.]+$/, "")),
    );

    const photo = await prisma.$transaction(async (tx) => {
      const createdPhoto = await tx.photo.create({
        data: {
          slug,
          imageUrl: upload.url,
          thumbUrl: upload.thumbUrl,
          creatorId: user.id,
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
              coverImageUrl: selectedAlbum.coverImageUrl || upload.thumbUrl,
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
