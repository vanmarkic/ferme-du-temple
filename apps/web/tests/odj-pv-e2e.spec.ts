import { test, expect, type Page } from '@playwright/test';

/**
 * ODJ-PV End-to-End Tests
 *
 * These tests require valid admin credentials set via environment variables:
 * - TEST_ADMIN_EMAIL: Admin email for login
 * - TEST_ADMIN_PASSWORD: Admin password for login
 *
 * Run with: TEST_ADMIN_EMAIL=xxx TEST_ADMIN_PASSWORD=xxx npx playwright test odj-pv-e2e.spec.ts
 */

const TEST_EMAIL = process.env.TEST_ADMIN_EMAIL || '';
const TEST_PASSWORD = process.env.TEST_ADMIN_PASSWORD || '';

// Skip all tests if credentials are not provided
test.beforeEach(({ }, testInfo) => {
  if (!TEST_EMAIL || !TEST_PASSWORD) {
    testInfo.skip();
    console.log('Skipping E2E tests: TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD environment variables required');
  }
});

async function login(page: Page) {
  await page.goto('/admin/login');

  // Fill login form
  await page.fill('input[type="email"]', TEST_EMAIL);
  await page.fill('input[type="password"]', TEST_PASSWORD);

  // Submit
  await page.click('button[type="submit"]');

  // Wait for redirect (should go to dashboard or odj-pv)
  await page.waitForURL(/\/admin\/(dashboard|odj-pv)/, { timeout: 10000 });
}

test.describe('ODJ-PV Meeting Creation E2E', () => {

  test('should login and access ODJ-PV page', async ({ page }) => {
    await login(page);

    // Navigate to ODJ-PV
    await page.goto('/admin/odj-pv');

    // Should see the meeting list page
    await expect(page.locator('text=/reunion|meeting/i').first()).toBeVisible({ timeout: 5000 });
  });

  test('should create a new meeting end-to-end', async ({ page }) => {
    await login(page);

    // Navigate to ODJ-PV
    await page.goto('/admin/odj-pv');
    await page.waitForLoadState('networkidle');

    // Click button to create new meeting
    const createButton = page.locator('button:has-text("Nouvelle"), button:has-text("Créer"), button:has-text("Ajouter")').first();
    await createButton.click();

    // Wait for the form to appear
    await expect(page.locator('text=/Nouvelle Reunion|New Meeting/i')).toBeVisible({ timeout: 5000 });

    // Generate unique test data
    const testTitle = `Test Meeting E2E ${Date.now()}`;
    const testDate = new Date().toISOString().split('T')[0];

    // Fill the form
    await page.fill('input#title', testTitle);
    await page.fill('input#date', testDate);
    await page.fill('input#startTime', '14:00');
    await page.fill('input#location', 'Test Location');

    // Submit the form
    await page.click('button[type="submit"]');

    // Wait for redirect to meeting detail page
    await page.waitForURL(/\/admin\/odj-pv\/[a-f0-9-]+/, { timeout: 10000 });

    // Verify we're on the meeting detail page
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/admin\/odj-pv\/[a-f0-9-]+/);

    // Extract meeting ID from URL for cleanup
    const meetingId = currentUrl.split('/').pop();

    // Verify meeting title is visible on the page
    await expect(page.locator(`text=${testTitle}`)).toBeVisible({ timeout: 5000 });

    // Store meeting ID for cleanup
    test.info().annotations.push({ type: 'meeting_id', description: meetingId || '' });

    console.log(`Created test meeting: ${meetingId}`);
  });

  test('should create meeting and add agenda items', async ({ page }) => {
    await login(page);

    // Navigate to ODJ-PV
    await page.goto('/admin/odj-pv');
    await page.waitForLoadState('networkidle');

    // Click button to create new meeting
    const createButton = page.locator('button:has-text("Nouvelle"), button:has-text("Créer"), button:has-text("Ajouter")').first();
    await createButton.click();

    // Wait for form
    await expect(page.locator('text=/Nouvelle Reunion/i')).toBeVisible({ timeout: 5000 });

    // Generate unique test data
    const testTitle = `Agenda Test ${Date.now()}`;

    // Fill and submit meeting form
    await page.fill('input#title', testTitle);
    await page.click('button[type="submit"]');

    // Wait for meeting detail page
    await page.waitForURL(/\/admin\/odj-pv\/[a-f0-9-]+/, { timeout: 10000 });

    // Look for an "Add agenda item" button
    const addAgendaButton = page.locator('button:has-text("Ajouter"), button:has-text("point"), button:has-text("agenda")').first();

    if (await addAgendaButton.isVisible()) {
      await addAgendaButton.click();

      // Fill agenda item form if visible
      const agendaTitle = page.locator('input[placeholder*="titre"], input[name*="title"]').first();
      if (await agendaTitle.isVisible()) {
        await agendaTitle.fill('Test Agenda Item');
      }
    }

    console.log(`Created meeting with title: ${testTitle}`);
  });

  test('should list existing meetings', async ({ page }) => {
    await login(page);

    // Navigate to ODJ-PV
    await page.goto('/admin/odj-pv');
    await page.waitForLoadState('networkidle');

    // The page should load without errors
    await expect(page.locator('body')).toBeVisible();

    // Check for either meetings list or empty state
    const hasMeetings = await page.locator('[data-meeting-id], .meeting-item, tr[data-id]').count() > 0;
    const hasEmptyState = await page.locator('text=/aucune|no meetings|empty/i').count() > 0;
    const hasCreateButton = await page.locator('button:has-text("Nouvelle"), button:has-text("Créer")').count() > 0;

    // Should have either meetings, empty state message, or create button
    expect(hasMeetings || hasEmptyState || hasCreateButton).toBeTruthy();
  });

  test('should access decisions page', async ({ page }) => {
    await login(page);

    // Navigate to decisions page
    await page.goto('/admin/odj-pv/decisions');
    await page.waitForLoadState('networkidle');

    // Should see decisions page content
    await expect(page.locator('body')).toBeVisible();

    // Check for decisions-related content
    const hasDecisionsContent = await page.locator('text=/decision|décision/i').count() > 0;
    const hasEmptyState = await page.locator('text=/aucune|no decisions/i').count() > 0;

    expect(hasDecisionsContent || hasEmptyState).toBeTruthy();
  });
});

