import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const { id: albumId } = await context.params;
  const body = await request.json().catch(() => null);
  const photoIds = Array.isArray(body?.photoIds)
    ? body.photoIds.filter((item: unknown): item is string => typeof item === "string")
    : [];

  if (!albumId || photoIds.length === 0) {
    return NextResponse.json({ error: "missing-photo-ids" }, { status: 400 });
  }

  const album = await prisma.album.findUnique({
    where: {
      id: albumId,
    },
    select: {
      id: true,
      imageCount: true,
      coverImageUrl: true,
    },
  });

  if (!album) {
    return NextResponse.json({ error: "album-not-found" }, { status: 404 });
  }

  await prisma.$transaction(async (tx) => {
    const existingCount = await tx.albumPhoto.count({
      where: {
        albumId,
      },
    });

    for (const [index, photoId] of photoIds.entries()) {
      await tx.albumPhoto.upsert({
        where: {
          albumId_photoId: {
            albumId,
            photoId,
          },
        },
        create: {
          albumId,
          photoId,
          sortOrder: existingCount + index,
        },
        update: {},
      });
    }

    const linkedCount = await tx.albumPhoto.count({
      where: {
        albumId,
      },
    });

    await tx.album.update({
      where: {
        id: albumId,
      },
      data: {
        imageCount: linkedCount,
      },
    });
  });

  return NextResponse.json({ ok: true });
}
