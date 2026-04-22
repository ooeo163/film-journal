"use client";

import { useMemo, useState } from "react";

type FilmPhoto = {
  id: string;
  title: string;
  imageUrl: string;
  thumbUrl: string | null;
  sortOrder: number;
};

type AlbumFilmStripProps = {
  albumTitle: string;
  photos: FilmPhoto[];
};

function chunkPhotos<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

export function AlbumFilmStrip({
  albumTitle,
  photos,
}: AlbumFilmStripProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const filmRows = useMemo(() => chunkPhotos(photos, 4), [photos]);
  const selectedPhoto =
    selectedIndex !== null ? photos[selectedIndex] ?? null : null;

  return (
    <>
      <div className="space-y-6 overflow-hidden">
        <div className="flex justify-end">
          <div className="rounded-[1.5rem] border border-stone-600/70 bg-[linear-gradient(180deg,#3a2c22_0%,#241c16_100%)] px-6 py-4 shadow-[0_10px_24px_rgba(0,0,0,0.28)]">
            <p className="text-[11px] uppercase tracking-[0.35em] text-stone-400">
              Contact Sheet Direction
            </p>
            <p className="mt-2 text-sm text-stone-300">
              整版胶卷网格，可点击单张查看
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {filmRows.map((row, rowIndex) => {
            const offsetClass = rowIndex % 2 === 0 ? "mr-8" : "ml-8";
            const paddedRow = [...row];

            while (paddedRow.length < 4) {
              paddedRow.push(null as never);
            }

            return (
              <div key={`row-${rowIndex}`} className={offsetClass}>
                <div className="relative overflow-hidden rounded-[1.8rem] border border-[#6f6253] bg-[linear-gradient(180deg,#8e7a64_0%,#6d604e_100%)] px-4 py-5 shadow-[0_18px_50px_rgba(0,0,0,0.3)]">
                  <div className="pointer-events-none absolute inset-x-0 top-3 h-4 bg-[repeating-linear-gradient(90deg,#14110f_0px,#14110f_12px,transparent_12px,transparent_24px)] opacity-95" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-3 h-4 bg-[repeating-linear-gradient(90deg,#14110f_0px,#14110f_12px,transparent_12px,transparent_24px)] opacity-95" />

                  {rowIndex === 0 ? (
                    <div className="pointer-events-none absolute right-4 top-5 flex items-center">
                      <div className="h-16 w-12 rounded-l-[0.7rem] rounded-r-[0.3rem] border border-[#534538] bg-[linear-gradient(180deg,#2a211a_0%,#17120f_100%)]" />
                      <div className="-ml-1 h-18 w-24 rounded-l-[1.2rem] rounded-r-[0.6rem] border border-[#534538] bg-[linear-gradient(180deg,#3b2f25_0%,#221a15_100%)] shadow-[0_12px_22px_rgba(0,0,0,0.24)]" />
                    </div>
                  ) : null}

                  <div className="grid grid-cols-2 gap-0 pt-7 sm:grid-cols-3 xl:grid-cols-4">
                    {paddedRow.map((photo, index) =>
                      photo ? (
                        <button
                          key={photo.id}
                          type="button"
                          className="-ml-px -mt-px border border-[#54483c] bg-[linear-gradient(180deg,#2b241f_0%,#181411_100%)] p-2 text-left transition-transform hover:z-10 hover:scale-[1.02]"
                          onClick={() => setSelectedIndex(rowIndex * 4 + index)}
                        >
                          <div className="rounded-[0.9rem] border border-stone-700/70 bg-black/75 p-1.5">
                            <div className="aspect-[4/3] overflow-hidden rounded-[0.7rem] bg-[rgba(16,13,11,0.92)]">
                              <img
                                src={photo.thumbUrl ?? photo.imageUrl}
                                alt={photo.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </div>
                        </button>
                      ) : (
                        <div
                          key={`empty-${rowIndex}-${index}`}
                          className="-ml-px -mt-px border border-[#54483c] bg-[linear-gradient(180deg,#2b241f_0%,#181411_100%)] p-2 opacity-0"
                          aria-hidden="true"
                        >
                          <div className="rounded-[0.9rem] border border-stone-700/70 bg-black/75 p-1.5">
                            <div className="aspect-[4/3] rounded-[0.7rem]" />
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-[1.6rem] border border-stone-700/70 bg-[rgba(28,22,18,0.72)] p-5 text-sm leading-7 text-stone-300">
          当前这版已经保证每排对齐，并支持点击片窗进入查看。下一步可以继续精修胶卷弧度、切换动效和更强的暗盒细节。
        </div>
      </div>

      {selectedPhoto ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/82 px-6 py-10 backdrop-blur-sm">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            onClick={() => setSelectedIndex(null)}
            aria-label="Close preview"
          />

          <div className="relative z-10 w-full max-w-6xl rounded-[2rem] border border-stone-700/80 bg-[rgba(18,15,13,0.94)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.48)]">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                  {albumTitle}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-stone-50">
                  {selectedPhoto.title}
                </h3>
              </div>

              <button
                type="button"
                className="rounded-full border border-stone-700/80 px-4 py-2 text-sm text-stone-300 transition-colors hover:bg-stone-800/70 hover:text-white"
                onClick={() => setSelectedIndex(null)}
              >
                Close
              </button>
            </div>

            <div className="overflow-hidden rounded-[1.5rem] border border-stone-700/70 bg-black/80">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="max-h-[78vh] w-full object-contain"
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 text-sm text-stone-400">
              <div>
                Frame {String(selectedPhoto.sortOrder + 1).padStart(2, "0")}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  className="rounded-full border border-stone-700/80 px-4 py-2 transition-colors hover:bg-stone-800/70 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  onClick={() =>
                    setSelectedIndex((current) =>
                      current !== null && current > 0 ? current - 1 : current,
                    )
                  }
                  disabled={selectedIndex === 0}
                >
                  Prev
                </button>
                <button
                  type="button"
                  className="rounded-full border border-stone-700/80 px-4 py-2 transition-colors hover:bg-stone-800/70 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  onClick={() =>
                    setSelectedIndex((current) =>
                      current !== null && current < photos.length - 1
                        ? current + 1
                        : current,
                    )
                  }
                  disabled={selectedIndex === photos.length - 1}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
