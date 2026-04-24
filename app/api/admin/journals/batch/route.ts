import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const ids = Array.isArray(body?.ids)
    ? body.ids.filter((id: unknown): id is string => typeof id === "string" && id.length > 0)
    : [];

  if (ids.length === 0) {
    return NextResponse.json({ error: "missing-ids" }, { status: 400 });
  }

  try {
    await prisma.journal.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return NextResponse.json({
      ok: true,
      redirectTo: `/admin/journals?deleted=${ids.length}`,
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
