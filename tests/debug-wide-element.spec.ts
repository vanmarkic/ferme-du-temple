import { test } from '@playwright/test';

test('Find element causing horizontal scroll', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/', { waitUntil: 'networkidle' });

  // Check container dimensions
  const containerInfo = await page.evaluate(() => {
    const container = document.querySelector('.container');
    if (!container) return null;

    const computed = window.getComputedStyle(container);
    const rect = container.getBoundingClientRect();

    return {
      width: rect.width,
      paddingLeft: computed.paddingLeft,
      paddingRight: computed.paddingRight,
      marginLeft: computed.marginLeft,
      marginRight: computed.marginRight,
    };
  });

  console.log('\n=== Container Info ===');
  console.log(JSON.stringify(containerInfo, null, 2));

  // Check grid info
  const gridInfo = await page.evaluate(() => {
    const grids = Array.from(document.querySelectorAll('.grid'));
    return grids.slice(0, 3).map(grid => {
      const computed = window.getComputedStyle(grid);
      const rect = grid.getBoundingClientRect();
      return {
        width: rect.width,
        gap: computed.gap,
        gridTemplateColumns: computed.gridTemplateColumns,
      };
    });
  });

  console.log('\n=== Grid Info ===');
  console.log(JSON.stringify(gridInfo, null, 2));

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
          paddingLeft: computed.paddingLeft,
          paddingRight: computed.paddingRight,
          marginLeft: computed.marginLeft,
          marginRight: computed.marginRight,
          textContent: el.textContent?.substring(0, 50),
          display: computed.display,
          whiteSpace: computed.whiteSpace,
        };
      })
      .filter(item => item.width > viewportWidth || item.scrollWidth > viewportWidth)
      .sort((a, b) => b.width - a.width)
      .slice(0, 10);
  });

  console.log('\n=== Wide elements causing horizontal scroll ===');
  console.log(JSON.stringify(wideElements, null, 2));
});
