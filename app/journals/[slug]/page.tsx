import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type JournalDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function JournalDetailPage({
  params,
}: JournalDetailPageProps) {
  const { slug } = await params;

  const journal = await prisma.journal.findUnique({
    where: {
      slug,
    },
  });

  if (!journal || !journal.isPublished) {
    notFound();
  }

  return (
    <main className="relative text-stone-100">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/homepage-background.jpg')",
        }}
      />
      <div className="fixed inset-0 bg-[linear-gradient(90deg,rgba(9,8,7,0.9)_0%,rgba(13,11,9,0.82)_36%,rgba(14,12,10,0.76)_65%,rgba(10,9,8,0.88)_100%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(7,6,5,0.28)_58%,rgba(5,4,4,0.74)_100%)]" />

      <div className="relative z-10 px-6 py-28">
        <article className="mx-auto flex w-full max-w-[1080px] flex-col gap-10">
          <header className="space-y-5 border-b border-stone-700/70 pb-10">
            <p className="text-xs uppercase tracking-[0.45em] text-stone-500">
              Journal Detail
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-stone-50 md:text-5xl">
              {journal.title}
            </h1>
            <p className="max-w-3xl text-base leading-8 text-stone-300">
              {journal.excerpt ?? "这篇文章当前还没有单独摘要，后续会继续完善文章的导语和结构。"}
            </p>
          </header>

          <section className="rounded-[2rem] border border-stone-700/80 bg-[rgba(28,22,18,0.82)] p-8 shadow-[0_14px_44px_rgba(0,0,0,0.24)] backdrop-blur-[2px]">
            <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
              Article Body
            </p>
            <div className="mt-6 space-y-6 text-base leading-9 text-stone-200">
              {journal.content ? (
                journal.content.split("\n").filter(Boolean).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              ) : (
                <>
                  <p>当前详情页已经接入真实文章模型，但还没有正式内容。</p>
                  <p>下一步会为文章增加录入数据，并逐步完善摄影文章的版式风格。</p>
                </>
              )}
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
