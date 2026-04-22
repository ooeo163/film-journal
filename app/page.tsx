import { prisma } from "@/lib/prisma";

export default async function Home() {
  const latestPhoto = await prisma.photo.findFirst({
    where: {
      isPublished: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-stone-100 px-6 py-16 text-stone-900">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-stone-500">
            Film Journal
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">Home</h1>
          <p className="max-w-2xl text-base leading-7 text-stone-600">
            This is the first database-connected page for the project. It reads
            the latest published photo from PostgreSQL through Prisma.
          </p>
        </header>

        {latestPhoto ? (
          <section className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.2em] text-stone-400">
                  Latest Photo
                </p>
                <h2 className="text-3xl font-semibold">{latestPhoto.title}</h2>
                {latestPhoto.description ? (
                  <p className="max-w-2xl text-base leading-7 text-stone-600">
                    {latestPhoto.description}
                  </p>
                ) : null}
              </div>

              <dl className="grid gap-3 text-sm text-stone-700 sm:grid-cols-2">
                <div>
                  <dt className="text-stone-400">Slug</dt>
                  <dd>{latestPhoto.slug}</dd>
                </div>
                <div>
                  <dt className="text-stone-400">Location</dt>
                  <dd>{latestPhoto.location ?? "Unknown"}</dd>
                </div>
                <div>
                  <dt className="text-stone-400">Camera</dt>
                  <dd>{latestPhoto.camera ?? "Unknown"}</dd>
                </div>
                <div>
                  <dt className="text-stone-400">Lens</dt>
                  <dd>{latestPhoto.lens ?? "Unknown"}</dd>
                </div>
                <div>
                  <dt className="text-stone-400">Film</dt>
                  <dd>{latestPhoto.filmStock ?? "Unknown"}</dd>
                </div>
                <div>
                  <dt className="text-stone-400">Image URL</dt>
                  <dd className="break-all">{latestPhoto.imageUrl}</dd>
                </div>
              </dl>
            </div>
          </section>
        ) : (
          <section className="rounded-3xl border border-dashed border-stone-300 bg-white p-8">
            <p className="text-base text-stone-600">
              No published photos yet. Add one and refresh this page.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
