import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

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
