import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { AdminPhotoGrid } from "@/components/admin-photo-grid";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export default async function AdminPhotosPage() {
  const user = await requireAdmin();
  if (!user) {
    redirect("/login");
  }

  const isSystemAdmin = user.role === "system_admin";
  const photos = await prisma.photo.findMany({
    where: isSystemAdmin
      ? undefined
      : { creatorId: user.id },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      slug: true,
      imageUrl: true,
      thumbUrl: true,
    },
  });

  return (
    <AdminShell
      title="照片管理"
      description="管理所有上传的照片。上传后即可在前台查看。"
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
            上传照片
          </Link>
          <Link
            href="/admin"
            className="border border-stone-700 bg-[#1d1916] px-4 py-2 text-stone-300 transition-colors hover:border-stone-500 hover:text-white"
          >
            返回后台
          </Link>
        </>
      }
      stats={
        <article className="border border-stone-700 bg-[#231d18] px-5 py-4 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
          <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
            照片总数
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-stone-50">
            {photos.length}
          </p>
        </article>
      }
    >
      <section className="border border-[#d6d0c5] bg-white shadow-[0_16px_40px_rgba(28,24,20,0.05)]">
        <div className="border-b border-[#ded8cf] bg-[#f7f5f0] px-5 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#222222]">
            所有照片
          </h2>
        </div>
        <div className="p-5">
          <AdminPhotoGrid photos={photos} />
        </div>
      </section>
    </AdminShell>
  );
}
