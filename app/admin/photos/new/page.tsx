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
    <main className="admin-light min-h-screen bg-[linear-gradient(180deg,#f7f5f0_0%,#eeebe3_100%)] px-4 pb-10 pt-18 text-[#1f1f1d] md:px-6">
      <div className="mx-auto max-w-[960px] space-y-5">
        <header className="border border-[#d6d0c5] bg-[#fbfaf7] px-6 py-5 shadow-[0_18px_50px_rgba(42,35,28,0.08)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#8a8276]">
                / admin / photos / new
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#111111]">
                新建照片
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5f584f]">
                上传照片文件，可选择挂入相册。上传后即可在前台查看。
              </p>
            </div>

            <Link
              href="/admin/photos"
              className="border border-[#d6d0c5] bg-white px-4 py-2 text-sm text-[#33312e] transition-all hover:border-[#b8afa2] hover:bg-[#f2efe8] hover:text-[#111111]"
            >
              返回照片管理
            </Link>
          </div>
        </header>

        <section className="border border-[#d6d0c5] bg-white shadow-[0_18px_50px_rgba(42,35,28,0.06)]">
          <div className="border-b border-[#e3ded6] bg-[#f7f5f0] px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#33312e]">
              基础信息
            </h2>
          </div>
          <AdminNewPhotoForm albums={albums} initialError={error} />
        </section>
      </div>
    </main>
  );
}
