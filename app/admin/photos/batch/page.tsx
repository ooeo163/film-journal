import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminBatchPhotoForm } from "@/components/admin-batch-photo-form";

export default async function AdminBatchPhotosPage() {
  const albums = await prisma.album.findMany({
    where: {
      isPublished: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      imageCount: true,
    },
  });

  return (
    <main className="min-h-screen bg-[#14110f] px-4 pb-10 pt-18 text-stone-100 md:px-6">
      <div className="mx-auto max-w-[1080px] space-y-5">
        <header className="border border-stone-700 bg-[#221d18] px-6 py-5 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-stone-500">
                / admin / photos / batch
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-50">
                批量上传照片
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-300">
                一次选择多张图片，后端会逐张保存到项目自己的附件目录，并批量创建照片记录。你也可以统一把它们挂进某个相册里。
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
                href="/admin/photos/new"
                className="border border-stone-700 bg-[#1d1916] px-4 py-2 text-sm text-stone-300 transition-colors hover:border-stone-500 hover:text-white"
              >
                单张上传
              </Link>
            </div>
          </div>
        </header>

        <section className="border border-stone-700 bg-[#221d18] shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
          <div className="border-b border-stone-700 px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-300">
              批量参数
            </h2>
          </div>
          <AdminBatchPhotoForm albums={albums} />
        </section>
      </div>
    </main>
  );
}
