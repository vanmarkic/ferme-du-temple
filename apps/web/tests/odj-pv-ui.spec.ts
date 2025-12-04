import { test, expect } from '@playwright/test';

/**
 * ODJ-PV UI End-to-End Tests
 *
 * These tests run with BYPASS_AUTH=true to skip authentication.
 * They test the full UI flow for meeting management.
 */

test.describe('ODJ-PV Meeting UI E2E', () => {

  test('should access ODJ-PV page without login', async ({ page }) => {
    await page.goto('/admin/odj-pv');
    await page.waitForLoadState('networkidle');

    // Should see the meetings page, not a login redirect
    expect(page.url()).toContain('/admin/odj-pv');

    // Should see meeting-related content
    await expect(page.locator('body')).toBeVisible();
  });

  test('should display create meeting button', async ({ page }) => {
    await page.goto('/admin/odj-pv');
    await page.waitForLoadState('networkidle');

    // Look for create button
    const createButton = page.locator('button').filter({ hasText: /nouvelle|créer|ajouter|new/i }).first();
    await expect(createButton).toBeVisible({ timeout: 10000 });
  });

  test('should open new meeting form', async ({ page }) => {
    await page.goto('/admin/odj-pv');
    await page.waitForLoadState('networkidle');

    // Click create button
    const createButton = page.locator('button').filter({ hasText: /nouvelle|créer|ajouter|new/i }).first();
    await createButton.click();

    // Should see the form
    await expect(page.locator('text=/Nouvelle Reunion/i')).toBeVisible({ timeout: 5000 });

    // Form fields should be visible
    await expect(page.locator('input#title')).toBeVisible();
    await expect(page.locator('input#date')).toBeVisible();
  });

  test('should create a new meeting via UI', async ({ page }) => {
    await page.goto('/admin/odj-pv');
    await page.waitForLoadState('networkidle');

    // Click create button
    const createButton = page.locator('button').filter({ hasText: /nouvelle|créer|ajouter|new/i }).first();
    await createButton.click();

    // Wait for form
    await expect(page.locator('input#title')).toBeVisible({ timeout: 5000 });

    // Fill form
    const testTitle = `UI Test Meeting ${Date.now()}`;
    await page.fill('input#title', testTitle);
    await page.fill('input#startTime', '14:30');
    await page.fill('input#location', 'Salle de réunion');

    // Submit
    await page.click('button[type="submit"]');

    // Should redirect to meeting detail page
    await page.waitForURL(/\/admin\/odj-pv\/[a-f0-9-]+/, { timeout: 10000 });

    // Verify URL pattern
    expect(page.url()).toMatch(/\/admin\/odj-pv\/[a-f0-9-]+/);

    console.log(`Created meeting via UI: ${page.url()}`);
  });

  test('should display meeting list', async ({ page }) => {
    await page.goto('/admin/odj-pv');
    await page.waitForLoadState('networkidle');

    // Page should load
    await expect(page.locator('body')).toBeVisible();

    // Should have either meetings or empty state
    const pageContent = await page.content();
    const hasMeetingContent = pageContent.includes('reunion') ||
                              pageContent.includes('Reunion') ||
                              pageContent.includes('meeting') ||
                              pageContent.includes('Nouvelle');

    expect(hasMeetingContent).toBeTruthy();
  });

  test('should access decisions page', async ({ page }) => {
    await page.goto('/admin/odj-pv/decisions');
    await page.waitForLoadState('networkidle');

    // Should not redirect to login
    expect(page.url()).toContain('/admin/odj-pv/decisions');

    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('ODJ-PV API via App E2E', () => {

  test('should fetch meetings via API with auth bypass', async ({ request }) => {
    const response = await request.get('/api/odj-pv/meetings');

    // With BYPASS_AUTH, should return 200
    expect(response.status()).toBe(200);

    const meetings = await response.json();
    expect(Array.isArray(meetings)).toBeTruthy();

    console.log(`Fetched ${meetings.length} meetings via API`);
  });

  test('should create meeting via API', async ({ request }) => {
    const testTitle = `API E2E Test ${Date.now()}`;

    const response = await request.post('/api/odj-pv/meetings', {
      data: {
        title: testTitle,
        date: new Date().toISOString().split('T')[0],
        status: 'draft'
      }
    });

    expect(response.status()).toBe(201);

    const meeting = await response.json();
    expect(meeting.id).toBeDefined();
    expect(meeting.title).toBe(testTitle);

    console.log(`Created meeting: ${meeting.id}`);

    // Cleanup
    const deleteRes = await request.delete(`/api/odj-pv/meetings?id=${meeting.id}`);
    expect(deleteRes.status()).toBe(200);

    console.log(`Deleted meeting: ${meeting.id}`);
  });

  test('should create full meeting workflow via API', async ({ request }) => {
    // 1. Create meeting
    const meetingRes = await request.post('/api/odj-pv/meetings', {
      data: {
        title: `Full Workflow ${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        start_time: '09:00',
        location: 'Test Location',
        status: 'draft'
      }
    });
    expect(meetingRes.status()).toBe(201);
    const meeting = await meetingRes.json();

    // 2. Add agenda item
    const agendaRes = await request.post('/api/odj-pv/agenda-items', {
      data: {
        meeting_id: meeting.id,
        title: 'Point 1: Accueil',
        duration_minutes: 10,
        methodology: 'Tour de table'
      }
    });
    expect(agendaRes.status()).toBe(201);
    const agenda = await agendaRes.json();

    // 3. Add decision
    const decisionRes = await request.post('/api/odj-pv/decisions', {
      data: {
        meeting_id: meeting.id,
        agenda_item_id: agenda.id,
        content: 'Décision de test approuvée',
        impact_level: 'daily'
      }
    });
    expect(decisionRes.status()).toBe(201);
    const decision = await decisionRes.json();

    console.log(`Created: Meeting ${meeting.id}, Agenda ${agenda.id}, Decision ${decision.id}`);

    // 4. Verify
    const fetchAgenda = await request.get(`/api/odj-pv/agenda-items?meeting_id=${meeting.id}`);
    expect(fetchAgenda.status()).toBe(200);
    expect((await fetchAgenda.json()).length).toBe(1);

    const fetchDecisions = await request.get(`/api/odj-pv/decisions?meeting_id=${meeting.id}`);
    expect(fetchDecisions.status()).toBe(200);
    expect((await fetchDecisions.json()).length).toBe(1);

    // 5. Cleanup
    await request.delete(`/api/odj-pv/meetings?id=${meeting.id}`);
    console.log('Cleanup complete');
  });
});
