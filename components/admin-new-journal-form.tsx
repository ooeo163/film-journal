"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type AdminNewJournalFormProps = {
  initialError?: string | null;
};

const errorMessages: Record<string, string> = {
  "missing-title": "请先填写文章标题。",
  "Unsupported file type": "当前只支持 jpg、png、webp、gif 图片。",
  "create-failed": "创建文章失败，请稍后再试。",
};

export function AdminNewJournalForm({
  initialError,
}: AdminNewJournalFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(
    initialError ? errorMessages[initialError] ?? initialError : null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch("/api/admin/journals", {
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

      router.push(data.redirectTo || "/admin/journals");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? errorMessages[submitError.message] ?? submitError.message
          : "创建文章失败，请稍后再试。",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="space-y-5 px-5 py-5"
    >
      {error ? (
        <div className="border border-red-900/40 bg-red-950/20 px-5 py-4 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-stone-300">
          <span className="block text-xs uppercase tracking-[0.2em] text-stone-500">
            标题
          </span>
          <input
            name="title"
            required
            className="w-full border border-stone-700 bg-[#181411] px-3 py-2 text-stone-100 outline-none transition-colors focus:border-stone-500"
            placeholder="输入文章标题"
          />
        </label>

        <label className="space-y-2 text-sm text-stone-300">
          <span className="block text-xs uppercase tracking-[0.2em] text-stone-500">
            自定义 slug
          </span>
          <input
            name="slug"
            className="w-full border border-stone-700 bg-[#181411] px-3 py-2 text-stone-100 outline-none transition-colors focus:border-stone-500"
            placeholder="留空则按标题生成"
          />
        </label>

        <label className="space-y-2 text-sm text-stone-300 md:col-span-2">
          <span className="block text-xs uppercase tracking-[0.2em] text-stone-500">
            摘要
          </span>
          <textarea
            name="excerpt"
            rows={4}
            className="w-full border border-stone-700 bg-[#181411] px-3 py-2 text-stone-100 outline-none transition-colors focus:border-stone-500"
            placeholder="输入文章摘要"
          />
        </label>

        <label className="space-y-2 text-sm text-stone-300 md:col-span-2">
          <span className="block text-xs uppercase tracking-[0.2em] text-stone-500">
            正文
          </span>
          <textarea
            name="content"
            rows={14}
            className="w-full border border-stone-700 bg-[#181411] px-3 py-2 text-stone-100 outline-none transition-colors focus:border-stone-500"
            placeholder="输入文章正文，当前先按纯文本保存。"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
        <label className="space-y-2 text-sm text-stone-300">
          <span className="block text-xs uppercase tracking-[0.2em] text-stone-500">
            发布时间
          </span>
          <input
            type="date"
            name="publishedAt"
            className="w-full border border-stone-700 bg-[#181411] px-3 py-2 text-stone-100 outline-none transition-colors focus:border-stone-500"
          />
        </label>

        <label className="space-y-2 text-sm text-stone-300">
          <span className="block text-xs uppercase tracking-[0.2em] text-stone-500">
            封面图
          </span>
          <input
            type="file"
            name="coverFile"
            accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif"
            className="w-full border border-stone-700 bg-[#181411] px-3 py-[7px] text-stone-300 file:mr-3 file:border-0 file:bg-stone-800 file:px-3 file:py-1.5 file:text-stone-100"
          />
        </label>
      </div>

      <label className="flex items-center gap-3 text-sm text-stone-300">
        <input type="checkbox" name="isPublished" defaultChecked className="h-4 w-4" />
        <span>创建后立即发布</span>
      </label>

      <div className="flex flex-wrap items-center gap-3 border-t border-stone-700 pt-5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="border border-stone-600 bg-[#2a241f] px-4 py-2 text-sm text-stone-100 transition-colors hover:border-stone-400 hover:bg-[#342c26] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "创建中..." : "创建文章"}
        </button>
      </div>
    </form>
  );
}
