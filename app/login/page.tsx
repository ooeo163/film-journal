type LoginPageProps = {
  searchParams?: Promise<{
    redirectTo?: string;
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const redirectTo = params?.redirectTo || "/albums";
  const error = params?.error || null;

  return (
    <main className="relative h-screen overflow-hidden text-stone-100">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/homepage-background.jpg')",
        }}
      />
      <div className="fixed inset-0 bg-[linear-gradient(90deg,rgba(9,8,7,0.9)_0%,rgba(13,11,9,0.82)_36%,rgba(14,12,10,0.76)_65%,rgba(10,9,8,0.88)_100%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(7,6,5,0.28)_58%,rgba(5,4,4,0.74)_100%)]" />
      <div className="page-bg-soft-light fixed inset-0" />

      <div className="relative z-10 flex h-screen items-center justify-center overflow-hidden px-6 py-8">
        <section className="w-full max-w-[560px] rounded-[2rem] border border-stone-700/80 bg-[rgba(17,16,15,0.86)] p-8 shadow-[0_18px_50px_rgba(17,16,15,0.22)] backdrop-blur-[2px]">
          <div className="border-b border-stone-700/70 pb-5">
            <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
              Login
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-50">
              登录
            </h1>
          </div>

          {error === "invalid-credentials" ? (
            <div className="mt-6 rounded-[1.2rem] border border-red-700/40 bg-[rgba(77,22,22,0.38)] p-4 text-sm leading-7 text-red-100">
              用户名或密码错误，请重试。
            </div>
          ) : null}

          <form className="mt-8 space-y-5" method="post" action="/api/auth/login">
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <label className="grid gap-2">
              <span className="text-sm text-stone-400">邮箱或用户名</span>
              <input
                name="identifier"
                type="text"
                placeholder="your@email.com"
                autoComplete="off"
                className="rounded-[1rem] border border-stone-700/80 bg-[rgba(28,22,18,0.76)] px-4 py-3 text-stone-100 outline-none transition-colors placeholder:text-stone-500 focus:border-stone-500 [&:-webkit-autofill]:[-webkit-text-fill-color:rgb(214,211,209)] [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s]"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm text-stone-400">密码</span>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                autoComplete="off"
                className="rounded-[1rem] border border-stone-700/80 bg-[rgba(28,22,18,0.76)] px-4 py-3 text-stone-100 outline-none transition-colors placeholder:text-stone-500 focus:border-stone-500 [&:-webkit-autofill]:[-webkit-text-fill-color:rgb(214,211,209)] [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s]"
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-[1rem] bg-[rgba(118,95,73,0.88)] px-4 py-3 text-sm font-medium text-stone-100 transition-colors hover:bg-[rgba(145,116,89,0.92)]"
            >
              登录
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
