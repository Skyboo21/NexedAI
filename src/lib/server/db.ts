// src/lib/server/db.ts
import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client Singleton for Next.js Serverless & Route Handlers.
 * In development, hot-reloads create multiple Prisma instances if not cached on globalThis.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const isDatabaseConfigured = (): boolean => {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL;
  return Boolean(url && url.trim().length > 0 && !url.includes("placeholder"));
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
