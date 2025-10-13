import { Page, Locator } from '@playwright/test';

/**
 * Maximum safe dimension for screenshots in Chromium browsers
 * Using 8000px as a conservative limit (modern browsers support up to 16384px)
 */
const MAX_DIMENSION = 8000;

interface SafeScreenshotOptions {
  path: string;
  fullPage?: boolean;
  maxWidth?: number;
  maxHeight?: number;
}

interface PageDimensions {
  width: number;
  height: number;
  viewportWidth: number;
  viewportHeight: number;
}

/**
 * Get the dimensions of the page or element
 */
async function getPageDimensions(page: Page): Promise<PageDimensions> {
  return await page.evaluate(() => {
    return {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
      viewportWidth: document.documentElement.clientWidth,
      viewportHeight: document.documentElement.clientHeight,
    };
  });
}

/**
 * Take a screenshot with automatic dimension checking
 * Throws an error if dimensions exceed the safe limit
 */
export async function safeScreenshot(
  page: Page,
  options: SafeScreenshotOptions
): Promise<void> {
  const maxWidth = options.maxWidth || MAX_DIMENSION;
  const maxHeight = options.maxHeight || MAX_DIMENSION;

  if (options.fullPage) {
    const dimensions = await getPageDimensions(page);

    // Check if dimensions exceed safe limits
    if (dimensions.width > maxWidth || dimensions.height > maxHeight) {
      throw new Error(
        `Page dimensions (${dimensions.width}x${dimensions.height}) exceed safe screenshot limits (${maxWidth}x${maxHeight}). ` +
        `Consider using viewport screenshots instead of fullPage, or split the screenshot into multiple parts.`
      );
    }
  }

  await page.screenshot({
    path: options.path,
    fullPage: options.fullPage,
  });
}

/**
 * Take a screenshot of an element with dimension checking
 */
export async function safeElementScreenshot(
  locator: Locator,
  options: { path: string; maxWidth?: number; maxHeight?: number }
): Promise<void> {
  const maxWidth = options.maxWidth || MAX_DIMENSION;
  const maxHeight = options.maxHeight || MAX_DIMENSION;

  // Get element dimensions
  const box = await locator.boundingBox();

  if (box) {
    if (box.width > maxWidth || box.height > maxHeight) {
      throw new Error(
        `Element dimensions (${box.width}x${box.height}) exceed safe screenshot limits (${maxWidth}x${maxHeight}).`
      );
    }
  }

  await locator.screenshot({ path: options.path });
}

/**
 * Check if a full page screenshot would be safe without taking it
 */
export async function checkScreenshotSafety(
  page: Page,
  maxWidth = MAX_DIMENSION,
  maxHeight = MAX_DIMENSION
): Promise<{ safe: boolean; dimensions: PageDimensions; message: string }> {
  const dimensions = await getPageDimensions(page);
  const safe = dimensions.width <= maxWidth && dimensions.height <= maxHeight;

  const message = safe
    ? `Page dimensions (${dimensions.width}x${dimensions.height}) are within safe limits.`
    : `WARNING: Page dimensions (${dimensions.width}x${dimensions.height}) exceed safe limits (${maxWidth}x${maxHeight}).`;

  return { safe, dimensions, message };
}

/**
 * Take a screenshot with automatic clipping if dimensions exceed limits
 * This will take only the viewport screenshot if fullPage would exceed limits
 */
export async function adaptiveScreenshot(
  page: Page,
  options: SafeScreenshotOptions
): Promise<{ method: 'fullPage' | 'viewport'; dimensions: PageDimensions }> {
  const maxWidth = options.maxWidth || MAX_DIMENSION;
  const maxHeight = options.maxHeight || MAX_DIMENSION;
  const dimensions = await getPageDimensions(page);

  if (options.fullPage) {
    const exceeds = dimensions.width > maxWidth || dimensions.height > maxHeight;

    if (exceeds) {
      console.warn(
        `Page dimensions (${dimensions.width}x${dimensions.height}) exceed limits. ` +
        `Taking viewport screenshot instead.`
      );
      await page.screenshot({ path: options.path, fullPage: false });
      return { method: 'viewport', dimensions };
    }
  }

  await page.screenshot({
    path: options.path,
    fullPage: options.fullPage,
  });

  return { method: options.fullPage ? 'fullPage' : 'viewport', dimensions };
}
