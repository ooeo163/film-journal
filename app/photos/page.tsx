import { prisma } from "@/lib/prisma";

export default async function PhotosPage() {
  const photos = await prisma.photo.findMany({
    where: {
      isPublished: true,
    },
    orderBy: [
      {
        shotAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  return (
    <main className="relative text-stone-100">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/homepage-background.jpg')",
        }}
      />
      <div className="fixed inset-0 bg-[linear-gradient(90deg,rgba(9,8,7,0.88)_0%,rgba(13,11,9,0.78)_36%,rgba(14,12,10,0.7)_65%,rgba(10,9,8,0.84)_100%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(7,6,5,0.26)_58%,rgba(5,4,4,0.72)_100%)]" />

      <div className="relative z-10 px-6 py-28">
        <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-10">
          <section className="grid gap-8 border-b border-stone-700/70 pb-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.45em] text-stone-500">
                Photos
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-stone-50 md:text-5xl">
                胶片照片列表
              </h1>
              <p className="max-w-2xl text-base leading-8 text-stone-300">
                这里会承载按时间沉淀下来的照片内容。当前第一版先完成最小可用列表，
                后续再逐步补标签、相册、胶卷、相机和地点筛选。
              </p>
            </div>

            <div className="rounded-[2rem] border border-stone-700/80 bg-[rgba(28,22,18,0.82)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.28)] backdrop-blur-[2px]">
              <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                Current Scope
              </p>
              <div className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
                <p>已接通数据库真实照片数据。</p>
                <p>当前展示标题、描述、地点、相机、镜头和胶卷信息。</p>
              </div>
            </div>
          </section>

          <section className="grid gap-5">
            {photos.length > 0 ? (
              photos.map((photo, index) => (
                <article
                  key={photo.id}
                  className="grid gap-5 rounded-[2rem] border border-stone-700/80 bg-[rgba(28,22,18,0.82)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.24)] backdrop-blur-[2px] md:grid-cols-[120px_1fr]"
                >
                  <div className="flex min-h-[120px] items-center justify-center rounded-[1.5rem] border border-stone-700/70 bg-[rgba(16,13,11,0.88)] text-sm uppercase tracking-[0.3em] text-stone-400">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                        Published Photo
                      </p>
                      <a
                        className="inline-block transition-colors hover:text-stone-300"
                        href={`/photos/${photo.slug}`}
                      >
                        <h2 className="text-3xl font-semibold text-stone-50">
                          {photo.title}
                        </h2>
                      </a>
                      <p className="text-base leading-8 text-stone-300">
                        {photo.description ?? "暂无描述，后续会在照片详情页中补足更多信息。"}
                      </p>
                    </div>

                    <dl className="grid gap-4 text-sm text-stone-200 sm:grid-cols-2 xl:grid-cols-3">
                      <div>
                        <dt className="text-stone-500">Slug</dt>
                        <dd>{photo.slug}</dd>
                      </div>
                      <div>
                        <dt className="text-stone-500">Location</dt>
                        <dd>{photo.location ?? "Unknown"}</dd>
                      </div>
                      <div>
                        <dt className="text-stone-500">Camera</dt>
                        <dd>{photo.camera ?? "Unknown"}</dd>
                      </div>
                      <div>
                        <dt className="text-stone-500">Lens</dt>
                        <dd>{photo.lens ?? "Unknown"}</dd>
                      </div>
                      <div>
                        <dt className="text-stone-500">Film</dt>
                        <dd>{photo.filmStock ?? "Unknown"}</dd>
                      </div>
                      <div>
                        <dt className="text-stone-500">Shot At</dt>
                        <dd>
                          {photo.shotAt
                            ? new Intl.DateTimeFormat("zh-CN", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              }).format(photo.shotAt)
                            : "Unknown"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[2rem] border border-dashed border-stone-600/70 bg-[rgba(28,22,18,0.82)] p-8 text-base leading-8 text-stone-300 backdrop-blur-[2px]">
                当前还没有已发布照片。后续上传和审核流程接通后，这里会显示完整照片列表。
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
