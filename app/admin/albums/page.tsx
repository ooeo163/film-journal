import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminBulkDeleteButton } from "@/components/admin-bulk-delete-button";
import { AdminDataGrid } from "@/components/admin-data-grid";
import { AdminDeleteButton } from "@/components/admin-delete-button";
import { AdminGridFilters } from "@/components/admin-grid-filters";
import { AdminGridSelectTools } from "@/components/admin-grid-select-tools";
import { AdminNotice } from "@/components/admin-notice";
import { AdminShell } from "@/components/admin-shell";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-admin";
import { Prisma } from "@prisma/client";

type AdminAlbumsPageProps = {
  searchParams: Promise<{
    created?: string;
    deleted?: string;
    page?: string;
    pageSize?: string;
    q?: string;
    status?: string;
  }>;
};

export default async function AdminAlbumsPage({
  searchParams,
}: AdminAlbumsPageProps) {
  const user = await requireAuth();
  if (!user) {
    redirect("/login");
  }

  const isSystemAdmin = user.role === "system_admin";
  const ownershipFilter = isSystemAdmin ? {} : { creatorId: user.id };
  const { created, deleted, page, pageSize: pageSizeParam, q, status } =
    await searchParams;
  const currentPage = Math.max(1, Number(page || "1") || 1);
  const requestedPageSize = Number(pageSizeParam || "20");
  const pageSize = [10, 20, 50, 100].includes(requestedPageSize)
    ? requestedPageSize
    : 20;
  const searchQuery = q?.trim() ?? "";
  const statusFilter = status === "published" || status === "draft" ? status : "all";
  const where: Prisma.AlbumWhereInput = {
    ...ownershipFilter,
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
            { description: { contains: searchQuery, mode: "insensitive" } },
          ],
        }
      : {}),
  };
  const [albums, totalCount, publishedCount, totalFrames] = await Promise.all([
    prisma.album.findMany({
      where,
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
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.album.count({ where }),
    prisma.album.count({
      where: {
        ...ownershipFilter,
        isPublished: true,
      },
    }),
    prisma.album.aggregate({
      where: ownershipFilter,
      _sum: {
        imageCount: true,
      },
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <AdminShell
      title="相册管理"
      description="这一页先承接真实相册数据，方便你从后台检查相册数量、片数、封面和公开状态。后续会继续接排序、封面调整、重新导入和审核流。"
      currentPath="/admin/albums"
      actions={
        <>
          <Link
            href="/admin/albums/new"
            className="border border-stone-500 bg-[#312923] px-4 py-2 text-stone-100 transition-colors hover:border-stone-300 hover:bg-[#3b312a]"
          >
            新建相册
          </Link>
          <Link
            href="/admin"
            className="border border-stone-700 bg-[#1d1916] px-4 py-2 text-stone-300 transition-colors hover:border-stone-500 hover:text-white"
          >
            返回后台
          </Link>
          <Link
            href="/albums"
            className="border border-stone-700 bg-[#1d1916] px-4 py-2 text-stone-300 transition-colors hover:border-stone-500 hover:text-white"
          >
            查看前台相册
          </Link>
        </>
      }
      stats={
        <>
          <article className="border border-stone-700 bg-[#231d18] px-5 py-4 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
            <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
              相册总数
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-stone-50">
              {albums.length}
            </p>
            <p className="mt-2 text-sm text-stone-500">当前列表已加载全部相册。</p>
          </article>

          <article className="border border-stone-700 bg-[#231d18] px-5 py-4 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
            <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
              已发布
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-stone-50">
              {publishedCount}
            </p>
            <p className="mt-2 text-sm text-stone-500">当前公开可见的相册数量。</p>
          </article>

          <article className="border border-stone-700 bg-[#231d18] px-5 py-4 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
            <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
              总片数
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-stone-50">
              {totalFrames._sum.imageCount ?? 0}
            </p>
            <p className="mt-2 text-sm text-stone-500">按相册记录统计的图片总数量。</p>
          </article>
        </>
      }
    >
      {created || deleted ? (
        <AdminNotice>
          {created ? `相册已创建：${created}` : "相册已删除。"}
        </AdminNotice>
      ) : null}

      <AdminDataGrid
        gridId="admin-albums-grid"
        title="相册列表"
        hint="后续补排序 / 重新导入 / 封面调整"
        filters={
          <AdminGridFilters
            basePath="/admin/albums"
            defaultQuery={searchQuery}
            defaultStatus={statusFilter}
            defaultPageSize={pageSize}
            searchPlaceholder="搜索标题、slug、描述"
          />
        }
        bulkActions={
          <>
            <AdminGridSelectTools gridId="admin-albums-grid" />
            <AdminBulkDeleteButton
              gridId="admin-albums-grid"
              endpoint="/api/admin/albums/batch"
              confirmText="确定批量删除选中的相册吗？相册内关联会被移除，但照片记录会保留。"
            />
          </>
        }
        columns={[
          { label: "选择", className: "w-[72px]" },
          { label: "标题" },
          { label: "slug" },
          { label: "记录片数" },
          { label: "实际关联" },
          { label: "封面" },
          { label: "状态" },
          { label: "操作" },
        ]}
        emptyText="当前还没有相册数据。后续导入内容后，这里会显示真实列表。"
        hasRows={albums.length > 0}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={pageSize}
        basePath="/admin/albums"
        searchParams={{
          created,
          deleted,
          q: searchQuery || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          pageSize: pageSize !== 20 ? String(pageSize) : undefined,
        }}
      >
        {albums.map((album) => (
          <tr key={album.id} className="align-top text-stone-300">
            <td className="border-b border-stone-800 px-5 py-4">
              <input
                type="checkbox"
                name="selectedIds"
                value={album.id}
                className="h-4 w-4"
                aria-label={`选择相册 ${album.title}`}
              />
            </td>
            <td className="border-b border-stone-800 px-5 py-4">
              <div className="min-w-[220px]">
                <div className="font-medium text-stone-100">{album.title}</div>
                <div className="mt-1 text-xs text-stone-500">
                  {album.description ?? "暂无描述"}
                </div>
              </div>
            </td>
            <td className="border-b border-stone-800 px-5 py-4 text-stone-400">
              {album.slug}
            </td>
            <td className="border-b border-stone-800 px-5 py-4 text-stone-400">
              {album.imageCount}
            </td>
            <td className="border-b border-stone-800 px-5 py-4 text-stone-400">
              {album._count.photoLinks}
            </td>
            <td className="border-b border-stone-800 px-5 py-4 text-stone-400">
              {album.coverImageUrl ? "Has cover" : "No cover"}
            </td>
            <td className="border-b border-stone-800 px-5 py-4">
              <span
                className={
                  album.isPublished
                    ? "inline-flex border border-emerald-700/40 bg-emerald-950/30 px-2 py-1 text-xs uppercase tracking-[0.16em] text-emerald-300"
                    : "inline-flex border border-amber-700/40 bg-amber-950/20 px-2 py-1 text-xs uppercase tracking-[0.16em] text-amber-300"
                }
              >
                {album.isPublished ? "Published" : "Draft"}
              </span>
            </td>
            <td className="border-b border-stone-800 px-5 py-4">
              <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em]">
                <Link
                  href={`/admin/albums/${album.id}`}
                  className="text-stone-300 transition-colors hover:text-white"
                >
                  管理
                </Link>
                <Link
                  href={`/admin/albums/${album.id}/edit`}
                  className="text-stone-300 transition-colors hover:text-white"
                >
                  编辑
                </Link>
                <Link
                  href={`/albums/${album.slug}`}
                  className="text-stone-500 transition-colors hover:text-stone-300"
                >
                  前台
                </Link>
                <AdminDeleteButton
                  endpoint={`/api/admin/albums/${album.id}`}
                  confirmText={`确定删除相册「${album.title}」吗？相册内的关联会被移除，但照片记录会保留。`}
                />
              </div>
            </td>
          </tr>
        ))}
      </AdminDataGrid>
    </AdminShell>
  );
}
