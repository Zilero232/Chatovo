import { config } from 'dotenv';
import { fileURLToPath } from 'node:url';
import { defineConfig, env } from 'prisma/config';

config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) });

export default defineConfig({
  schema: './prisma',
  migrations: {
    path: './prisma/migrations'
  },
  datasource: {
    url: env('DIRECT_URL')
  }
});
