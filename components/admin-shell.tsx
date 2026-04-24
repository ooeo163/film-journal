import Link from "next/link";
import { ReactNode } from "react";

const adminNavItems = [
  { href: "/admin", label: "总览" },
  { href: "/admin/photos", label: "照片管理" },
  { href: "/admin/albums", label: "相册管理" },
  { href: "/admin/journals", label: "文章管理" },
  { href: "/admin/media", label: "导入与上传" },
];

type AdminShellProps = {
  title: string;
  description: string;
  currentPath: string;
  actions?: ReactNode;
  stats?: ReactNode;
  notice?: ReactNode;
  children: ReactNode;
};

export function AdminShell({
  title,
  description,
  currentPath,
  actions,
  stats,
  notice,
  children,
}: AdminShellProps) {
  return (
    <main className="min-h-screen bg-[#181411] px-4 pb-10 pt-18 text-stone-100 md:px-6">
      <div className="mx-auto grid max-w-[1480px] gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="h-fit border border-stone-700 bg-[#211c18] shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
          <div className="border-b border-stone-700 px-5 py-5">
            <p className="text-[11px] uppercase tracking-[0.32em] text-stone-500">
              Admin Console
            </p>
            <p className="mt-2 text-lg font-semibold text-stone-50">后台管理</p>
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
                      ? "mb-1 block border border-amber-600/40 bg-amber-900/20 px-4 py-3 text-sm font-medium text-amber-100"
                      : "mb-1 block border border-transparent px-4 py-3 text-sm text-stone-200 transition-colors hover:border-stone-700 hover:bg-[#2a241f] hover:text-white"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section className="space-y-5">
          <header className="border border-stone-700 bg-[#221d18] shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
            <div className="flex flex-wrap items-start justify-between gap-4 px-6 py-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-stone-500">
                  {currentPath.replaceAll("/", " / ").replace(/^ /, "")}
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-50">
                  {title}
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-300">
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
