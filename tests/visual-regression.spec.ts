import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('homepage full page snapshot', async ({ page }) => {
    await page.goto('/');
    
    // Wait for all images to load
    await page.waitForLoadState('networkidle');
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('homepage-full.png', {
      fullPage: true,
      maxDiffPixels: 100,
    });
  });

  test('hero section snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const heroSection = page.locator('section').first();
    await expect(heroSection).toHaveScreenshot('hero-section.png', {
      maxDiffPixels: 100,
    });
  });

  test('project section snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const projectSection = page.locator('section').nth(1);
    await expect(projectSection).toHaveScreenshot('project-section.png', {
      maxDiffPixels: 100,
    });
  });

  test('collaboration section snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const collaborationSection = page.locator('section').nth(2);
    await expect(collaborationSection).toHaveScreenshot('collaboration-section.png', {
      maxDiffPixels: 100,
    });
  });

  test('location section snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const locationSection = page.locator('section').nth(3);
    await expect(locationSection).toHaveScreenshot('location-section.png', {
      maxDiffPixels: 100,
    });
  });

  test('pricing section snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const pricingSection = page.locator('section').nth(4);
    await expect(pricingSection).toHaveScreenshot('pricing-section.png', {
      maxDiffPixels: 100,
    });
  });

  test('inscription form snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const inscriptionForm = page.locator('section').nth(5);
    await expect(inscriptionForm).toHaveScreenshot('inscription-form.png', {
      maxDiffPixels: 100,
    });
  });

  test('timeline section snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const timelineSection = page.locator('section').nth(6);
    await expect(timelineSection).toHaveScreenshot('timeline-section.png', {
      maxDiffPixels: 100,
    });
  });

  test('footer snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const footer = page.locator('footer');
    await expect(footer).toHaveScreenshot('footer.png', {
      maxDiffPixels: 100,
    });
  });
});
