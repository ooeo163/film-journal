"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

export type PhotoViewerItem = {
  id: string;
  imageUrl: string;
};

type PhotoViewerModalProps = {
  items: PhotoViewerItem[];
  currentIndex: number;
  onClose: () => void;
  onChange: (nextIndex: number) => void;
};

export function PhotoViewerModal({
  items,
  currentIndex,
  onClose,
  onChange,
}: PhotoViewerModalProps) {
  const currentItem = items[currentIndex];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "ArrowLeft" && currentIndex > 0) {
        onChange(currentIndex - 1);
        return;
      }

      if (event.key === "ArrowRight" && currentIndex < items.length - 1) {
        onChange(currentIndex + 1);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, items.length, onChange, onClose]);

  if (!currentItem) {
    return null;
  }

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === items.length - 1;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-[rgba(8,7,6,0.72)] text-stone-100 backdrop-blur-[3px]"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(8, 7, 6, 0.72)",
        backdropFilter: "blur(3px)",
      }}
    >
      <button
        type="button"
        aria-label="Close preview"
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative z-10 flex h-full items-center justify-center p-2 md:p-3">
        <div
          className="relative flex h-[98vh] w-full max-w-[98vw] flex-col overflow-hidden rounded-[1.2rem] border border-stone-700/80 bg-[rgba(18,15,13,0.9)] opacity-100 shadow-[0_28px_100px_rgba(0,0,0,0.55)]"
          style={{
            opacity: 1,
            transform: "translateY(0) scale(1)",
          }}
        >
          <div className="flex min-h-[54px] items-center justify-between border-b border-stone-800/90 px-4 py-2 md:px-5">
            <div className="min-w-0 pr-4">
              <h3 className="truncate text-base font-semibold text-stone-50 md:text-lg">
                照片查看
              </h3>
            </div>

            <button
              type="button"
              className="shrink-0 rounded-full border border-stone-700/80 px-3 py-1.5 text-xs text-stone-300 transition-colors hover:bg-stone-800/70 hover:text-white"
              onClick={onClose}
            >
              Close
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 py-2 md:px-3 md:py-3">
            <button
              type="button"
              className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-stone-700/80 bg-[rgba(20,17,15,0.88)] px-3 py-2 text-xs text-stone-200 transition-colors hover:bg-stone-800/80 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 md:left-5"
              onClick={() => onChange(currentIndex - 1)}
              disabled={isFirst}
            >
              Prev
            </button>

            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[0.9rem] border border-stone-800/90 bg-black/60">
              <img
                src={currentItem.imageUrl}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-35 blur-2xl"
              />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(6,5,4,0.28)_58%,rgba(6,5,4,0.65)_100%)]" />
              <div className="relative z-10 flex h-full w-full items-center justify-center px-2 py-1 md:px-4 md:py-2">
                <div className="flex h-full w-full items-center justify-center rounded-[0.8rem] border border-stone-700/60 bg-[rgba(14,12,11,0.3)] p-1 md:p-2">
                  <img
                    src={currentItem.imageUrl}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full max-w-full object-contain shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-stone-700/80 bg-[rgba(20,17,15,0.88)] px-3 py-2 text-xs text-stone-200 transition-colors hover:bg-stone-800/80 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 md:right-5"
              onClick={() => onChange(currentIndex + 1)}
              disabled={isLast}
            >
              Next
            </button>
          </div>

          <div className="flex min-h-[34px] items-center justify-between border-t border-stone-800/90 px-4 py-1.5 text-xs text-stone-400 md:px-5">
            <div>
              {String(currentIndex + 1).padStart(2, "0")} /{" "}
              {String(items.length).padStart(2, "0")}
            </div>
            <div>{currentItem.id}</div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
