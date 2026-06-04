const { PrismaClient } = require('@prisma/client');

try {
  const prisma = new PrismaClient();
  console.log("Prisma client initialized");
} catch (e) {
  console.error("Failed:", e);
}
