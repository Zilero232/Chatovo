import { expect, test } from '@playwright/test';

test.describe('server routes', () => {
  test('the server page redirects an anonymous visitor to auth', async ({ page }) => {
    await page.goto('/server?id=00000000-0000-4000-8000-000000000000');

    await page.waitForURL(/\/auth/, { timeout: 15_000 });
    expect(page.url()).toContain('/auth');
  });

  test('an invite link redirects an anonymous visitor to auth', async ({ page }) => {
    await page.goto('/invite?code=abcd1234');

    await page.waitForURL(/\/auth/, { timeout: 15_000 });
    expect(page.url()).toContain('/auth');
  });

  test('the room route still redirects an anonymous visitor to auth', async ({ page }) => {
    await page.goto('/room?id=00000000-0000-4000-8000-000000000000');

    await page.waitForURL(/\/auth/, { timeout: 15_000 });
    expect(page.url()).toContain('/auth');
  });
});
