import { prisma } from "@/lib/prisma";

export default async function JournalsPage() {
  const journals = await prisma.journal.findMany({
    where: {
      isPublished: true,
    },
    orderBy: [
      {
        publishedAt: "desc",
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
                Journals
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-stone-50 md:text-5xl">
                摄影文章与记录
              </h1>
              <p className="max-w-2xl text-base leading-8 text-stone-300">
                这里会承载拍摄日记、器材记录、胶卷心得和更完整的摄影文字内容。
                这一版先把文章主线结构立起来，后续再补真实内容与排版细节。
              </p>
            </div>

            <div className="rounded-[2rem] border border-stone-700/80 bg-[rgba(28,22,18,0.82)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.28)] backdrop-blur-[2px]">
              <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                Current Scope
              </p>
              <div className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
                <p>文章主线已经接入真实数据库结构。</p>
                <p>当前先完成列表页和详情页骨架，后续再补内容录入与富文本展示。</p>
              </div>
            </div>
          </section>

          <section className="grid gap-5">
            {journals.length > 0 ? (
              journals.map((journal, index) => (
                <article
                  key={journal.id}
                  className="grid gap-5 rounded-[2rem] border border-stone-700/80 bg-[rgba(28,22,18,0.82)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.24)] backdrop-blur-[2px] md:grid-cols-[120px_1fr]"
                >
                  <div className="flex min-h-[120px] items-center justify-center rounded-[1.5rem] border border-stone-700/70 bg-[rgba(16,13,11,0.88)] text-sm uppercase tracking-[0.3em] text-stone-400">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                        Published Journal
                      </p>
                      <a
                        className="inline-block transition-colors hover:text-stone-300"
                        href={`/journals/${journal.slug}`}
                      >
                        <h2 className="text-3xl font-semibold text-stone-50">
                          {journal.title}
                        </h2>
                      </a>
                      <p className="text-base leading-8 text-stone-300">
                        {journal.excerpt ?? "暂无摘要，后续会在文章详情页中补足更完整的引导内容。"}
                      </p>
                    </div>

                    <dl className="grid gap-4 text-sm text-stone-200 sm:grid-cols-2 xl:grid-cols-3">
                      <div>
                        <dt className="text-stone-500">Slug</dt>
                        <dd>{journal.slug}</dd>
                      </div>
                      <div>
                        <dt className="text-stone-500">Published At</dt>
                        <dd>
                          {journal.publishedAt
                            ? new Intl.DateTimeFormat("zh-CN", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              }).format(journal.publishedAt)
                            : "Unscheduled"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-stone-500">Cover Image</dt>
                        <dd>{journal.coverImageUrl ? "Available" : "None"}</dd>
                      </div>
                    </dl>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[2rem] border border-dashed border-stone-600/70 bg-[rgba(28,22,18,0.82)] p-8 text-base leading-8 text-stone-300 backdrop-blur-[2px]">
                当前还没有已发布文章。下一步会补 `Journal` 内容录入，然后这里就会出现真实文章列表。
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
