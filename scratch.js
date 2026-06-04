const { PrismaClient } = require('@prisma/client');

try {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL || "file:./dev.db"
  });
  console.log("Prisma client initialized");
} catch (e) {
  console.error("Failed:", e);
}
