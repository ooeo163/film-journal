import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

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

  if (!photo || !photo.isPublished) {
    notFound();
  }

  return (
    <main className="relative text-stone-100">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/homepage-background.jpg')",
        }}
      />
      <div className="fixed inset-0 bg-[linear-gradient(90deg,rgba(9,8,7,0.9)_0%,rgba(13,11,9,0.82)_36%,rgba(14,12,10,0.76)_65%,rgba(10,9,8,0.88)_100%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(7,6,5,0.28)_58%,rgba(5,4,4,0.74)_100%)]" />

      <div className="relative z-10 px-6 py-28">
        <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-10">
          <section className="grid gap-8 border-b border-stone-700/70 pb-10 lg:grid-cols-[1fr_0.9fr]">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.45em] text-stone-500">
                Photo Detail
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-stone-50 md:text-5xl">
                {photo.title}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-stone-300">
                {photo.description ?? "这张照片目前还没有补充更详细的说明。"}
              </p>
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
              <div className="flex aspect-[4/3] items-center justify-center rounded-[1.5rem] border border-stone-700/70 bg-[rgba(13,11,9,0.92)] p-6 text-center">
                <div className="max-w-lg space-y-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                    Image Display Placeholder
                  </p>
                  <h2 className="text-2xl font-semibold text-stone-100">
                    {photo.title}
                  </h2>
                  <p className="text-sm leading-7 text-stone-400 break-all">
                    当前阶段先保留图片展示位。后续接入真实图片组件、缩略图/展示图切换和放大查看时，
                    这里会显示正式图片。
                  </p>
                  <p className="text-xs leading-6 text-stone-500 break-all">
                    {photo.imageUrl}
                  </p>
                </div>
              </div>
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
                    <dt className="text-stone-500">Location</dt>
                    <dd>{photo.location ?? "Unknown"}</dd>
                  </div>
                  <div>
                    <dt className="text-stone-500">Camera</dt>
                    <dd>{photo.camera ?? "Unknown"}</dd>
                  </div>
                  <div>
                    <dt className="text-stone-500">Lens</dt>
                    <dd>{photo.lens ?? "Unknown"}</dd>
                  </div>
                  <div>
                    <dt className="text-stone-500">Film</dt>
                    <dd>{photo.filmStock ?? "Unknown"}</dd>
                  </div>
                  <div>
                    <dt className="text-stone-500">Shot At</dt>
                    <dd>
                      {photo.shotAt
                        ? new Intl.DateTimeFormat("zh-CN", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          }).format(photo.shotAt)
                        : "Unknown"}
                    </dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-[2rem] border border-stone-700/80 bg-[rgba(36,29,24,0.8)] p-8 shadow-[0_14px_44px_rgba(0,0,0,0.24)] backdrop-blur-[2px]">
                <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                  Next Steps
                </p>
                <div className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
                  <p>后续会补充真实图片组件、详情页上下篇切换和相册关联。</p>
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
