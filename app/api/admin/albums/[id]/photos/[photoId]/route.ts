import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
    photoId: string;
  }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const { id: albumId, photoId } = await context.params;

  const existingLink = await prisma.albumPhoto.findUnique({
    where: {
      albumId_photoId: {
        albumId,
        photoId,
      },
    },
  });

  if (!existingLink) {
    return NextResponse.json({ error: "link-not-found" }, { status: 404 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.albumPhoto.delete({
      where: {
        albumId_photoId: {
          albumId,
          photoId,
        },
      },
    });

    const remainingLinks = await tx.albumPhoto.findMany({
      where: {
        albumId,
      },
      orderBy: {
        sortOrder: "asc",
      },
      select: {
        id: true,
      },
    });

    for (const [index, link] of remainingLinks.entries()) {
      await tx.albumPhoto.update({
        where: {
          id: link.id,
        },
        data: {
          sortOrder: index,
        },
      });
    }

    await tx.album.update({
      where: {
        id: albumId,
      },
      data: {
        imageCount: remainingLinks.length,
      },
    });
  });

  return NextResponse.json({ ok: true });
}
