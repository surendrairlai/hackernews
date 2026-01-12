import { test, expect } from '@playwright/test';

test.describe('Hacker News', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for stories to load
    await page.waitForSelector('h2:has-text("Top Stories"), h2:has-text("Latest News")', { timeout: 10000 });
    // Wait a bit more for content to render
    await page.waitForTimeout(1000);
  });

  test('should load and display stories', async ({ page }) => {
    // Check header is visible
    await expect(page.locator('h1')).toContainText('Hacker News');
    
    // Check that stories section is visible
    await expect(page.locator('h2')).toBeVisible();
    
    // Check that at least one story card is visible (wait for content to load)
    await expect(page.locator('a[href*="news.ycombinator.com"], a[href*="http"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('should switch themes', async ({ page }) => {
    // Get initial theme state
    const initialHasDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    
    // Click theme toggle button
    const themeBtn = page.locator('button[title*="theme"]');
    await themeBtn.click();
    
    // Wait for theme to change
    await page.waitForTimeout(300);
    
    // Check that theme has changed
    const newHasDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    expect(newHasDark).toBe(!initialHasDark);
    
    // Click again to verify it toggles back
    await themeBtn.click();
    await page.waitForTimeout(300);
    const finalHasDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    expect(finalHasDark).toBe(initialHasDark);
  });
  

  test('should switch layouts', async ({ page }) => {
    // Get initial layout - check if grid or list class is present
    const gridBtn = page.locator('button[title="Grid View"]');
    const listBtn = page.locator('button[title="List View"]');
    
    // Check initial state - one should be active
    const gridActive = await gridBtn.evaluate(el => el.classList.contains('bg-accent'));
    const listActive = await listBtn.evaluate(el => el.classList.contains('bg-accent'));
    
    // Verify one is active
    expect(gridActive || listActive).toBe(true);
    
    // Click list view if grid is active, or grid if list is active
    if (gridActive) {
      await listBtn.click();
      await page.waitForTimeout(300);
      const listNowActive = await listBtn.evaluate(el => el.classList.contains('bg-accent'));
      expect(listNowActive).toBe(true);
    } else {
      await gridBtn.click();
      await page.waitForTimeout(300);
      const gridNowActive = await gridBtn.evaluate(el => el.classList.contains('bg-accent'));
      expect(gridNowActive).toBe(true);
    }
  });

  test('should switch views', async ({ page }) => {
    // Initially should show "Top Stories"
    await expect(page.locator('h2')).toContainText('Top Stories');
    
    // Click "New Stories" button
    const newStoriesBtn = page.locator('button:has-text("New Stories"), button:has-text("New")');
    await newStoriesBtn.click();
    
    // Wait for content to load
    await page.waitForSelector('h2:has-text("Latest News")', { timeout: 10000 });
    await expect(page.locator('h2')).toContainText('Latest News');
    
    // Switch back to Top Stories
    const topStoriesBtn = page.locator('button:has-text("Top Stories"), button:has-text("Top")');
    await topStoriesBtn.click();
    
    // Wait for content to load
    await page.waitForSelector('h2:has-text("Top Stories")', { timeout: 10000 });
    await expect(page.locator('h2')).toContainText('Top Stories');
  });
});
