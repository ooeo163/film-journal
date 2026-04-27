import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { prisma } from "@/lib/prisma";

const adminLinks = [
  {
    title: "内容总览",
    description: "先从公开相册入口查看内容呈现，后续再接审核和发布状态。",
    href: "/albums",
  },
  {
    title: "管理照片",
    description: "继续查看和整理站点中的真实照片数据。",
    href: "/admin/photos",
  },
  {
    title: "管理相册",
    description: "进入相册列表，后续在这里接排序、封面与审核能力。",
    href: "/admin/albums",
  },
];

export default async function AdminPage() {
  const [photoCount, albumCount, journalCount, userCount] = await Promise.all([
    prisma.photo.count({
      where: {
        isPublished: true,
      },
    }),
    prisma.album.count({
      where: {
        isPublished: true,
      },
    }),
    prisma.journal.count({
      where: {
        isPublished: true,
      },
    }),
    prisma.user.count({
      where: {
        isActive: true,
      },
    }),
  ]);

  return (
    <AdminShell
      title="后台入口"
      description="后台先统一成更清晰的管理框架：左侧导航、顶部说明、关键统计和模块入口。后面上传、审核、日志和系统设置都会继续挂在这条主线上。"
      currentPath="/admin"
      stats={
        <>
          {[
            { label: "已发布照片", value: photoCount },
            { label: "已发布相册", value: albumCount },
            { label: "已发布文章", value: journalCount },
            { label: "可用账号", value: userCount },
          ].map((item) => (
            <article
              key={item.label}
              className="border border-[#d6d0c5] bg-white px-5 py-4 shadow-[0_12px_30px_rgba(28,24,20,0.05)]"
            >
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#8a8276]">
                {item.label}
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-[#111111]">
                {item.value}
              </p>
            </article>
          ))}
        </>
      }
    >
      <section className="border border-[#d6d0c5] bg-white shadow-[0_16px_40px_rgba(28,24,20,0.05)]">
        <div className="border-b border-[#ded8cf] bg-[#f7f5f0] px-5 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#222222]">
            快速入口
          </h2>
        </div>

        <div className="grid gap-0 md:grid-cols-2">
          {adminLinks.map((item) => (
            <article
              key={item.href}
              className="border-t border-[#ded8cf] bg-white p-5 transition-colors hover:bg-[#f7f5f0] md:border-r md:border-r-[#ded8cf] md:[&:nth-child(2n)]:border-r-0"
            >
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#8a8276]">
                Module
              </p>
              <h2 className="mt-2 text-xl font-semibold text-[#111111]">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#5d574f]">
                {item.description}
              </p>
              <Link
                href={item.href}
                className="mt-5 inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-[#e60012] transition-colors hover:text-[#9d0010]"
              >
                进入
                <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
