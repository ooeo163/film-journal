import { ReactNode } from "react";

const accountNavItems = [
  { label: "总览", href: "/me" },
  { label: "我的照片", href: "/me/photos" },
  { label: "我的相册", href: "/me/albums" },
  { label: "账号设置", href: "/me/settings" },
];

type AccountShellProps = {
  title: string;
  description: string;
  userName?: string | null;
  children: ReactNode;
};

export function AccountShell({
  title,
  description,
  userName,
  children,
}: AccountShellProps) {
  return (
    <main className="relative text-stone-100">
      <div
        className="home-background fixed inset-0"
      />
      <div className="fixed inset-0 bg-[linear-gradient(90deg,rgba(9,8,7,0.9)_0%,rgba(13,11,9,0.8)_36%,rgba(14,12,10,0.72)_65%,rgba(10,9,8,0.86)_100%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(7,6,5,0.26)_58%,rgba(5,4,4,0.74)_100%)]" />
      <div className="page-bg-soft-light fixed inset-0" />

      <div className="relative z-10 px-6 pb-14 pt-5">
        <div className="mx-auto grid w-full max-w-[1480px] gap-4 xl:grid-cols-[300px_1fr]">
          <aside className="rounded-[2rem] border border-stone-700/80 bg-[rgba(17,16,15,0.84)] p-6 shadow-[0_18px_50px_rgba(17,16,15,0.22)] backdrop-blur-[2px] xl:sticky xl:top-24 xl:h-fit">
            <div className="border-b border-stone-700/70 pb-4">
              <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                Account
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-stone-50">
                用户中心
              </h2>
            </div>

            <div className="mt-5 grid gap-3">
              {accountNavItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-[1.3rem] border border-stone-700/70 bg-[rgba(28,22,18,0.72)] px-4 py-4 text-sm text-stone-300 transition-colors hover:bg-[rgba(40,31,25,0.82)]"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </aside>

          <section className="rounded-[2rem] border border-stone-700/80 bg-[rgba(17,16,15,0.84)] p-8 shadow-[0_18px_50px_rgba(17,16,15,0.22)] backdrop-blur-[2px]">
            <header className="border-b border-stone-700/70 pb-5">
              <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                User Center
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-50">
                {title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-stone-300">
                {description}
              </p>
              {userName ? (
                <p className="mt-4 text-sm uppercase tracking-[0.3em] text-stone-500">
                  当前账号：{userName}
                </p>
              ) : null}
            </header>

            <div className="mt-8">{children}</div>
          </section>
        </div>
      </div>
    </main>
  );
}
