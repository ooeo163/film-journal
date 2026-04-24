import { cookies } from "next/headers";
import { AccountShell } from "@/components/account-shell";
import { prisma } from "@/lib/prisma";

export default async function MyJournalsPage() {
  const cookieStore = await cookies();
  const userName = cookieStore.get("fj_user_name")?.value || null;
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
    take: 24,
  });

  return (
    <AccountShell
      title="我的文章"
      description="这里会承接当前账号的文章草稿、已发布文章和待审核内容。"
      userName={userName}
    >
      <div className="space-y-6">
        <section className="rounded-[1.6rem] border border-stone-700/70 bg-[rgba(36,29,24,0.8)] p-5 text-sm leading-7 text-stone-300">
          当前先接入站点内可管理的真实文章数据，作为“我的文章”第一版。后续补充文章作者关系后，再细分到当前账号名下。
        </section>

        {journals.length > 0 ? (
          <div className="grid gap-4">
            {journals.map((journal) => (
              <article
                key={journal.id}
                className="rounded-[1.6rem] border border-stone-700/70 bg-[rgba(28,22,18,0.72)] p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <a
                      href={`/journals/${journal.slug}`}
                      className="text-xl font-semibold text-stone-50 transition-colors hover:text-stone-300"
                    >
                      {journal.title}
                    </a>
                    <p className="mt-2 text-sm leading-7 text-stone-300">
                      {journal.excerpt ?? "当前文章还没有补充摘要。"}
                    </p>
                  </div>
                  <span className="rounded-full border border-stone-700/70 px-3 py-1 text-xs uppercase tracking-[0.25em] text-stone-400">
                    Published
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-stone-400">
                  <span>{journal.slug}</span>
                  <span>
                    {journal.publishedAt
                      ? new Intl.DateTimeFormat("zh-CN", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        }).format(journal.publishedAt)
                      : "Unscheduled"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.8rem] border border-dashed border-stone-600/70 bg-[rgba(28,22,18,0.72)] p-8 text-base leading-8 text-stone-300">
            当前还没有已发布文章。后续录入内容后，这里会显示真实文章列表。
          </div>
        )}
      </div>
    </AccountShell>
  );
}
