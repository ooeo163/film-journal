"use client";

import { useState } from "react";
import Image from "next/image";
import { getImageSrc } from "@/lib/local-media";

type AlbumSwitcherItem = {
  id: string;
  title: string;
  slug: string;
  imageCount: number;
  coverImageUrl: string | null;
};

type AlbumSwitcherProps = {
  albums: AlbumSwitcherItem[];
  activeSlug: string;
};

function AlbumLink({
  item,
  active,
  onClick,
}: {
  item: AlbumSwitcherItem;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <a
      href={`/albums/${item.slug}`}
      onClick={onClick}
      className={
        active
          ? "flex items-center gap-3 rounded-[1.4rem] border border-[#8b7760] bg-[linear-gradient(180deg,#6b5948_0%,#45382d_100%)] p-3 text-stone-100 shadow-[0_10px_24px_rgba(0,0,0,0.24)]"
          : "flex items-center gap-3 rounded-[1.4rem] border border-stone-700/70 bg-[rgba(28,22,18,0.72)] p-3 text-stone-300 transition-colors hover:bg-[rgba(40,31,25,0.82)]"
      }
    >
      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-[0.8rem] border border-stone-700/60 bg-[rgba(16,13,11,0.88)]">
        {item.coverImageUrl ? (
          <Image
            src={getImageSrc(item.coverImageUrl)}
            alt=""
            fill
            sizes="56px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-stone-500">
            -
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500" style={{ fontFamily: "var(--font-display), Georgia, serif" }}>
          {String(item.imageCount).padStart(2, "0")} Frames
        </p>
        <p className="mt-1 line-clamp-2 text-sm leading-5">{item.title}</p>
      </div>
    </a>
  );
}

function AlbumSwitcherContent({
  albums,
  activeSlug,
  onSelect,
}: AlbumSwitcherProps & {
  onSelect?: () => void;
}) {
  return (
    <>
      <div className="border-b border-stone-700/70 pb-4">
        <p className="text-xs uppercase tracking-[0.35em] text-stone-500" style={{ fontFamily: "var(--font-display), Georgia, serif" }}>
          Albums
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-stone-50">
          相册切换
        </h2>
      </div>

      <div className="mt-5 grid max-h-[60vh] gap-3 overflow-y-auto pr-2">
        {albums.map((item) => (
          <AlbumLink
            key={item.id}
            item={item}
            active={item.slug === activeSlug}
            onClick={onSelect}
          />
        ))}
      </div>
    </>
  );
}

export function AlbumSwitcher({ albums, activeSlug }: AlbumSwitcherProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="hidden rounded-[2rem] border border-stone-700/80 bg-[rgba(17,16,15,0.84)] p-6 shadow-[0_18px_50px_rgba(17,16,15,0.22)] backdrop-blur-[2px] xl:sticky xl:top-24 xl:block xl:h-fit">
        <AlbumSwitcherContent albums={albums} activeSlug={activeSlug} />
      </aside>

      <div className="fixed bottom-4 left-4 right-4 z-40 xl:hidden">
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-full border border-stone-700/80 bg-[rgba(18,15,13,0.92)] px-5 py-3 text-left text-sm text-stone-100 shadow-[0_14px_34px_rgba(0,0,0,0.36)] backdrop-blur-[3px]"
          onClick={() => setOpen(true)}
          aria-expanded={open}
        >
          <span>相册切换</span>
          <span className="text-xs uppercase tracking-[0.25em] text-stone-500" style={{ fontFamily: "var(--font-display), Georgia, serif" }}>
            Albums
          </span>
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[9998] xl:hidden">
          <button
            type="button"
            aria-label="Close album switcher"
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[82vh] rounded-t-[2rem] border border-stone-700/80 bg-[rgba(17,16,15,0.96)] p-5 shadow-[0_-18px_50px_rgba(0,0,0,0.36)]">
            <div className="mb-4 flex items-center justify-between">
              <div className="h-1 w-12 rounded-full bg-stone-700" />
              <button
                type="button"
                className="rounded-full border border-stone-700/80 px-4 py-2 text-sm text-stone-300"
                onClick={() => setOpen(false)}
              >
                关闭
              </button>
            </div>
            <AlbumSwitcherContent
              albums={albums}
              activeSlug={activeSlug}
              onSelect={() => setOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
