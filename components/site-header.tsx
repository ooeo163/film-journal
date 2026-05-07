"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "首页", href: "/" },
  { label: "照片", href: "/photos" },
  { label: "相册", href: "/albums" },
  { label: "关于", href: "/about" },
];

type SiteHeaderProps = {
  isLoggedIn: boolean;
  userName: string | null;
  userRole: string | null;
};

export function SiteHeader({ isLoggedIn, userName, userRole }: SiteHeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isSystemAdmin = userRole === "system_admin";

  return (
    <header
      className={
        isHome
          ? "absolute inset-x-0 top-0 z-40"
          : "sticky top-0 z-40 border-b border-stone-700/70 bg-[#16120f]/92 backdrop-blur"
      }
    >
      <div className="mx-auto flex w-full max-w-[1480px] items-center justify-between gap-6 px-5 py-6 md:px-8 xl:px-10">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.45em] text-stone-400">
            Film Journal
          </p>
          <p className="mt-1 text-sm text-stone-300">
            Archive of film photography
          </p>
        </div>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm text-stone-300">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  className="transition-colors hover:text-stone-50"
                  href={item.href}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="relative hidden md:block">
          <div className="group relative">
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-700/80 bg-[rgba(18,15,13,0.6)] text-stone-200 transition-colors hover:bg-stone-800/70 hover:text-white"
              aria-label="Account menu"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M20 21a8 8 0 1 0-16 0" />
                <circle cx="12" cy="8" r="4" />
              </svg>
            </button>

            <div className="invisible absolute right-0 top-full z-50 mt-3 min-w-[190px] rounded-[1.2rem] border border-stone-700/80 bg-[rgba(17,16,15,0.94)] p-2 opacity-0 shadow-[0_18px_50px_rgba(0,0,0,0.32)] transition-all duration-200 group-hover:visible group-hover:opacity-100">
              {isLoggedIn ? (
                <>
                  <div className="rounded-[0.9rem] border border-stone-700/70 px-4 py-3 text-sm text-stone-400">
                    {userName ?? "已登录用户"}
                  </div>
                  <a
                    href="/me"
                    className="block rounded-[0.9rem] px-4 py-3 text-sm text-stone-200 transition-colors hover:bg-[rgba(40,31,25,0.82)]"
                  >
                    用户中心
                  </a>
                  <a
                    href="/me/settings"
                    className="block rounded-[0.9rem] px-4 py-3 text-sm text-stone-200 transition-colors hover:bg-[rgba(40,31,25,0.82)]"
                  >
                    账号设置
                  </a>
                  {isSystemAdmin ? (
                    <Link
                      href="/admin"
                      className="block rounded-[0.9rem] px-4 py-3 text-sm text-stone-200 transition-colors hover:bg-[rgba(40,31,25,0.82)]"
                    >
                      系统管理
                    </Link>
                  ) : null}
                  <a
                    href="/api/auth/logout"
                    className="block rounded-[0.9rem] px-4 py-3 text-sm text-stone-200 transition-colors hover:bg-[rgba(40,31,25,0.82)]"
                  >
                    退出登录
                  </a>
                </>
              ) : (
                <a
                  href="/login"
                  className="block rounded-[0.9rem] px-4 py-3 text-sm text-stone-200 transition-colors hover:bg-[rgba(40,31,25,0.82)]"
                >
                  登录
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
