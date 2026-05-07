"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PhotoItem = {
  id: string;
  slug: string;
  imageUrl: string;
  thumbUrl: string | null;
};

type AdminPhotoGridProps = {
  photos: PhotoItem[];
};

export function AdminPhotoGrid({ photos }: AdminPhotoGridProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, slug: string) {
    if (deletingId) return;

    const confirmed = window.confirm(
      `确定删除照片「${slug}」吗？这会把它从所有相册关联里移除。`,
    );
    if (!confirmed) return;

    setDeletingId(id);

    try {
      const response = await fetch(`/api/admin/photos/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-form": "1",
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "delete-failed");
      }

      router.refresh();
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "删除失败，请稍后再试。",
      );
    } finally {
      setDeletingId(null);
    }
  }

  if (photos.length === 0) {
    return (
      <div className="rounded border border-dashed border-[#d6d0c5] bg-[#f7f5f0] p-8 text-center text-sm text-[#8a8276]">
        当前还没有照片。点击上方「上传照片」按钮添加。
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="group relative overflow-hidden border border-[#d6d0c5] bg-white"
        >
          <div className="aspect-[3/4] bg-[#f7f5f0]">
            <img
              src={photo.thumbUrl ?? photo.imageUrl}
              alt={photo.slug}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex items-center justify-between">
              <span className="truncate text-xs text-white/80">
                {photo.slug}
              </span>
              <button
                type="button"
                onClick={() => handleDelete(photo.id, photo.slug)}
                disabled={deletingId === photo.id}
                className="ml-2 flex-shrink-0 rounded bg-red-600 px-2 py-1 text-xs text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {deletingId === photo.id ? "删除中" : "删除"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
