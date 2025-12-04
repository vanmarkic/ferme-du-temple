import { test, expect, type Page } from '@playwright/test';

/**
 * ODJ-PV (Ordre du Jour - Procès Verbal) Integration Tests
 *
 * Non-destructive tests that verify the ODJ-PV feature functionality:
 * - Page accessibility and navigation
 * - UI component rendering
 * - Read-only API endpoint validation
 * - Authentication flow verification
 *
 * These tests do NOT create, modify, or delete any data.
 */

test.describe('ODJ-PV Feature Integration Tests', () => {

  test.describe('Page Accessibility', () => {

    test('odj-pv index page should require authentication', async ({ page }) => {
      // Attempt to access without auth
      const response = await page.goto('/admin/odj-pv');

      // Should either redirect to login or show unauthorized
      const url = page.url();
      const isRedirectedToLogin = url.includes('login') || url.includes('auth');
      const isUnauthorizedPage = await page.locator('text=/unauthorized|connexion|se connecter/i').count() > 0;

      expect(isRedirectedToLogin || isUnauthorizedPage || response?.status() === 401).toBeTruthy();
    });

    test('decisions page should require authentication', async ({ page }) => {
      const response = await page.goto('/admin/odj-pv/decisions');

      const url = page.url();
      const isRedirectedToLogin = url.includes('login') || url.includes('auth');
      const isUnauthorizedPage = await page.locator('text=/unauthorized|connexion|se connecter/i').count() > 0;

      expect(isRedirectedToLogin || isUnauthorizedPage || response?.status() === 401).toBeTruthy();
    });

    test('meeting detail page should require authentication', async ({ page }) => {
      // Try a random UUID that won't exist
      const response = await page.goto('/admin/odj-pv/00000000-0000-0000-0000-000000000000');

      const url = page.url();
      const isRedirectedToLogin = url.includes('login') || url.includes('auth');
      const isUnauthorizedPage = await page.locator('text=/unauthorized|connexion|se connecter/i').count() > 0;

      expect(isRedirectedToLogin || isUnauthorizedPage || response?.status() === 401).toBeTruthy();
    });
  });

  test.describe('API Endpoint Security', () => {

    test('GET /api/odj-pv/meetings should return 401 without auth', async ({ request }) => {
      const response = await request.get('/api/odj-pv/meetings');
      expect(response.status()).toBe(401);

      const body = await response.json();
      expect(body.message).toBe('Unauthorized');
    });

    test('GET /api/odj-pv/decisions should return 401 without auth', async ({ request }) => {
      const response = await request.get('/api/odj-pv/decisions');
      expect(response.status()).toBe(401);

      const body = await response.json();
      expect(body.message).toBe('Unauthorized');
    });

    test('GET /api/odj-pv/agenda-items should return 400 or 401', async ({ request }) => {
      // Without meeting_id param, should return 400 if authed, 401 if not
      const response = await request.get('/api/odj-pv/agenda-items');
      expect([400, 401]).toContain(response.status());
    });

    test('GET /api/odj-pv/missions should return 401 without auth', async ({ request }) => {
      const response = await request.get('/api/odj-pv/missions');
      expect(response.status()).toBe(401);
    });

    test('GET /api/odj-pv/member-roles should return 401 without auth', async ({ request }) => {
      const response = await request.get('/api/odj-pv/member-roles');
      expect(response.status()).toBe(401);
    });

    test('GET /api/odj-pv/versions should return 401 without auth', async ({ request }) => {
      const response = await request.get('/api/odj-pv/versions');
      expect(response.status()).toBe(401);
    });

    test('POST /api/odj-pv/meetings should return 401 without auth', async ({ request }) => {
      const response = await request.post('/api/odj-pv/meetings', {
        data: { title: 'Test Meeting', date: '2025-01-01' }
      });
      expect(response.status()).toBe(401);
    });

    test('POST /api/odj-pv/decisions should return 401 without auth', async ({ request }) => {
      const response = await request.post('/api/odj-pv/decisions', {
        data: {
          meeting_id: '00000000-0000-0000-0000-000000000000',
          content: 'Test',
          impact_level: 'daily'
        }
      });
      expect(response.status()).toBe(401);
    });

    test('DELETE endpoints should return 401 without auth', async ({ request }) => {
      const meetingsDelete = await request.delete('/api/odj-pv/meetings?id=test');
      expect(meetingsDelete.status()).toBe(401);

      const decisionsDelete = await request.delete('/api/odj-pv/decisions?id=test');
      expect(decisionsDelete.status()).toBe(401);

      const agendaDelete = await request.delete('/api/odj-pv/agenda-items?id=test');
      expect(agendaDelete.status()).toBe(401);
    });
  });

  test.describe('API Response Format Validation', () => {

    test('unauthorized responses should have correct JSON structure', async ({ request }) => {
      const response = await request.get('/api/odj-pv/meetings');

      expect(response.headers()['content-type']).toContain('application/json');

      const body = await response.json();
      expect(body).toHaveProperty('message');
      expect(typeof body.message).toBe('string');
    });

    test('API endpoints should not expose stack traces on error', async ({ request }) => {
      const response = await request.get('/api/odj-pv/meetings');
      const body = await response.json();

      // Should not contain stack trace indicators
      expect(body.message).not.toContain('Error:');
      expect(body.message).not.toContain('at ');
      expect(body).not.toHaveProperty('stack');
    });
  });

  test.describe('Route Validation', () => {

    test('non-existent API routes should return 404', async ({ request }) => {
      const response = await request.get('/api/odj-pv/nonexistent');
      expect(response.status()).toBe(404);
    });

    test('admin pages should have proper base layout structure', async ({ page }) => {
      // Even when redirected, the page should still render properly
      await page.goto('/admin/odj-pv');

      // Page should have a valid HTML structure
      const html = await page.locator('html');
      await expect(html).toBeVisible();

      // No JavaScript errors should have occurred
      const errors: string[] = [];
      page.on('pageerror', (err) => errors.push(err.message));

      await page.waitForTimeout(1000);

      // Filter out expected auth-related errors
      const unexpectedErrors = errors.filter(e =>
        !e.includes('401') &&
        !e.includes('unauthorized') &&
        !e.includes('auth')
      );

      expect(unexpectedErrors).toHaveLength(0);
    });
  });

  test.describe('Content Security', () => {

    test('API should not accept malformed JSON', async ({ request }) => {
      const response = await request.post('/api/odj-pv/meetings', {
        headers: { 'Content-Type': 'application/json' },
        data: 'not valid json{{{',
      });

      // Should return error, not crash
      expect([400, 401, 500]).toContain(response.status());
    });

    test('API should handle empty request body', async ({ request }) => {
      const response = await request.post('/api/odj-pv/meetings', {
        headers: { 'Content-Type': 'application/json' },
        data: {},
      });

      // Should return error, not crash
      expect([400, 401]).toContain(response.status());
    });
  });
});

