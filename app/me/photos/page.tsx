import { cookies } from "next/headers";
import { AccountShell } from "@/components/account-shell";
import { prisma } from "@/lib/prisma";
import { getImageSrc } from "@/lib/local-media";

export default async function MyPhotosPage() {
  const cookieStore = await cookies();
  const userName = cookieStore.get("fj_user_name")?.value || null;
  const photos = await prisma.photo.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      imageUrl: true,
      thumbUrl: true,
    },
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
          当前先接入站点内可管理的真实照片数据，作为我的照片第一版。后续补充 Photo 到 User 的归属关系后，再细分到当前账号名下。
        </section>

        {photos.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative overflow-hidden border border-stone-700/70 bg-[rgba(28,22,18,0.72)]"
              >
                <div className="aspect-[3/4] bg-[#16120f]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getImageSrc(photo.thumbUrl ?? photo.imageUrl)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.8rem] border border-dashed border-stone-600/70 bg-[rgba(28,22,18,0.72)] p-8 text-base leading-8 text-stone-300">
            当前还没有照片。后续导入或上传内容后，这里会显示真实照片列表。
          </div>
        )}
      </div>
    </AccountShell>
  );
}
