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
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#ded8cf] px-5 py-4 text-sm text-[#6d665d]">
      <p>
        显示第 {start}-{end} 条，共 {totalCount} 条
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={buildPageHref(basePath, searchParams, Math.max(1, currentPage - 1))}
          aria-disabled={currentPage <= 1}
          className={
            currentPage <= 1
              ? "border border-[#e3ded6] bg-[#f2efe8] px-3 py-1.5 text-[#bdb6aa] pointer-events-none"
              : "border border-[#d6d0c5] bg-white px-3 py-1.5 text-[#33312e] transition-all hover:border-[#c44b37] hover:bg-[#fff8f5] hover:text-[#8a2f22]"
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
                ? "border border-[#1f1f1d] bg-[#1f1f1d] px-3 py-1.5 text-white shadow-[inset_0_-2px_0_#c44b37]"
                : "border border-[#d6d0c5] bg-white px-3 py-1.5 text-[#33312e] transition-all hover:border-[#c44b37] hover:bg-[#fff8f5] hover:text-[#8a2f22]"
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
              ? "border border-[#e3ded6] bg-[#f2efe8] px-3 py-1.5 text-[#bdb6aa] pointer-events-none"
              : "border border-[#d6d0c5] bg-white px-3 py-1.5 text-[#33312e] transition-all hover:border-[#c44b37] hover:bg-[#fff8f5] hover:text-[#8a2f22]"
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
    <section className="border border-[#d6d0c5] bg-white shadow-[0_16px_40px_rgba(28,24,20,0.05)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ded8cf] bg-[#f7f5f0] px-5 py-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-[#222222]">
          {title}
        </h2>
        {hint ? (
          <div className="text-xs uppercase tracking-[0.2em] text-[#8a8276]">
            {hint}
          </div>
        ) : null}
      </div>

      {filters ? <div className="border-b border-[#ded8cf] px-5 py-4">{filters}</div> : null}

      {bulkActions ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ded8cf] bg-[#fbfaf7] px-5 py-3">
          {bulkActions}
        </div>
      ) : null}

      {hasRows ? (
        <>
          <div id={gridId} className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-[#f2efe8] text-[#33312e]">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.label}
                      className={`border-b border-[#ded8cf] px-5 py-3 font-medium ${column.className ?? ""}`}
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
        <div className="px-5 py-8 text-sm leading-7 text-[#6d665d]">{emptyText}</div>
      )}
    </section>
  );
}
