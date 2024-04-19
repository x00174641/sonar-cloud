import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://staging.clipr.solutions/');
  await page.getByPlaceholder('Search...').click();
  await page.getByPlaceholder('Search...').press('CapsLock');
  await page.getByPlaceholder('Search...').fill('AEST');
  await page.click('text=AEST', { timeout: 60000 });
  await page.waitForSelector('text=Uploaded by Lamb | 0 followers');
  const uploadedByText = await page.textContent('text=Uploaded by Lamb | 0 followers');
  expect(uploadedByText).toContain('Uploaded by Lamb | 0 followers');
  await page.click('text=AEST');
  await page.waitForSelector('text=AEST');
  const headingText = await page.textContent('text=AEST');
  expect(headingText).toContain('AEST');
});
