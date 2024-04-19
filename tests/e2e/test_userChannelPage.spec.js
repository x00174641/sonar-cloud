import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://staging.clipr.solutions/');
  await page.getByPlaceholder('Search...').click();
  await page.getByPlaceholder('Search...').press('CapsLock');
  await page.getByPlaceholder('Search...').fill('AEST');
  await page.getByRole('link', { name: 'AEST 3 views' }).click();
  await page.getByRole('link', { name: 'Lamb | 0 followers' }).click();
  const textContent = await page.textContent('text=@lamb');
  expect(textContent).toContain('@lamb');
  const currentUrl = page.url();
  expect(currentUrl).toBe('https://staging.clipr.solutions/user/channel/lamb');
});
