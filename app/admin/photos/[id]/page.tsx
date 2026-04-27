import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminDeleteButton } from "@/components/admin-delete-button";
import { AdminEditPhotoForm } from "@/components/admin-edit-photo-form";
import { prisma } from "@/lib/prisma";

type AdminEditPhotoPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminEditPhotoPage({
  params,
}: AdminEditPhotoPageProps) {
  const { id } = await params;

  const photo = await prisma.photo.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      location: true,
      camera: true,
      lens: true,
      filmStock: true,
      shotAt: true,
      isPublished: true,
      imageUrl: true,
    },
  });

  if (!photo) {
    notFound();
  }

  return (
    <main className="admin-light min-h-screen bg-[#14110f] px-4 pb-10 pt-18 text-stone-100 md:px-6">
      <div className="mx-auto max-w-[1080px] space-y-5">
        <header className="border border-stone-700 bg-[#221d18] px-6 py-5 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-stone-500">
                / admin / photos / edit
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-50">
                编辑照片
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-300">
                当前先支持编辑照片的基础元数据。后续会继续接封面替换、移动到相册、重新上传图片和审核状态。
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/photos"
                className="border border-stone-700 bg-[#1d1916] px-4 py-2 text-sm text-stone-300 transition-colors hover:border-stone-500 hover:text-white"
              >
                返回照片管理
              </Link>
              <Link
                href={`/photos/${photo.slug}`}
                className="border border-stone-700 bg-[#1d1916] px-4 py-2 text-sm text-stone-300 transition-colors hover:border-stone-500 hover:text-white"
              >
                查看前台
              </Link>
              <AdminDeleteButton
                endpoint={`/api/admin/photos/${photo.id}`}
                redirectTo="/admin/photos"
                confirmText={`确定删除照片「${photo.title}」吗？这会把它从所有相册关联里移除。`}
                className="border border-red-900/50 bg-red-950/20 px-4 py-2 text-sm text-red-200 transition-colors hover:border-red-700 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
          <section className="border border-stone-700 bg-[#221d18] p-4 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
            <div className="overflow-hidden border border-stone-800 bg-[#181411]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="h-auto w-full object-cover"
              />
            </div>

            <div className="mt-4 space-y-2 text-sm text-stone-400">
              <p>slug: {photo.slug}</p>
              <p>
                拍摄日期：
                {photo.shotAt
                  ? new Intl.DateTimeFormat("zh-CN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    }).format(photo.shotAt)
                  : "-"}
              </p>
              <p>状态：{photo.isPublished ? "Published" : "Draft"}</p>
            </div>
          </section>

          <section className="border border-stone-700 bg-[#221d18] shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
            <div className="border-b border-stone-700 px-5 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-300">
                基础信息
              </h2>
            </div>

            <AdminEditPhotoForm
              photo={{
                ...photo,
                shotAt: photo.shotAt
                  ? new Date(photo.shotAt).toISOString().slice(0, 10)
                  : "",
              }}
            />
          </section>
        </div>
      </div>
    </main>
  );
}
