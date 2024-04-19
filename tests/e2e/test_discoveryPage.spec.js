import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://staging.clipr.solutions/');
  await page.locator('div').filter({ hasText: /^Login$/ }).getByRole('link').click();
  const currentUrl = page.url();
  expect(currentUrl).toBe('https://staging.clipr.solutions/discovery');
});
