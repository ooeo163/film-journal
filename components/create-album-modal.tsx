"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

type CreateAlbumModalProps = {
  onClose: () => void;
};

export function CreateAlbumModal({ onClose }: CreateAlbumModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/admin/albums", {
        method: "POST",
        body: formData,
        headers: {
          "x-admin-form": "1",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "create-failed");
      }

      router.push(data.redirectTo || "/albums");
      router.refresh();
      onClose();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "创建相册失败，请稍后再试。"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
      <div className="w-full max-w-[560px] rounded-[1.5rem] border border-stone-700/80 bg-[rgba(17,16,15,0.96)] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.4)]">
        <div className="border-b border-stone-700/70 pb-4">
          <h2 className="text-2xl font-semibold text-stone-50">创建新相册</h2>
        </div>

        {error && (
          <div className="mt-4 rounded-[0.9rem] border border-red-700/40 bg-[rgba(77,22,22,0.38)] p-4 text-sm text-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <input type="hidden" name="redirectTo" value="/albums" />
          <input type="hidden" name="isPublished" value="on" />

          <label className="grid gap-2">
            <span className="text-sm text-stone-400">相册名称 *</span>
            <input
              name="title"
              type="text"
              required
              placeholder="输入相册名称"
              className="rounded-[1rem] border border-stone-700/80 bg-[rgba(28,22,18,0.76)] px-4 py-3 text-stone-100 outline-none transition-colors placeholder:text-stone-500 focus:border-stone-500"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm text-stone-400">相册描述</span>
            <textarea
              name="description"
              rows={3}
              placeholder="输入相册描述（可选）"
              className="rounded-[1rem] border border-stone-700/80 bg-[rgba(28,22,18,0.76)] px-4 py-3 text-stone-100 outline-none transition-colors placeholder:text-stone-500 focus:border-stone-500"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm text-stone-400">自定义 slug（可选）</span>
            <input
              name="slug"
              type="text"
              placeholder="留空则按名称生成"
              className="rounded-[1rem] border border-stone-700/80 bg-[rgba(28,22,18,0.76)] px-4 py-3 text-stone-100 outline-none transition-colors placeholder:text-stone-500 focus:border-stone-500"
            />
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-[1rem] border border-stone-700/80 bg-transparent px-4 py-3 text-sm font-medium text-stone-300 transition-colors hover:bg-stone-800/50"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-[1rem] bg-[rgba(118,95,73,0.88)] px-4 py-3 text-sm font-medium text-stone-100 transition-colors hover:bg-[rgba(145,116,89,0.92)] disabled:opacity-50"
            >
              {isSubmitting ? "创建中..." : "创建相册"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
