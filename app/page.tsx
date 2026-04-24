export default function Home() {
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

      <div className="relative z-10">
        <section className="relative min-h-screen overflow-hidden">

          <div className="relative mx-auto flex min-h-screen w-full max-w-[1480px] flex-col justify-between px-5 pb-10 pt-32 md:px-8 xl:px-10">
            <div className="grid flex-1 items-center gap-10 lg:grid-cols-[0.98fr_1.02fr]">
              <div className="max-w-[760px] space-y-7">
                <p className="text-xs uppercase tracking-[0.45em] text-stone-400">
                  Capturing Time, Preserving Stories.
                </p>
                <h1 className="font-serif text-5xl leading-[0.92] tracking-[0.08em] text-[#e9ddca] md:text-7xl">
                  PHOTOGRAPHS
                  <br />
                  AS MEMORIES
                </h1>
                <div className="max-w-xl space-y-3 text-base leading-8 text-stone-300 md:text-lg">
                  <p>一个围绕胶片摄影建立的长期档案与展示网站。</p>
                  <p>照片会沉淀成相册、文章、时间轴，以及一整套更完整的记录系统。</p>
                </div>
                <div className="pt-4">
                  <a
                    className="inline-flex items-center gap-4 border-b border-stone-400 pb-3 text-sm uppercase tracking-[0.35em] text-stone-200 transition-colors hover:text-white"
                    href="/works"
                  >
                    Explore Works
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>

              <div className="hidden lg:flex lg:justify-end">
                <div className="w-full max-w-[420px] rounded-[1.75rem] border border-stone-700/70 bg-[rgba(11,10,9,0.34)] p-7 backdrop-blur-[2px]">
                  <p className="text-sm leading-8 text-stone-300">
                    Photography is a way of feeling, touching, of loving. What you have caught on film is captured forever.
                  </p>
                  <p className="mt-6 text-sm uppercase tracking-[0.3em] text-stone-500">
                    Film Journal
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-end justify-between gap-6 pt-12 text-stone-500">
              <div className="hidden md:block">
                <p className="text-xs uppercase tracking-[0.4em]">Scroll To Explore</p>
              </div>
              <div className="text-right text-xs uppercase tracking-[0.35em]">
                Archive of photographs, albums and journals
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
