import { notFound } from "next/navigation";
import { AlbumFilmStrip } from "@/components/album-film-strip";
import { AlbumSwitcher } from "@/components/album-switcher";
import { prisma } from "@/lib/prisma";

type AlbumDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function AlbumDetailPage({
  params,
}: AlbumDetailPageProps) {
  const { slug } = await params;

  const [album, albumList] = await Promise.all([
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
      },
    }),
  ]);

  if (!album || !album.isPublished) {
    notFound();
  }

  return (
    <main className="relative text-stone-100">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/homepage-background.jpg')",
        }}
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
                  <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                    Film Strip
                  </p>
                  <h1 className="mt-2 text-2xl font-semibold text-stone-50 sm:text-3xl">
                    {album.title}
                  </h1>
                  <p className="mt-2 text-sm text-stone-400">
                    Contact Sheet · {album.photoLinks.length} photos
                  </p>
                </div>
                <p className="text-sm text-stone-400">点击任意片窗全屏查看</p>
              </div>

              <AlbumFilmStrip
                albumTitle={album.title}
                photos={album.photoLinks.map((link) => ({
                  id: link.id,
                  title: link.photo.title,
                  imageUrl: link.photo.imageUrl,
                  thumbUrl: link.photo.thumbUrl,
                  sortOrder: link.sortOrder,
                }))}
              />
            </section>
          </section>
        </div>
      </div>
    </main>
  );
}
