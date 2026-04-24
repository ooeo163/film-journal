import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminEditAlbumForm } from "@/components/admin-edit-album-form";
import { prisma } from "@/lib/prisma";

type AdminEditAlbumPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminEditAlbumPage({
  params,
}: AdminEditAlbumPageProps) {
  const { id } = await params;

  const album = await prisma.album.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      sourceUrl: true,
      isPublished: true,
      imageCount: true,
      coverImageUrl: true,
      photoLinks: {
        orderBy: {
          sortOrder: "asc",
        },
        select: {
          photo: {
            select: {
              id: true,
              title: true,
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

  return (
    <main className="min-h-screen bg-[#14110f] px-4 pb-10 pt-18 text-stone-100 md:px-6">
      <div className="mx-auto max-w-[1080px] space-y-5">
        <header className="border border-stone-700 bg-[#221d18] px-6 py-5 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-stone-500">
                / admin / albums / edit
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-50">
                编辑相册
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-300">
                当前支持编辑相册基础元数据，也可以直接从相册已有照片里选封面，或者上传新封面替换。
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/admin/albums/${album.id}`}
                className="border border-stone-700 bg-[#1d1916] px-4 py-2 text-sm text-stone-300 transition-colors hover:border-stone-500 hover:text-white"
              >
                返回相册管理详情
              </Link>
              <Link
                href={`/albums/${album.slug}`}
                className="border border-stone-700 bg-[#1d1916] px-4 py-2 text-sm text-stone-300 transition-colors hover:border-stone-500 hover:text-white"
              >
                查看前台
              </Link>
            </div>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
          <section className="border border-stone-700 bg-[#221d18] p-4 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
            <div className="overflow-hidden border border-stone-800 bg-[#181411]">
              {album.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={album.coverImageUrl}
                  alt={album.title}
                  className="h-auto w-full object-cover"
                />
              ) : (
                <div className="flex h-[240px] items-center justify-center text-sm text-stone-500">
                  当前还没有封面
                </div>
              )}
            </div>

            <div className="mt-4 space-y-2 text-sm text-stone-400">
              <p>slug: {album.slug}</p>
              <p>当前片数：{album.imageCount}</p>
              <p>状态：{album.isPublished ? "Published" : "Draft"}</p>
            </div>
          </section>

          <section className="border border-stone-700 bg-[#221d18] shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
            <div className="border-b border-stone-700 px-5 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-300">
                基础信息
              </h2>
            </div>

            <AdminEditAlbumForm album={album} />
          </section>
        </div>
      </div>
    </main>
  );
}
