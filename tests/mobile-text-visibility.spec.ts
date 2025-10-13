import { test, expect } from '@playwright/test';
import { adaptiveScreenshot, safeElementScreenshot, checkScreenshotSafety } from './utils/screenshot-helper';

/**
 * Mobile Text Visibility Test Suite
 *
 * Tests that all text content is visible on mobile devices:
 * - No overflow hidden text
 * - No text behind other elements (z-index issues)
 * - No text clipped by parent containers
 * - Text properly wraps on small screens
 */

const MOBILE_VIEWPORTS = [
  { name: 'iPhone SE', width: 320, height: 568 },
  { name: 'iPhone 12/13', width: 375, height: 667 },
  { name: 'iPhone 12/13 Pro Max', width: 414, height: 896 },
  { name: 'iPad Mini', width: 768, height: 1024 },
];

// Helper function to check if element has overflow issues
async function checkTextOverflow(page: any, selector: string) {
  return await page.evaluate((sel: string) => {
    const element = document.querySelector(sel);
    if (!element) return { hasOverflow: false, reason: 'Element not found' };

    const computedStyle = window.getComputedStyle(element);
    const isHidden = computedStyle.overflow === 'hidden' || computedStyle.overflowX === 'hidden';
    const scrollWidth = element.scrollWidth;
    const clientWidth = element.clientWidth;

    return {
      hasOverflow: isHidden && scrollWidth > clientWidth,
      scrollWidth,
      clientWidth,
      overflow: computedStyle.overflow,
      overflowX: computedStyle.overflowX,
      reason: isHidden && scrollWidth > clientWidth ? 'Content wider than container with overflow hidden' : 'OK'
    };
  }, selector);
}

// Helper function to check z-index stacking issues
async function checkZIndexIssues(page: any, selector: string) {
  return await page.evaluate((sel: string) => {
    const element = document.querySelector(sel);
    if (!element) return { hasIssue: false, reason: 'Element not found' };

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Check if the element at this position is actually our element or a child
    const elementAtPoint = document.elementFromPoint(centerX, centerY);
    const isVisible = elementAtPoint === element || element.contains(elementAtPoint);

    return {
      hasIssue: !isVisible,
      elementAtPoint: elementAtPoint?.tagName + '.' + elementAtPoint?.className,
      zIndex: window.getComputedStyle(element).zIndex,
      reason: !isVisible ? 'Element covered by another element' : 'OK'
    };
  }, selector);
}

// Helper to check word breaking
async function checkWordBreaking(page: any, selector: string) {
  return await page.evaluate((sel: string) => {
    const element = document.querySelector(sel);
    if (!element) return { hasIssue: false };

    const computedStyle = window.getComputedStyle(element);
    const hasBreakWord = computedStyle.overflowWrap === 'break-word' ||
                         computedStyle.wordBreak === 'break-word' ||
                         computedStyle.wordBreak === 'break-all';

    return {
      overflowWrap: computedStyle.overflowWrap,
      wordBreak: computedStyle.wordBreak,
      hasBreakWord,
      textContent: element.textContent?.substring(0, 100)
    };
  }, selector);
}

