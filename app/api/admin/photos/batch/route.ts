import path from "node:path";
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
  const files = formData
    .getAll("files")
    .filter((item): item is File => item instanceof File && item.size > 0);
  const albumId = String(formData.get("albumId") || "").trim();
  const titlePrefix = String(formData.get("titlePrefix") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const camera = String(formData.get("camera") || "").trim();
  const filmStock = String(formData.get("filmStock") || "").trim();
  const shotAtValue = String(formData.get("shotAt") || "").trim();
  const isPublished = formData.get("isPublished") === "on";

  if (files.length === 0) {
    return NextResponse.json({ error: "missing-files" }, { status: 400 });
  }

  try {
    const createdPhotos: Array<{
      id: string;
      slug: string;
      imageUrl: string;
    }> = [];

    for (const [index, file] of files.entries()) {
      const upload = await saveUploadedLocalMedia(file, "photos-batch");
      const baseTitle =
        titlePrefix ||
        path.parse(file.name).name.replace(/[_-]+/g, " ").trim() ||
        "Photo";
      const title = titlePrefix
        ? `${titlePrefix} ${String(index + 1).padStart(2, "0")}`
        : baseTitle;
      const slug = await ensureUniquePhotoSlug(
        sanitizeMediaSegment(title || path.parse(file.name).name),
      );

      const photo = await prisma.photo.create({
        data: {
          title,
          slug,
          description: description || null,
          imageUrl: upload.url,
          thumbUrl: upload.url,
          location: location || null,
          camera: camera || null,
          filmStock: filmStock || null,
          shotAt: shotAtValue ? new Date(shotAtValue) : null,
          isPublished,
        },
        select: {
          id: true,
          slug: true,
          imageUrl: true,
        },
      });

      createdPhotos.push(photo);
    }

    if (albumId && createdPhotos.length > 0) {
      await prisma.$transaction(async (tx) => {
        const existingCount = await tx.albumPhoto.count({
          where: {
            albumId,
          },
        });

        for (const [index, photo] of createdPhotos.entries()) {
          await tx.albumPhoto.create({
            data: {
              albumId,
              photoId: photo.id,
              sortOrder: existingCount + index,
            },
          });
        }

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
              imageCount: selectedAlbum.imageCount + createdPhotos.length,
              coverImageUrl:
                selectedAlbum.coverImageUrl || createdPhotos[0].imageUrl,
            },
          });
        }
      });
    }

    return NextResponse.json({
      ok: true,
      createdCount: createdPhotos.length,
      redirectTo: `/admin/photos?batchCreated=${createdPhotos.length}`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "batch-create-failed",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const ids = Array.isArray(body?.ids)
    ? body.ids.filter(
        (id: unknown): id is string => typeof id === "string" && id.length > 0,
      )
    : [];

  if (ids.length === 0) {
    return NextResponse.json({ error: "missing-ids" }, { status: 400 });
  }

  try {
    const photos = await prisma.photo.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        id: true,
        imageUrl: true,
        albumLinks: {
          select: {
            albumId: true,
          },
        },
      },
    });
    const deletedImageUrls = new Set(photos.map((photo) => photo.imageUrl));
    const affectedAlbumIds = [
      ...new Set(
        photos.flatMap((photo) => photo.albumLinks.map((link) => link.albumId)),
      ),
    ];

    await prisma.$transaction(async (tx) => {
      await tx.photo.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });

      for (const albumId of affectedAlbumIds) {
        const remainingLinks = await tx.albumPhoto.findMany({
          where: {
            albumId,
          },
          orderBy: {
            sortOrder: "asc",
          },
          select: {
            photo: {
              select: {
                imageUrl: true,
              },
            },
          },
        });
        const album = await tx.album.findUnique({
          where: {
            id: albumId,
          },
          select: {
            coverImageUrl: true,
          },
        });
        const coverWasDeleted = album?.coverImageUrl
          ? deletedImageUrls.has(album.coverImageUrl)
          : false;

        await tx.album.update({
          where: {
            id: albumId,
          },
          data: {
            imageCount: remainingLinks.length,
            coverImageUrl: coverWasDeleted
              ? remainingLinks[0]?.photo.imageUrl ?? null
              : album?.coverImageUrl ?? null,
          },
        });
      }
    });

    return NextResponse.json({
      ok: true,
      redirectTo: `/admin/photos?deleted=${photos.length}`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "bulk-delete-failed",
      },
      { status: 400 },
    );
  }
}
