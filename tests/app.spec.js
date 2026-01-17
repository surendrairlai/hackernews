import { test, expect } from '@playwright/test';

test.describe('Hacker News', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for stories to load
    await page.waitForSelector('h2:has-text("Top Stories"), h2:has-text("Latest News")', { timeout: 15000 });
    // Wait for at least one story card to be visible
    await page.waitForSelector('h2 a', { timeout: 15000 });
  });

  test('should load and display stories', async ({ page }) => {
    // Check header is visible
    await expect(page.locator('h1')).toContainText('Hacker News');
    
    // Check that stories section heading is visible
    await expect(page.locator('h2:has-text("Top Stories"), h2:has-text("Latest News")')).toBeVisible();
    
    // Check that at least one story title link is visible (more stable than href selector)
    await expect(page.locator('h2 a').first()).toBeVisible({ timeout: 15000 });
  });

  test('should switch themes', async ({ page }) => {
    // Get initial theme state
    const initialHasDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    
    // Click theme toggle button using role-based selector
    const themeBtn = page.locator('button[title*="theme"], button[title*="Theme"]');
    await expect(themeBtn).toBeVisible();
    await themeBtn.click();
    
    // Wait for theme to change
    await page.waitForTimeout(500);
    
    // Check that theme has changed
    const newHasDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    expect(newHasDark).toBe(!initialHasDark);
    
    // Click again to verify it toggles back
    await themeBtn.click();
    await page.waitForTimeout(500);
    const finalHasDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    expect(finalHasDark).toBe(initialHasDark);
  });
  

  test('should switch layouts', async ({ page }) => {
    // Get initial layout - check if grid or list class is present
    const gridBtn = page.locator('button[title="Grid View"]');
    const listBtn = page.locator('button[title="List View"]');
    
    // Wait for both buttons to be visible
    await expect(gridBtn).toBeVisible({ timeout: 10000 });
    await expect(listBtn).toBeVisible({ timeout: 10000 });
    
    // Check initial state - one should be active
    const gridActive = await gridBtn.evaluate(el => el.classList.contains('bg-accent'));
    const listActive = await listBtn.evaluate(el => el.classList.contains('bg-accent'));
    
    // Verify one is active
    expect(gridActive || listActive).toBe(true);
    
    // Click list view if grid is active, or grid if list is active
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
    // Initially should show "Top Stories"
    await expect(page.locator('h2:has-text("Top Stories")')).toBeVisible();
    
    // Click "New Stories" button using button text
    const newStoriesBtn = page.locator('button:has-text("New Stories"), button:has-text("New")');
    await expect(newStoriesBtn).toBeVisible();
    await newStoriesBtn.click();
    
    // Wait for content to load with increased timeout
    await page.waitForSelector('h2:has-text("Latest News")', { timeout: 15000 });
    await expect(page.locator('h2:has-text("Latest News")')).toBeVisible();
    // Wait for stories to actually load
    await page.waitForSelector('h2 a', { timeout: 15000 });
    
    // Switch back to Top Stories
    const topStoriesBtn = page.locator('button:has-text("Top Stories"), button:has-text("Top")');
    await expect(topStoriesBtn).toBeVisible();
    await topStoriesBtn.click();
    
    // Wait for content to load with increased timeout
    await page.waitForSelector('h2:has-text("Top Stories")', { timeout: 15000 });
    await expect(page.locator('h2:has-text("Top Stories")')).toBeVisible();
    // Wait for stories to actually load
    await page.waitForSelector('h2 a', { timeout: 15000 });
  });
});
