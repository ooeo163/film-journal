"use client";

import Link from "next/link";

type PhotoPaginationProps = {
  currentPage: number;
  totalPages: number;
};

export function PhotoPagination({ currentPage, totalPages }: PhotoPaginationProps) {
  const pages: (number | "...")[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  function getPageUrl(page: number) {
    return `/photos?page=${page}`;
  }

  return (
    <nav className="flex items-center justify-center gap-1.5 pt-4">
      {currentPage > 1 && (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="rounded-lg border border-stone-700/60 bg-[rgba(18,15,13,0.6)] px-3 py-1.5 text-sm text-stone-400 transition-colors hover:border-stone-500 hover:text-stone-200"
        >
          ‹
        </Link>
      )}

      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`dots-${i}`} className="px-1 text-stone-600">
            …
          </span>
        ) : (
          <Link
            key={page}
            href={getPageUrl(page)}
            className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
              page === currentPage
                ? "border-stone-500/80 bg-[rgba(118,95,73,0.6)] text-stone-100"
                : "border-stone-700/60 bg-[rgba(18,15,13,0.6)] text-stone-400 hover:border-stone-500 hover:text-stone-200"
            }`}
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="rounded-lg border border-stone-700/60 bg-[rgba(18,15,13,0.6)] px-3 py-1.5 text-sm text-stone-400 transition-colors hover:border-stone-500 hover:text-stone-200"
        >
          ›
        </Link>
      )}
    </nav>
  );
}
