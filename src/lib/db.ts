import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create a function to get the Prisma client, initializing it lazily
function getPrismaClient() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  }
  return globalForPrisma.prisma;
}

// Export as a Proxy to defer instantiation until first use
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return getPrismaClient()[prop as keyof PrismaClient];
  },
});
