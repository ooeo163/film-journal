"use client";

import Image from "next/image";
import { PhotoViewerGallery } from "@/components/photo-viewer-gallery";
import { PhotoViewerItem } from "@/components/photo-viewer-modal";
import { getImageSrc } from "@/lib/local-media";

type PhotoWallItem = {
  id: string;
  imageUrl: string;
  thumbUrl: string | null;
};

type PhotoWallProps = {
  photos: PhotoWallItem[];
};

export function PhotoWall({ photos }: PhotoWallProps) {
  const viewerItems: PhotoViewerItem[] = photos.map((photo) => ({
    id: photo.id,
    imageUrl: getImageSrc(photo.imageUrl),
  }));

  if (photos.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-stone-500">
        还没有照片，点击上方「上传照片」开始吧。
      </div>
    );
  }

  return (
    <PhotoViewerGallery items={viewerItems}>
      {({ openAt }) => (
        <section className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8">
          {photos.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              className="group relative block overflow-hidden border border-stone-500/80 bg-[rgba(16,13,11,0.82)] p-1.5 shadow-[0_10px_28px_rgba(0,0,0,0.2)] backdrop-blur-[2px] transition-colors duration-300 hover:border-stone-300"
              onClick={() => openAt(index)}
              aria-label="查看照片"
            >
              <div className="relative aspect-[3/4] border border-stone-700/80 bg-[rgba(16,13,11,0.88)]">
                <Image
                  src={getImageSrc(photo.thumbUrl ?? photo.imageUrl)}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.035] group-hover:brightness-110"
                />
              </div>
              <div className="pointer-events-none absolute inset-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="h-full w-full bg-[linear-gradient(135deg,rgba(255,255,255,0.18)_0%,transparent_34%,transparent_100%)]" />
              </div>
            </button>
          ))}
        </section>
      )}
    </PhotoViewerGallery>
  );
}
