import { test, expect } from '@playwright/test';

/**
 * Test suite to ensure content is not hidden under fixed navigation
 */

test.describe('Navigation Clearance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('hero section is visible and not hidden under navigation', async ({ page }) => {
    // Test on mobile
    await page.setViewportSize({ width: 430, height: 932 });

    // Get navigation height and position
    const nav = page.locator('nav').first();
    const navBox = await nav.boundingBox();
    expect(navBox).not.toBeNull();

    // Get hero section position
    const heroSection = page.locator('[data-testid="hero-section"]');
    const heroBox = await heroSection.boundingBox();
    expect(heroBox).not.toBeNull();

    // Get hero h1 position
    const heroTitle = page.locator('[data-testid="hero-section"] h1').first();
    const heroTitleBox = await heroTitle.boundingBox();
    expect(heroTitleBox).not.toBeNull();

    // Navigation should be fixed at top
    expect(navBox!.y).toBe(0);

    // Hero title top should be below navigation bottom (with padding)
    expect(heroTitleBox!.y).toBeGreaterThan(navBox!.y + navBox!.height);

    // Hero section should start at or after navigation
    expect(heroBox!.y).toBeGreaterThanOrEqual(0);
  });

  test('hero content is fully visible on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    const nav = page.locator('nav').first();
    const navBox = await nav.boundingBox();

    const heroTitle = page.locator('[data-testid="hero-section"] h1').first();
    const heroTitleBox = await heroTitle.boundingBox();

    // Hero title should be below navigation
    expect(heroTitleBox!.y).toBeGreaterThan(navBox!.y + navBox!.height);
  });

  test('navigation height remains consistent', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568 },
      { width: 768, height: 1024 },
      { width: 1920, height: 1080 },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);

      const nav = page.locator('nav').first();
      const navBox = await nav.boundingBox();

      // Navigation should be approximately 80px tall (h-20 = 5rem = 80px), allow for borders
      expect(navBox!.height, `Navigation height at ${viewport.width}px`).toBeGreaterThanOrEqual(80);
      expect(navBox!.height, `Navigation height at ${viewport.width}px`).toBeLessThanOrEqual(81);
    }
  });

  test('hero section has proper top spacing on all viewports', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568, name: 'mobile-small' },
      { width: 430, height: 932, name: 'mobile-large' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1440, height: 900, name: 'desktop' },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      // Wait for page to settle
      await page.waitForTimeout(100);

      const nav = page.locator('nav').first();
      const navBox = await nav.boundingBox();

      const heroSection = page.locator('[data-testid="hero-section"]');
      const heroBox = await heroSection.boundingBox();

      const heroTitle = page.locator('[data-testid="hero-section"] h1').first();

      // Ensure hero title is visible
      await expect(heroTitle).toBeVisible();

      const heroTitleBox = await heroTitle.boundingBox();

      // Hero title must be below the navigation
      expect(
        heroTitleBox!.y,
        `Hero title should be below navigation at ${viewport.name} (${viewport.width}px)`
      ).toBeGreaterThan(navBox!.y + navBox!.height);
    }
  });
});
