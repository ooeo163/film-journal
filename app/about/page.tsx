import Link from "next/link";

const filmStocks = [
  { name: "Kodak Portra 400", note: "柔和肤色、低对比度，最适合日常记录" },
  { name: "Fuji Pro 400H", note: "清冷调性，绿色和蓝色的表现力极好" },
  { name: "Ilford HP5 Plus", note: "经典黑白，颗粒感丰富，宽容度高" },
  { name: "Kodak Tri-X 400", note: "纪实风格的首选黑白，高光和暗部层次分明" },
  { name: "CineStill 800T", note: "电影胶片改机，钨丝灯光线下的色彩非常迷人" },
  { name: "Fuji Velvia 50", note: "反转片之王，饱和度极高，风光摄影利器" },
];

const gear = [
  { category: "135 相机", items: ["Leica M6", "Nikon FM2", "Contax T2"] },
  { category: "120 相机", items: ["Hasselblad 500C/M", "Mamiya 7 II"] },
  { category: "镜头", items: ["Summicron 35mm f/2", "Planar 45mm f/2", "Nikon 50mm f/1.4 AI-s"] },
  { category: "冲扫", items: ["自冲 C-41 / B&W", "Noritsu HS-1800 扫描"] },
];

const milestones = [
  { year: "2021", event: "开始系统性拍摄胶片，从一台 Nikon FM2 入手" },
  { year: "2022", event: "积累了第一批完整的 135 和 120 底片，开始自己冲洗黑白" },
  { year: "2023", event: "搭建 Film Journal 的雏形，用照片和文字重建记忆" },
  { year: "2024", event: "完成相册系统、胶卷时间轴，开始整理三年来的全部底片" },
  { year: "2025", event: "站点正式上线，开始接受协作投稿与底片档案共建" },
];

