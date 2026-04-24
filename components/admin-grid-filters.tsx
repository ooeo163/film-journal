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
      <label className="min-w-[260px] flex-1 space-y-2 text-sm text-stone-300">
        <span className="block text-xs uppercase tracking-[0.2em] text-stone-500">
          搜索
        </span>
        <input
          type="search"
          name="q"
          defaultValue={defaultQuery}
          placeholder={searchPlaceholder}
          className="w-full border border-stone-700 bg-[#181411] px-3 py-2 text-stone-100 outline-none transition-colors focus:border-stone-500"
        />
      </label>

      <label className="w-[180px] space-y-2 text-sm text-stone-300">
        <span className="block text-xs uppercase tracking-[0.2em] text-stone-500">
          状态
        </span>
        <select
          name="status"
          defaultValue={defaultStatus}
          className="w-full border border-stone-700 bg-[#181411] px-3 py-2 text-stone-100 outline-none transition-colors focus:border-stone-500"
        >
          <option value="all">全部</option>
          <option value="published">已发布</option>
          <option value="draft">未发布</option>
        </select>
      </label>

      <label className="w-[150px] space-y-2 text-sm text-stone-300">
        <span className="block text-xs uppercase tracking-[0.2em] text-stone-500">
          每页条数
        </span>
        <select
          name="pageSize"
          defaultValue={String(defaultPageSize)}
          className="w-full border border-stone-700 bg-[#181411] px-3 py-2 text-stone-100 outline-none transition-colors focus:border-stone-500"
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
          className="border border-stone-500 bg-[#312923] px-4 py-2 text-sm text-stone-100 transition-colors hover:border-stone-300 hover:bg-[#3b312a]"
        >
          应用筛选
        </button>
        <a
          href={basePath}
          className="border border-stone-700 bg-[#1d1916] px-4 py-2 text-sm text-stone-300 transition-colors hover:border-stone-500 hover:text-white"
        >
          重置
        </a>
      </div>
    </form>
  );
}
