import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-admin";

export async function DELETE(request: NextRequest) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const ids = Array.isArray(body?.ids)
    ? body.ids.filter((id: unknown): id is string => typeof id === "string" && id.length > 0)
    : [];

  if (ids.length === 0) {
    return NextResponse.json({ error: "missing-ids" }, { status: 400 });
  }

  try {
    const resources = await prisma.album.findMany({
      where: {
        id: { in: ids },
        OR: [
          { creatorId: user.id },
          ...(user.role === "system_admin" ? [{}] : []),
        ],
      },
      select: { id: true },
    });

    const deletableIds = resources.map((r) => r.id);

    if (deletableIds.length === 0) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    await prisma.album.deleteMany({
      where: {
        id: {
          in: deletableIds,
        },
      },
    });

    return NextResponse.json({
      ok: true,
      redirectTo: `/admin/albums?deleted=${deletableIds.length}`,
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
