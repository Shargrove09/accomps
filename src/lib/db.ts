import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

// Create a function to get the Prisma client, initializing it lazily
function getPrismaClient() {
  if (!globalForPrisma.prisma) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    if (!globalForPrisma.pool) {
      globalForPrisma.pool = new Pool({ connectionString });
    }

    const adapter = new PrismaPg(globalForPrisma.pool);

    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log:
        process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }
  return globalForPrisma.prisma;
}

// Export as a Proxy to defer instantiation until first use
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = client[prop as keyof PrismaClient];

    // Bind methods to the client instance to preserve 'this' context
    if (typeof value === "function") {
      return value.bind(client);
    }

    return value;
  },
});
