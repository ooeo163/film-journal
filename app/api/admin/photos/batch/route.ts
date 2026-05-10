import path from "node:path";
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

  try {
    const formData = await request.formData();
    const files = formData
      .getAll("files")
      .filter((item): item is File => item instanceof File && item.size > 0);
    const albumId = String(formData.get("albumId") || "").trim();

    if (files.length === 0) {
      return NextResponse.json({ error: "missing-files" }, { status: 400 });
    }

    const createdPhotos: Array<{
      id: string;
      slug: string;
      imageUrl: string;
    }> = [];

    let firstThumbUrl: string | null = null;

    for (const file of files) {
      const upload = await saveUploadedLocalMedia(file, "photos-batch");
      const baseName = path.parse(file.name).name.replace(/[_-]+/g, " ").trim() || "photo";
      const slug = await ensureUniquePhotoSlug(
        sanitizeMediaSegment(baseName),
      );

      if (!firstThumbUrl) {
        firstThumbUrl = upload.thumbUrl;
      }

      const photo = await prisma.photo.create({
        data: {
          slug,
          imageUrl: upload.url,
          thumbUrl: upload.thumbUrl,
          creatorId: user.id,
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
                selectedAlbum.coverImageUrl || firstThumbUrl,
            },
          });
        }
      });
    }

    return NextResponse.json({
      ok: true,
      createdCount: createdPhotos.length,
    });
  } catch (error) {
    console.error("Batch upload error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "batch-create-failed",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => null);
    const ids = Array.isArray(body?.ids)
      ? body.ids.filter(
          (id: unknown): id is string => typeof id === "string" && id.length > 0,
        )
      : [];

    if (ids.length === 0) {
      return NextResponse.json({ error: "missing-ids" }, { status: 400 });
    }

    const resources = await prisma.photo.findMany({
      where: {
        id: { in: ids },
        OR: [
          { creatorId: user.id },
          ...(user.role === "system_admin" ? [{}] : []),
        ],
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

    const deletableIds = resources.map((r) => r.id);

    if (deletableIds.length === 0) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const deletedImageUrls = new Set(resources.map((photo) => photo.imageUrl));
    const affectedAlbumIds = [
      ...new Set(
        resources.flatMap((photo) => photo.albumLinks.map((link) => link.albumId)),
      ),
    ];

    await prisma.$transaction(async (tx) => {
      await tx.photo.deleteMany({
        where: {
          id: {
            in: deletableIds,
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
      redirectTo: `/admin/photos?deleted=${resources.length}`,
    });
  } catch (error) {
    console.error("Batch delete error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "bulk-delete-failed",
      },
      { status: 500 },
    );
  }
}
