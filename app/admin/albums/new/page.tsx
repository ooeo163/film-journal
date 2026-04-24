import Link from "next/link";
import { AdminNewAlbumForm } from "@/components/admin-new-album-form";

type AdminNewAlbumPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function AdminNewAlbumPage({
  searchParams,
}: AdminNewAlbumPageProps) {
  const params = await searchParams;
  const error = params?.error;

  return (
    <main className="min-h-screen bg-[#14110f] px-4 pb-10 pt-18 text-stone-100 md:px-6">
      <div className="mx-auto max-w-[960px] space-y-5">
        <header className="border border-stone-700 bg-[#221d18] px-6 py-5 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-stone-500">
                / admin / albums / new
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-50">
                新建相册
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-300">
                先创建相册本身，支持可选上传封面。创建完成后，下一步再往相册里挂照片。
              </p>
            </div>

            <Link
              href="/admin/albums"
              className="border border-stone-700 bg-[#1d1916] px-4 py-2 text-sm text-stone-300 transition-colors hover:border-stone-500 hover:text-white"
            >
              返回相册管理
            </Link>
          </div>
        </header>

        <section className="border border-stone-700 bg-[#221d18] shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
          <div className="border-b border-stone-700 px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-300">
              基础信息
            </h2>
          </div>
          <AdminNewAlbumForm initialError={error} />
        </section>
      </div>
    </main>
  );
}
