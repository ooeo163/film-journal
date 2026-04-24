"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type PhotoViewerItem = {
  id: string;
  title: string;
  imageUrl: string;
  subtitle?: string;
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
  const [visible, setVisible] = useState(false);
  const currentItem = items[currentIndex];

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setVisible(true);
    });

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      setVisible(false);
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
      className={`fixed inset-0 z-[9999] text-stone-100 transition-[background-color,backdrop-filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        visible
          ? "bg-[rgba(8,7,6,0.5)] backdrop-blur-[3px]"
          : "bg-[rgba(8,7,6,0)] backdrop-blur-0"
      }`}
    >
      <button
        type="button"
        aria-label="Close preview"
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative z-10 flex h-full items-center justify-center p-3 md:p-5">
        <div
          className={`relative flex h-[95vh] w-full max-w-[97vw] flex-col overflow-hidden rounded-[2rem] border border-stone-700/80 bg-[rgba(18,15,13,0.9)] shadow-[0_28px_100px_rgba(0,0,0,0.55)] transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            visible
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-6 scale-[0.965] opacity-0"
          }`}
        >
          <div className="flex items-center justify-between border-b border-stone-800/90 px-6 py-4 md:px-8">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                Viewer
              </p>
              <h3 className="mt-2 truncate text-xl font-semibold text-stone-50 md:text-2xl">
                {currentItem.title}
              </h3>
              {currentItem.subtitle ? (
                <p className="mt-2 text-sm text-stone-400">
                  {currentItem.subtitle}
                </p>
              ) : null}
            </div>

            <button
              type="button"
              className="rounded-full border border-stone-700/80 px-4 py-2 text-sm text-stone-300 transition-colors hover:bg-stone-800/70 hover:text-white"
              onClick={onClose}
            >
              Close
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 py-3 md:px-6 md:py-4">
            <button
              type="button"
              className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-stone-700/80 bg-[rgba(20,17,15,0.88)] px-4 py-3 text-sm text-stone-200 transition-colors hover:bg-stone-800/80 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 md:left-6"
              onClick={() => onChange(currentIndex - 1)}
              disabled={isFirst}
            >
              Prev
            </button>

            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[1.4rem] border border-stone-800/90 bg-black/60">
              <img
                src={currentItem.imageUrl}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-35 blur-2xl"
              />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(6,5,4,0.28)_58%,rgba(6,5,4,0.65)_100%)]" />
              <div className="relative z-10 flex h-full w-full items-center justify-center px-4 py-3 md:px-8 md:py-5">
                <div className="flex h-full w-full max-w-[min(78vw,980px)] items-center justify-center rounded-[1.2rem] border border-stone-700/60 bg-[rgba(14,12,11,0.3)] p-3 md:max-w-[min(70vw,860px)] md:p-4">
                  <img
                    src={currentItem.imageUrl}
                    alt={currentItem.title}
                    className="max-h-full max-w-full object-contain shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-stone-700/80 bg-[rgba(20,17,15,0.88)] px-4 py-3 text-sm text-stone-200 transition-colors hover:bg-stone-800/80 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 md:right-6"
              onClick={() => onChange(currentIndex + 1)}
              disabled={isLast}
            >
              Next
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-stone-800/90 px-6 py-4 text-sm text-stone-400 md:px-8">
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
