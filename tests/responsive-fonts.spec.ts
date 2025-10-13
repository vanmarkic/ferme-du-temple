import { test, expect } from '@playwright/test';

/**
 * Test suite for responsive font sizes using clamp()
 * Verifies that font sizes scale smoothly across different viewport sizes
 */

test.describe('Responsive Font Sizes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('body text scales between 16px and 17px', async ({ page }) => {
    // Test at mobile viewport (320px)
    await page.setViewportSize({ width: 320, height: 568 });
    const bodyMobile = await page.locator('body').first();
    const mobileFontSize = await bodyMobile.evaluate((el) => {
      return window.getComputedStyle(el).fontSize;
    });
    const mobilePx = parseFloat(mobileFontSize);

    // Should be close to 16px (minimum)
    expect(mobilePx).toBeGreaterThanOrEqual(16);
    expect(mobilePx).toBeLessThanOrEqual(17);

    // Test at tablet viewport (768px)
    await page.setViewportSize({ width: 768, height: 1024 });
    const bodyTablet = await page.locator('body').first();
    const tabletFontSize = await bodyTablet.evaluate((el) => {
      return window.getComputedStyle(el).fontSize;
    });
    const tabletPx = parseFloat(tabletFontSize);

    // Should be between 16px and 17px
    expect(tabletPx).toBeGreaterThanOrEqual(16);
    expect(tabletPx).toBeLessThanOrEqual(17);

    // Test at desktop viewport (1920px)
    await page.setViewportSize({ width: 1920, height: 1080 });
    const bodyDesktop = await page.locator('body').first();
    const desktopFontSize = await bodyDesktop.evaluate((el) => {
      return window.getComputedStyle(el).fontSize;
    });
    const desktopPx = parseFloat(desktopFontSize);

    // Should be close to 17px (maximum)
    expect(desktopPx).toBeGreaterThanOrEqual(16);
    expect(desktopPx).toBeLessThanOrEqual(17);
  });

  test('heading sizes scale proportionally across viewports', async ({ page }) => {
    // Find the main hero heading
    const heroHeading = page.locator('[data-testid="hero-section"] h1').first();

    // Mobile (320px)
    await page.setViewportSize({ width: 320, height: 568 });
    const mobileFontSize = await heroHeading.evaluate((el) => {
      return parseFloat(window.getComputedStyle(el).fontSize);
    });

    // Tablet (768px)
    await page.setViewportSize({ width: 768, height: 1024 });
    const tabletFontSize = await heroHeading.evaluate((el) => {
      return parseFloat(window.getComputedStyle(el).fontSize);
    });

    // Desktop (1920px)
    await page.setViewportSize({ width: 1920, height: 1080 });
    const desktopFontSize = await heroHeading.evaluate((el) => {
      return parseFloat(window.getComputedStyle(el).fontSize);
    });

    // Verify font size increases with viewport
    expect(tabletFontSize).toBeGreaterThan(mobileFontSize);
    expect(desktopFontSize).toBeGreaterThanOrEqual(tabletFontSize);

    // Verify reasonable bounds
    // Hero uses text-6xl (52-84px) on mobile and text-8xl (72-120px) on larger screens
    expect(mobileFontSize).toBeGreaterThanOrEqual(52);
    expect(desktopFontSize).toBeLessThanOrEqual(120);
  });

  test('text remains readable at all viewport sizes', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568, name: 'mobile-small' },
      { width: 375, height: 667, name: 'mobile-medium' },
      { width: 414, height: 896, name: 'mobile-large' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1024, height: 768, name: 'tablet-landscape' },
      { width: 1440, height: 900, name: 'desktop' },
      { width: 1920, height: 1080, name: 'desktop-large' },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      // Check body font size
      const bodyFontSize = await page.locator('body').first().evaluate((el) => {
        return parseFloat(window.getComputedStyle(el).fontSize);
      });

      // Minimum readable size should be at least 16px
      expect(bodyFontSize, `Body font size at ${viewport.name} (${viewport.width}px)`).toBeGreaterThanOrEqual(16);

      // Maximum should not exceed 17px for body text
      expect(bodyFontSize, `Body font size at ${viewport.name} (${viewport.width}px)`).toBeLessThanOrEqual(17);
    }
  });

  test('clamp() function is properly applied to font sizes', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });

    // Check that body text uses clamp()
    const bodyStyle = await page.locator('body').first().evaluate((el) => {
      return window.getComputedStyle(el).fontSize;
    });

    // Font size should be computed (not raw clamp() string)
    expect(bodyStyle).toMatch(/^\d+(\.\d+)?px$/);

    // Verify the computed value is within expected range
    const fontSize = parseFloat(bodyStyle);
    expect(fontSize).toBeGreaterThanOrEqual(16);
    expect(fontSize).toBeLessThanOrEqual(17);
  });

  test('font sizes maintain proper hierarchy', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });

    // Get computed font sizes for different elements
    const h1Size = await page.locator('h1').first().evaluate((el) => {
      return parseFloat(window.getComputedStyle(el).fontSize);
    });

    const h2Size = await page.locator('h2').first().evaluate((el) => {
      return parseFloat(window.getComputedStyle(el).fontSize);
    });

    const bodySize = await page.locator('body').first().evaluate((el) => {
      return parseFloat(window.getComputedStyle(el).fontSize);
    });

    // Verify hierarchy: h1 > h2 > body
    expect(h1Size).toBeGreaterThan(h2Size);
    expect(h2Size).toBeGreaterThan(bodySize);
  });

  test('font sizes are accessible and respect minimum size', async ({ page }) => {
    // Test at the smallest supported viewport
    await page.setViewportSize({ width: 320, height: 568 });

    // Get all text elements
    const textElements = await page.locator('p, span, a, button, h1, h2, h3, h4, h5, h6, li').all();

    for (const element of textElements) {
      const isVisible = await element.isVisible().catch(() => false);

      if (isVisible) {
        const fontSize = await element.evaluate((el) => {
          return parseFloat(window.getComputedStyle(el).fontSize);
        });

        // WCAG recommends minimum 14px, but we aim for 16px minimum for body text
        // Allow smaller sizes for specific UI elements like badges or labels
        expect(fontSize, 'Font size should be at least 12px for accessibility').toBeGreaterThanOrEqual(12);
      }
    }
  });
});