test.describe('Mobile Text Visibility Tests', () => {

  for (const viewport of MOBILE_VIEWPORTS) {
    test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {

      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('/', { waitUntil: 'networkidle' });
      });

      test('should take full page screenshot', async ({ page }) => {
        // Check if full page screenshot is safe before taking it
        const safety = await checkScreenshotSafety(page);
        console.log(safety.message);

        // Use adaptive screenshot helper that automatically switches to viewport if page is too large
        const result = await adaptiveScreenshot(page, {
          path: `tests/screenshots/mobile-${viewport.width}px-full.png`,
          fullPage: true
        });
        console.log(`Screenshot taken using ${result.method} method (${result.dimensions.width}x${result.dimensions.height})`);
      });

      test('Hero Section - text visibility', async ({ page }) => {
        const heroSection = page.getByTestId('hero-section');
        await expect(heroSection).toBeVisible();

        // Take screenshot with dimension check
        await safeElementScreenshot(heroSection, {
          path: `tests/screenshots/hero-${viewport.width}px.png`
        });

        // Check main title overflow
        const titleOverflow = await checkTextOverflow(page, '[data-testid="hero-section"] h1');
        expect(titleOverflow.hasOverflow, `Hero title has overflow on ${viewport.name}: ${titleOverflow.reason}`).toBeFalsy();

        // Check yellow text block (overlapping element with -ml-16)
        const yellowBlock = page.locator('[data-testid="hero-section"] .bg-butter-yellow').first();
        await expect(yellowBlock).toBeVisible();

        const yellowOverflow = await checkTextOverflow(page, '[data-testid="hero-section"] .bg-butter-yellow p');
        expect(yellowOverflow.hasOverflow, `Yellow text block has overflow: ${yellowOverflow.reason}`).toBeFalsy();
      });

      test('Project Section - three poles text visibility', async ({ page }) => {
        const projectSection = page.getByTestId('project-section');
        await projectSection.scrollIntoViewIfNeeded();
        await expect(projectSection).toBeVisible();

        await safeElementScreenshot(projectSection, {
          path: `tests/screenshots/project-${viewport.width}px.png`
        });

        // Check "POURQUOI LE COLLECTIF BEAVER?" title
        const beaverTitle = projectSection.locator('text=POURQUOI LE').first();
        await expect(beaverTitle).toBeVisible();

        const beaverTitleOverflow = await checkTextOverflow(page, '[data-testid="project-section"] h3');
        expect(beaverTitleOverflow.hasOverflow, `Beaver title has overflow: ${beaverTitleOverflow.reason}`).toBeFalsy();

        // Check word breaking on long French words
        const wordBreaking = await checkWordBreaking(page, '[data-testid="project-section"] h3');
        console.log(`Word breaking config for ${viewport.name}:`, wordBreaking);

        // Check each pole for overflow
        for (let i = 0; i < 3; i++) {
          const pole = projectSection.locator('.bg-butter-yellow, .border-rich-black').nth(i);
          await expect(pole).toBeVisible();
        }
      });

      test('Location Section - transport cards and heritage', async ({ page }) => {
        const locationSection = page.getByTestId('location-section');
        await locationSection.scrollIntoViewIfNeeded();
        await expect(locationSection).toBeVisible();

        await safeElementScreenshot(locationSection, {
          path: `tests/screenshots/location-${viewport.width}px.png`
        });

        // Check heritage title
        const heritageTitle = locationSection.locator('text=Un patrimoine').first();
        if (await heritageTitle.isVisible()) {
          const overflow = await checkTextOverflow(page, '[data-testid="location-section"] h3');
          expect(overflow.hasOverflow, `Heritage title overflow: ${overflow.reason}`).toBeFalsy();
        }

        // Check floor plan doesn't overlap text (has -ml-8 on desktop)
        const floorPlanContainer = locationSection.locator('img[alt*="Plan"]').first();
        if (await floorPlanContainer.isVisible()) {
          const box = await floorPlanContainer.boundingBox();
          expect(box, 'Floor plan should be visible').toBeTruthy();
        }

        // Check transport cards text visibility
        const trainCard = locationSection.locator('text=Transport ferroviaire').first();
        if (await trainCard.isVisible()) {
          await expect(trainCard).toBeVisible();
        }
      });

      test('Pricing Section - overlapping cards text visibility', async ({ page }) => {
        const pricingSection = page.getByTestId('pricing-section');
        await pricingSection.scrollIntoViewIfNeeded();
        await expect(pricingSection).toBeVisible();

        await safeElementScreenshot(pricingSection, {
          path: `tests/screenshots/pricing-${viewport.width}px.png`
        });

        // Check main title
        const titleOverflow = await checkTextOverflow(page, '[data-testid="pricing-section"] h2');
        expect(titleOverflow.hasOverflow, `Pricing title overflow: ${titleOverflow.reason}`).toBeFalsy();

        // Check that second pricing card (which has -mt-12 negative margin) doesn't hide text
        const pricingCards = pricingSection.locator('.border-4, .bg-butter-yellow').filter({ hasText: 'M²' });
        const count = await pricingCards.count();

        for (let i = 0; i < count; i++) {
          const card = pricingCards.nth(i);
          await expect(card).toBeVisible();

          // Check z-index stacking
          const cardText = card.locator('text=Prix total').first();
          if (await cardText.isVisible()) {
            const zIndexIssue = await checkZIndexIssues(page, `[data-testid="pricing-section"] .border-4:nth-of-type(${i+1})`);
            console.log(`Card ${i+1} z-index check:`, zIndexIssue);
          }
        }

        // Check offer title with long text
        const offerTitle = pricingSection.locator('text=TOTAL').first();
        if (await offerTitle.isVisible()) {
          const overflow = await checkTextOverflow(page, '[data-testid="pricing-section"] h3');
          expect(overflow.hasOverflow, `Offer title overflow: ${overflow.reason}`).toBeFalsy();
        }
      });

      test('Timeline Section - text visibility', async ({ page }) => {
        const timelineSection = page.getByTestId('timeline-section');
        await timelineSection.scrollIntoViewIfNeeded();
        await expect(timelineSection).toBeVisible();

        await safeElementScreenshot(timelineSection, {
          path: `tests/screenshots/timeline-${viewport.width}px.png`
        });

        // Check timeline title
        const titleOverflow = await checkTextOverflow(page, '[data-testid="timeline-section"] h2');
        expect(titleOverflow.hasOverflow, `Timeline title overflow: ${titleOverflow.reason}`).toBeFalsy();
      });

      test('Inscription Form - text visibility', async ({ page }) => {
        const inscriptionSection = page.getByTestId('inscription-section');
        await inscriptionSection.scrollIntoViewIfNeeded();
        await expect(inscriptionSection).toBeVisible();

        await safeElementScreenshot(inscriptionSection, {
          path: `tests/screenshots/inscription-${viewport.width}px.png`
        });

        // Check form title and labels are visible
        const title = inscriptionSection.locator('h2, h3').first();
        await expect(title).toBeVisible();
      });

      test('Footer - text visibility', async ({ page }) => {
        const footer = page.getByTestId('footer');
        await footer.scrollIntoViewIfNeeded();
        await expect(footer).toBeVisible();

        await safeElementScreenshot(footer, {
          path: `tests/screenshots/footer-${viewport.width}px.png`
        });
      });

      test('Check for any horizontal scroll', async ({ page }) => {
        const hasHorizontalScroll = await page.evaluate(() => {
          return {
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
            hasScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth
          };
        });

        expect(hasHorizontalScroll.hasScroll,
          `Page has horizontal scroll at ${viewport.width}px: scrollWidth=${hasHorizontalScroll.scrollWidth}, clientWidth=${hasHorizontalScroll.clientWidth}`
        ).toBeFalsy();
      });
    });
  }
});
