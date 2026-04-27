export default function AboutPage() {
  return (
    <main className="relative text-stone-100">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/homepage-background.jpg')",
        }}
      />
      <div className="fixed inset-0 bg-[linear-gradient(90deg,rgba(9,8,7,0.88)_0%,rgba(13,11,9,0.8)_36%,rgba(14,12,10,0.72)_65%,rgba(10,9,8,0.84)_100%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(7,6,5,0.26)_58%,rgba(5,4,4,0.72)_100%)]" />
      <div className="page-bg-soft-light fixed inset-0" />

      <div className="relative z-10 px-6 pb-14 pt-5">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4">
          <section className="grid gap-4 border-b border-stone-700/70 pb-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.45em] text-stone-500">
                About
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-stone-50 md:text-5xl">
                关于 Film Journal
              </h1>
              <p className="max-w-2xl text-base leading-8 text-stone-300">
                这是一个围绕胶片摄影建立的长期记录与展示网站。它不仅用来存放照片，
                也会逐步沉淀成相册、时间轴，以及更完整的摄影档案系统。
              </p>
            </div>

            <div className="rounded-[2rem] border border-stone-700/80 bg-[rgba(28,22,18,0.82)] p-6 shadow-[0_14px_44px_rgba(0,0,0,0.28)] backdrop-blur-[2px]">
              <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                Site Direction
              </p>
              <div className="mt-4 space-y-3 text-sm leading-7 text-stone-300">
                <p>风格方向：复古胶片感、档案馆气质、现代克制排版。</p>
                <p>内容主线：照片、相册，后续再延展到胶卷、相机与时间轴。</p>
              </div>
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            <section className="rounded-[2rem] border border-stone-700/80 bg-[rgba(28,22,18,0.82)] p-8 shadow-[0_14px_44px_rgba(0,0,0,0.24)] backdrop-blur-[2px]">
              <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                Why This Site
              </p>
              <div className="mt-6 space-y-4 text-base leading-8 text-stone-300">
                <p>照片会随着时间堆积，但没有好的结构就很难真正回看。</p>
                <p>这个网站的目标，是把拍摄过的内容重新组织成更有秩序、更可持续浏览的档案。</p>
                <p>它既是个人摄影记录站，也会逐步支持协作上传、审核和后台管理。</p>
              </div>
            </section>

            <section className="rounded-[2rem] border border-stone-700/80 bg-[rgba(36,29,24,0.82)] p-8 shadow-[0_14px_44px_rgba(0,0,0,0.24)] backdrop-blur-[2px]">
              <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                Current Stage
              </p>
              <div className="mt-6 space-y-4 text-base leading-8 text-stone-300">
                <p>当前已经完成前台骨架、照片主线和相册主线第一版。</p>
                <p>下一步会继续补充登录、用户中心、上传管理，以及更完整的后台体系。</p>
                <p>图片存储当前先读本地目录，后续会逐步切换到腾讯云 COS。</p>
              </div>
            </section>
          </section>

          <section className="rounded-[2rem] border border-stone-700/80 bg-[rgba(17,16,15,0.84)] px-8 py-10 shadow-[0_18px_50px_rgba(17,16,15,0.22)] backdrop-blur-[2px]">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                  Photos
                </p>
                <p className="mt-3 text-sm leading-7 text-stone-300">
                  承载单张照片及其元数据，是最基础的内容单元。
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                  Albums
                </p>
                <p className="mt-3 text-sm leading-7 text-stone-300">
                  用胶卷式结构组织一组照片，是整站最重要的视觉识别模块。
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
