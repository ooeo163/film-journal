"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type AlbumOption = {
  id: string;
  title: string;
  imageCount: number;
};

type AdminBatchPhotoFormProps = {
  albums: AlbumOption[];
};

const errorMessages: Record<string, string> = {
  "missing-files": "请至少选择一张图片。",
  "batch-create-failed": "批量上传失败，请稍后再试。",
  "Unsupported file type": "当前只支持 jpg、png、webp、gif 图片。",
};

export function AdminBatchPhotoForm({ albums }: AdminBatchPhotoFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileCount, setFileCount] = useState(0);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch("/api/admin/photos/batch", {
        method: "POST",
        body: formData,
        headers: {
          "x-admin-form": "1",
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "batch-create-failed");
      }

      router.push(data.redirectTo || "/admin/photos");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? errorMessages[submitError.message] ?? submitError.message
          : "批量上传失败，请稍后再试。",
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
            批量选择图片
          </span>
          <input
            type="file"
            name="files"
            multiple
            required
            accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif"
            onChange={(event) => setFileCount(event.target.files?.length ?? 0)}
            className="w-full border border-stone-700 bg-[#181411] px-3 py-[7px] text-stone-300 file:mr-3 file:border-0 file:bg-stone-800 file:px-3 file:py-1.5 file:text-stone-100"
          />
          <p className="text-sm text-stone-500">
            当前已选择：{fileCount} 张
          </p>
        </label>

        <label className="space-y-2 text-sm text-stone-300">
          <span className="block text-xs uppercase tracking-[0.2em] text-stone-500">
            挂入相册
          </span>
          <select
            name="albumId"
            defaultValue=""
            className="w-full border border-stone-700 bg-[#181411] px-3 py-2 text-stone-100 outline-none transition-colors focus:border-stone-500"
          >
            <option value="">先不挂入相册</option>
            {albums.map((album) => (
              <option key={album.id} value={album.id}>
                {album.title} ({album.imageCount})
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-stone-700 pt-5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="border border-stone-600 bg-[#2a241f] px-4 py-2 text-sm text-stone-100 transition-colors hover:border-stone-400 hover:bg-[#342c26] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "批量上传中..." : "批量上传照片"}
        </button>
        <p className="text-sm text-stone-500">
          上传后即可在前台查看。
        </p>
      </div>
    </form>
  );
}
