"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { label: "首页", href: "/", en: "Home" },
  { label: "照片", href: "/photos", en: "Photos" },
  { label: "相册", href: "/albums", en: "Albums" },
  { label: "关于", href: "/about", en: "About" },
];

type SiteHeaderProps = {
  isLoggedIn: boolean;
  userName: string | null;
  userRole: string | null;
};

export function SiteHeader({ isLoggedIn, userName, userRole }: SiteHeaderProps) {
  const pathname = usePathname();
  const isOverlayRoute = pathname === "/" || pathname === "/login";
  const isSystemAdmin = userRole === "system_admin";
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={
          isOverlayRoute
            ? "absolute inset-x-0 top-0 z-40"
            : "sticky top-0 z-40 border-b border-stone-700/70 bg-[#16120f]/92 backdrop-blur"
        }
      >
        <div className="mx-auto flex w-full max-w-[1480px] items-center justify-between gap-6 px-5 py-6 md:px-8 xl:px-10">
          <Link href="/" className="min-w-0">
            <p className="font-serif text-xs uppercase tracking-[0.45em] text-stone-400" style={{ fontFamily: "var(--font-display), Georgia, serif" }}>
              Film Journal
            </p>
            <p className="mt-1 text-sm text-stone-300">
              Archive of film photography
            </p>
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-8 text-sm tracking-[0.12em] text-stone-300">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    className={`transition-colors hover:text-stone-50 ${pathname === item.href ? "text-stone-50" : ""}`}
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
                    <Link
                      href="/admin/photos"
                      className="block rounded-[0.9rem] px-4 py-3 text-sm text-stone-200 transition-colors hover:bg-[rgba(40,31,25,0.82)]"
                    >
                      内容管理
                    </Link>
                    <form method="post" action="/api/auth/logout">
                      <button
                        type="submit"
                        className="block w-full rounded-[0.9rem] px-4 py-3 text-left text-sm text-stone-200 transition-colors hover:bg-[rgba(40,31,25,0.82)]"
                      >
                        退出登录
                      </button>
                    </form>
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

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="relative flex h-10 w-10 items-center justify-center text-stone-300 transition-colors hover:text-white md:hidden"
            aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
            aria-expanded={mobileOpen}
          >
            <span className={`absolute block w-5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${mobileOpen ? "rotate-45" : "-translate-y-1.5"}`} style={{ height: "1.5px", background: "currentColor" }} />
            <span className={`absolute block w-5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${mobileOpen ? "opacity-0 scale-x-0" : ""}`} style={{ height: "1.5px", background: "currentColor" }} />
            <span className={`absolute block w-5 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${mobileOpen ? "-rotate-45" : "translate-y-1.5"}`} style={{ height: "1.5px", background: "currentColor" }} />
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[10000] md:hidden ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!mobileOpen}
      >
        <div
          className={`absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-500 ease-out ${mobileOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileOpen(false)}
        />

        <nav
          ref={drawerRef}
          aria-label="Mobile navigation"
          className={`absolute right-0 top-0 flex h-full w-[min(88vw,360px)] flex-col overflow-y-auto border-l border-stone-700/40 bg-[#0f0d0b] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between px-7 pb-2 pt-7">
            <p className="text-[10px] uppercase tracking-[0.5em] text-stone-600" style={{ fontFamily: "var(--font-display), Georgia, serif" }}>
              Navigation
            </p>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-700/60 text-stone-500 transition-colors hover:border-stone-500 hover:text-stone-300"
              aria-label="关闭菜单"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div className="mt-4 flex-1 px-3">
            <ul className="flex flex-col gap-0.5">
              {navItems.map((item, index) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`group flex items-baseline gap-4 rounded-2xl px-5 py-4 transition-all duration-300 ${
                        active
                          ? "bg-[rgba(255,255,255,0.06)] text-white"
                          : "text-stone-400 hover:bg-[rgba(255,255,255,0.03)] hover:text-stone-200"
                      }`}
                    >
                      <span className="w-5 text-right text-[10px] tracking-[0.2em] text-stone-600 transition-colors group-hover:text-stone-500" style={{ fontFamily: "var(--font-display), Georgia, serif" }}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="flex flex-1 items-baseline justify-between gap-3">
                        <span className="text-lg tracking-wide">{item.label}</span>
                        <span className="text-[10px] uppercase tracking-[0.35em] text-stone-600 transition-colors group-hover:text-stone-500" style={{ fontFamily: "var(--font-display), Georgia, serif" }}>
                          {item.en}
                        </span>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="border-t border-stone-800/80 px-7 py-6">
            {isLoggedIn ? (
              <div className="flex flex-col gap-1">
                <p className="mb-3 text-[10px] uppercase tracking-[0.4em] text-stone-600" style={{ fontFamily: "var(--font-display), Georgia, serif" }}>
                  {userName ?? "已登录用户"}
                </p>
                <a href="/me" onClick={() => setMobileOpen(false)} className="block py-2.5 text-sm tracking-wider text-stone-400 transition-colors hover:text-stone-100">
                  用户中心
                </a>
                <a href="/me/settings" onClick={() => setMobileOpen(false)} className="block py-2.5 text-sm tracking-wider text-stone-400 transition-colors hover:text-stone-100">
                  账号设置
                </a>
                {isSystemAdmin ? (
                  <Link href="/admin" onClick={() => setMobileOpen(false)} className="block py-2.5 text-sm tracking-wider text-stone-400 transition-colors hover:text-stone-100">
                    系统管理
                  </Link>
                ) : null}
                <Link href="/admin/photos" onClick={() => setMobileOpen(false)} className="block py-2.5 text-sm tracking-wider text-stone-400 transition-colors hover:text-stone-100">
                  内容管理
                </Link>
                <form method="post" action="/api/auth/logout">
                  <button
                    type="submit"
                    onClick={() => setMobileOpen(false)}
                    className="mt-2 block w-full py-2.5 text-left text-sm tracking-wider text-stone-500 transition-colors hover:text-stone-300"
                  >
                    退出登录
                  </button>
                </form>
              </div>
            ) : (
              <a
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block py-2.5 text-sm tracking-wider text-stone-400 transition-colors hover:text-stone-100"
              >
                登录
              </a>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
