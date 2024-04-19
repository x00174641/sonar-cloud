import { test, expect } from '@playwright/test';

test('Login Successful', async ({ page }) => {
  await page.goto('https://staging.clipr.solutions/');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByPlaceholder('Clipr Username').click();
  await page.getByPlaceholder('Clipr Username').fill('test');
  await page.getByPlaceholder('Clipr Password').click();
  await page.getByPlaceholder('Clipr Password').press('CapsLock');
  await page.getByPlaceholder('Clipr Password').fill('Test12345!');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForSelector('.relative.flex');
  const toastText = await page.textContent('.relative.flex');
  expect(toastText).toContain('You are now logged in.');
  await page.waitForSelector('text=Account Settings');
  expect(await page.isVisible('text=Account Settings')).toBeTruthy();
});

// No Params
test('No Params For Login', async ({ page }) => {
    await page.goto('https://staging.clipr.solutions/');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForSelector('.relative.flex');
    const toastText = await page.textContent('.relative.flex');
    expect(toastText).toContain('Request does not contain valid parameters');
  });

// Invalid Credentials
test('Invalid Credentials', async ({ page }) => {
    await page.goto('https://staging.clipr.solutions/');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByPlaceholder('Clipr Username').click();
    await page.getByPlaceholder('Clipr Username').fill('test');
    await page.getByPlaceholder('Clipr Password').click();
    await page.getByPlaceholder('Clipr Password').press('CapsLock');
    await page.getByPlaceholder('Clipr Password').fill('Test12345!!');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForSelector('.relative.flex');
    const toastText = await page.textContent('.relative.flex');
    expect(toastText).toContain('Incorrect username or password.');
});
