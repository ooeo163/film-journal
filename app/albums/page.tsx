import { AlbumCoverGrid } from "@/components/album-cover-grid";
import { CreateAlbumButton } from "@/components/create-album-button";
import { resolveCosUrl } from "@/lib/cos-utils";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export default async function AlbumsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("fj_user_id")?.value;

  const albums = await prisma.album.findMany({
    where: {
      isPublished: true,
      creatorId: userId || undefined,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          photoLinks: true,
        },
      },
      photoLinks: {
        take: 1,
        orderBy: { sortOrder: "asc" },
        select: {
          photo: {
            select: { thumbUrl: true, imageUrl: true },
          },
        },
      },
    },
  });

  return (
    <main className="relative text-stone-100">
      <div
        className="home-background fixed inset-0"
      />
      <div className="fixed inset-0 bg-[linear-gradient(90deg,rgba(9,8,7,0.9)_0%,rgba(13,11,9,0.8)_36%,rgba(14,12,10,0.72)_65%,rgba(10,9,8,0.86)_100%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(7,6,5,0.26)_58%,rgba(5,4,4,0.74)_100%)]" />
      <div className="page-bg-soft-light fixed inset-0" />

      <div className="relative z-10 px-6 pb-14 pt-5">
        <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-3">
          <section className="border border-stone-700/60 bg-[rgba(18,15,13,0.38)] px-4 py-3 shadow-[0_10px_32px_rgba(0,0,0,0.14)] backdrop-blur-[1px]">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-1.5">
                <p className="text-xs uppercase tracking-[0.45em] text-stone-500" style={{ fontFamily: "var(--font-display), Georgia, serif" }}>
                  Albums
                </p>
                <h1 className="text-4xl font-semibold tracking-tight text-stone-50 md:text-5xl">
                  相册列表
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <CreateAlbumButton />
                <div className="text-right text-xs uppercase tracking-[0.28em] text-stone-500" style={{ fontFamily: "var(--font-display), Georgia, serif" }}>
                  {String(albums.length).padStart(2, "0")} Rolls
                </div>
              </div>
            </div>
            <div className="mt-3 h-px bg-[linear-gradient(90deg,rgba(214,188,150,0.62),rgba(214,188,150,0.08),transparent)]" />
          </section>

          <AlbumCoverGrid
            albums={albums.map((album) => ({
              id: album.id,
              title: album.title,
              slug: album.slug,
              description: album.description,
              coverImageUrl: resolveCosUrl(album.coverImageUrl || album.photoLinks[0]?.photo.thumbUrl || album.photoLinks[0]?.photo.imageUrl),
              photoCount: album._count.photoLinks,
            }))}
          />
        </div>
      </div>
    </main>
  );
}
