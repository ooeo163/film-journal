import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { prisma } from "@/lib/prisma";
import { UserRegistrationForm } from "@/components/user-registration-form";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    where: { isActive: true },
    select: {
      id: true,
      username: true,
      email: true,
      displayName: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminShell
      title="用户管理"
      description="管理系统用户账号，注册新用户。"
      currentPath="/admin/users"
    >
      <section className="border border-[#d6d0c5] bg-white shadow-[0_16px_40px_rgba(28,24,20,0.05)]">
        <div className="border-b border-[#ded8cf] bg-[#f7f5f0] px-5 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#222222]">
            注册新用户
          </h2>
        </div>
        <div className="p-5">
          <UserRegistrationForm />
        </div>
      </section>

      <section className="border border-[#d6d0c5] bg-white shadow-[0_16px_40px_rgba(28,24,20,0.05)]">
        <div className="border-b border-[#ded8cf] bg-[#f7f5f0] px-5 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#222222]">
            用户列表
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#ded8cf]">
                <th className="px-5 py-3 text-left text-[11px] uppercase tracking-[0.24em] text-[#8a8276]">
                  用户名
                </th>
                <th className="px-5 py-3 text-left text-[11px] uppercase tracking-[0.24em] text-[#8a8276]">
                  显示名
                </th>
                <th className="px-5 py-3 text-left text-[11px] uppercase tracking-[0.24em] text-[#8a8276]">
                  邮箱
                </th>
                <th className="px-5 py-3 text-left text-[11px] uppercase tracking-[0.24em] text-[#8a8276]">
                  角色
                </th>
                <th className="px-5 py-3 text-left text-[11px] uppercase tracking-[0.24em] text-[#8a8276]">
                  创建时间
                </th>
                <th className="px-5 py-3 text-left text-[11px] uppercase tracking-[0.24em] text-[#8a8276]">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-[#ded8cf] last:border-b-0"
                >
                  <td className="px-5 py-4 text-sm text-[#111111]">
                    {user.username}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#5d574f]">
                    {user.displayName}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#5d574f]">
                    {user.email}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                        user.role === "system_admin"
                          ? "bg-[#e60012] text-white"
                          : "bg-[#f7f5f0] text-[#5d574f]"
                      }`}
                    >
                      {user.role === "system_admin" ? "系统管理员" : "普通用户"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-[#5d574f]">
                    {new Date(user.createdAt).toLocaleDateString("zh-CN")}
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/users/${user.id}/edit`}
                      className="inline-block rounded border border-[#d6d0c5] bg-white px-3 py-1 text-sm text-[#5d574f] transition-colors hover:bg-[#f7f5f0]"
                    >
                      编辑
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
