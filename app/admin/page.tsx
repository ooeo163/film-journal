import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { prisma } from "@/lib/prisma";

const adminLinks = [
  {
    title: "用户管理",
    description: "管理系统用户账号，注册新用户。",
    href: "/admin/users",
  },
  {
    title: "照片管理",
    description: "查看和整理站点中的照片数据。",
    href: "/admin/photos",
  },
  {
    title: "相册管理",
    description: "管理相册，排序、封面与审核。",
    href: "/admin/albums",
  },
];

export default async function AdminPage() {
  const [photoCount, albumCount, journalCount, userCount] = await Promise.all([
    prisma.photo.count(),
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
      title="系统管理"
      description="系统管理员后台，管理用户和内容。"
      currentPath="/admin"
      stats={
        <>
          {[
            { label: "照片总数", value: photoCount },
            { label: "已发布相册", value: albumCount },
            { label: "已发布文章", value: journalCount },
            { label: "用户账号", value: userCount },
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

        <div className="grid gap-0 md:grid-cols-3">
          {adminLinks.map((item) => (
            <article
              key={item.href}
              className="border-t border-[#ded8cf] bg-white p-5 transition-colors hover:bg-[#f7f5f0] md:border-r md:border-r-[#ded8cf] md:[&:nth-child(3n)]:border-r-0"
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
