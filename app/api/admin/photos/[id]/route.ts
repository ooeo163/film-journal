import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizeMediaSegment } from "@/lib/local-media-server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function ensureUniquePhotoSlug(baseSlug: string, currentId: string) {
  let candidate = baseSlug || "photo";
  let counter = 1;

  while (true) {
    const existing = await prisma.photo.findUnique({
      where: {
        slug: candidate,
      },
      select: {
        id: true,
      },
    });

    if (!existing || existing.id === currentId) {
      return candidate;
    }

    counter += 1;
    candidate = `${baseSlug || "photo"}-${counter}`;
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const formData = await request.formData();
  const title = String(formData.get("title") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const camera = String(formData.get("camera") || "").trim();
  const lens = String(formData.get("lens") || "").trim();
  const filmStock = String(formData.get("filmStock") || "").trim();
  const shotAtValue = String(formData.get("shotAt") || "").trim();
  const isPublished = formData.get("isPublished") === "on";

  if (!title) {
    return NextResponse.json({ error: "missing-title" }, { status: 400 });
  }

  const existingPhoto = await prisma.photo.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!existingPhoto) {
    return NextResponse.json({ error: "photo-not-found" }, { status: 404 });
  }

  try {
    const slug = await ensureUniquePhotoSlug(
      sanitizeMediaSegment(slugInput || title),
      id,
    );

    const photo = await prisma.photo.update({
      where: {
        id,
      },
      data: {
        title,
        slug,
        description: description || null,
        location: location || null,
        camera: camera || null,
        lens: lens || null,
        filmStock: filmStock || null,
        shotAt: shotAtValue ? new Date(shotAtValue) : null,
        isPublished,
      },
      select: {
        slug: true,
      },
    });

    return NextResponse.json({
      ok: true,
      redirectTo: `/admin/photos?updated=${photo.slug}`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "update-failed",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(_: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const existingPhoto = await prisma.photo.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      slug: true,
      imageUrl: true,
      albumLinks: {
        select: {
          albumId: true,
        },
      },
    },
  });

  if (!existingPhoto) {
    return NextResponse.json({ error: "photo-not-found" }, { status: 404 });
  }

  try {
    const affectedAlbumIds = [...new Set(existingPhoto.albumLinks.map((link) => link.albumId))];

    await prisma.$transaction(async (tx) => {
      await tx.photo.delete({
        where: {
          id,
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

        const nextCover =
          album?.coverImageUrl === existingPhoto.imageUrl
            ? remainingLinks[0]?.photo.imageUrl ?? null
            : album?.coverImageUrl ?? null;

        await tx.album.update({
          where: {
            id: albumId,
          },
          data: {
            imageCount: remainingLinks.length,
            coverImageUrl: nextCover,
          },
        });
      }
    });

    return NextResponse.json({
      ok: true,
      redirectTo: "/admin/photos?deleted=1",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "delete-failed",
      },
      { status: 400 },
    );
  }
}
