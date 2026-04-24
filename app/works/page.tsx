import { cookies } from "next/headers";
import { HomeArchiveContent } from "@/components/home-archive-content";

export default async function WorksPage() {
  const cookieStore = await cookies();
  const userName = cookieStore.get("fj_user_name")?.value || "Admin";

  return (
    <main className="relative text-stone-100">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/homepage-background.jpg')",
        }}
      />
      <div className="fixed inset-0 bg-[linear-gradient(90deg,rgba(9,8,7,0.84)_0%,rgba(12,10,8,0.74)_36%,rgba(16,13,10,0.52)_65%,rgba(10,9,8,0.76)_100%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(7,6,5,0.24)_58%,rgba(5,4,4,0.68)_100%)]" />
      <div className="fixed inset-0 pointer-events-none opacity-30 [background-image:radial-gradient(rgba(220,202,174,0.14)_0.8px,transparent_0.8px)] [background-size:18px_18px]" />

      <div className="relative z-10 px-6 pt-28">
        <div className="mx-auto w-full max-w-[1480px]">
          <section className="rounded-[2rem] border border-stone-700/80 bg-[rgba(17,16,15,0.72)] px-8 py-8 shadow-[0_18px_50px_rgba(17,16,15,0.22)] backdrop-blur-[2px]">
            <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
              Works Home
            </p>
            <div className="mt-4 grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-end">
              <div>
                <h1 className="text-4xl font-semibold tracking-tight text-stone-50 md:text-5xl">
                  欢迎回来，{userName}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-8 text-stone-300">
                  这里是登录后的内容首页。你可以从这里继续进入照片、相册、文章和用户中心。
                </p>
              </div>
              <div className="text-sm leading-7 text-stone-400">
                当前已打通：
                登录回跳 / 作品归档页 / 照片主线 / 相册主线 / 文章主线
              </div>
            </div>
          </section>
        </div>
      </div>

      <HomeArchiveContent />
    </main>
  );
}
