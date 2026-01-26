import { test, expect } from '@playwright/test';

test.describe('Hacker News', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('h2:has-text("Top Stories"), h2:has-text("Latest News")', { timeout: 15000 });
    await page.waitForSelector('h2 a', { timeout: 15000 });
  });

  test('should load and display stories', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Hacker News');
    
    await expect(page.locator('h2:has-text("Top Stories"), h2:has-text("Latest News")')).toBeVisible();
    
    await expect(page.locator('h2 a').first()).toBeVisible({ timeout: 15000 });
  });

  test('should switch themes', async ({ page }) => {
    const initialHasDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    
    const themeBtn = page.locator('button[title*="theme"], button[title*="Theme"]');
    await expect(themeBtn).toBeVisible();
    await themeBtn.click();
    
    await page.waitForTimeout(500);
    
    const newHasDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    expect(newHasDark).toBe(!initialHasDark);
    
    await themeBtn.click();
    await page.waitForTimeout(500);
    const finalHasDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    expect(finalHasDark).toBe(initialHasDark);
  });
  

  test('should switch layouts', async ({ page }) => {
    const gridBtn = page.locator('button[title="Grid View"]');
    const listBtn = page.locator('button[title="List View"]');
    
    await expect(gridBtn).toBeVisible({ timeout: 10000 });
    await expect(listBtn).toBeVisible({ timeout: 10000 });
    
    const gridActive = await gridBtn.evaluate(el => el.classList.contains('bg-accent'));
    const listActive = await listBtn.evaluate(el => el.classList.contains('bg-accent'));
    
    expect(gridActive || listActive).toBe(true);
    
    if (gridActive) {
      await listBtn.click();
      await page.waitForTimeout(500);
      const listNowActive = await listBtn.evaluate(el => el.classList.contains('bg-accent'));
      expect(listNowActive).toBe(true);
    } else {
      await gridBtn.click();
      await page.waitForTimeout(500);
      const gridNowActive = await gridBtn.evaluate(el => el.classList.contains('bg-accent'));
      expect(gridNowActive).toBe(true);
    }
  });

  test('should switch views', async ({ page }) => {
    await expect(page.locator('h2:has-text("Top Stories")')).toBeVisible();
    
    const newStoriesBtn = page.locator('button:has-text("New Stories"), button:has-text("New")');
    await expect(newStoriesBtn).toBeVisible();
    await newStoriesBtn.click();
    
    await page.waitForSelector('h2:has-text("Latest News")', { timeout: 15000 });
    await expect(page.locator('h2:has-text("Latest News")')).toBeVisible();
    await page.waitForSelector('h2 a', { timeout: 15000 });
    
    const topStoriesBtn = page.locator('button:has-text("Top Stories"), button:has-text("Top")');
    await expect(topStoriesBtn).toBeVisible();
    await topStoriesBtn.click();
    
    await page.waitForSelector('h2:has-text("Top Stories")', { timeout: 15000 });
    await expect(page.locator('h2:has-text("Top Stories")')).toBeVisible();
    await page.waitForSelector('h2 a', { timeout: 15000 });
  });

  test('should display responsive button text on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await page.waitForSelector('h2:has-text("Top Stories"), h2:has-text("Latest News")', { timeout: 10000 });
    
    const newStoriesBtn = page.locator('button:has-text("New Stories")');
    await expect(newStoriesBtn).toBeVisible();
    await newStoriesBtn.click();
    
    await page.waitForSelector('h2:has-text("Latest News")', { timeout: 10000 });
    await expect(page.locator('h2').first()).toContainText('Latest News');
  });

  test('should display responsive button text on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForSelector('h2:has-text("Top Stories")', { timeout: 10000 });
    
    const newStoriesBtn = page.locator('button:has-text("New")');
    await expect(newStoriesBtn).toBeVisible();
    await newStoriesBtn.click();
    
    await page.waitForSelector('h2:has-text("Latest News")', { timeout: 10000 });
    await expect(page.locator('h2').first()).toContainText('Latest News');
  });
});
