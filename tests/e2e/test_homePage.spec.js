import { test, expect } from '@playwright/test';

test('test', async ({ page, browserName }) => {
  await page.goto('https://staging.clipr.solutions/');
  const content = await page.content();
  await page.click('[placeholder="Search..."]');
  await page.waitForSelector('[placeholder="Search..."]');
  expect(content).toContain('Login');
  expect(content).toContain('CLIPR SOLUTIONS');
  expect(content).toContain('Download For Windows');
});
