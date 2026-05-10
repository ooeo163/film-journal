import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminDeleteButton } from "@/components/admin-delete-button";
import { AdminShell } from "@/components/admin-shell";
import { AdminAlbumPhotoManager } from "@/components/admin-album-photo-manager";
import { prisma } from "@/lib/prisma";

type AdminAlbumDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminAlbumDetailPage({
  params,
}: AdminAlbumDetailPageProps) {
  const { id } = await params;

  const album = await prisma.album.findUnique({
    where: {
      id,
    },
    include: {
      photoLinks: {
        orderBy: {
          sortOrder: "asc",
        },
        include: {
          photo: {
            select: {
              id: true,
              slug: true,
              imageUrl: true,
            },
          },
        },
      },
    },
  });

  if (!album) {
    notFound();
  }

  const availablePhotos = await prisma.photo.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 120,
    select: {
      id: true,
      slug: true,
      imageUrl: true,
    },
  });

  const linkedPhotos = album.photoLinks.map((link) => ({
    id: link.photo.id,
    slug: link.photo.slug,
    imageUrl: link.photo.imageUrl,
    sortOrder: link.sortOrder,
  }));

  return (
    <AdminShell
      title={`管理相册：${album.title}`}
      description="这一页开始承接相册的真实维护动作。当前先支持查看已挂入照片，并从现有照片中继续加入相册。"
      currentPath="/admin/albums"
      actions={
        <>
          <Link
            href="/admin/albums"
            className="border border-stone-700 bg-[#1d1916] px-4 py-2 text-stone-300 transition-colors hover:border-stone-500 hover:text-white"
          >
            返回相册管理
          </Link>
          <Link
            href={`/albums/${album.slug}`}
            className="border border-stone-700 bg-[#1d1916] px-4 py-2 text-stone-300 transition-colors hover:border-stone-500 hover:text-white"
          >
            查看前台相册
          </Link>
          <AdminDeleteButton
            endpoint={`/api/admin/albums/${album.id}`}
            redirectTo="/admin/albums"
            confirmText={`确定删除相册「${album.title}」吗？相册内的关联会被移除，但照片记录会保留。`}
            className="border border-red-900/50 bg-red-950/20 px-4 py-2 text-sm text-red-200 transition-colors hover:border-red-700 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </>
      }
      stats={
        <>
          <article className="border border-stone-700 bg-[#231d18] px-5 py-4 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
            <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
              当前片数
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-stone-50">
              {album.photoLinks.length}
            </p>
          </article>

          <article className="border border-stone-700 bg-[#231d18] px-5 py-4 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
            <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
              slug
            </p>
            <p className="mt-3 text-sm font-medium text-stone-100">{album.slug}</p>
          </article>

          <article className="border border-stone-700 bg-[#231d18] px-5 py-4 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
            <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
              封面
            </p>
            <p className="mt-3 text-sm font-medium text-stone-100">
              {album.coverImageUrl ? "已设置" : "未设置"}
            </p>
          </article>
        </>
      }
    >
      <AdminAlbumPhotoManager
        albumId={album.id}
        linkedPhotos={linkedPhotos}
        availablePhotos={availablePhotos}
      />
    </AdminShell>
  );
}
