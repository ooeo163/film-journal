"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getImageSrc } from "@/lib/local-media";

type AdminEditJournalFormProps = {
  journal: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string | null;
    coverImageUrl: string | null;
    publishedAt: string;
    isPublished: boolean;
  };
};

const errorMessages: Record<string, string> = {
  "missing-title": "请先填写文章标题。",
  "journal-not-found": "没有找到要编辑的文章。",
  "Unsupported file type": "当前只支持 jpg、png、webp、gif 图片。",
  "update-failed": "更新文章失败，请稍后再试。",
};

export function AdminEditJournalForm({ journal }: AdminEditJournalFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch(`/api/admin/journals/${journal.id}`, {
        method: "PATCH",
        body: formData,
        headers: {
          "x-admin-form": "1",
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "update-failed");
      }

      router.push(data.redirectTo || "/admin/journals");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? errorMessages[submitError.message] ?? submitError.message
          : "更新文章失败，请稍后再试。",
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
            defaultValue={journal.title}
            className="w-full border border-stone-700 bg-[#181411] px-3 py-2 text-stone-100 outline-none transition-colors focus:border-stone-500"
          />
        </label>

        <label className="space-y-2 text-sm text-stone-300">
          <span className="block text-xs uppercase tracking-[0.2em] text-stone-500">
            slug
          </span>
          <input
            name="slug"
            defaultValue={journal.slug}
            className="w-full border border-stone-700 bg-[#181411] px-3 py-2 text-stone-100 outline-none transition-colors focus:border-stone-500"
          />
        </label>

        <label className="space-y-2 text-sm text-stone-300 md:col-span-2">
          <span className="block text-xs uppercase tracking-[0.2em] text-stone-500">
            摘要
          </span>
          <textarea
            name="excerpt"
            rows={4}
            defaultValue={journal.excerpt ?? ""}
            className="w-full border border-stone-700 bg-[#181411] px-3 py-2 text-stone-100 outline-none transition-colors focus:border-stone-500"
          />
        </label>

        <label className="space-y-2 text-sm text-stone-300 md:col-span-2">
          <span className="block text-xs uppercase tracking-[0.2em] text-stone-500">
            正文
          </span>
          <textarea
            name="content"
            rows={16}
            defaultValue={journal.content ?? ""}
            className="w-full border border-stone-700 bg-[#181411] px-3 py-2 text-stone-100 outline-none transition-colors focus:border-stone-500"
          />
        </label>

        <div className="space-y-3 border border-stone-700 bg-[#1b1714] p-4 md:col-span-2">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
              封面图
            </p>
            <p className="text-sm leading-6 text-stone-400">
              当前可以直接上传新的文章封面。后续如果要复用站内照片，也可以继续接成统一图库选择。
            </p>
          </div>

          {journal.coverImageUrl ? (
            <div className="overflow-hidden border border-stone-700 bg-[#14110f]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getImageSrc(journal.coverImageUrl)}
                alt={`${journal.title} cover`}
                className="h-44 w-full object-cover"
              />
            </div>
          ) : null}

          <label className="space-y-2 text-sm text-stone-300">
            <span className="block text-xs uppercase tracking-[0.2em] text-stone-500">
              上传新封面
            </span>
            <input
              type="file"
              name="coverFile"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="w-full border border-dashed border-stone-700 bg-[#181411] px-3 py-2 text-stone-300 file:mr-3 file:border-0 file:bg-[#2a241f] file:px-3 file:py-2 file:text-sm file:text-stone-100 hover:file:bg-[#342c26]"
            />
          </label>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[220px_1fr]">
        <label className="space-y-2 text-sm text-stone-300">
          <span className="block text-xs uppercase tracking-[0.2em] text-stone-500">
            发布时间
          </span>
          <input
            type="date"
            name="publishedAt"
            defaultValue={journal.publishedAt}
            className="w-full border border-stone-700 bg-[#181411] px-3 py-2 text-stone-100 outline-none transition-colors focus:border-stone-500"
          />
        </label>

        <label className="flex items-center gap-3 self-end text-sm text-stone-300">
          <input
            type="checkbox"
            name="isPublished"
            defaultChecked={journal.isPublished}
            className="h-4 w-4"
          />
          <span>保持为公开发布状态</span>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-stone-700 pt-5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="border border-stone-600 bg-[#2a241f] px-4 py-2 text-sm text-stone-100 transition-colors hover:border-stone-400 hover:bg-[#342c26] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "保存中..." : "保存修改"}
        </button>
      </div>
    </form>
  );
}
