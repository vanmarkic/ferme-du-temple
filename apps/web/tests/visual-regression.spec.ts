import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('hero section snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const heroSection = page.getByTestId('hero-section');
    await expect(heroSection).toHaveScreenshot('hero-section.png', {
      maxDiffPixels: 100,
    });
  });

  test('project section snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const projectSection = page.getByTestId('project-section');
    await expect(projectSection).toHaveScreenshot('project-section.png', {
      maxDiffPixels: 100,
    });
  });

  test('collaboration section snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const collaborationSection = page.getByTestId('collaboration-section');
    await expect(collaborationSection).toHaveScreenshot('collaboration-section.png', {
      maxDiffPixels: 100,
    });
  });

  test('location section snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const locationSection = page.getByTestId('location-section');
    await expect(locationSection).toHaveScreenshot('location-section.png', {
      maxDiffPixels: 100,
    });
  });

  test('pricing section snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const pricingSection = page.getByTestId('pricing-section');
    await expect(pricingSection).toHaveScreenshot('pricing-section.png', {
      maxDiffPixels: 100,
    });
  });

  test('inscription form snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const inscriptionForm = page.getByTestId('inscription-section');
    await expect(inscriptionForm).toHaveScreenshot('inscription-form.png', {
      maxDiffPixels: 100,
    });
  });

  test('timeline section snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const timelineSection = page.getByTestId('timeline-section');
    await expect(timelineSection).toHaveScreenshot('timeline-section.png', {
      maxDiffPixels: 100,
    });
  });

  test('footer snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const footer = page.getByTestId('footer');
    await expect(footer).toHaveScreenshot('footer.png', {
      maxDiffPixels: 100,
    });
  });
});
