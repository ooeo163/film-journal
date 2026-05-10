import { prisma } from "@/lib/prisma";
import { PhotoWall } from "@/components/photo-wall";
import { UploadPhotoButton } from "@/components/upload-photo-button";
import { PhotoPagination } from "@/components/photo-pagination";
import { cookies } from "next/headers";

const PAGE_SIZE = 24;

type PhotosPageProps = {
  searchParams?: Promise<{
    page?: string;
  }>;
};

export default async function PhotosPage({ searchParams }: PhotosPageProps) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("fj_user_id")?.value;
  const params = searchParams ? await searchParams : undefined;
  const currentPage = Math.max(1, Number(params?.page || "1") || 1);

  const where = {
    creatorId: userId || undefined,
  };

  const [photos, totalCount] = await Promise.all([
    prisma.photo.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        imageUrl: true,
        thumbUrl: true,
      },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.photo.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const albums = await prisma.album.findMany({
    where: {
      creatorId: userId || undefined,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
    },
  });

  return (
    <main className="relative text-stone-100">
      <div
        className="home-background fixed inset-0"
      />
      <div className="fixed inset-0 bg-[linear-gradient(90deg,rgba(9,8,7,0.88)_0%,rgba(13,11,9,0.78)_36%,rgba(14,12,10,0.7)_65%,rgba(10,9,8,0.84)_100%)]" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(7,6,5,0.26)_58%,rgba(5,4,4,0.72)_100%)]" />
      <div className="page-bg-soft-light fixed inset-0" />

      <div className="relative z-10 px-6 pb-14 pt-5">
        <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-3">
          <section className="border border-stone-700/60 bg-[rgba(18,15,13,0.38)] px-4 py-3 shadow-[0_10px_32px_rgba(0,0,0,0.14)] backdrop-blur-[1px]">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-1.5">
                <p className="text-xs uppercase tracking-[0.45em] text-stone-500" style={{ fontFamily: "var(--font-display), Georgia, serif" }}>
                  Photos
                </p>
                <h1 className="text-4xl font-semibold tracking-tight text-stone-50 md:text-5xl">
                  胶片照片
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <UploadPhotoButton albums={albums} />
                <div className="text-right text-xs uppercase tracking-[0.28em] text-stone-500" style={{ fontFamily: "var(--font-display), Georgia, serif" }}>
                  {String(totalCount).padStart(2, "0")} Frames
                </div>
              </div>
            </div>
            <div className="mt-3 h-px bg-[linear-gradient(90deg,rgba(214,188,150,0.62),rgba(214,188,150,0.08),transparent)]" />
          </section>

          <PhotoWall
            photos={photos.map((photo) => ({
              id: photo.id,
              imageUrl: photo.imageUrl,
              thumbUrl: photo.thumbUrl,
            }))}
          />

          {totalPages > 1 && (
            <PhotoPagination
              currentPage={currentPage}
              totalPages={totalPages}
            />
          )}
        </div>
      </div>
    </main>
  );
}
