"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AdminBulkDeleteButtonProps = {
  gridId: string;
  endpoint: string;
  confirmText: string;
  label?: string;
};

export function AdminBulkDeleteButton({
  gridId,
  endpoint,
  confirmText,
  label = "批量删除",
}: AdminBulkDeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleBulkDelete() {
    if (isDeleting) {
      return;
    }

    const grid = document.getElementById(gridId);
    const checkedBoxes = Array.from(
      grid?.querySelectorAll<HTMLInputElement>('input[name="selectedIds"]:checked') ?? [],
    );
    const ids = checkedBoxes.map((checkbox) => checkbox.value);

    if (ids.length === 0) {
      window.alert("请先勾选要操作的数据。");
      return;
    }

    const confirmed = window.confirm(`${confirmText}\n\n本次将处理 ${ids.length} 条数据。`);
    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          "x-admin-form": "1",
        },
        body: JSON.stringify({ ids }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "bulk-delete-failed");
      }

      router.push(data.redirectTo || window.location.pathname);
      router.refresh();
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "批量删除失败，请稍后再试。",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-stone-400">
      <span>批量操作</span>
      <button
        type="button"
        onClick={handleBulkDelete}
        disabled={isDeleting}
        className="border border-red-900/50 bg-red-950/20 px-3 py-1.5 text-sm text-red-200 transition-colors hover:border-red-700 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isDeleting ? "删除中..." : label}
      </button>
    </div>
  );
}
