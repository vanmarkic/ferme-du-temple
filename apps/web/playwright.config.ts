import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
    video: 'off',
    screenshot: 'only-on-failure',
    // Set maximum viewport to prevent screenshots exceeding browser limits
    // Chromium has a 16,384px limit, but we use 8,000px as a conservative safe limit
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'BYPASS_AUTH=true npm run dev',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    env: {
      BYPASS_AUTH: 'true',
    },
  },
});
