import { test } from '@playwright/test';

test('Find element causing horizontal scroll', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/', { waitUntil: 'networkidle' });

  // Find all elements wider than viewport
  const wideElements = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('*'));
    const viewportWidth = document.documentElement.clientWidth;

    return elements
      .map(el => {
        const rect = el.getBoundingClientRect();
        const computed = window.getComputedStyle(el);
        return {
          tag: el.tagName,
          class: el.className,
          id: el.id,
          width: rect.width,
          scrollWidth: el.scrollWidth,
          minWidth: computed.minWidth,
          maxWidth: computed.maxWidth,
          textContent: el.textContent?.substring(0, 100),
          display: computed.display,
          whiteSpace: computed.whiteSpace,
        };
      })
      .filter(item => item.width > viewportWidth || item.scrollWidth > viewportWidth)
      .sort((a, b) => b.width - a.width)
      .slice(0, 20);
  });

  console.log('Wide elements causing horizontal scroll:');
  console.log(JSON.stringify(wideElements, null, 2));
});
