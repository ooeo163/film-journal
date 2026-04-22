import { prisma } from "@/lib/prisma";

export default async function AlbumsPage() {
  const albums = await prisma.album.findMany({
    where: {
      isPublished: true,
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
    },
  });

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
          <section className="grid gap-8 border-b border-stone-700/70 pb-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.45em] text-stone-500">
                Albums
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-stone-50 md:text-5xl">
                相册列表
              </h1>
              <p className="max-w-2xl text-base leading-8 text-stone-300">
                当前这一版已经接入了你本地相册目录。每个文件夹作为一个相册导入，
                第一张图片作为封面，图片暂时直接走本地原图路径，后续再切到 COS 和多尺寸图。
              </p>
            </div>

            <div className="rounded-[2rem] border border-stone-700/80 bg-[rgba(28,22,18,0.82)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.28)] backdrop-blur-[2px]">
              <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                Current Scope
              </p>
              <div className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
                <p>当前已从本地目录导入真实相册数据。</p>
                <p>下一步会继续进入相册详情页和胶卷式展示主线。</p>
              </div>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {albums.length > 0 ? (
              albums.map((album) => (
                <article
                  key={album.id}
                  className="overflow-hidden rounded-[2rem] border border-stone-700/80 bg-[rgba(28,22,18,0.82)] shadow-[0_14px_44px_rgba(0,0,0,0.24)] backdrop-blur-[2px]"
                >
                  <div className="aspect-[4/3] border-b border-stone-700/70 bg-[rgba(16,13,11,0.88)]">
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

                  <div className="space-y-4 p-6">
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                        Imported Album
                      </p>
                      <a
                        className="inline-block transition-colors hover:text-stone-300"
                        href={`/albums/${album.slug}`}
                      >
                        <h2 className="text-2xl font-semibold text-stone-50">
                          {album.title}
                        </h2>
                      </a>
                      <p className="text-sm leading-7 text-stone-300">
                        {album.description ?? "暂无简介，后续会在相册详情页里补更完整的描述。"}
                      </p>
                    </div>

                    <dl className="grid gap-3 text-sm text-stone-200 sm:grid-cols-2">
                      <div>
                        <dt className="text-stone-500">Slug</dt>
                        <dd>{album.slug}</dd>
                      </div>
                      <div>
                        <dt className="text-stone-500">Photo Count</dt>
                        <dd>{album._count.photoLinks}</dd>
                      </div>
                    </dl>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[2rem] border border-dashed border-stone-600/70 bg-[rgba(28,22,18,0.82)] p-8 text-base leading-8 text-stone-300 backdrop-blur-[2px]">
                当前还没有已发布相册。
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
