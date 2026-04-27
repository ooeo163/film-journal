"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AdminDeleteButtonProps = {
  endpoint: string;
  label?: string;
  confirmText: string;
  redirectTo?: string;
  className?: string;
};

export function AdminDeleteButton({
  endpoint,
  label = "删除",
  confirmText,
  redirectTo,
  className,
}: AdminDeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (isDeleting) {
      return;
    }

    const confirmed = window.confirm(confirmText);
    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
          "x-admin-form": "1",
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "delete-failed");
      }

      if (redirectTo || data.redirectTo) {
        router.push(redirectTo || data.redirectTo);
      } else {
        router.refresh();
      }

      router.refresh();
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "删除失败，请稍后再试。",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className={
        className ??
        "text-[#8a4a40] transition-all hover:text-[#9a2f22] disabled:cursor-not-allowed disabled:opacity-60"
      }
    >
      {isDeleting ? "删除中" : label}
    </button>
  );
}
