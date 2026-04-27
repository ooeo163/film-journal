import Link from "next/link";

export default function Home() {
  return (
    <main className="relative text-stone-100">
      <div
        className="home-bg-reveal fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/homepage-background.jpg')",
        }}
      />

      <div className="relative z-10">
        <section className="relative min-h-screen overflow-hidden">
          <div className="relative mx-auto flex min-h-screen w-full max-w-[1480px] flex-col justify-between px-5 pb-10 pt-32 md:px-8 xl:px-10">
            <div className="grid flex-1 items-center gap-10 lg:grid-cols-[0.98fr_1.02fr]">
              <div className="home-copy-enter max-w-[760px] space-y-7">
                <p className="home-stagger-1 text-xs uppercase tracking-[0.45em] text-stone-400">
                  Capturing Time, Preserving Stories.
                </p>
                <h1 className="home-stagger-2 font-serif text-5xl leading-[0.92] tracking-[0.08em] text-[#e9ddca] md:text-7xl">
                  PHOTOGRAPHS
                  <br />
                  AS MEMORIES
                </h1>
                <div className="home-stagger-3 max-w-xl space-y-3 text-base leading-8 text-stone-300 md:text-lg">
                  <p>一个围绕胶片摄影建立的长期档案与展示网站。</p>
                  <p>照片会沉淀成相册、时间轴，以及一整套更完整的记录系统。</p>
                </div>
                <div className="home-stagger-4 pt-4">
                  <Link
                    className="group inline-flex origin-left items-center gap-4 border-b border-stone-400 pb-3 text-sm uppercase tracking-[0.35em] text-stone-200 transition duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.03] hover:border-stone-100 hover:text-white hover:brightness-125"
                    href="/albums"
                  >
                    Explore Albums
                    <span
                      className="transition-transform duration-300 ease-out group-hover:translate-x-1.5"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </Link>
                </div>
              </div>

              <div className="hidden lg:flex lg:justify-end">
                <div className="home-quote-enter w-full max-w-[420px] rounded-[1.75rem] border border-stone-700/70 bg-[rgba(11,10,9,0.34)] p-7 backdrop-blur-[2px]">
                  <p className="text-sm leading-8 text-stone-300">
                    Photography is a way of feeling, touching, of loving. What you have caught on film is captured forever.
                  </p>
                  <p className="mt-6 text-sm uppercase tracking-[0.3em] text-stone-500">
                    Film Journal
                  </p>
                </div>
              </div>
            </div>

            <div className="home-footer-enter flex items-end justify-between gap-6 pt-12 text-stone-500">
              <div className="hidden md:block">
                <p className="text-xs uppercase tracking-[0.4em]">Scroll To Explore</p>
              </div>
              <div className="text-right text-xs uppercase tracking-[0.35em]">
                Archive of photographs and albums
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
