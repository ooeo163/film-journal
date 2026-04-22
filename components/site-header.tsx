"use client";

import { usePathname } from "next/navigation";

const navItems = [
  { label: "首页", href: "/" },
  { label: "照片", href: "/photos" },
  { label: "相册", href: "/albums" },
  { label: "文章", href: "/journals" },
  { label: "关于", href: "/about" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

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
      </div>
    </header>
  );
}
