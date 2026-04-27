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
    <main className="admin-light min-h-screen bg-[linear-gradient(180deg,#f7f5f0_0%,#eeebe3_100%)] px-4 pb-10 pt-18 text-[#1f1f1d] md:px-6">
      <div className="mx-auto max-w-[1080px] space-y-5">
        <header className="border border-[#d6d0c5] bg-[#fbfaf7] px-6 py-5 shadow-[0_18px_50px_rgba(42,35,28,0.08)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#8a8276]">
                / admin / photos / batch
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#111111]">
                批量上传照片
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5f584f]">
                一次选择多张图片，后端会逐张保存到项目自己的附件目录，并批量创建照片记录。你也可以统一把它们挂进某个相册里。
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/photos"
                className="border border-[#d6d0c5] bg-white px-4 py-2 text-sm text-[#33312e] transition-all hover:border-[#b8afa2] hover:bg-[#f2efe8] hover:text-[#111111]"
              >
                返回照片管理
              </Link>
              <Link
                href="/admin/photos/new"
                className="border border-[#d6d0c5] bg-white px-4 py-2 text-sm text-[#33312e] transition-all hover:border-[#b8afa2] hover:bg-[#f2efe8] hover:text-[#111111]"
              >
                单张上传
              </Link>
            </div>
          </div>
        </header>

        <section className="border border-[#d6d0c5] bg-white shadow-[0_18px_50px_rgba(42,35,28,0.06)]">
          <div className="border-b border-[#e3ded6] bg-[#f7f5f0] px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#33312e]">
              批量参数
            </h2>
          </div>
          <AdminBatchPhotoForm albums={albums} />
        </section>
      </div>
    </main>
  );
}
