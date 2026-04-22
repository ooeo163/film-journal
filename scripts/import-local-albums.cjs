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

const ROOT = process.env.LOCAL_ALBUMS_ROOT || "D:\\workspace\\film-journal-img";

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
  const usedSlugs = new Set(
    (await prisma.album.findMany({ select: { slug: true } })).map((item) => item.slug),
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

    const readmePath = path.join(albumDir, "README.md");
    const readme = fs.existsSync(readmePath) ? parseReadme(readmePath) : null;
    const title = (readme && readme.title) || dir.name;
    const slug = ensureUniqueSlug(slugify(dir.name), usedSlugs);
    const coverRelativePath = `${dir.name}/${imageFiles[0]}`.replace(/\\/g, "/");
    const existingAlbum = await prisma.album.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (existingAlbum) {
      console.log(`Skip existing album: ${title}`);
      continue;
    }

    const album = await prisma.album.create({
      data: {
        title,
        slug,
        description: readme?.description ?? "Imported from local album directory.",
        sourceUrl: readme?.sourceUrl ?? null,
        imageCount: readme?.imageCount ?? imageFiles.length,
        coverImageUrl: `/api/local-media?path=${encodeURIComponent(coverRelativePath)}`,
        isPublished: true,
      },
    });

    for (const [index, imageName] of imageFiles.entries()) {
      const relativePath = `${dir.name}/${imageName}`.replace(/\\/g, "/");
      const photoSlug = ensureUniqueSlug(slugify(`${dir.name}-${path.parse(imageName).name}`), usedSlugs);

      const photo = await prisma.photo.create({
        data: {
          title: `${title} ${String(index + 1).padStart(2, "0")}`,
          slug: photoSlug,
          description: `Imported from local album "${title}".`,
          imageUrl: `/api/local-media?path=${encodeURIComponent(relativePath)}`,
          thumbUrl: `/api/local-media?path=${encodeURIComponent(relativePath)}`,
          isPublished: true,
        },
      });

      await prisma.albumPhoto.create({
        data: {
          albumId: album.id,
          photoId: photo.id,
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
