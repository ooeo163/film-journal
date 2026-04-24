import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaSchemaVersion?: string;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined.");
}

const adapter = new PrismaPg({ connectionString });
const prismaSchemaVersion = "photo-album-journal-user-v1";

function createPrismaClient() {
  return new PrismaClient({
    adapter,
    log: ["error", "warn"],
  });
}

export const prisma =
  globalForPrisma.prisma &&
  globalForPrisma.prismaSchemaVersion === prismaSchemaVersion &&
  "album" in globalForPrisma.prisma &&
  "albumPhoto" in globalForPrisma.prisma &&
  "journal" in globalForPrisma.prisma &&
  "user" in globalForPrisma.prisma
    ? globalForPrisma.prisma
    : createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaSchemaVersion = prismaSchemaVersion;
}
