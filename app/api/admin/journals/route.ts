import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sanitizeMediaSegment,
  saveUploadedLocalMedia,
} from "@/lib/local-media-server";

async function ensureUniqueJournalSlug(baseSlug: string) {
  let candidate = baseSlug || "journal";
  let counter = 1;

  while (await prisma.journal.findUnique({ where: { slug: candidate } })) {
    counter += 1;
    candidate = `${baseSlug || "journal"}-${counter}`;
  }

  return candidate;
}

export async function POST(request: NextRequest) {
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

  try {
    const slug = await ensureUniqueJournalSlug(
      sanitizeMediaSegment(slugInput || title),
    );

    let coverImageUrl: string | null = null;
    if (coverFile) {
      const savedCover = await saveUploadedLocalMedia(
        coverFile,
        `journal-covers/${slug || title}`,
      );
      coverImageUrl = savedCover.url;
    }

    const journal = await prisma.journal.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content: content || null,
        coverImageUrl,
        publishedAt: publishedAtValue ? new Date(publishedAtValue) : null,
        isPublished,
      },
      select: {
        id: true,
        slug: true,
      },
    });

    return NextResponse.json({
      ok: true,
      redirectTo: `/admin/journals?created=${journal.slug}`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "create-failed",
      },
      { status: 400 },
    );
  }
}
