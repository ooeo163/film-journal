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

type AdminPhotosPageProps = {
  searchParams: Promise<{
    created?: string;
    updated?: string;
    deleted?: string;
    batchCreated?: string;
    page?: string;
    pageSize?: string;
    q?: string;
    status?: string;
  }>;
};

export default async function AdminPhotosPage({
  searchParams,
}: AdminPhotosPageProps) {
  const {
    created,
    updated,
    deleted,
    batchCreated,
    page,
    pageSize: pageSizeParam,
    q,
    status,
  } =
    await searchParams;
  const currentPage = Math.max(1, Number(page || "1") || 1);
  const requestedPageSize = Number(pageSizeParam || "20");
  const pageSize = [10, 20, 50, 100].includes(requestedPageSize)
    ? requestedPageSize
    : 20;
  const searchQuery = q?.trim() ?? "";
  const statusFilter = status === "published" || status === "draft" ? status : "all";
  const where: Prisma.PhotoWhereInput = {
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
            { location: { contains: searchQuery, mode: "insensitive" } },
            { camera: { contains: searchQuery, mode: "insensitive" } },
            { filmStock: { contains: searchQuery, mode: "insensitive" } },
          ],
        }
      : {}),
  };
  const [photos, totalCount, publishedCount, draftCount] = await Promise.all([
    prisma.photo.findMany({
      where,
      orderBy: [
        {
          shotAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.photo.count({ where }),
    prisma.photo.count({
      where: {
        isPublished: true,
      },
    }),
    prisma.photo.count({
      where: {
        isPublished: false,
      },
    }),
  ]);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <AdminShell
      title="照片管理"
      description="这一页先作为后台照片管理第一版，优先展示可维护的真实数据。后续会继续接筛选、批量操作、上传、审核和归属关系。"
      currentPath="/admin/photos"
      actions={
        <>
          <Link
            href="/admin/photos/batch"
            className="border border-stone-500 bg-[#312923] px-4 py-2 text-stone-100 transition-colors hover:border-stone-300 hover:bg-[#3b312a]"
          >
            批量上传
          </Link>
          <Link
            href="/admin/photos/new"
            className="border border-stone-500 bg-[#312923] px-4 py-2 text-stone-100 transition-colors hover:border-stone-300 hover:bg-[#3b312a]"
          >
            新建照片
          </Link>
          <Link
            href="/admin"
            className="border border-stone-700 bg-[#1d1916] px-4 py-2 text-stone-300 transition-colors hover:border-stone-500 hover:text-white"
          >
            返回后台
          </Link>
          <Link
            href="/me/photos"
            className="border border-stone-700 bg-[#1d1916] px-4 py-2 text-stone-300 transition-colors hover:border-stone-500 hover:text-white"
          >
            查看前台个人页
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
              {photos.length}
            </p>
            <p className="mt-2 text-sm text-stone-500">当前已加载最近 60 条照片。</p>
          </article>

          <article className="border border-stone-700 bg-[#231d18] px-5 py-4 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
            <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
              已发布
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-stone-50">
              {publishedCount}
            </p>
            <p className="mt-2 text-sm text-stone-500">当前公开可见的照片数量。</p>
          </article>

          <article className="border border-stone-700 bg-[#231d18] px-5 py-4 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
            <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
              未发布
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-stone-50">
              {draftCount}
            </p>
            <p className="mt-2 text-sm text-stone-500">后续会作为审核和草稿流的入口。</p>
          </article>
        </>
      }
    >
      {created || updated || deleted || batchCreated ? (
        <AdminNotice>
          {batchCreated
            ? `批量上传成功，已创建 ${batchCreated} 张照片。`
            : created
              ? `照片已创建：${created}`
              : updated
                ? `照片已更新：${updated}`
                : "照片已删除。"}
        </AdminNotice>
      ) : null}

      <AdminDataGrid
        gridId="admin-photos-grid"
        title="照片列表"
        hint="后续补筛选 / 批量操作 / 上传入口"
        filters={
          <AdminGridFilters
            basePath="/admin/photos"
            defaultQuery={searchQuery}
            defaultStatus={statusFilter}
            defaultPageSize={pageSize}
            searchPlaceholder="搜索标题、slug、地点、相机、胶卷"
          />
        }
        bulkActions={
          <>
            <AdminGridSelectTools gridId="admin-photos-grid" />
            <AdminBulkDeleteButton
              gridId="admin-photos-grid"
              endpoint="/api/admin/photos/batch"
              confirmText="确定批量删除选中的照片吗？它们会从所有相册关联中移除。"
            />
          </>
        }
        columns={[
          { label: "选择", className: "w-[72px]" },
          { label: "标题" },
          { label: "地点" },
          { label: "相机" },
          { label: "胶卷" },
          { label: "拍摄时间" },
          { label: "状态" },
          { label: "操作" },
        ]}
        emptyText="当前还没有照片数据。后续导入或上传内容后，这里会显示真实列表。"
        hasRows={photos.length > 0}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={pageSize}
        basePath="/admin/photos"
        searchParams={{
          created,
          updated,
          deleted,
          batchCreated,
          q: searchQuery || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          pageSize: pageSize !== 20 ? String(pageSize) : undefined,
        }}
      >
        {photos.map((photo) => (
          <tr key={photo.id} className="align-top text-stone-300">
            <td className="border-b border-stone-800 px-5 py-4">
              <input
                type="checkbox"
                name="selectedIds"
                value={photo.id}
                className="h-4 w-4"
                aria-label={`选择照片 ${photo.title}`}
              />
            </td>
            <td className="border-b border-stone-800 px-5 py-4">
              <div className="min-w-[220px]">
                <div className="font-medium text-stone-100">{photo.title}</div>
                <div className="mt-1 text-xs text-stone-500">/photos/{photo.slug}</div>
              </div>
            </td>
            <td className="border-b border-stone-800 px-5 py-4 text-stone-400">
              {photo.location ?? "-"}
            </td>
            <td className="border-b border-stone-800 px-5 py-4 text-stone-400">
              {photo.camera ?? "-"}
            </td>
            <td className="border-b border-stone-800 px-5 py-4 text-stone-400">
              {photo.filmStock ?? "-"}
            </td>
            <td className="border-b border-stone-800 px-5 py-4 text-stone-400">
              {photo.shotAt
                ? new Intl.DateTimeFormat("zh-CN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  }).format(photo.shotAt)
                : "-"}
            </td>
            <td className="border-b border-stone-800 px-5 py-4">
              <span
                className={
                  photo.isPublished
                    ? "inline-flex border border-emerald-700/40 bg-emerald-950/30 px-2 py-1 text-xs uppercase tracking-[0.16em] text-emerald-300"
                    : "inline-flex border border-amber-700/40 bg-amber-950/20 px-2 py-1 text-xs uppercase tracking-[0.16em] text-amber-300"
                }
              >
                {photo.isPublished ? "Published" : "Draft"}
              </span>
            </td>
            <td className="border-b border-stone-800 px-5 py-4">
              <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.18em]">
                <Link
                  href={`/photos/${photo.slug}`}
                  className="text-stone-300 transition-colors hover:text-white"
                >
                  查看
                </Link>
                <Link
                  href={`/admin/photos/${photo.id}`}
                  className="text-stone-300 transition-colors hover:text-white"
                >
                  编辑
                </Link>
                <AdminDeleteButton
                  endpoint={`/api/admin/photos/${photo.id}`}
                  confirmText={`确定删除照片「${photo.title}」吗？这会把它从所有相册关联里移除。`}
                />
              </div>
            </td>
          </tr>
        ))}
      </AdminDataGrid>
    </AdminShell>
  );
}
