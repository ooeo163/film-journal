import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sanitizeMediaSegment,
  saveUploadedLocalMedia,
} from "@/lib/local-media-server";
import { requireAdmin } from "@/lib/require-admin";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function ensureUniqueJournalSlug(baseSlug: string, currentId: string) {
  let candidate = baseSlug || "journal";
  let counter = 1;

  while (true) {
    const existing = await prisma.journal.findUnique({
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
    candidate = `${baseSlug || "journal"}-${counter}`;
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const formData = await request.formData();
  const title = String(formData.get("title") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const excerpt = String(formData.get("excerpt") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const publishedAtValue = String(formData.get("publishedAt") || "").trim();
  const isPublished = formData.get("isPublished") === "on";
  const coverFileValue = formData.get("coverFile");
  const coverFile =
    coverFileValue instanceof File && coverFileValue.size > 0
      ? coverFileValue
      : null;

  if (!title) {
    return NextResponse.json({ error: "missing-title" }, { status: 400 });
  }

  const existingJournal = await prisma.journal.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      coverImageUrl: true,
    },
  });

  if (!existingJournal) {
    return NextResponse.json({ error: "journal-not-found" }, { status: 404 });
  }

  try {
    const slug = await ensureUniqueJournalSlug(
      sanitizeMediaSegment(slugInput || title),
      id,
    );

    let coverImageUrl = existingJournal.coverImageUrl;
    if (coverFile) {
      const savedCover = await saveUploadedLocalMedia(
        coverFile,
        `journal-covers/${slug || title}`,
      );
      coverImageUrl = savedCover.url;
    }

    await prisma.journal.update({
      where: {
        id,
      },
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content: content || null,
        coverImageUrl,
        publishedAt: publishedAtValue ? new Date(publishedAtValue) : null,
        isPublished,
      },
    });

    return NextResponse.json({
      ok: true,
      redirectTo: `/admin/journals?updated=${slug}`,
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
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const existingJournal = await prisma.journal.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!existingJournal) {
    return NextResponse.json({ error: "journal-not-found" }, { status: 404 });
  }

  try {
    await prisma.journal.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      ok: true,
      redirectTo: "/admin/journals?deleted=1",
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
