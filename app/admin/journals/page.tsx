import Link from "next/link";
import { AdminBulkDeleteButton } from "@/components/admin-bulk-delete-button";
import { AdminDataGrid } from "@/components/admin-data-grid";
import { AdminDeleteButton } from "@/components/admin-delete-button";
import { AdminGridFilters } from "@/components/admin-grid-filters";
import { AdminGridSelectTools } from "@/components/admin-grid-select-tools";
import { AdminNotice } from "@/components/admin-notice";
import { AdminShell } from "@/components/admin-shell";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type AdminJournalsPageProps = {
  searchParams: Promise<{
    created?: string;
    updated?: string;
    deleted?: string;
    page?: string;
    pageSize?: string;
    q?: string;
    status?: string;
  }>;
};

export default async function AdminJournalsPage({
  searchParams,
}: AdminJournalsPageProps) {
  const { created, updated, deleted, page, pageSize: pageSizeParam, q, status } =
    await searchParams;
  const currentPage = Math.max(1, Number(page || "1") || 1);
  const requestedPageSize = Number(pageSizeParam || "20");
  const pageSize = [10, 20, 50, 100].includes(requestedPageSize)
    ? requestedPageSize
    : 20;
  const searchQuery = q?.trim() ?? "";
  const statusFilter = status === "published" || status === "draft" ? status : "all";
  const where: Prisma.JournalWhereInput = {
    ...(statusFilter === "published"
      ? { isPublished: true }
      : statusFilter === "draft"
        ? { isPublished: false }
        : {}),
    ...(searchQuery
      ? {
          OR: [
            { title: { contains: searchQuery, mode: "insensitive" } },
            { slug: { contains: searchQuery, mode: "insensitive" } },
            { excerpt: { contains: searchQuery, mode: "insensitive" } },
          ],
        }
      : {}),
  };
  const [journals, totalCount, publishedCount, draftCount] = await Promise.all([
    prisma.journal.findMany({
      where,
      orderBy: [
        {
          publishedAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.journal.count({ where }),
    prisma.journal.count({
      where: {
        isPublished: true,
      },
    }),
    prisma.journal.count({
      where: {
        isPublished: false,
      },
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <AdminShell
      title="文章管理"
      description="这一页先承接真实文章数据，方便你从后台检查标题、摘要、发布时间和公开状态。后续会继续接草稿编辑、封面图、审核流和发布时间管理。"
      currentPath="/admin/journals"
      actions={
        <>
          <Link
            href="/admin/journals/new"
            className="border border-stone-700 bg-[#2a241f] px-4 py-2 text-stone-100 transition-colors hover:border-stone-400 hover:bg-[#342c26]"
          >
            新建文章
          </Link>
          <Link
            href="/admin"
            className="border border-stone-700 bg-[#1d1916] px-4 py-2 text-stone-300 transition-colors hover:border-stone-500 hover:text-white"
          >
            返回后台
          </Link>
          <Link
            href="/journals"
            className="border border-stone-700 bg-[#1d1916] px-4 py-2 text-stone-300 transition-colors hover:border-stone-500 hover:text-white"
          >
            查看前台文章
          </Link>
        </>
      }
      stats={
        <>
          <article className="border border-stone-700 bg-[#231d18] px-5 py-4 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
            <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
              当前列表
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-stone-50">
              {journals.length}
            </p>
            <p className="mt-2 text-sm text-stone-500">当前已加载最近 60 篇文章。</p>
          </article>

          <article className="border border-stone-700 bg-[#231d18] px-5 py-4 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
            <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
              已发布
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-stone-50">
              {publishedCount}
            </p>
            <p className="mt-2 text-sm text-stone-500">当前公开可见的文章数量。</p>
          </article>

          <article className="border border-stone-700 bg-[#231d18] px-5 py-4 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
            <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
              未发布
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-stone-50">
              {draftCount}
            </p>
            <p className="mt-2 text-sm text-stone-500">后续会作为草稿和审核流的入口。</p>
          </article>
        </>
      }
    >
      {created || updated || deleted ? (
        <AdminNotice>
          {created
            ? `文章已创建：${created}`
            : updated
              ? "文章已更新。"
              : "文章已删除。"}
        </AdminNotice>
      ) : null}

      <AdminDataGrid
        gridId="admin-journals-grid"
        title="文章列表"
        hint="后续补草稿编辑 / 发布计划 / 封面图"
        filters={
          <AdminGridFilters
            basePath="/admin/journals"
            defaultQuery={searchQuery}
            defaultStatus={statusFilter}
            defaultPageSize={pageSize}
            searchPlaceholder="搜索标题、slug、摘要"
          />
        }
        bulkActions={
          <>
            <AdminGridSelectTools gridId="admin-journals-grid" />
            <AdminBulkDeleteButton
              gridId="admin-journals-grid"
              endpoint="/api/admin/journals/batch"
              confirmText="确定批量删除选中的文章吗？删除后将无法从前台访问。"
            />
          </>
        }
        columns={[
          { label: "选择", className: "w-[72px]" },
          { label: "标题" },
          { label: "slug" },
          { label: "摘要" },
          { label: "发布时间" },
          { label: "状态" },
          { label: "操作" },
        ]}
        emptyText="当前还没有文章数据。后续录入内容后，这里会显示真实列表。"
        hasRows={journals.length > 0}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={pageSize}
        basePath="/admin/journals"
        searchParams={{
          created,
          updated,
          deleted,
          q: searchQuery || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          pageSize: pageSize !== 20 ? String(pageSize) : undefined,
        }}
      >
        {journals.map((journal) => (
          <tr key={journal.id} className="align-top text-stone-300">
            <td className="border-b border-stone-800 px-5 py-4">
              <input
                type="checkbox"
                name="selectedIds"
                value={journal.id}
                className="h-4 w-4"
                aria-label={`选择文章 ${journal.title}`}
              />
            </td>
            <td className="border-b border-stone-800 px-5 py-4">
              <div className="min-w-[220px]">
                <div className="font-medium text-stone-100">{journal.title}</div>
              </div>
            </td>
            <td className="border-b border-stone-800 px-5 py-4 text-stone-400">
              {journal.slug}
            </td>
            <td className="border-b border-stone-800 px-5 py-4 text-stone-400">
              <div className="max-w-[320px] leading-7">
                {journal.excerpt ?? "暂无摘要"}
              </div>
            </td>
            <td className="border-b border-stone-800 px-5 py-4 text-stone-400">
              {journal.publishedAt
                ? new Intl.DateTimeFormat("zh-CN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  }).format(journal.publishedAt)
                : "-"}
            </td>
            <td className="border-b border-stone-800 px-5 py-4">
              <span
                className={
                  journal.isPublished
                    ? "inline-flex border border-emerald-700/40 bg-emerald-950/30 px-2 py-1 text-xs uppercase tracking-[0.16em] text-emerald-300"
                    : "inline-flex border border-amber-700/40 bg-amber-950/20 px-2 py-1 text-xs uppercase tracking-[0.16em] text-amber-300"
                }
              >
                {journal.isPublished ? "Published" : "Draft"}
              </span>
            </td>
            <td className="border-b border-stone-800 px-5 py-4">
              <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em]">
                <Link
                  href={`/admin/journals/${journal.id}`}
                  className="text-stone-300 transition-colors hover:text-white"
                >
                  编辑
                </Link>
                <Link
                  href={`/journals/${journal.slug}`}
                  className="text-stone-300 transition-colors hover:text-white"
                >
                  查看
                </Link>
                <AdminDeleteButton
                  endpoint={`/api/admin/journals/${journal.id}`}
                  confirmText={`确定删除文章「${journal.title}」吗？删除后将无法从前台访问。`}
                />
              </div>
            </td>
          </tr>
        ))}
      </AdminDataGrid>
    </AdminShell>
  );
}
