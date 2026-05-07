import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { AccountShell } from "@/components/account-shell";

export default async function MePage() {
  const cookieStore = await cookies();
  const userName = cookieStore.get("fj_user_name")?.value || null;
  const [photoCount, albumCount] = await Promise.all([
    prisma.photo.count(),
    prisma.album.count({
      where: {
        isPublished: true,
      },
    }),
  ]);

  return (
    <AccountShell
      title="用户中心总览"
      description="这里会承载当前账号的内容总览、最近上传、待审核内容和个人资料。当前先建立用户中心骨架。"
      userName={userName}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-[1.6rem] border border-stone-700/70 bg-[rgba(28,22,18,0.72)] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
            Photos
          </p>
          <p className="mt-3 text-3xl font-semibold text-stone-50">{photoCount}</p>
          <p className="mt-3 text-sm leading-7 text-stone-300">
            当前先显示已发布照片总数，后续再细分到当前账号名下。
          </p>
        </section>

        <section className="rounded-[1.6rem] border border-stone-700/70 bg-[rgba(28,22,18,0.72)] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
            Albums
          </p>
          <p className="mt-3 text-3xl font-semibold text-stone-50">{albumCount}</p>
          <p className="mt-3 text-sm leading-7 text-stone-300">
            当前先显示已发布相册总数，后续再细分到当前账号可维护内容。
          </p>
        </section>
      </div>

      <section className="mt-8 rounded-[1.8rem] border border-stone-700/70 bg-[rgba(36,29,24,0.8)] p-6">
        <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
          Next Steps
        </p>
        <div className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
          <p>当前已经接入最小登录状态和默认测试账号。</p>
          <p>下一步会继续把照片、相册与当前账号真正关联起来。</p>
        </div>
      </section>
    </AccountShell>
  );
}
