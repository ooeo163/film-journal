import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizeMediaSegment } from "@/lib/local-media-server";
import { requireAuth } from "@/lib/require-admin";
import { getCosSignedUrl, isCosUrl, parseCosKey } from "@/lib/cos-utils";

async function ensureUniquePhotoSlug(baseSlug: string) {
  let candidate = baseSlug || "photo";
  let counter = 1;

  while (await prisma.photo.findUnique({ where: { slug: candidate } })) {
    counter += 1;
    candidate = `${baseSlug || "photo"}-${counter}`;
  }

  return candidate;
}

export async function POST(request: NextRequest) {
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { imageUrl, thumbUrl, storageType = "cos", albumId, fileName } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "imageUrl is required" },
        { status: 400 }
      );
    }

    const baseName = fileName
      ? fileName.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " ").trim()
      : "photo";
    const slug = await ensureUniquePhotoSlug(sanitizeMediaSegment(baseName));

    const cosKey = isCosUrl(imageUrl) ? parseCosKey(imageUrl) : null;

    let firstThumbUrl: string | null = null;

    const photo = await prisma.$transaction(async (tx) => {
      const createdPhoto = await tx.photo.create({
        data: {
          slug,
          imageUrl,
          thumbUrl,
          cosKey,
          storageType,
          creatorId: user.id,
        },
        select: {
          id: true,
          slug: true,
          imageUrl: true,
          thumbUrl: true,
        },
      });

      if (albumId) {
        const sortOrder = await tx.albumPhoto.count({
          where: { albumId },
        });

        await tx.albumPhoto.create({
          data: {
            albumId,
            photoId: createdPhoto.id,
            sortOrder,
          },
        });

        const selectedAlbum = await tx.album.findUnique({
          where: { id: albumId },
          select: { imageCount: true, coverImageUrl: true },
        });

        if (selectedAlbum) {
          await tx.album.update({
            where: { id: albumId },
            data: {
              imageCount: selectedAlbum.imageCount + 1,
              coverImageUrl: selectedAlbum.coverImageUrl || thumbUrl,
            },
          });
        }
      }

      return createdPhoto;
    });

    return NextResponse.json({
      ok: true,
      photo,
    });
  } catch (error) {
    console.error("Photo register error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "register-failed",
      },
      { status: 500 }
    );
  }
}
