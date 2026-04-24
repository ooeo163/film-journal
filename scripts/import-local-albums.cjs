const fs = require("node:fs");
const path = require("node:path");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:583914@localhost:5432/film_journal?schema=public";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const ROOT = process.env.LOCAL_IMPORT_SOURCE_ROOT || "D:\\workspace\\film-journal-img";
const LOCAL_MEDIA_ROOT =
  process.env.LOCAL_MEDIA_ROOT ||
  path.join(__dirname, "..", "storage", "local-media");

function buildLocalMediaUrl(relativePath) {
  return `/api/local-media?path=${encodeURIComponent(relativePath)}`;
}

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

function ensureDirectory(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function syncAlbumAssets(albumDirName, files) {
  const sourceDir = path.join(ROOT, albumDirName);
  const targetDir = path.join(LOCAL_MEDIA_ROOT, albumDirName);

  ensureDirectory(targetDir);

  for (const fileName of files) {
    const sourcePath = path.join(sourceDir, fileName);
    const targetPath = path.join(targetDir, fileName);

    if (!fs.existsSync(targetPath)) {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

function slugify(input) {
  return input
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function ensureUniqueSlug(baseSlug, usedSlugs) {
  let candidate = baseSlug || "album";
  let count = 1;

  while (usedSlugs.has(candidate)) {
    count += 1;
    candidate = `${baseSlug}-${count}`;
  }

  usedSlugs.add(candidate);
  return candidate;
}

function parseReadme(readmePath) {
  const content = fs.readFileSync(readmePath, "utf8");
  const titleMatch =
    content.match(/^#\s+(.+)$/m) ||
    content.match(/\|\s*文章标题\s*\|\s*(.+?)\s*\|/);
  const sourceUrlMatch = content.match(/\((https?:\/\/[^\s)]+)\)/);
  const imageCountMatch = content.match(/\|\s*(?:🖼️\s*)?图片数量\s*\|\s*(\d+)\s*张\s*\|/);

  return {
    title: titleMatch ? titleMatch[1].trim() : null,
    sourceUrl: sourceUrlMatch ? sourceUrlMatch[1].trim() : null,
    imageCount: imageCountMatch ? Number(imageCountMatch[1]) : null,
    description: "Imported from local album directory.",
  };
}

async function main() {
  const existingAlbums = await prisma.album.findMany({
    select: {
      slug: true,
      id: true,
      coverImageUrl: true,
    },
  });
  const existingPhotos = await prisma.photo.findMany({
    select: {
      id: true,
      slug: true,
      imageUrl: true,
    },
  });
  const usedSlugs = new Set([
    ...existingAlbums.map((item) => item.slug),
    ...existingPhotos.map((item) => item.slug),
  ]);
  const importedAlbumDirs = new Map(
    existingAlbums
      .map((item) => {
        const coverRelativePath = getRelativePathFromMediaUrl(item.coverImageUrl);

        return coverRelativePath
          ? [path.posix.dirname(coverRelativePath), item.id]
          : null;
      })
      .filter(Boolean),
  );
  const existingPhotosByPath = new Map(
    existingPhotos
      .map((item) => {
        const relativePath = getRelativePathFromMediaUrl(item.imageUrl);

        return relativePath ? [relativePath, item.id] : null;
      })
      .filter(Boolean),
  );
  const albumDirs = fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory());

  for (const dir of albumDirs) {
    const albumDir = path.join(ROOT, dir.name);
    const files = fs.readdirSync(albumDir);
    const imageFiles = files
      .filter((name) => /\.(jpg|jpeg|png|webp)$/i.test(name))
      .sort((a, b) => a.localeCompare(b, "en"));

    if (imageFiles.length === 0) {
      continue;
    }

    const transferableFiles = files.filter(
      (name) =>
        /\.(jpg|jpeg|png|webp|gif)$/i.test(name) ||
        /^README\.md$/i.test(name),
    );
    syncAlbumAssets(dir.name, transferableFiles);

    const readmePath = path.join(albumDir, "README.md");
    const readme = fs.existsSync(readmePath) ? parseReadme(readmePath) : null;
    const title = (readme && readme.title) || dir.name;
    const albumRelativeDir = dir.name.replace(/\\/g, "/");

    if (importedAlbumDirs.has(albumRelativeDir)) {
      console.log(`Skip imported album directory: ${title}`);
      continue;
    }

    const slug = ensureUniqueSlug(slugify(dir.name), usedSlugs);
    const coverRelativePath = `${dir.name}/${imageFiles[0]}`.replace(/\\/g, "/");

    const album = await prisma.album.create({
      data: {
        title,
        slug,
        description: readme?.description ?? "Imported from local album directory.",
        sourceUrl: readme?.sourceUrl ?? null,
        imageCount: readme?.imageCount ?? imageFiles.length,
        coverImageUrl: buildLocalMediaUrl(coverRelativePath),
        isPublished: true,
      },
    });
    importedAlbumDirs.set(albumRelativeDir, album.id);

    for (const [index, imageName] of imageFiles.entries()) {
      const relativePath = `${dir.name}/${imageName}`.replace(/\\/g, "/");
      const existingPhotoId = existingPhotosByPath.get(relativePath);
      let photoId = existingPhotoId;

      if (!photoId) {
        const photoSlug = ensureUniqueSlug(
          slugify(`${dir.name}-${path.parse(imageName).name}`),
          usedSlugs,
        );

        const photo = await prisma.photo.create({
          data: {
            title: `${title} ${String(index + 1).padStart(2, "0")}`,
            slug: photoSlug,
            description: `Imported from local album "${title}".`,
            imageUrl: buildLocalMediaUrl(relativePath),
            thumbUrl: buildLocalMediaUrl(relativePath),
            isPublished: true,
          },
        });

        photoId = photo.id;
        existingPhotosByPath.set(relativePath, photo.id);
      }

      await prisma.albumPhoto.create({
        data: {
          albumId: album.id,
          photoId,
          sortOrder: index,
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Local albums imported.");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
