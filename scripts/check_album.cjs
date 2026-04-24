const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: "postgresql://postgres:583914@localhost:5432/film_journal?schema=public" }),
});

async function main() {
  const albums = await prisma.album.findMany({ 
    where: { title: { contains: "Nikon" } },
  });
  console.log(JSON.stringify(albums, null, 2));
  
  const totalPhotos = await prisma.photo.count();
  const totalAlbums = await prisma.album.count();
  console.log(`\n总相册: ${totalAlbums}, 总照片: ${totalPhotos}`);
}

main().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
