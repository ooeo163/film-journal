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
    <main className="admin-light min-h-screen bg-[linear-gradient(180deg,#f7f5f0_0%,#eeebe3_100%)] px-4 pb-10 pt-18 text-[#1f1f1d] md:px-6">
      <div className="mx-auto max-w-[960px] space-y-5">
        <header className="border border-[#d6d0c5] bg-[#fbfaf7] px-6 py-5 shadow-[0_18px_50px_rgba(42,35,28,0.08)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#8a8276]">
                / admin / albums / new
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#111111]">
                新建相册
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5f584f]">
                先创建相册本身，支持可选上传封面。创建完成后，下一步再往相册里挂照片。
              </p>
            </div>

            <Link
              href="/admin/albums"
              className="border border-[#d6d0c5] bg-white px-4 py-2 text-sm text-[#33312e] transition-all hover:border-[#b8afa2] hover:bg-[#f2efe8] hover:text-[#111111]"
            >
              返回相册管理
            </Link>
          </div>
        </header>

        <section className="border border-[#d6d0c5] bg-white shadow-[0_18px_50px_rgba(42,35,28,0.06)]">
          <div className="border-b border-[#e3ded6] bg-[#f7f5f0] px-5 py-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#33312e]">
              基础信息
            </h2>
          </div>
          <AdminNewAlbumForm initialError={error} />
        </section>
      </div>
    </main>
  );
}
