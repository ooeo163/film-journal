import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { AdminEditUserForm } from "@/components/admin-edit-user-form";
import { prisma } from "@/lib/prisma";

type AdminEditUserPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminEditUserPage({
  params,
}: AdminEditUserPageProps) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <AdminShell
      title="编辑用户"
      description={`编辑用户 ${user.username} 的信息`}
      currentPath="/admin/users"
    >
      <div className="flex gap-3">
        <Link
          href="/admin/users"
          className="border border-[#d6d0c5] bg-white px-4 py-2 text-sm text-[#5d574f] transition-colors hover:bg-[#f7f5f0]"
        >
          返回用户列表
        </Link>
      </div>

      <section className="border border-[#d6d0c5] bg-white shadow-[0_16px_40px_rgba(28,24,20,0.05)]">
        <div className="border-b border-[#ded8cf] bg-[#f7f5f0] px-5 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#222222]">
            用户信息
          </h2>
        </div>
        <div className="p-5">
          <div className="mb-5 grid grid-cols-2 gap-4 rounded border border-[#ded8cf] bg-[#f7f5f0] p-4 text-sm text-[#5d574f] md:grid-cols-4">
            <div>
              <span className="text-[#8a8276]">用户ID：</span>
              <span className="font-mono text-xs">{user.id}</span>
            </div>
            <div>
              <span className="text-[#8a8276]">创建时间：</span>
              <span>{new Date(user.createdAt).toLocaleDateString("zh-CN")}</span>
            </div>
            <div>
              <span className="text-[#8a8276]">状态：</span>
              <span
                className={
                  user.isActive ? "text-green-600" : "text-red-600"
                }
              >
                {user.isActive ? "激活" : "已禁用"}
              </span>
            </div>
            <div>
              <span className="text-[#8a8276]">角色：</span>
              <span
                className={
                  user.role === "system_admin"
                    ? "font-medium text-[#e60012]"
                    : ""
                }
              >
                {user.role === "system_admin" ? "系统管理员" : "普通用户"}
              </span>
            </div>
          </div>

          <AdminEditUserForm user={user} />
        </div>
      </section>
    </AdminShell>
  );
}
