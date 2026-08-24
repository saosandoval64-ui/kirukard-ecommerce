// Prisma client - mock for portfolio demo (no database required)
// In production, replace with actual Prisma client

export const prisma = {
  product: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async (data: any) => data,
    update: async (data: any) => data,
    delete: async () => ({}),
    count: async () => 0,
    findFirst: async () => null,
    updateMany: async () => ({ count: 0 }),
  },
  user: {
    findUnique: async () => null,
    create: async (data: any) => data,
    findMany: async () => [],
  },
  session: {
    create: async (data: any) => data,
    findUnique: async () => null,
    deleteMany: async () => ({}),
    delete: async () => ({}),
  },
  order: {
    create: async (data: any) => data,
    findMany: async () => [],
    findUnique: async () => null,
    update: async (data: any) => data,
    count: async () => 0,
  },
  orderItem: {
    create: async (data: any) => data,
  },
  settings: {
    findUnique: async () => null,
    upsert: async (data: any) => data,
    findMany: async () => [],
  },
  $transaction: async (fns: any[]) => {
    const results = [];
    for (const fn of fns) {
      results.push(await fn);
    }
    return results;
  },
  $disconnect: async () => {},
} as any;
