const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: "postgresql://postgres:583914@localhost:5432/film_journal?schema=public" }),
});

async function main() {
  // Check nikon-z-f-2 album photos
  const album2 = await prisma.album.findUnique({ where: { slug: "nikon-z-f-2" }, include: { photoLinks: true } });
  console.log(`Album nikon-z-f-2: ${album2.photoLinks.length} photos`);
  
  // Check all photos with "img_01" to find duplicates
  const dupes = await prisma.photo.findMany({
    where: { slug: { contains: "img-01" } },
    include: { albumLinks: { include: { album: true } } },
  });
  console.log(`\nPhotos with slug containing "img-01":`);
  for (const p of dupes) {
    console.log(`  ${p.id} slug=${p.slug} albums=[${p.albumLinks.map(a => a.album.slug).join(', ')}]`);
  }
  
  const totalPhotos = await prisma.photo.count();
  const totalAlbums = await prisma.album.count();
  console.log(`\n总相册: ${totalAlbums}, 总照片: ${totalPhotos}`);
}

main().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
