const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:583914@localhost:5432/film_journal?schema=public";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

function getRelativePathFromMediaUrl(url) {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url, "http://localhost");
    const relativePath = parsed.searchParams.get("path");

    return relativePath ? relativePath.replace(/\\/g, "/") : null;
  } catch {
    return null;
  }
}

function getAlbumSourceDir(album) {
  const coverRelativePath = getRelativePathFromMediaUrl(album.coverImageUrl);

  if (!coverRelativePath) {
    return null;
  }

  const segments = coverRelativePath.split("/");
  segments.pop();

  return segments.join("/");
}

function compareAlbums(a, b) {
  if (b.linkedCount !== a.linkedCount) {
    return b.linkedCount - a.linkedCount;
  }

  if (b.imageCount !== a.imageCount) {
    return b.imageCount - a.imageCount;
  }

  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

function comparePhotos(a, b) {
  if (b.linkedCount !== a.linkedCount) {
    return b.linkedCount - a.linkedCount;
  }

  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

async function dedupeAlbums() {
  const albums = await prisma.album.findMany({
    include: {
      photoLinks: {
        select: {
          id: true,
        },
      },
    },
  });

  const groups = new Map();

  for (const album of albums) {
    const sourceDir = getAlbumSourceDir(album);

    if (!sourceDir) {
      continue;
    }

    const group = groups.get(sourceDir) ?? [];
    group.push({
      id: album.id,
      slug: album.slug,
      title: album.title,
      imageCount: album.imageCount,
      createdAt: album.createdAt,
      linkedCount: album.photoLinks.length,
    });
    groups.set(sourceDir, group);
  }

  let deletedAlbums = 0;

  for (const [, group] of groups) {
    if (group.length <= 1) {
      continue;
    }

    group.sort(compareAlbums);
    const [, ...duplicates] = group;

    for (const duplicate of duplicates) {
      await prisma.album.delete({
        where: {
          id: duplicate.id,
        },
      });
      deletedAlbums += 1;
      console.log(`Deleted duplicate album: ${duplicate.title} (${duplicate.slug})`);
    }
  }

  return deletedAlbums;
}

async function dedupePhotos() {
  const photos = await prisma.photo.findMany({
    include: {
      albumLinks: {
        select: {
          id: true,
        },
      },
    },
  });

  const groups = new Map();

  for (const photo of photos) {
    const relativePath = getRelativePathFromMediaUrl(photo.imageUrl);

    if (!relativePath) {
      continue;
    }

    const group = groups.get(relativePath) ?? [];
    group.push({
      id: photo.id,
      slug: photo.slug,
      title: photo.title,
      createdAt: photo.createdAt,
      linkedCount: photo.albumLinks.length,
    });
    groups.set(relativePath, group);
  }

  let deletedPhotos = 0;

  for (const [, group] of groups) {
    if (group.length <= 1) {
      continue;
    }

    group.sort(comparePhotos);
    const [, ...duplicates] = group;

    for (const duplicate of duplicates) {
      await prisma.photo.delete({
        where: {
          id: duplicate.id,
        },
      });
      deletedPhotos += 1;
      console.log(`Deleted duplicate photo: ${duplicate.title} (${duplicate.slug})`);
    }
  }

  return deletedPhotos;
}

async function main() {
  const deletedAlbums = await dedupeAlbums();
  const deletedPhotos = await dedupePhotos();

  const [albums, photos, albumPhotos, orphanPhotos] = await Promise.all([
    prisma.album.count(),
    prisma.photo.count(),
    prisma.albumPhoto.count(),
    prisma.photo.count({
      where: {
        albumLinks: {
          none: {},
        },
      },
    }),
  ]);

  console.log(
    JSON.stringify(
      {
        deletedAlbums,
        deletedPhotos,
        albums,
        photos,
        albumPhotos,
        orphanPhotos,
      },
      null,
      2,
    ),
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
