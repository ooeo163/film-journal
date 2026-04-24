import { notFound } from "next/navigation";
import { AlbumFilmStrip } from "@/components/album-film-strip";
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

      <div className="relative z-10 px-6 pb-16 pt-8">
        <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-8">
          <section className="grid gap-8 xl:grid-cols-[320px_1fr]">
            <aside className="rounded-[2rem] border border-stone-700/80 bg-[rgba(17,16,15,0.84)] p-6 shadow-[0_18px_50px_rgba(17,16,15,0.22)] backdrop-blur-[2px] xl:sticky xl:top-24 xl:h-fit">
              <div className="border-b border-stone-700/70 pb-4">
                <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                  Albums
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-stone-50">
                  相册切换
                </h2>
              </div>

              <div className="mt-5 grid max-h-[60vh] gap-3 overflow-y-auto pr-2">
                {albumList.map((item) => {
                  const active = item.slug === album.slug;

                  return (
                    <a
                      key={item.id}
                      href={`/albums/${item.slug}`}
                      className={
                        active
                          ? "rounded-[1.4rem] border border-[#8b7760] bg-[linear-gradient(180deg,#6b5948_0%,#45382d_100%)] px-4 py-4 text-stone-100 shadow-[0_10px_24px_rgba(0,0,0,0.24)]"
                          : "rounded-[1.4rem] border border-stone-700/70 bg-[rgba(28,22,18,0.72)] px-4 py-4 text-stone-300 transition-colors hover:bg-[rgba(40,31,25,0.82)]"
                      }
                    >
                      <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                        {String(item.imageCount).padStart(2, "0")} Frames
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm leading-6">
                        {item.title}
                      </p>
                    </a>
                  );
                })}
              </div>
            </aside>

            <section className="rounded-[2rem] border border-stone-700/80 bg-[rgba(17,16,15,0.84)] p-8 shadow-[0_18px_50px_rgba(17,16,15,0.22)] backdrop-blur-[2px]">
              <div className="mb-6 flex items-end justify-between gap-4 border-b border-stone-700/70 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                    Film Strip
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold text-stone-50">
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