export default function AboutPage() {
  return (
    <main className="relative text-stone-100">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/homepage-background.jpg')",
        }}
      />
      <div className="fixed inset-0 bg-[linear-gradient(90deg,rgba(9,8,7,0.92)_0%,rgba(13,11,9,0.84)_36%,rgba(14,12,10,0.76)_65%,rgba(10,9,8,0.88)_100%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(7,6,5,0.3)_58%,rgba(5,4,4,0.78)_100%)]" />
      <div className="page-bg-soft-light fixed inset-0" />

      <div className="relative z-10 px-5 pb-20 pt-6 sm:px-6 md:px-8">
        <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-16 lg:gap-24">

          {/* Hero */}
          <section className="grid items-end gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <p
                className="text-xs uppercase tracking-[0.5em] text-stone-500"
                style={{ fontFamily: "var(--font-display), Georgia, serif" }}
              >
                About This Project
              </p>
              <h1
                className="text-4xl leading-[0.95] tracking-[0.04em] text-[#e9ddca] sm:text-5xl md:text-6xl"
                style={{ fontFamily: "var(--font-display), Georgia, serif", fontWeight: 300 }}
              >
                WHY FILM,
                <br />
                WHY NOW
              </h1>
              <p className="max-w-xl text-base leading-8 text-stone-300 md:text-lg">
                在一个一切都可以被即时删除的时代，胶片摄影教会我一件重要的事：
                每一次按下快门都应该是有意义的。这个网站是那些有意义瞬间的长期归宿。
              </p>
            </div>

            <div className="rounded-[1.75rem] border border-stone-700/60 bg-[rgba(11,10,9,0.4)] p-7 backdrop-blur-[1px]">
              <p
                className="text-xs uppercase tracking-[0.35em] text-stone-500"
                style={{ fontFamily: "var(--font-display), Georgia, serif" }}
              >
                In One Sentence
              </p>
              <p
                className="mt-5 text-xl leading-relaxed text-stone-200"
                style={{ fontFamily: "var(--font-display), Georgia, serif", fontWeight: 300 }}
              >
                &ldquo;用胶片的节奏，记录值得被记住的事。&rdquo;
              </p>
            </div>
          </section>

          {/* Philosophy */}
          <section className="grid gap-6 lg:grid-cols-3">
            {[
              {
                label: "Slow Photography",
                title: "慢摄影",
                body: "不追求效率，不追求流量。一卷 36 张的胶卷，可能跨越一个月的时间。这种节奏本身就是一种筛选——留下来的，都是真正想拍的。",
              },
              {
                label: "Archive Mindset",
                title: "档案思维",
                body: "照片不是发完朋友圈就可以丢弃的素材。它们需要被整理、归档、打标签，需要在五年后依然能被找到和回看。这个网站就是我的底片档案馆。",
              },
              {
                label: "Materiality",
                title: "物质性",
                body: "数码照片是像素，胶片是银盐颗粒。每一次扫描、每一次放大，都在提醒我：影像是有重量的。这种物质感让拍摄变成了一种更认真的行为。",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[1.75rem] border border-stone-700/70 bg-[rgba(17,16,15,0.7)] p-7 backdrop-blur-[1px]"
              >
                <p
                  className="text-[10px] uppercase tracking-[0.45em] text-stone-600"
                  style={{ fontFamily: "var(--font-display), Georgia, serif" }}
                >
                  {item.label}
                </p>
                <h2 className="mt-3 text-xl font-medium text-stone-100">
                  {item.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-stone-400">
                  {item.body}
                </p>
              </div>
            ))}
          </section>

          {/* Film Stocks */}
          <section>
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p
                  className="text-xs uppercase tracking-[0.5em] text-stone-500"
                  style={{ fontFamily: "var(--font-display), Georgia, serif" }}
                >
                  Film Stocks
                </p>
                <h2 className="mt-3 text-2xl font-medium text-stone-100 sm:text-3xl">
                  常用胶卷
                </h2>
              </div>
              <p className="hidden text-sm text-stone-500 sm:block">
                从负片到反转，从彩色到黑白
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filmStocks.map((stock, index) => (
                <div
                  key={stock.name}
                  className="flex items-baseline gap-4 rounded-2xl border border-stone-700/50 bg-[rgba(17,16,15,0.55)] px-5 py-4 backdrop-blur-[1px] transition-colors hover:border-stone-600/70 hover:bg-[rgba(25,21,17,0.7)]"
                >
                  <span
                    className="flex-shrink-0 text-[10px] tracking-[0.2em] text-stone-600"
                    style={{ fontFamily: "var(--font-display), Georgia, serif" }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-stone-200">{stock.name}</p>
                    <p className="mt-1 text-xs leading-6 text-stone-500">{stock.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Gear */}
          <section className="grid gap-6 lg:grid-cols-[0.55fr_0.45fr]">
            <div>
              <p
                className="text-xs uppercase tracking-[0.5em] text-stone-500"
                style={{ fontFamily: "var(--font-display), Georgia, serif" }}
              >
                Equipment
              </p>
              <h2 className="mt-3 text-2xl font-medium text-stone-100 sm:text-3xl">
                器材清单
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-stone-400">
                器材不是最重要的，但合适的工具能让拍摄过程更顺畅。
                以下是目前在用的主力设备，大部分是二手市场淘来的。
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {gear.map((group) => (
                <div
                  key={group.category}
                  className="rounded-[1.5rem] border border-stone-700/60 bg-[rgba(17,16,15,0.65)] p-6 backdrop-blur-[1px]"
                >
                  <p
                    className="text-[10px] uppercase tracking-[0.4em] text-stone-600"
                    style={{ fontFamily: "var(--font-display), Georgia, serif" }}
                  >
                    {group.category}
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-sm text-stone-300"
                      >
                        <span className="h-px w-3 flex-shrink-0 bg-stone-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Timeline */}
          <section>
            <div className="mb-8">
              <p
                className="text-xs uppercase tracking-[0.5em] text-stone-500"
                style={{ fontFamily: "var(--font-display), Georgia, serif" }}
              >
                Timeline
              </p>
              <h2 className="mt-3 text-2xl font-medium text-stone-100 sm:text-3xl">
                时间线
              </h2>
            </div>

            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-stone-800 sm:left-6" />

              <div className="space-y-8">
                {milestones.map((item) => (
                  <div key={item.year} className="relative pl-12 sm:pl-16">
                    <div className="absolute left-2.5 top-1.5 h-3 w-3 rounded-full border border-stone-600 bg-[#171310] sm:left-4.5" />
                    <p
                      className="text-sm tracking-[0.2em] text-stone-500"
                      style={{ fontFamily: "var(--font-display), Georgia, serif" }}
                    >
                      {item.year}
                    </p>
                    <p className="mt-1 text-base leading-7 text-stone-300">
                      {item.event}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Tech Stack */}
          <section className="rounded-[2rem] border border-stone-700/50 bg-[rgba(17,16,15,0.6)] px-8 py-10 backdrop-blur-[1px]">
            <div className="grid gap-10 lg:grid-cols-[0.4fr_0.6fr]">
              <div>
                <p
                  className="text-xs uppercase tracking-[0.5em] text-stone-500"
                  style={{ fontFamily: "var(--font-display), Georgia, serif" }}
                >
                  Built With
                </p>
                <h2 className="mt-3 text-2xl font-medium text-stone-100">
                  技术栈
                </h2>
                <p className="mt-4 text-sm leading-7 text-stone-400">
                  用现代 Web 技术构建，但保持胶片时代的审美。
                  自托管、无第三方图床、数据完全自主。
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { name: "Next.js 16", role: "App Router、SSR、Server Actions" },
                  { name: "PostgreSQL", role: "主数据库，Prisma ORM" },
                  { name: "Tailwind CSS 4", role: "原子化样式，响应式布局" },
                  { name: "sharp", role: "图片处理、压缩与缩略图生成" },
                  { name: "自托管", role: "本地存储，数据完全可控" },
                  { name: "scrypt", role: "密码哈希，timingSafeEqual 比较" },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-baseline gap-3 rounded-xl border border-stone-700/40 bg-[rgba(25,21,17,0.5)] px-4 py-3"
                  >
                    <span className="h-px w-3 flex-shrink-0 bg-stone-600" />
                    <div>
                      <p className="text-sm font-medium text-stone-200">{item.name}</p>
                      <p className="mt-0.5 text-xs text-stone-500">{item.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact / CTA */}
          <section className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div className="space-y-4">
              <p
                className="text-xs uppercase tracking-[0.5em] text-stone-500"
                style={{ fontFamily: "var(--font-display), Georgia, serif" }}
              >
                Get In Touch
              </p>
              <h2
                className="text-3xl leading-tight text-stone-100 sm:text-4xl"
                style={{ fontFamily: "var(--font-display), Georgia, serif", fontWeight: 300 }}
              >
                有想说的话，或者想分享的底片？
              </h2>
              <p className="max-w-lg text-sm leading-7 text-stone-400">
                如果你也在拍胶片，或者对这个项目有任何想法，欢迎通过 GitHub 联系。
                也接受胶片摄影作品的协作投稿。
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a
                href="https://github.com/ooeo163/film-journal"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-600/80 px-6 py-3 text-sm tracking-wider text-stone-200 transition-all hover:border-stone-400 hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </a>
              <Link
                href="/albums"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-700/60 px-6 py-3 text-sm tracking-wider text-stone-400 transition-all hover:border-stone-500 hover:text-stone-200"
              >
                浏览相册
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
