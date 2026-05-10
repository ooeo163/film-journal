import { notFound } from "next/navigation";
import { AlbumFilmStrip } from "@/components/album-film-strip";
import { AlbumSwitcher } from "@/components/album-switcher";
import { AlbumUploadButton } from "@/components/album-upload-button";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

type AlbumDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function AlbumDetailPage({
  params,
}: AlbumDetailPageProps) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const userId = cookieStore.get("fj_user_id")?.value;

  const [album, albumList, userAlbums] = await Promise.all([
    prisma.album.findUnique({
      where: {
        slug,
      },
      include: {
        photoLinks: {
          orderBy: {
            sortOrder: "asc",
          },
          include: {
            photo: true,
          },
        },
      },
    }),
    prisma.album.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        imageCount: true,
        coverImageUrl: true,
      },
    }),
    prisma.album.findMany({
      where: {
        creatorId: userId || undefined,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
      },
    }),
  ]);

  if (!album || !album.isPublished) {
    notFound();
  }

  const currentIndex = albumList.findIndex((a) => a.slug === album.slug);
  const nextAlbum = albumList[(currentIndex + 1) % albumList.length];
  const hasNext = albumList.length > 1 && nextAlbum;

  return (
    <main className="relative text-stone-100">
      <div
        className="home-background fixed inset-0"
      />
      <div className="fixed inset-0 bg-[linear-gradient(90deg,rgba(9,8,7,0.9)_0%,rgba(13,11,9,0.8)_36%,rgba(14,12,10,0.72)_65%,rgba(10,9,8,0.86)_100%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(7,6,5,0.26)_58%,rgba(5,4,4,0.74)_100%)]" />
      <div className="page-bg-soft-light fixed inset-0" />

      <div className="relative z-10 px-4 pb-16 pt-4 sm:px-6 sm:pb-12 sm:pt-5">
        <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-5">
          <section className="grid gap-5 xl:grid-cols-[320px_1fr]">
            <AlbumSwitcher albums={albumList} activeSlug={album.slug} />

            <section className="rounded-[1.4rem] border border-stone-700/80 bg-[rgba(17,16,15,0.84)] p-4 shadow-[0_18px_50px_rgba(17,16,15,0.22)] backdrop-blur-[2px] sm:rounded-[2rem] sm:p-8">
              <div className="mb-5 grid gap-3 border-b border-stone-700/70 pb-4 sm:mb-6 sm:flex sm:items-end sm:justify-between sm:gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-stone-500" style={{ fontFamily: "var(--font-display), Georgia, serif" }}>
                    Film Strip
                  </p>
                  <h1 className="mt-2 text-2xl font-semibold text-stone-50 sm:text-3xl">
                    {album.title}
                  </h1>
                  <p className="mt-2 text-sm text-stone-400" style={{ fontFamily: "var(--font-display), Georgia, serif" }}>
                    Contact Sheet · {album.photoLinks.length} photos
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <AlbumUploadButton
                    albumId={album.id}
                    albums={userAlbums}
                  />
                  <p className="text-sm text-stone-400">点击任意片窗全屏查看</p>
                </div>
              </div>

              <AlbumFilmStrip
                albumTitle={album.title}
                photos={album.photoLinks.map((link) => ({
                  id: link.id,
                  imageUrl: link.photo.imageUrl,
                  thumbUrl: link.photo.thumbUrl,
                  sortOrder: link.sortOrder,
                }))}
              />
            </section>
          </section>

          {hasNext ? (
            <a
              href={`/albums/${nextAlbum.slug}`}
              className="group flex items-center justify-between rounded-[1.4rem] border border-stone-700/60 bg-[rgba(17,16,15,0.72)] px-6 py-5 backdrop-blur-[1px] transition-all duration-300 hover:border-stone-600/80 hover:bg-[rgba(25,21,17,0.88)] sm:rounded-[2rem] sm:px-8 sm:py-6"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-[0.4em] text-stone-600" style={{ fontFamily: "var(--font-display), Georgia, serif" }}>
                  Next Album
                </p>
                <p className="mt-2 truncate text-lg text-stone-200 transition-colors group-hover:text-white sm:text-xl">
                  {nextAlbum.title}
                </p>
                <p className="mt-1 text-xs text-stone-500">
                  {nextAlbum.imageCount} photos
                </p>
              </div>
              <div className="ml-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-stone-700/60 text-stone-500 transition-all duration-300 group-hover:border-stone-500 group-hover:text-stone-300 group-hover:translate-x-1 sm:ml-6 sm:h-12 sm:w-12">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 sm:h-5 sm:w-5" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          ) : null}
        </div>
      </div>
    </main>
  );
}
