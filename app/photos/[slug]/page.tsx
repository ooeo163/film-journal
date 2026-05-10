import { notFound } from "next/navigation";
import { PhotoDetailViewer } from "@/components/photo-detail-viewer";
import { prisma } from "@/lib/prisma";
import { getImageSrc } from "@/lib/local-media";

type PhotoDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function PhotoDetailPage({
  params,
}: PhotoDetailPageProps) {
  const { slug } = await params;

  const photo = await prisma.photo.findUnique({
    where: {
      slug,
    },
  });

  if (!photo) {
    notFound();
  }

  return (
    <main className="relative text-stone-100">
      <div
        className="home-background fixed inset-0"
      />
      <div className="fixed inset-0 bg-[linear-gradient(90deg,rgba(9,8,7,0.9)_0%,rgba(13,11,9,0.82)_36%,rgba(14,12,10,0.76)_65%,rgba(10,9,8,0.88)_100%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(7,6,5,0.28)_58%,rgba(5,4,4,0.74)_100%)]" />
      <div className="page-bg-soft-light fixed inset-0" />

      <div className="relative z-10 px-6 pb-14 pt-5">
        <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-4">
          <section className="grid gap-4 border-b border-stone-700/70 pb-4 lg:grid-cols-[1fr_0.9fr]">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.45em] text-stone-500">
                Photo Detail
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-stone-50 md:text-5xl">
                {photo.slug}
              </h1>
            </div>

            <div className="rounded-[2rem] border border-stone-700/80 bg-[rgba(28,22,18,0.82)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.28)] backdrop-blur-[2px]">
              <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                Viewing Context
              </p>
              <div className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
                <p>这是照片详情页第一版，先承载核心信息和浏览入口。</p>
                <p>后续会补大图查看、上一篇/下一篇、所属相册与关联文章。</p>
              </div>
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-stone-700/80 bg-[rgba(20,17,14,0.88)] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.32)] backdrop-blur-[2px]">
              <PhotoDetailViewer
                item={{
                  id: photo.id,
                  title: photo.slug,
                  imageUrl: getImageSrc(photo.imageUrl),
                }}
              />
            </div>

            <div className="grid gap-8">
              <section className="rounded-[2rem] border border-stone-700/80 bg-[rgba(28,22,18,0.82)] p-8 shadow-[0_14px_44px_rgba(0,0,0,0.24)] backdrop-blur-[2px]">
                <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                  Metadata
                </p>
                <dl className="mt-6 grid gap-4 text-sm text-stone-200 sm:grid-cols-2">
                  <div>
                    <dt className="text-stone-500">Slug</dt>
                    <dd>{photo.slug}</dd>
                  </div>
                  <div>
                    <dt className="text-stone-500">Created</dt>
                    <dd>
                      {new Intl.DateTimeFormat("zh-CN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      }).format(photo.createdAt)}
                    </dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-[2rem] border border-stone-700/80 bg-[rgba(36,29,24,0.8)] p-8 shadow-[0_14px_44px_rgba(0,0,0,0.24)] backdrop-blur-[2px]">
                <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                  Next Steps
                </p>
                <div className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
                  <p>当前已经接入真实图片组件和点击放大查看。</p>
                  <p>目前先完成照片浏览主线的闭环，确保结构和数据链路都稳定。</p>
                </div>
              </section>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
