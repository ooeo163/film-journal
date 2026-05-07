import Link from "next/link";

type AlbumCover = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImageUrl: string | null;
  photoCount: number;
};

type AlbumCoverGridProps = {
  albums: AlbumCover[];
};

export function AlbumCoverGrid({ albums }: AlbumCoverGridProps) {
  return (
    <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {albums.length > 0 ? (
        albums.map((album) => (
          <Link
            key={album.id}
            className="group relative block overflow-hidden rounded-[1.25rem] border border-stone-700/80 bg-[rgba(28,22,18,0.82)] shadow-[0_12px_32px_rgba(0,0,0,0.22)] backdrop-blur-[2px] transition duration-300 ease-out hover:-translate-y-1 hover:border-stone-500/80 hover:bg-[rgba(36,29,24,0.9)]"
            href={`/albums/${album.slug}`}
          >
            <div className="aspect-[5/4] border-b border-stone-700/70 bg-[rgba(16,13,11,0.88)]">
              {album.coverImageUrl ? (
                <img
                  src={album.coverImageUrl}
                  alt={album.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.3em] text-stone-500">
                  No Cover
                </div>
              )}
            </div>

            <div className="space-y-3 p-4">
              <div className="space-y-1.5">
                <p className="text-[11px] uppercase tracking-[0.3em] text-stone-500">
                  Imported Album
                </p>
                <h2 className="text-xl font-semibold text-stone-50 transition-colors group-hover:text-white">
                  {album.title}
                </h2>
                <p className="line-clamp-2 text-sm leading-6 text-stone-300">
                  {album.description ??
                    "暂无简介，后续会在相册详情页里补更完整的描述。"}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-stone-700/60 pt-3 text-xs uppercase tracking-[0.22em] text-stone-500">
                <span>{album.photoCount} photos</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  Enter
                </span>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="h-full w-full bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,transparent_30%,transparent_100%)]" />
            </div>
          </Link>
        ))
      ) : (
        <div className="py-16 text-center text-sm text-stone-500 sm:col-span-2 lg:col-span-3 2xl:col-span-4">
          还没有相册，点击上方「创建相册」开始吧。
        </div>
      )}
    </section>
  );
}
