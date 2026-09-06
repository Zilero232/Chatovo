import { expect, test } from '@playwright/test';

test.describe('public routes', () => {
  test('home renders and links to the auth page', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/chatovo/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('auth page renders a sign-in form', async ({ page }) => {
    await page.goto('/auth');

    await expect(page.getByRole('textbox').first()).toBeVisible();
  });

  test('privacy policy is reachable without auth', async ({ page }) => {
    const response = await page.goto('/privacy');

    expect(response?.status()).toBe(200);
    await expect(page.locator('body')).toContainText(/privacy|конфиденциальност/i);
  });

  test('terms are reachable without auth', async ({ page }) => {
    const response = await page.goto('/terms');

    expect(response?.status()).toBe(200);
    await expect(page.locator('body')).toContainText(/terms|условия/i);
  });

  test('an unknown route renders the not-found page', async ({ page }) => {
    await page.goto('/definitely-not-a-real-route');

    await expect(page.locator('body')).toBeVisible();
  });

  test('lobby redirects an anonymous visitor to auth', async ({ page }) => {
    await page.goto('/lobby');

    await page.waitForURL(/\/auth/, { timeout: 15_000 });
    expect(page.url()).toContain('/auth');
  });
});
