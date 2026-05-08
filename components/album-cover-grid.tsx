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
    <section className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {albums.length > 0 ? (
        albums.map((album) => (
          <Link
            key={album.id}
            className="group relative block overflow-hidden rounded-xl border border-stone-700/80 bg-[rgba(28,22,18,0.82)] shadow-[0_8px_24px_rgba(0,0,0,0.2)] backdrop-blur-[2px] transition duration-300 ease-out hover:-translate-y-0.5 hover:border-stone-500/80 hover:bg-[rgba(36,29,24,0.9)]"
            href={`/albums/${album.slug}`}
          >
            <div className="aspect-[3/4] bg-[rgba(16,13,11,0.88)]">
              {album.coverImageUrl ? (
                <img
                  src={album.coverImageUrl}
                  alt={album.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-[0.3em] text-stone-500">
                  No Cover
                </div>
              )}
            </div>

            <div className="p-2.5">
              <h2 className="truncate text-sm font-medium text-stone-100 transition-colors group-hover:text-white">
                {album.title}
              </h2>
              <p className="mt-1 text-[11px] text-stone-500">
                {album.photoCount} photos
              </p>
            </div>
          </Link>
        ))
      ) : (
        <div className="py-12 text-center text-sm text-stone-500 col-span-full">
          还没有相册，点击上方「创建相册」开始吧。
        </div>
      )}
    </section>
  );
}
