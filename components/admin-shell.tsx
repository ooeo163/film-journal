import Link from "next/link";
import { ReactNode } from "react";
import { cookies } from "next/headers";

type AdminShellProps = {
  title: string;
  description: string;
  currentPath: string;
  actions?: ReactNode;
  stats?: ReactNode;
  notice?: ReactNode;
  children: ReactNode;
};

export async function AdminShell({
  title,
  description,
  currentPath,
  actions,
  stats,
  notice,
  children,
}: AdminShellProps) {
  const cookieStore = await cookies();
  const userRole = cookieStore.get("fj_user_role")?.value;
  const isSystemAdmin = userRole === "system_admin";

  const adminNavItems = isSystemAdmin
    ? [
        { href: "/admin", label: "系统管理" },
        { href: "/admin/users", label: "用户管理" },
        { href: "/admin/photos", label: "照片管理" },
        { href: "/admin/albums", label: "相册管理" },
        { href: "/admin/media", label: "导入与上传" },
      ]
    : [
        { href: "/admin/photos", label: "照片管理" },
        { href: "/admin/albums", label: "相册管理" },
        { href: "/admin/media", label: "导入与上传" },
      ];

  return (
    <main className="admin-light min-h-screen bg-[linear-gradient(180deg,#f7f5f0_0%,#eeebe3_100%)] px-4 pb-10 pt-18 text-[#1f1f1d] md:px-6">
      <div className="mx-auto grid max-w-[1480px] gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="h-fit border border-[#d6d0c5] bg-[#fbfaf7] shadow-[0_18px_44px_rgba(28,24,20,0.06)]">
          <div className="border-b border-[#ded8cf] bg-[#f2efe8] px-5 py-5">
            <p className="text-[11px] uppercase tracking-[0.32em] text-[#8a8276]">
              Admin Console
            </p>
            <p className="mt-2 text-lg font-semibold text-[#1f1f1d]">
              {isSystemAdmin ? "系统管理" : "后台管理"}
            </p>
          </div>

          <nav className="p-2">
            {adminNavItems.map((item) => {
              const active = currentPath === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    active
                      ? "mb-1 block border border-[#d8cbc0] bg-white px-4 py-3 text-sm font-medium text-[#111111] shadow-[inset_3px_0_0_#e60012]"
                      : "mb-1 block border border-transparent px-4 py-3 text-sm text-[#4b4741] transition-colors hover:border-[#d8cbc0] hover:bg-[#f4f1eb] hover:text-[#111111]"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="space-y-5">
          <header className="border border-[#d6d0c5] bg-white shadow-[0_16px_40px_rgba(28,24,20,0.06)]">
            <div className="flex flex-wrap items-start justify-between gap-4 px-6 py-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-[#8a8276]">
                  {currentPath.replaceAll("/", " / ").replace(/^ /, "")}
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#111111]">
                  {title}
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5d574f]">
                  {description}
                </p>
              </div>

              {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
            </div>
          </header>

          {stats ? <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{stats}</section> : null}

          {notice}

          {children}
        </section>
      </div>
    </main>
  );
}
