import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:3000';

export default defineConfig({
  testDir: './e2e',
  outputDir: './e2e/.results',

  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,
  retries: process.env.CI ? 1 : 0,

  timeout: 90_000,
  expect: { timeout: 15_000 },

  reporter: process.env.CI ? [['github'], ['list']] : [['list']],

  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: 'bun --filter @chatovo/client dev',
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000
      },

  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off'
  },

  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } }
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'] }
    }
  ]
});
