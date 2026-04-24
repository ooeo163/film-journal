import Link from "next/link";
import { ReactNode } from "react";

export type AdminDataGridColumn = {
  label: string;
  className?: string;
};

type AdminDataGridProps = {
  gridId?: string;
  title: string;
  hint?: string;
  filters?: ReactNode;
  bulkActions?: ReactNode;
  columns: AdminDataGridColumn[];
  emptyText: string;
  hasRows: boolean;
  children: ReactNode;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
};

function buildPageHref(
  basePath: string,
  searchParams: Record<string, string | undefined>,
  page: number,
) {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (!value || key === "page") {
      return;
    }

    params.set(key, value);
  });

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

function AdminPagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  basePath,
  searchParams = {},
}: Omit<AdminDataGridProps, "title" | "hint" | "columns" | "emptyText" | "hasRows" | "children">) {
  if (totalPages <= 1) {
    return null;
  }

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalCount);
  const pageNumbers = [];
  const rangeStart = Math.max(1, currentPage - 2);
  const rangeEnd = Math.min(totalPages, currentPage + 2);

  for (let page = rangeStart; page <= rangeEnd; page += 1) {
    pageNumbers.push(page);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-700 px-5 py-4 text-sm text-stone-400">
      <p>
        显示第 {start}-{end} 条，共 {totalCount} 条
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={buildPageHref(basePath, searchParams, Math.max(1, currentPage - 1))}
          aria-disabled={currentPage <= 1}
          className={
            currentPage <= 1
              ? "border border-stone-800 bg-[#171310] px-3 py-1.5 text-stone-600 pointer-events-none"
              : "border border-stone-700 bg-[#1d1916] px-3 py-1.5 text-stone-200 transition-colors hover:border-stone-500 hover:text-white"
          }
        >
          上一页
        </Link>

        {pageNumbers.map((page) => (
          <Link
            key={page}
            href={buildPageHref(basePath, searchParams, page)}
            className={
              page === currentPage
                ? "border border-amber-600/40 bg-amber-900/20 px-3 py-1.5 text-amber-100"
                : "border border-stone-700 bg-[#1d1916] px-3 py-1.5 text-stone-200 transition-colors hover:border-stone-500 hover:text-white"
            }
          >
            {page}
          </Link>
        ))}

        <Link
          href={buildPageHref(basePath, searchParams, Math.min(totalPages, currentPage + 1))}
          aria-disabled={currentPage >= totalPages}
          className={
            currentPage >= totalPages
              ? "border border-stone-800 bg-[#171310] px-3 py-1.5 text-stone-600 pointer-events-none"
              : "border border-stone-700 bg-[#1d1916] px-3 py-1.5 text-stone-200 transition-colors hover:border-stone-500 hover:text-white"
          }
        >
          下一页
        </Link>
      </div>
    </div>
  );
}

export function AdminDataGrid({
  gridId,
  title,
  hint,
  filters,
  bulkActions,
  columns,
  emptyText,
  hasRows,
  children,
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  basePath,
  searchParams,
}: AdminDataGridProps) {
  return (
    <section className="border border-stone-700 bg-[#221d18] shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-700 px-5 py-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-300">
          {title}
        </h2>
        {hint ? (
          <div className="text-xs uppercase tracking-[0.2em] text-stone-500">
            {hint}
          </div>
        ) : null}
      </div>

      {filters ? <div className="border-b border-stone-700 px-5 py-4">{filters}</div> : null}

      {bulkActions ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-700 bg-[#1b1612] px-5 py-3">
          {bulkActions}
        </div>
      ) : null}

      {hasRows ? (
        <>
          <div id={gridId} className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-[#1b1612] text-stone-300">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.label}
                      className={`border-b border-stone-800 px-5 py-3 font-medium ${column.className ?? ""}`}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>{children}</tbody>
            </table>
          </div>

          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            basePath={basePath}
            searchParams={searchParams}
          />
        </>
      ) : (
        <div className="px-5 py-8 text-sm leading-7 text-stone-400">{emptyText}</div>
      )}
    </section>
  );
}
