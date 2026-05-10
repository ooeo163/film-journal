"use client";

import { PhotoViewerGallery } from "@/components/photo-viewer-gallery";
import { PhotoViewerItem } from "@/components/photo-viewer-modal";

type PhotoDetailViewerProps = {
  item: PhotoViewerItem;
};

export function PhotoDetailViewer({ item }: PhotoDetailViewerProps) {
  return (
    <PhotoViewerGallery items={[item]}>
      {({ openAt }) => (
        <button
          type="button"
          className="group flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-[1.5rem] border border-stone-700/70 bg-[rgba(13,11,9,0.92)] p-3 text-left transition-transform hover:scale-[1.01]"
          onClick={() => openAt(0)}
          aria-label={`Open ${item.title ?? "photo"}`}
        >
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[1.2rem] border border-stone-700/70 bg-black/70">
            <img
              src={item.imageUrl}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="pointer-events-none absolute inset-0 h-full w-full scale-105 object-cover opacity-30 blur-xl transition-transform duration-500 group-hover:scale-110"
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(6,5,4,0.24)_58%,rgba(6,5,4,0.62)_100%)]" />
            <img
              src={item.imageUrl}
              alt={item.title ?? ""}
              loading="lazy"
              decoding="async"
              className="relative z-10 max-h-full max-w-full object-contain shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
            />
            <div className="absolute bottom-4 right-4 z-20 rounded-full border border-stone-600/70 bg-[rgba(15,13,11,0.72)] px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-stone-300">
              Click To View
            </div>
          </div>
        </button>
      )}
    </PhotoViewerGallery>
  );
}
