import Link from "next/link";
import { AdminNewPhotoForm } from "@/components/admin-new-photo-form";
import { prisma } from "@/lib/prisma";

type AdminNewPhotoPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function AdminNewPhotoPage({
  searchParams,
}: AdminNewPhotoPageProps) {
  const [albums, params] = await Promise.all([
    prisma.album.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        imageCount: true,
      },
    }),
    searchParams,
  ]);
  const error = params?.error;

  return (
    <main className="min-h-screen bg-[#14110f] px-4 pb-10 pt-18 text-stone-100 md:px-6">
      <div className="mx-auto max-w-[960px] space-y-5">
        <header className="border border-stone-700 bg-[#221d18] px-6 py-5 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-stone-500">
                / admin / photos / new
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-50">
                新建照片
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-300">
                这一页把“上传文件”和“创建照片记录”合并在一起。当前会先把文件保存到项目自己的本地附件目录，后面再平滑切到 COS。
              </p>
            </div>

            <Link
              href="/admin/photos"
              className="border border-stone-700 bg-[#1d1916] px-4 py-2 text-sm text-stone-300 transition-colors hover:border-stone-500 hover:text-white"
            >
              返回照片管理
            </Link>
          </div>
        </header>

        <section className="border border-stone-700 bg-[#221d18] shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
          <div className="border-b border-stone-700 px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-300">
              基础信息
            </h2>
          </div>
          <AdminNewPhotoForm albums={albums} initialError={error} />
        </section>
      </div>
    </main>
  );
}
