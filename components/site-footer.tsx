export function SiteFooter() {
  return (
    <footer className="border-t border-stone-700/70 bg-[#120f0d]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-stone-400 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="uppercase tracking-[0.35em] text-stone-500" style={{ fontFamily: "var(--font-display), Georgia, serif" }}>
            Film Journal
          </p>
          <p>真实胶卷感、档案馆气质、现代克制排版。</p>
        </div>

        <div className="space-y-1 text-left md:text-right">
          <p style={{ fontFamily: "var(--font-display), Georgia, serif" }}>Photos, albums, and long-term archive.</p>
          <p>Built with Next.js, PostgreSQL, and Prisma.</p>
        </div>
      </div>
    </footer>
  );
}
