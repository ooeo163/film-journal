"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getImageSrc } from "@/lib/local-media";

type AdminEditAlbumFormProps = {
  album: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    sourceUrl: string | null;
    isPublished: boolean;
    coverImageUrl?: string | null;
    photoLinks?: {
      photo: {
        id: string;
        imageUrl: string;
      };
    }[];
  };
};

const errorMessages: Record<string, string> = {
  "missing-title": "请先填写相册标题。",
  "album-not-found": "没有找到要编辑的相册。",
  "update-failed": "更新相册失败，请稍后再试。",
};

export function AdminEditAlbumForm({ album }: AdminEditAlbumFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const linkedPhotos = album.photoLinks ?? [];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch(`/api/admin/albums/${album.id}`, {
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

      router.push(data.redirectTo || `/admin/albums/${album.id}`);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? errorMessages[submitError.message] ?? submitError.message
          : "更新相册失败，请稍后再试。",
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
            defaultValue={album.title}
            className="w-full border border-stone-700 bg-[#181411] px-3 py-2 text-stone-100 outline-none transition-colors focus:border-stone-500"
          />
        </label>

        <label className="space-y-2 text-sm text-stone-300">
          <span className="block text-xs uppercase tracking-[0.2em] text-stone-500">
            slug
          </span>
          <input
            name="slug"
            defaultValue={album.slug}
            className="w-full border border-stone-700 bg-[#181411] px-3 py-2 text-stone-100 outline-none transition-colors focus:border-stone-500"
          />
        </label>

        <label className="space-y-2 text-sm text-stone-300 md:col-span-2">
          <span className="block text-xs uppercase tracking-[0.2em] text-stone-500">
            描述
          </span>
          <textarea
            name="description"
            rows={6}
            defaultValue={album.description ?? ""}
            className="w-full border border-stone-700 bg-[#181411] px-3 py-2 text-stone-100 outline-none transition-colors focus:border-stone-500"
          />
        </label>

        <label className="space-y-2 text-sm text-stone-300 md:col-span-2">
          <span className="block text-xs uppercase tracking-[0.2em] text-stone-500">
            来源链接
          </span>
          <input
            name="sourceUrl"
            defaultValue={album.sourceUrl ?? ""}
            className="w-full border border-stone-700 bg-[#181411] px-3 py-2 text-stone-100 outline-none transition-colors focus:border-stone-500"
            placeholder="可选，填写相册原始来源地址"
          />
        </label>

        <div className="space-y-3 border border-stone-700 bg-[#1b1714] p-4 md:col-span-2">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
              封面设置
            </p>
            <p className="text-sm leading-6 text-stone-400">
              你可以从当前相册已有照片里选一张做封面，或者上传一张新封面。若两者同时填写，优先使用上传的新封面。
            </p>
          </div>

          {album.coverImageUrl ? (
            <div className="overflow-hidden border border-stone-700 bg-[#14110f]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getImageSrc(album.coverImageUrl)}
                alt={`${album.title} cover`}
                className="h-44 w-full object-cover"
              />
            </div>
          ) : null}

          <label className="space-y-2 text-sm text-stone-300">
            <span className="block text-xs uppercase tracking-[0.2em] text-stone-500">
              从当前相册已有照片中选择封面
            </span>
            <select
              name="coverPhotoId"
              defaultValue=""
              className="w-full border border-stone-700 bg-[#181411] px-3 py-2 text-stone-100 outline-none transition-colors focus:border-stone-500"
            >
              <option value="">保持当前封面不变</option>
              {linkedPhotos.map(({ photo }, index) => (
                <option key={photo.id} value={photo.id}>
                  照片 {index + 1}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-stone-300">
            <span className="block text-xs uppercase tracking-[0.2em] text-stone-500">
              或上传新封面
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

      <label className="flex items-center gap-3 text-sm text-stone-300">
        <input
          type="checkbox"
          name="isPublished"
          defaultChecked={album.isPublished}
          className="h-4 w-4"
        />
        <span>保持为公开发布状态</span>
      </label>

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
