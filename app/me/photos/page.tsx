import { cookies } from "next/headers";
import Link from "next/link";
import { AccountShell } from "@/components/account-shell";
import { prisma } from "@/lib/prisma";

export default async function MyPhotosPage() {
  const cookieStore = await cookies();
  const userName = cookieStore.get("fj_user_name")?.value || null;
  const photos = await prisma.photo.findMany({
    where: {
      isPublished: true,
    },
    orderBy: [
      {
        shotAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
    take: 24,
  });

  return (
    <AccountShell
      title="我的照片"
      description="这里会展示当前登录账号拥有或可管理的照片内容。当前先建立页面结构，后续接真实账号与数据权限。"
      userName={userName}
    >
      <div className="space-y-6">
        <section className="rounded-[1.6rem] border border-stone-700/70 bg-[rgba(36,29,24,0.8)] p-5 text-sm leading-7 text-stone-300">
          当前先接入站点内可管理的真实照片数据，作为“我的照片”第一版。后续补充 Photo 到 User 的归属关系后，再细分到当前账号名下。
        </section>

        {photos.length > 0 ? (
          <div className="grid gap-4">
            {photos.map((photo, index) => (
              <article
                key={photo.id}
                className="grid gap-4 rounded-[1.6rem] border border-stone-700/70 bg-[rgba(28,22,18,0.72)] p-5 md:grid-cols-[80px_1fr]"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-stone-600/70 bg-[#16120f] text-sm text-stone-300">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/photos/${photo.slug}`}
                        className="text-xl font-semibold text-stone-50 transition-colors hover:text-stone-300"
                      >
                        {photo.title}
                      </Link>
                      <p className="mt-2 text-sm leading-7 text-stone-300">
                        {photo.description ?? "暂无描述。"}
                      </p>
                    </div>
                    <span className="rounded-full border border-stone-700/70 px-3 py-1 text-xs uppercase tracking-[0.25em] text-stone-400">
                      Published
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-400">
                    <span>{photo.location ?? "Unknown location"}</span>
                    <span>{photo.camera ?? "Unknown camera"}</span>
                    <span>{photo.filmStock ?? "Unknown film"}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.8rem] border border-dashed border-stone-600/70 bg-[rgba(28,22,18,0.72)] p-8 text-base leading-8 text-stone-300">
            当前还没有已发布照片。后续导入或上传内容后，这里会显示真实照片列表。
          </div>
        )}
      </div>
    </AccountShell>
  );
}
