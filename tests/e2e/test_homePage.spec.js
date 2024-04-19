import { test, expect } from '@playwright/test';

test('test', async ({ page, browserName }) => {
  if (browserName === 'firefox') {
    console.log('Skipping test for Firefox browser.');
    return;
  }

  await page.goto('https://staging.clipr.solutions/');
  await page.waitForLoadState('networkidle', { timeout: 50000 });
  const content = await page.content();
  expect(content).toContain('Clipr is a user-friendly tool');
  await page.click('[placeholder="Search..."]');
  await page.waitForSelector('[placeholder="Search..."]');
  expect(content).toContain('Login');
  expect(content).toContain('CLIPR SOLUTIONS');
  expect(content).toContain('Download For Windows');
});
