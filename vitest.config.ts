import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      'packages/schemas/vitest.config.ts',
      'apps/server/vitest.config.ts',
      'apps/client/vitest.config.ts'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'packages/schemas/src/**',
        'apps/server/src/**',
        'apps/client/{entities,features,shared,widgets}/**'
      ],
      exclude: ['**/_tests/**', '**/*.types.ts', '**/index.ts']
    }
  }
});
