const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { randomBytes, scrypt } = require("node:crypto");
require("dotenv/config");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not defined.");
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (err, derived) => {
      if (err) reject(err);
      else resolve(`${salt}:${derived.toString("hex")}`);
    });
  });
}

async function main() {
  const password = await hashPassword("admin123");

  const admin = await prisma.user.upsert({
    where: { username: "admin_0" },
    update: {
      password,
      role: "system_admin",
      isActive: true,
    },
    create: {
      username: "admin_0",
      email: "admin_0@filmjournal.local",
      displayName: "系统管理员",
      password,
      role: "system_admin",
      isActive: true,
    },
  });

  console.log("Seed admin_0 done:", admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
