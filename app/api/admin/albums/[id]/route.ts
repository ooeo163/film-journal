import { NextRequest, NextResponse } from "next/server";
import { saveUploadedLocalMedia } from "@/lib/local-media-server";
import { prisma } from "@/lib/prisma";
import { sanitizeMediaSegment } from "@/lib/local-media-server";
import { requireAuth } from "@/lib/require-admin";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function ensureUniqueAlbumSlug(baseSlug: string, currentId: string) {
  let candidate = baseSlug || "album";
  let counter = 1;

  while (true) {
    const existing = await prisma.album.findUnique({
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
    candidate = `${baseSlug || "album"}-${counter}`;
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const formData = await request.formData();
  const title = String(formData.get("title") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const sourceUrl = String(formData.get("sourceUrl") || "").trim();
  const isPublished = formData.get("isPublished") === "on";
  const coverPhotoId = String(formData.get("coverPhotoId") || "").trim();
  const coverFileValue = formData.get("coverFile");
  const coverFile =
    coverFileValue instanceof File && coverFileValue.size > 0
      ? coverFileValue
      : null;

  if (!title) {
    return NextResponse.json({ error: "missing-title" }, { status: 400 });
  }

  const existingAlbum = await prisma.album.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      coverImageUrl: true,
      creatorId: true,
    },
  });

  if (!existingAlbum) {
    return NextResponse.json({ error: "album-not-found" }, { status: 404 });
  }

  if (existingAlbum.creatorId !== user.id && user.role !== "system_admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  try {
    const slug = await ensureUniqueAlbumSlug(
      sanitizeMediaSegment(slugInput || title),
      id,
    );
    let coverImageUrl = existingAlbum.coverImageUrl;

    if (coverPhotoId) {
      const linkedPhoto = await prisma.albumPhoto.findFirst({
        where: {
          albumId: id,
          photoId: coverPhotoId,
        },
        select: {
          photo: {
            select: {
              imageUrl: true,
            },
          },
        },
      });

      if (linkedPhoto?.photo.imageUrl) {
        coverImageUrl = linkedPhoto.photo.imageUrl;
      }
    }

    if (coverFile) {
      const savedCover = await saveUploadedLocalMedia(
        coverFile,
        `album-covers/${slug || title}`,
      );
      coverImageUrl = savedCover.url;
    }

    await prisma.album.update({
      where: {
        id,
      },
      data: {
        title,
        slug,
        description: description || null,
        sourceUrl: sourceUrl || null,
        coverImageUrl,
        isPublished,
      },
    });

    return NextResponse.json({
      ok: true,
      redirectTo: `/admin/albums/${id}?updated=1`,
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
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const existingAlbum = await prisma.album.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      creatorId: true,
    },
  });

  if (!existingAlbum) {
    return NextResponse.json({ error: "album-not-found" }, { status: 404 });
  }

  if (existingAlbum.creatorId !== user.id && user.role !== "system_admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  try {
    await prisma.album.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      ok: true,
      redirectTo: "/admin/albums?deleted=1",
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
