type AdminGridFiltersProps = {
  basePath: string;
  searchPlaceholder?: string;
  defaultQuery?: string;
  defaultStatus?: string;
  defaultPageSize?: number;
};

export function AdminGridFilters({
  basePath,
  searchPlaceholder = "搜索标题、slug 或其他关键字段",
  defaultQuery = "",
  defaultStatus = "all",
  defaultPageSize = 20,
}: AdminGridFiltersProps) {
  return (
    <form action={basePath} method="get" className="flex flex-wrap items-end gap-3">
      <label className="min-w-[260px] flex-1 space-y-2 text-sm text-[#33312e]">
        <span className="block text-xs uppercase tracking-[0.2em] text-[#8a8276]">
          搜索
        </span>
        <input
          type="search"
          name="q"
          defaultValue={defaultQuery}
          placeholder={searchPlaceholder}
          className="w-full border border-[#d6d0c5] bg-white px-3 py-2 text-[#111111] outline-none transition-all placeholder:text-[#9a9389] hover:border-[#b8afa2] focus:border-[#c44b37] focus:shadow-[0_0_0_3px_rgba(196,75,55,0.10)]"
        />
      </label>

      <label className="w-[180px] space-y-2 text-sm text-[#33312e]">
        <span className="block text-xs uppercase tracking-[0.2em] text-[#8a8276]">
          状态
        </span>
        <select
          name="status"
          defaultValue={defaultStatus}
          className="w-full border border-[#d6d0c5] bg-white px-3 py-2 text-[#111111] outline-none transition-all hover:border-[#b8afa2] focus:border-[#c44b37] focus:shadow-[0_0_0_3px_rgba(196,75,55,0.10)]"
        >
          <option value="all">全部</option>
          <option value="published">已发布</option>
          <option value="draft">未发布</option>
        </select>
      </label>

      <label className="w-[150px] space-y-2 text-sm text-[#33312e]">
        <span className="block text-xs uppercase tracking-[0.2em] text-[#8a8276]">
          每页条数
        </span>
        <select
          name="pageSize"
          defaultValue={String(defaultPageSize)}
          className="w-full border border-[#d6d0c5] bg-white px-3 py-2 text-[#111111] outline-none transition-all hover:border-[#b8afa2] focus:border-[#c44b37] focus:shadow-[0_0_0_3px_rgba(196,75,55,0.10)]"
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </label>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="border border-[#1f1f1d] bg-[#1f1f1d] px-4 py-2 text-sm text-white shadow-[0_8px_18px_rgba(31,31,29,0.12)] transition-all hover:border-[#c44b37] hover:bg-[#2c2925]"
        >
          应用筛选
        </button>
        <a
          href={basePath}
          className="border border-[#d6d0c5] bg-white px-4 py-2 text-sm text-[#33312e] transition-all hover:border-[#c44b37] hover:bg-[#fff8f5] hover:text-[#8a2f22]"
        >
          重置
        </a>
      </div>
    </form>
  );
}
