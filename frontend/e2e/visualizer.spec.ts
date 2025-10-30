import { test, expect } from '@playwright/test';

test('Visualizer basic flow: server check and pumping', async ({ page }) => {
  await page.goto('/');

  // wait for page to render
  await page.waitForSelector('#test-string');

  // ensure default input present
  const input = await page.locator('#test-string');
  await expect(input).toHaveValue('aaaaabbbbb');

  // set split to select a single 'a' at index 1..2
  await page.fill('#y-start', '1');
  await page.fill('#y-end', '2');

  // set i to 2
  await page.fill('#i-times', '2');

  // check pumped string updates
  const pumped = page.locator('.pumped-result');
  await expect(pumped).toContainText('aaaaaabbbbb');

  // click server check for original string and assert SERVER: IN appears
  await page.click('text=Check original (server)');
  await expect(page.locator('.result')).toContainText('SERVER: IN');
});