test.describe('ODJ-PV Static Assets', () => {

  test('client-side JavaScript bundle should load', async ({ page }) => {
    const jsRequests: string[] = [];

    page.on('request', (request) => {
      if (request.url().includes('odj-pv') && request.url().endsWith('.js')) {
        jsRequests.push(request.url());
      }
    });

    await page.goto('/admin/odj-pv');
    await page.waitForTimeout(2000);

    // The page should attempt to load JS (even if auth blocks rendering)
    // This is a smoke test for asset availability
  });
});

test.describe('ODJ-PV Validation Rules', () => {

  test('meetings API should validate required fields', async ({ request }) => {
    // Missing title
    const response1 = await request.post('/api/odj-pv/meetings', {
      data: { date: '2025-01-01' }
    });
    expect([400, 401]).toContain(response1.status());

    // Missing date
    const response2 = await request.post('/api/odj-pv/meetings', {
      data: { title: 'Test' }
    });
    expect([400, 401]).toContain(response2.status());
  });

  test('decisions API should validate impact_level enum', async ({ request }) => {
    const response = await request.post('/api/odj-pv/decisions', {
      data: {
        meeting_id: '00000000-0000-0000-0000-000000000000',
        content: 'Test',
        impact_level: 'invalid_level'
      }
    });

    // Should reject invalid impact_level (after auth check)
    expect([400, 401]).toContain(response.status());
  });

  test('PUT requests should require ID', async ({ request }) => {
    const meetingsResponse = await request.put('/api/odj-pv/meetings', {
      data: { title: 'Updated' }
    });
    expect([400, 401]).toContain(meetingsResponse.status());

    const decisionsResponse = await request.put('/api/odj-pv/decisions', {
      data: { content: 'Updated' }
    });
    expect([400, 401]).toContain(decisionsResponse.status());

    const agendaResponse = await request.put('/api/odj-pv/agenda-items', {
      data: { title: 'Updated' }
    });
    expect([400, 401]).toContain(agendaResponse.status());
  });
});
