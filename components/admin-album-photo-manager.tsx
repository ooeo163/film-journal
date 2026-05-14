"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getImageSrc } from "@/lib/local-media";

type LinkedPhoto = {
  id: string;
  slug: string;
  imageUrl: string;
  sortOrder: number;
};

type AvailablePhoto = {
  id: string;
  slug: string;
  imageUrl: string;
};

type AdminAlbumPhotoManagerProps = {
  albumId: string;
  linkedPhotos: LinkedPhoto[];
  availablePhotos: AvailablePhoto[];
};

export function AdminAlbumPhotoManager({
  albumId,
  linkedPhotos,
  availablePhotos,
}: AdminAlbumPhotoManagerProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const linkedIdSet = useMemo(
    () => new Set(linkedPhotos.map((photo) => photo.id)),
    [linkedPhotos],
  );

  function togglePhoto(photoId: string) {
    setSelectedIds((current) =>
      current.includes(photoId)
        ? current.filter((item) => item !== photoId)
        : [...current, photoId],
    );
  }

  async function handleRemove(photoId: string) {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/albums/${albumId}/photos/${photoId}`,
        { method: "DELETE" },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "remove-failed");
      }

      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "移除照片失败，请稍后再试。",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleMove(photoId: string, direction: "up" | "down") {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/albums/${albumId}/sort`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId, direction }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "sort-failed");
      }

      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "排序失败，请稍后再试。",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleAttach() {
    if (selectedIds.length === 0) {
      setError("请先选择至少一张照片。");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/albums/${albumId}/photos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoIds: selectedIds }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "attach-failed");
      }

      setSelectedIds([]);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "挂入相册失败，请稍后再试。",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="border border-stone-700 bg-[#221d18] shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
        <div className="border-b border-stone-700 px-5 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-300">
            已挂入照片
          </h2>
        </div>

        {linkedPhotos.length > 0 ? (
          <div className="space-y-3 px-5 py-5">
            {linkedPhotos.map((photo, index) => (
              <article
                key={photo.id}
                className="flex items-center gap-4 border border-stone-800 bg-[#1a1613] p-3"
              >
                <div className="relative h-16 w-16 overflow-hidden border border-stone-700 bg-[#14110f]">
                  <Image
                    src={getImageSrc(photo.imageUrl)}
                    alt={`照片 ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-stone-100">
                    照片 {index + 1}
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    sort: {photo.sortOrder} / {photo.slug}
                  </p>
                </div>

                <div className="flex flex-col gap-2 text-[11px] uppercase tracking-[0.14em]">
                  <button
                    type="button"
                    disabled={isSubmitting || index === 0}
                    onClick={() => handleMove(photo.id, "up")}
                    className="border border-stone-700 px-2 py-1 text-stone-300 transition-colors hover:border-stone-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    上移
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting || index === linkedPhotos.length - 1}
                    onClick={() => handleMove(photo.id, "down")}
                    className="border border-stone-700 px-2 py-1 text-stone-300 transition-colors hover:border-stone-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    下移
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleRemove(photo.id)}
                    className="border border-red-900/40 px-2 py-1 text-red-300 transition-colors hover:border-red-700/60 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    移除
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="px-5 py-8 text-sm leading-7 text-stone-400">
            当前相册还没有挂入照片。你可以从右侧选择已有照片加入。
          </div>
        )}
      </section>

      <section className="border border-stone-700 bg-[#221d18] shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-700 px-5 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-300">
            从现有照片中加入
          </h2>
          <button
            type="button"
            onClick={handleAttach}
            disabled={isSubmitting}
            className="border border-stone-600 bg-[#2a241f] px-4 py-2 text-sm text-stone-100 transition-colors hover:border-stone-400 hover:bg-[#342c26] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "加入中..." : `加入所选 (${selectedIds.length})`}
          </button>
        </div>

        {error ? (
          <div className="border-b border-red-900/40 bg-red-950/20 px-5 py-4 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {availablePhotos.length > 0 ? (
          <div className="grid gap-3 px-5 py-5 md:grid-cols-2">
            {availablePhotos.map((photo) => {
              const selected = selectedIds.includes(photo.id);
              const linked = linkedIdSet.has(photo.id);

              return (
                <label
                  key={photo.id}
                  className={
                    linked
                      ? "flex cursor-not-allowed gap-3 border border-stone-800 bg-[#191613] p-3 opacity-45"
                      : selected
                        ? "flex cursor-pointer gap-3 border border-amber-700/40 bg-amber-950/20 p-3"
                        : "flex cursor-pointer gap-3 border border-stone-800 bg-[#191613] p-3 transition-colors hover:border-stone-600"
                  }
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4"
                    checked={selected || linked}
                    disabled={linked}
                    onChange={() => togglePhoto(photo.id)}
                  />

                  <div className="relative h-20 w-20 overflow-hidden border border-stone-700 bg-[#14110f]">
                    <Image
                      src={getImageSrc(photo.imageUrl)}
                      alt={photo.slug}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium text-stone-100">
                      {photo.slug}
                    </p>
                    <p className="mt-1 text-xs text-stone-500">{photo.slug}</p>
                  </div>
                </label>
              );
            })}
          </div>
        ) : (
          <div className="px-5 py-8 text-sm leading-7 text-stone-400">
            当前没有可加入的照片。你可以先去"新建照片"上传内容。
          </div>
        )}
      </section>
    </div>
  );
}
