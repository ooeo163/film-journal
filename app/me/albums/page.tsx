import { cookies } from "next/headers";
import Link from "next/link";
import { AccountShell } from "@/components/account-shell";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/require-admin";

export default async function MyAlbumsPage() {
  const cookieStore = await cookies();
  const userName = cookieStore.get("fj_user_name")?.value || null;
  const user = await requireAuth();
  const albums = await prisma.album.findMany({
    where: {
      isPublished: true,
      ...(user ? { creatorId: user.id } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 24,
  });

  return (
    <AccountShell
      title="我的相册"
      description="这里会展示当前账号可维护的相册内容，并承接后续的上传、排序和审核状态。"
      userName={userName}
    >
      <div className="space-y-6">
        <section className="rounded-[1.6rem] border border-stone-700/70 bg-[rgba(36,29,24,0.8)] p-5 text-sm leading-7 text-stone-300">
          当前先接入站点内可管理的真实相册数据，作为“我的相册”第一版。后续补充 Album 到 User 的归属关系后，再切到当前账号真正拥有的内容。
        </section>

        {albums.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {albums.map((album) => (
              <article
                key={album.id}
                className="rounded-[1.6rem] border border-stone-700/70 bg-[rgba(28,22,18,0.72)] p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/albums/${album.slug}`}
                      className="text-xl font-semibold text-stone-50 transition-colors hover:text-stone-300"
                    >
                      {album.title}
                    </Link>
                    <p className="mt-2 text-sm leading-7 text-stone-300">
                      {album.description ?? "当前相册还没有补充详细说明。"}
                    </p>
                  </div>
                  <span className="rounded-full border border-stone-700/70 px-3 py-1 text-xs uppercase tracking-[0.25em] text-stone-400">
                    {album.imageCount} Frames
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-stone-400">
                  <span>{album.slug}</span>
                  <span>{album.coverImageUrl ? "Has cover" : "No cover"}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.8rem] border border-dashed border-stone-600/70 bg-[rgba(28,22,18,0.72)] p-8 text-base leading-8 text-stone-300">
            当前还没有已发布相册。后续导入或上传相册后，这里会显示真实列表。
          </div>
        )}
      </div>
    </AccountShell>
  );
}
