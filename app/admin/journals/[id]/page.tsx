import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminDeleteButton } from "@/components/admin-delete-button";
import { AdminShell } from "@/components/admin-shell";
import { AdminEditJournalForm } from "@/components/admin-edit-journal-form";
import { prisma } from "@/lib/prisma";

type AdminEditJournalPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminEditJournalPage({
  params,
}: AdminEditJournalPageProps) {
  const { id } = await params;

  const journal = await prisma.journal.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      coverImageUrl: true,
      publishedAt: true,
      isPublished: true,
    },
  });

  if (!journal) {
    notFound();
  }

  return (
    <AdminShell
      title={`编辑文章：${journal.title}`}
      description="当前先支持文章的基础编辑，包含标题、slug、摘要、正文、发布时间、封面和公开状态。"
      currentPath="/admin/journals"
      actions={
        <>
          <Link
            href="/admin/journals"
            className="border border-stone-700 bg-[#1d1916] px-4 py-2 text-stone-300 transition-colors hover:border-stone-500 hover:text-white"
          >
            返回文章管理
          </Link>
          <AdminDeleteButton
            endpoint={`/api/admin/journals/${journal.id}`}
            redirectTo="/admin/journals"
            confirmText={`确定删除文章「${journal.title}」吗？删除后将无法从前台访问。`}
            className="border border-red-900/50 bg-red-950/20 px-4 py-2 text-sm text-red-200 transition-colors hover:border-red-700 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </>
      }
      stats={
        <>
          <article className="border border-stone-700 bg-[#231d18] px-5 py-4 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
            <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
              slug
            </p>
            <p className="mt-3 text-sm font-medium text-stone-100">{journal.slug}</p>
          </article>

          <article className="border border-stone-700 bg-[#231d18] px-5 py-4 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
            <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
              发布时间
            </p>
            <p className="mt-3 text-sm font-medium text-stone-100">
              {journal.publishedAt
                ? new Intl.DateTimeFormat("zh-CN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  }).format(journal.publishedAt)
                : "-"}
            </p>
          </article>

          <article className="border border-stone-700 bg-[#231d18] px-5 py-4 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
            <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
              状态
            </p>
            <p className="mt-3 text-sm font-medium text-stone-100">
              {journal.isPublished ? "Published" : "Draft"}
            </p>
          </article>
        </>
      }
    >
      <section className="border border-stone-700 bg-[#221d18] shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
        <div className="border-b border-stone-700 px-5 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-300">
            文章内容
          </h2>
        </div>

        <AdminEditJournalForm
          journal={{
            ...journal,
            publishedAt: journal.publishedAt
              ? journal.publishedAt.toISOString().slice(0, 10)
              : "",
          }}
        />
      </section>
    </AdminShell>
  );
}
