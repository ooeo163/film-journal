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

      <div className="relative z-10 px-6 py-28">
        <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-10">
          <section className="grid gap-8 border-b border-stone-700/70 pb-10 lg:grid-cols-[1fr_0.9fr]">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.45em] text-stone-500">
                Album Detail
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-stone-50 md:text-5xl">
                {album.title}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-stone-300">
                {album.description ?? "这个相册当前还没有补充更详细的介绍说明。"}
              </p>
            </div>

            <div className="rounded-[2rem] border border-stone-700/80 bg-[rgba(28,22,18,0.82)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.28)] backdrop-blur-[2px]">
              <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                Current Scope
              </p>
              <div className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
                <p>这是相册详情页第一版，已经接入了真实本地相册图片数据。</p>
                <p>后续会在这个页面基础上继续演进成胶卷式展示结构。</p>
              </div>
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="rounded-[2rem] border border-stone-700/80 bg-[rgba(28,22,18,0.82)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.24)] backdrop-blur-[2px]">
              <div className="aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-stone-700/70 bg-[rgba(16,13,11,0.88)]">
                {album.coverImageUrl ? (
                  <img
                    src={album.coverImageUrl}
                    alt={album.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm uppercase tracking-[0.3em] text-stone-500">
                    No Cover
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-8">
              <section className="rounded-[2rem] border border-stone-700/80 bg-[rgba(28,22,18,0.82)] p-8 shadow-[0_14px_44px_rgba(0,0,0,0.24)] backdrop-blur-[2px]">
                <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                  Album Metadata
                </p>
                <dl className="mt-6 grid gap-4 text-sm text-stone-200 sm:grid-cols-2">
                  <div>
                    <dt className="text-stone-500">Slug</dt>
                    <dd>{album.slug}</dd>
                  </div>
                  <div>
                    <dt className="text-stone-500">Photo Count</dt>
                    <dd>{album.photoLinks.length}</dd>
                  </div>
                  <div>
                    <dt className="text-stone-500">Source URL</dt>
                    <dd className="break-all">
                      {album.sourceUrl ?? "No source url"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-stone-500">Cover Image</dt>
                    <dd className="break-all">
                      {album.coverImageUrl ?? "No cover image"}
                    </dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-[2rem] border border-stone-700/80 bg-[rgba(45,36,29,0.82)] p-8 text-stone-100 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-[2px]">
                <p className="text-xs uppercase tracking-[0.35em] text-stone-400">
                  Film Strip Direction
                </p>
                <p className="mt-4 text-sm leading-7 text-stone-300">
                  这一版先把真实相册详情和照片顺序打通。下一步会在这里正式进入“一个相册 = 一卷胶卷”的视觉实现。
                </p>
              </section>
            </div>
          </section>

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

              <div className="mt-5 grid gap-3">
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
                  <h2 className="mt-2 text-3xl font-semibold text-stone-50">
                    Ordered Frames
                  </h2>
                </div>
                <div className="text-sm text-stone-400">
                  {album.photoLinks.length} photos
                </div>
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