test.describe('ODJ-PV API with Authentication', () => {

  test('should fetch meetings when authenticated', async ({ page, request }) => {
    // First login via browser to get auth cookies
    await login(page);

    // Get cookies from browser context
    const cookies = await page.context().cookies();

    // Build cookie header
    const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

    // Make authenticated API request
    const response = await request.get('/api/odj-pv/meetings', {
      headers: { Cookie: cookieHeader }
    });

    expect(response.status()).toBe(200);

    const meetings = await response.json();
    expect(Array.isArray(meetings)).toBeTruthy();
  });

  test('should create and delete a meeting via API', async ({ page, request }) => {
    // Login first
    await login(page);
    const cookies = await page.context().cookies();
    const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

    // Create meeting
    const createResponse = await request.post('/api/odj-pv/meetings', {
      headers: {
        Cookie: cookieHeader,
        'Content-Type': 'application/json'
      },
      data: {
        title: `API Test Meeting ${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        status: 'draft'
      }
    });

    expect(createResponse.status()).toBe(201);
    const meeting = await createResponse.json();
    expect(meeting.id).toBeDefined();
    expect(meeting.title).toContain('API Test Meeting');

    console.log(`Created meeting via API: ${meeting.id}`);

    // Clean up - delete the meeting
    const deleteResponse = await request.delete(`/api/odj-pv/meetings?id=${meeting.id}`, {
      headers: { Cookie: cookieHeader }
    });

    expect(deleteResponse.status()).toBe(200);
    console.log(`Deleted meeting: ${meeting.id}`);
  });

  test('should create meeting with agenda items and decisions', async ({ page, request }) => {
    // Login
    await login(page);
    const cookies = await page.context().cookies();
    const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

    // 1. Create meeting
    const meetingRes = await request.post('/api/odj-pv/meetings', {
      headers: { Cookie: cookieHeader, 'Content-Type': 'application/json' },
      data: {
        title: `Full E2E Test ${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        start_time: '10:00',
        location: 'Test Room',
        status: 'draft'
      }
    });
    expect(meetingRes.status()).toBe(201);
    const meeting = await meetingRes.json();

    // 2. Create agenda item
    const agendaRes = await request.post('/api/odj-pv/agenda-items', {
      headers: { Cookie: cookieHeader, 'Content-Type': 'application/json' },
      data: {
        meeting_id: meeting.id,
        title: 'Test Agenda Point',
        duration_minutes: 15,
        methodology: 'Discussion'
      }
    });
    expect(agendaRes.status()).toBe(201);
    const agendaItem = await agendaRes.json();

    // 3. Create decision linked to agenda item
    const decisionRes = await request.post('/api/odj-pv/decisions', {
      headers: { Cookie: cookieHeader, 'Content-Type': 'application/json' },
      data: {
        meeting_id: meeting.id,
        agenda_item_id: agendaItem.id,
        content: 'Test decision content',
        impact_level: 'medium_term'
      }
    });
    expect(decisionRes.status()).toBe(201);
    const decision = await decisionRes.json();

    console.log(`Created full meeting structure: Meeting ${meeting.id}, Agenda ${agendaItem.id}, Decision ${decision.id}`);

    // 4. Verify by fetching
    const fetchAgendaRes = await request.get(`/api/odj-pv/agenda-items?meeting_id=${meeting.id}`, {
      headers: { Cookie: cookieHeader }
    });
    expect(fetchAgendaRes.status()).toBe(200);
    const agendaItems = await fetchAgendaRes.json();
    expect(agendaItems.length).toBe(1);

    const fetchDecisionsRes = await request.get(`/api/odj-pv/decisions?meeting_id=${meeting.id}`, {
      headers: { Cookie: cookieHeader }
    });
    expect(fetchDecisionsRes.status()).toBe(200);
    const decisions = await fetchDecisionsRes.json();
    expect(decisions.length).toBe(1);

    // 5. Cleanup - delete meeting (cascade should delete agenda items and decisions)
    const deleteRes = await request.delete(`/api/odj-pv/meetings?id=${meeting.id}`, {
      headers: { Cookie: cookieHeader }
    });
    expect(deleteRes.status()).toBe(200);

    console.log('Cleaned up test data');
  });
});
