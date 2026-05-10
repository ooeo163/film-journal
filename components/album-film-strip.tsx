"use client";

import { useMemo } from "react";
import { PhotoViewerGallery } from "@/components/photo-viewer-gallery";

type FilmPhoto = {
  id: string;
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
  const filmRows = useMemo(() => chunkPhotos(photos, 4), [photos]);
  const viewerItems = useMemo(
    () =>
      photos.map((photo) => ({
        id: `frame-${String(photo.sortOrder + 1).padStart(2, "0")}`,
        title: `Frame ${String(photo.sortOrder + 1).padStart(2, "0")}`,
        imageUrl: photo.imageUrl,
        subtitle: `${albumTitle} · Frame ${String(photo.sortOrder + 1).padStart(2, "0")}`,
      })),
    [albumTitle, photos],
  );

  return (
    <PhotoViewerGallery items={viewerItems}>
      {({ openAt }) => (
        <div className="overflow-hidden">
          <div className="relative overflow-hidden rounded-[1.4rem] border border-[#6f6253] bg-[linear-gradient(90deg,#8e7a64_0%,#6d604e_100%)] px-3 py-5 shadow-[0_14px_34px_rgba(0,0,0,0.28)] md:hidden">
            <div className="pointer-events-none absolute inset-y-0 left-3 w-4 bg-[repeating-linear-gradient(180deg,#14110f_0px,#14110f_12px,transparent_12px,transparent_24px)] opacity-95" />
            <div className="pointer-events-none absolute inset-y-0 right-3 w-4 bg-[repeating-linear-gradient(180deg,#14110f_0px,#14110f_12px,transparent_12px,transparent_24px)] opacity-95" />

            <div className="relative mx-auto w-[calc(100%-2.5rem)]">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  type="button"
                  className="-mt-px block w-full border border-[#54483c] bg-[linear-gradient(180deg,#2b241f_0%,#181411_100%)] p-2 text-left transition-transform active:scale-[0.99]"
                  onClick={() => openAt(index)}
                  aria-label={`Open Frame ${String(photo.sortOrder + 1).padStart(2, "0")}`}
                >
                  <div className="rounded-[0.9rem] border border-stone-700/70 bg-black/75 p-1.5">
                    <div className="overflow-hidden rounded-[0.7rem] bg-[rgba(16,13,11,0.92)]">
                      <img
                        src={photo.thumbUrl ?? photo.imageUrl}
                        alt={`Frame ${String(photo.sortOrder + 1).padStart(2, "0")}`}
                        loading="lazy"
                        decoding="async"
                        className="h-auto w-full object-contain"
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="hidden space-y-5 md:block">
            {filmRows.map((row, rowIndex) => {
              const offsetClass = rowIndex % 2 === 0 ? "mr-8" : "ml-8";
              const paddedRow = [...row];

              while (paddedRow.length < 4) {
                paddedRow.push(null as never);
              }

              return (
                <div key={`row-${rowIndex}`} className={offsetClass}>
                  <div className="relative overflow-hidden rounded-[1.8rem] border border-[#6f6253] bg-[linear-gradient(180deg,#8e7a64_0%,#6d604e_100%)] px-4 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.3)]">
                    <div className="pointer-events-none absolute inset-x-0 top-3 h-4 bg-[repeating-linear-gradient(90deg,#14110f_0px,#14110f_12px,transparent_12px,transparent_24px)] opacity-95" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-3 h-4 bg-[repeating-linear-gradient(90deg,#14110f_0px,#14110f_12px,transparent_12px,transparent_24px)] opacity-95" />

                    <div className="grid grid-cols-2 gap-0 py-4 sm:grid-cols-3 xl:grid-cols-4">
                      {paddedRow.map((photo, index) =>
                        photo ? (
                          <button
                            key={photo.id}
                            type="button"
                            className="-ml-px -mt-px border border-[#54483c] bg-[linear-gradient(180deg,#2b241f_0%,#181411_100%)] p-2 text-left transition-transform hover:z-10 hover:scale-[1.02]"
                            onClick={() => openAt(rowIndex * 4 + index)}
                            aria-label={`Open Frame ${String(photo.sortOrder + 1).padStart(2, "0")}`}
                          >
                            <div className="rounded-[0.9rem] border border-stone-700/70 bg-black/75 p-1.5">
                              <div className="aspect-[4/3] overflow-hidden rounded-[0.7rem] bg-[rgba(16,13,11,0.92)]">
                                <img
                                  src={photo.thumbUrl ?? photo.imageUrl}
                                  alt={`Frame ${String(photo.sortOrder + 1).padStart(2, "0")}`}
                                  loading="lazy"
                                  decoding="async"
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
        </div>
      )}
    </PhotoViewerGallery>
  );
}
