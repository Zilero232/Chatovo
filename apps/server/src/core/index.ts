import { validateEnv } from '../config/env.schema';

export const env = validateEnv(process.env);

export { basePrisma } from './base-prisma';
export { PrismaModule } from './prisma.module';
export { PrismaService } from './prisma.service';
