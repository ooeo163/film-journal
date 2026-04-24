const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: "postgresql://postgres:583914@localhost:5432/film_journal?schema=public" }),
});

async function main() {
  const album = await prisma.album.findUnique({ where: { slug: "nikon-z-f" } });
  if (!album) { console.log("Album nikon-z-f not found"); return; }
  console.log(`Deleting album: ${album.title} (id: ${album.id}, slug: ${album.slug})`);
  
  // Delete AlbumPhoto junction records first
  const delJunction = await prisma.albumPhoto.deleteMany({ where: { albumId: album.id } });
  console.log(`Deleted ${delJunction.count} junction records`);
  
  // Delete orphan photos that only belong to this album
  const photos = await prisma.photo.findMany({
    where: { albumLinks: { some: { albumId: album.id } } },
    include: { albumLinks: true },
  });
  
  let orphanCount = 0;
  for (const photo of photos) {
    if (photo.albumLinks.length === 1) {
      await prisma.albumPhoto.deleteMany({ where: { photoId: photo.id } });
      await prisma.photo.delete({ where: { id: photo.id } });
      orphanCount++;
    }
  }
  console.log(`Deleted ${orphanCount} orphan photos`);
  
  // Delete the album
  await prisma.album.delete({ where: { id: album.id } });
  console.log("Album deleted");
  
  const totalPhotos = await prisma.photo.count();
  const totalAlbums = await prisma.album.count();
  console.log(`\n总相册: ${totalAlbums}, 总照片: ${totalPhotos}`);
}

main().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
