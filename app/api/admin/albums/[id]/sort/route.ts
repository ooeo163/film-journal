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
  const photoId = typeof body?.photoId === "string" ? body.photoId : "";
  const direction = body?.direction === "down" ? "down" : "up";

  if (!photoId) {
    return NextResponse.json({ error: "missing-photo-id" }, { status: 400 });
  }

  const links = await prisma.albumPhoto.findMany({
    where: {
      albumId,
    },
    orderBy: {
      sortOrder: "asc",
    },
    select: {
      id: true,
      photoId: true,
      sortOrder: true,
    },
  });

  const index = links.findIndex((link) => link.photoId === photoId);

  if (index === -1) {
    return NextResponse.json({ error: "link-not-found" }, { status: 404 });
  }

  const targetIndex = direction === "up" ? index - 1 : index + 1;

  if (targetIndex < 0 || targetIndex >= links.length) {
    return NextResponse.json({ ok: true, unchanged: true });
  }

  const reordered = [...links];
  const [moved] = reordered.splice(index, 1);
  reordered.splice(targetIndex, 0, moved);

  await prisma.$transaction(
    reordered.map((link, order) =>
      prisma.albumPhoto.update({
        where: {
          id: link.id,
        },
        data: {
          sortOrder: order,
        },
      }),
    ),
  );

  return NextResponse.json({ ok: true });
}
