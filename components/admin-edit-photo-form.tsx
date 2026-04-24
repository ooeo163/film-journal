"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type AdminEditPhotoFormProps = {
  photo: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    location: string | null;
    camera: string | null;
    lens: string | null;
    filmStock: string | null;
    shotAt: string;
    isPublished: boolean;
  };
};

const errorMessages: Record<string, string> = {
  "missing-title": "请先填写照片标题。",
  "photo-not-found": "没有找到要编辑的照片。",
  "update-failed": "更新照片失败，请稍后再试。",
};

export function AdminEditPhotoForm({ photo }: AdminEditPhotoFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch(`/api/admin/photos/${photo.id}`, {
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

      router.push(data.redirectTo || "/admin/photos");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? errorMessages[submitError.message] ?? submitError.message
          : "更新照片失败，请稍后再试。",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 px-5 py-5">
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
            defaultValue={photo.title}
            className="w-full border border-stone-700 bg-[#181411] px-3 py-2 text-stone-100 outline-none transition-colors focus:border-stone-500"
          />
        </label>

        <label className="space-y-2 text-sm text-stone-300">
          <span className="block text-xs uppercase tracking-[0.2em] text-stone-500">
            slug
          </span>
          <input
            name="slug"
            defaultValue={photo.slug}
            className="w-full border border-stone-700 bg-[#181411] px-3 py-2 text-stone-100 outline-none transition-colors focus:border-stone-500"
          />
        </label>

        <label className="space-y-2 text-sm text-stone-300 md:col-span-2">
          <span className="block text-xs uppercase tracking-[0.2em] text-stone-500">
            描述
          </span>
          <textarea
            name="description"
            rows={5}
            defaultValue={photo.description ?? ""}
            className="w-full border border-stone-700 bg-[#181411] px-3 py-2 text-stone-100 outline-none transition-colors focus:border-stone-500"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="space-y-2 text-sm text-stone-300">
          <span className="block text-xs uppercase tracking-[0.2em] text-stone-500">
            地点
          </span>
          <input
            name="location"
            defaultValue={photo.location ?? ""}
            className="w-full border border-stone-700 bg-[#181411] px-3 py-2 text-stone-100 outline-none transition-colors focus:border-stone-500"
          />
        </label>

        <label className="space-y-2 text-sm text-stone-300">
          <span className="block text-xs uppercase tracking-[0.2em] text-stone-500">
            相机
          </span>
          <input
            name="camera"
            defaultValue={photo.camera ?? ""}
            className="w-full border border-stone-700 bg-[#181411] px-3 py-2 text-stone-100 outline-none transition-colors focus:border-stone-500"
          />
        </label>

        <label className="space-y-2 text-sm text-stone-300">
          <span className="block text-xs uppercase tracking-[0.2em] text-stone-500">
            镜头
          </span>
          <input
            name="lens"
            defaultValue={photo.lens ?? ""}
            className="w-full border border-stone-700 bg-[#181411] px-3 py-2 text-stone-100 outline-none transition-colors focus:border-stone-500"
          />
        </label>

        <label className="space-y-2 text-sm text-stone-300">
          <span className="block text-xs uppercase tracking-[0.2em] text-stone-500">
            胶卷
          </span>
          <input
            name="filmStock"
            defaultValue={photo.filmStock ?? ""}
            className="w-full border border-stone-700 bg-[#181411] px-3 py-2 text-stone-100 outline-none transition-colors focus:border-stone-500"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-[220px_1fr]">
        <label className="space-y-2 text-sm text-stone-300">
          <span className="block text-xs uppercase tracking-[0.2em] text-stone-500">
            拍摄日期
          </span>
          <input
            type="date"
            name="shotAt"
            defaultValue={photo.shotAt}
            className="w-full border border-stone-700 bg-[#181411] px-3 py-2 text-stone-100 outline-none transition-colors focus:border-stone-500"
          />
        </label>

        <label className="flex items-center gap-3 self-end text-sm text-stone-300">
          <input
            type="checkbox"
            name="isPublished"
            defaultChecked={photo.isPublished}
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
