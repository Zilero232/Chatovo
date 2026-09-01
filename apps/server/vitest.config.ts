import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'server',
    environment: 'node',
    include: ['src/**/*.test.ts'],
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://test:test@localhost:5433/test',
      BETTER_AUTH_SECRET: 'test-secret-not-used-outside-tests',
      BETTER_AUTH_URL: 'http://localhost:4000',
      SMTP_HOST: 'localhost',
      SMTP_SECURE: 'false',
      SMTP_USER: 'test',
      SMTP_PASSWORD: 'test',
      EMAIL_FROM: 'test@chatovo.invalid',
      SUPPORT_EMAIL: 'test@chatovo.invalid',
      LIVEKIT_API_KEY: 'devkey',
      LIVEKIT_API_SECRET: 'devsecret_devsecret_devsecret_32',
      LIVEKIT_URL: 'ws://localhost:7880'
    }
  },
  resolve: {
    alias: {
      '@chatovo/schemas': resolve(import.meta.dirname, '../../packages/schemas/src')
    }
  }
});
