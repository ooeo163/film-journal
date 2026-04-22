import { prisma } from "@/lib/prisma";

export default async function Home() {
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

  return (
    <main className="relative text-stone-100">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/homepage-background.jpg')",
        }}
      />
      <div className="fixed inset-0 bg-[linear-gradient(90deg,rgba(9,8,7,0.84)_0%,rgba(12,10,8,0.74)_36%,rgba(16,13,10,0.52)_65%,rgba(10,9,8,0.76)_100%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(7,6,5,0.24)_58%,rgba(5,4,4,0.68)_100%)]" />
      <div className="fixed inset-0 pointer-events-none opacity-30 [background-image:radial-gradient(rgba(220,202,174,0.14)_0.8px,transparent_0.8px)] [background-size:18px_18px]" />

      <div className="relative z-10">
        <section className="relative min-h-screen overflow-hidden">

          <div className="relative mx-auto flex min-h-screen w-full max-w-[1480px] flex-col justify-between px-5 pb-10 pt-32 md:px-8 xl:px-10">
            <div className="grid flex-1 items-center gap-10 lg:grid-cols-[0.98fr_1.02fr]">
              <div className="max-w-[760px] space-y-7">
                <p className="text-xs uppercase tracking-[0.45em] text-stone-400">
                  Capturing Time, Preserving Stories.
                </p>
                <h1 className="font-serif text-5xl leading-[0.92] tracking-[0.08em] text-[#e9ddca] md:text-7xl">
                  PHOTOGRAPHS
                  <br />
                  AS MEMORIES
                </h1>
                <div className="max-w-xl space-y-3 text-base leading-8 text-stone-300 md:text-lg">
                  <p>一个围绕胶片摄影建立的长期档案与展示网站。</p>
                  <p>照片会沉淀成相册、文章、时间轴，以及一整套更完整的记录系统。</p>
                </div>
                <div className="pt-4">
                  <a
                    className="inline-flex items-center gap-4 border-b border-stone-400 pb-3 text-sm uppercase tracking-[0.35em] text-stone-200 transition-colors hover:text-white"
                    href="#home-content"
                  >
                    Explore Works
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>

              <div className="hidden lg:flex lg:justify-end">
                <div className="w-full max-w-[420px] rounded-[1.75rem] border border-stone-700/70 bg-[rgba(11,10,9,0.34)] p-7 backdrop-blur-[2px]">
                  <p className="text-sm leading-8 text-stone-300">
                    Photography is a way of feeling, touching, of loving. What you have caught on film is captured forever.
                  </p>
                  <p className="mt-6 text-sm uppercase tracking-[0.3em] text-stone-500">
                    Film Journal
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-end justify-between gap-6 pt-12 text-stone-500">
              <div className="hidden md:block">
                <p className="text-xs uppercase tracking-[0.4em]">Scroll To Explore</p>
              </div>
              <div className="text-right text-xs uppercase tracking-[0.35em]">
                Archive of photographs, albums and journals
              </div>
            </div>
          </div>
        </section>

        <div id="home-content" className="px-6 py-14">
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
                首页将逐步承载精选照片、推荐相册、最新文章和时间轴入口。当前先完成前台骨架，
                再继续沿着文档里的产品计划推进。
              </p>
            </div>

            <div className="rounded-[2rem] border border-stone-700/80 bg-[rgba(28,22,18,0.8)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.28)] backdrop-blur-[2px]">
              <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                Home Structure
              </p>
              <div className="mt-4 space-y-4 text-sm leading-7 text-stone-300">
                <p>首页将逐步承载精选照片、推荐相册、最新文章和时间轴入口。</p>
                <p>当前先完成前台骨架和数据库联通，后续继续补内容模块。</p>
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
                      当前首页先展示一条已发布照片，用来验证数据库、页面和内容结构已经贯通。
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
                <a
                  className="text-sm text-stone-400 transition-colors hover:text-stone-50"
                  href="/photos"
                >
                  查看全部
                </a>
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
      </div>
    </main>
  );
}
