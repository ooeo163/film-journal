import Link from "next/link";
import { prisma } from "@/lib/prisma";

export async function HomeArchiveContent() {
  const publishedPhotos = await prisma.photo.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      shotAt: "desc",
    },
    take: 3,
  });

  const latestPhoto = publishedPhotos[0] ?? null;
  const [albumCount, journalCount] = await Promise.all([
    prisma.album.count({
      where: {
        isPublished: true,
      },
    }),
    prisma.journal.count({
      where: {
        isPublished: true,
      },
    }),
  ]);

  return (
    <div className="relative z-10 px-6 py-14">
      <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-12 px-0">
        <section className="grid gap-10 border-b border-stone-700/70 pb-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.45em] text-stone-500">
              Front Archive
            </p>
            <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-stone-50 md:text-5xl">
              胶片照片、相册与摄影记录的长期档案。
            </h2>
            <p className="max-w-2xl text-base leading-8 text-stone-300 md:text-lg">
              这里会逐步承载精选照片、推荐相册、最新文章和时间轴入口。当前先完成前台骨架，
              再继续沿着文档里的产品计划推进。
            </p>
          </div>

          <div className="rounded-[2rem] border border-stone-700/80 bg-[rgba(28,22,18,0.8)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.28)] backdrop-blur-[2px]">
            <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
              Works Archive
            </p>
            <div className="mt-4 grid gap-4 text-sm leading-7 text-stone-300 sm:grid-cols-3">
              <div className="rounded-[1.2rem] border border-stone-700/70 bg-[rgba(17,16,15,0.54)] p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                  Photos
                </p>
                <p className="mt-2 text-2xl font-semibold text-stone-50">
                  {publishedPhotos.length}
                </p>
                <p className="mt-2 text-xs text-stone-400">当前首页精选条目</p>
              </div>
              <div className="rounded-[1.2rem] border border-stone-700/70 bg-[rgba(17,16,15,0.54)] p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                  Albums
                </p>
                <p className="mt-2 text-2xl font-semibold text-stone-50">
                  {albumCount}
                </p>
                <p className="mt-2 text-xs text-stone-400">已发布相册总数</p>
              </div>
              <div className="rounded-[1.2rem] border border-stone-700/70 bg-[rgba(17,16,15,0.54)] p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                  Journals
                </p>
                <p className="mt-2 text-2xl font-semibold text-stone-50">
                  {journalCount}
                </p>
                <p className="mt-2 text-xs text-stone-400">已发布文章总数</p>
              </div>
            </div>
          </div>
        </section>

        {latestPhoto ? (
          <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2rem] border border-stone-700/80 bg-[rgba(36,28,23,0.84)] p-8 text-stone-100 shadow-[0_18px_50px_rgba(0,0,0,0.32)] backdrop-blur-[2px]">
              <p className="text-xs uppercase tracking-[0.35em] text-stone-400">
                Featured Photo
              </p>
              <h2 className="mt-4 text-4xl font-semibold">{latestPhoto.title}</h2>
              <p className="mt-4 text-base leading-8 text-stone-300">
                {latestPhoto.description ?? "No description yet."}
              </p>
            </div>

            <div className="rounded-[2rem] border border-stone-700/80 bg-[rgba(28,22,18,0.82)] p-8 shadow-[0_14px_44px_rgba(0,0,0,0.24)] backdrop-blur-[2px]">
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                    Photo Metadata
                  </p>
                  <p className="text-sm leading-7 text-stone-300">
                    当前先展示一条已发布照片，用来验证数据库、页面和内容结构已经贯通。
                  </p>
                </div>

                <dl className="grid gap-4 text-sm text-stone-200 sm:grid-cols-2">
                  <div>
                    <dt className="text-stone-400">Slug</dt>
                    <dd>{latestPhoto.slug}</dd>
                  </div>
                  <div>
                    <dt className="text-stone-400">Location</dt>
                    <dd>{latestPhoto.location ?? "Unknown"}</dd>
                  </div>
                  <div>
                    <dt className="text-stone-400">Camera</dt>
                    <dd>{latestPhoto.camera ?? "Unknown"}</dd>
                  </div>
                  <div>
                    <dt className="text-stone-400">Lens</dt>
                    <dd>{latestPhoto.lens ?? "Unknown"}</dd>
                  </div>
                  <div>
                    <dt className="text-stone-400">Film</dt>
                    <dd>{latestPhoto.filmStock ?? "Unknown"}</dd>
                  </div>
                  <div>
                    <dt className="text-stone-400">Image URL</dt>
                    <dd className="break-all">{latestPhoto.imageUrl}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>
        ) : (
          <section className="rounded-[2rem] border border-dashed border-stone-600/70 bg-[rgba(28,22,18,0.82)] p-8 backdrop-blur-[2px]">
            <p className="text-base leading-7 text-stone-300">
              还没有已发布照片。后面接入上传和内容管理后，这里会显示精选内容。
            </p>
          </section>
        )}

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-stone-700/80 bg-[rgba(28,22,18,0.82)] p-8 shadow-[0_14px_44px_rgba(0,0,0,0.24)] backdrop-blur-[2px]">
            <div className="flex items-end justify-between gap-4 border-b border-stone-700/70 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                  精选照片
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-stone-50">
                  Latest Published Photos
                </h3>
              </div>
              <Link
                className="text-sm text-stone-400 transition-colors hover:text-stone-50"
                href="/photos"
              >
                查看全部
              </Link>
            </div>

            <div className="mt-6 grid gap-4">
              {publishedPhotos.length > 0 ? (
                publishedPhotos.map((photo, index) => (
                  <article
                    key={photo.id}
                    className="grid gap-4 rounded-2xl border border-stone-700/70 bg-[rgba(36,29,24,0.76)] p-5 md:grid-cols-[80px_1fr]"
                  >
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-stone-600/70 bg-[#16120f] text-sm text-stone-300">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-semibold text-stone-50">
                        {photo.title}
                      </h4>
                      <p className="text-sm leading-7 text-stone-300">
                        {photo.description ?? "暂无描述，后续会在详情页中完善内容说明。"}
                      </p>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-400">
                        <span>{photo.location ?? "Unknown location"}</span>
                        <span>{photo.camera ?? "Unknown camera"}</span>
                        <span>{photo.filmStock ?? "Unknown film"}</span>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-stone-600/70 p-5 text-sm leading-7 text-stone-300">
                  还没有已发布照片，后续这里会展示最新或精选的照片条目。
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-8">
            <section className="rounded-[2rem] border border-stone-700/80 bg-[rgba(45,36,29,0.82)] p-8 text-stone-100 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-[2px]">
              <p className="text-xs uppercase tracking-[0.35em] text-stone-400">
                推荐相册
              </p>
              <h3 className="mt-3 text-2xl font-semibold">Albums Coming Next</h3>
              <p className="mt-4 text-sm leading-7 text-stone-300">
                相册页会是整站最有识别度的页面。后续将按“一个相册 = 一卷胶卷”的概念，
                实现从右侧暗盒中拉开的胶片展示结构。
              </p>
            </section>

            <section className="rounded-[2rem] border border-stone-700/80 bg-[rgba(28,22,18,0.82)] p-8 shadow-[0_14px_44px_rgba(0,0,0,0.24)] backdrop-blur-[2px]">
              <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                最新文章
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-stone-50">
                Journals Placeholder
              </h3>
              <p className="mt-4 text-sm leading-7 text-stone-300">
                文章区会承载摄影日记、拍摄记录、胶卷与相机心得。当前阶段先保留内容入口，
                后续在文章模型和页面落地后接入真实数据。
              </p>
            </section>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-3">
          <Link
            href="/photos"
            className="rounded-[2rem] border border-stone-700/80 bg-[rgba(28,22,18,0.82)] p-8 shadow-[0_14px_44px_rgba(0,0,0,0.24)] backdrop-blur-[2px] transition-transform hover:-translate-y-1"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
              Browse
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-stone-50">照片</h3>
            <p className="mt-4 text-sm leading-7 text-stone-300">
              进入照片列表，按时间继续浏览已发布的胶片照片。
            </p>
          </Link>

          <Link
            href="/albums"
            className="rounded-[2rem] border border-stone-700/80 bg-[rgba(36,29,24,0.8)] p-8 shadow-[0_14px_44px_rgba(0,0,0,0.24)] backdrop-blur-[2px] transition-transform hover:-translate-y-1"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
              Browse
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-stone-50">相册</h3>
            <p className="mt-4 text-sm leading-7 text-stone-300">
              进入胶卷式相册浏览页，按相册组织回看一组照片。
            </p>
          </Link>

          <Link
            href="/journals"
            className="rounded-[2rem] border border-stone-700/80 bg-[rgba(28,22,18,0.82)] p-8 shadow-[0_14px_44px_rgba(0,0,0,0.24)] backdrop-blur-[2px] transition-transform hover:-translate-y-1"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
              Browse
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-stone-50">文章</h3>
            <p className="mt-4 text-sm leading-7 text-stone-300">
              进入摄影记录与文字内容，查看日记、器材和胶卷心得。
            </p>
          </Link>
        </section>

        <section className="rounded-[2rem] border border-stone-700/70 bg-[rgba(17,16,15,0.84)] px-8 py-10 text-stone-100 shadow-[0_18px_50px_rgba(17,16,15,0.22)] backdrop-blur-[2px]">
          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-end">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                时间轴入口
              </p>
              <h3 className="text-3xl font-semibold">Timeline Will Tie Everything Together</h3>
              <p className="max-w-2xl text-sm leading-7 text-stone-300">
                后续时间轴页会按年与月组织照片和文章，让这个网站不仅能看作品，也能看见拍摄与记录的时间脉络。
              </p>
            </div>

            <div className="text-sm leading-7 text-stone-400">
              计划中的主线：
              照片 / 相册 / 文章 / 胶卷 / 相机 / 时间轴
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
