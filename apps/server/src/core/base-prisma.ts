import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../../generated';
import { validateEnv } from '../config/env.schema';

const env = validateEnv(process.env);

type GlobalForPrisma = { basePrisma?: PrismaClient };
const globalForPrisma = globalThis as unknown as GlobalForPrisma;

const createBaseClient = () => {
  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

  return new PrismaClient({
    adapter,
    log: env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
};

export const basePrisma = globalForPrisma.basePrisma ?? createBaseClient();

if (env.NODE_ENV !== 'production') {
  globalForPrisma.basePrisma = basePrisma;
}
