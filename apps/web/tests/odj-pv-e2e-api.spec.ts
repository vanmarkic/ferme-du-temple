import { test, expect } from '@playwright/test';

/**
 * ODJ-PV End-to-End API Tests (using service role)
 *
 * These tests use the Supabase service role key to bypass authentication
 * and directly test the database operations.
 *
 * This simulates what happens when an authenticated admin makes requests.
 */

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

test.describe('ODJ-PV Direct Database E2E Tests', () => {

  test.beforeEach(({ }, testInfo) => {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.log('Skipping: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required');
      testInfo.skip();
    }
  });

  test('should create a meeting directly in Supabase', async ({ request }) => {
    const testTitle = `Direct API Test ${Date.now()}`;

    // Create meeting using Supabase REST API
    const createResponse = await request.post(`${SUPABASE_URL}/rest/v1/meetings`, {
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      data: {
        title: testTitle,
        date: new Date().toISOString().split('T')[0],
        status: 'draft'
      }
    });

    expect(createResponse.status()).toBe(201);
    const meetings = await createResponse.json();
    expect(Array.isArray(meetings)).toBeTruthy();
    expect(meetings.length).toBe(1);

    const meeting = meetings[0];
    expect(meeting.id).toBeDefined();
    expect(meeting.title).toBe(testTitle);

    console.log(`Created meeting: ${meeting.id} - ${meeting.title}`);

    // Cleanup - delete the meeting
    const deleteResponse = await request.delete(
      `${SUPABASE_URL}/rest/v1/meetings?id=eq.${meeting.id}`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        }
      }
    );

    expect(deleteResponse.status()).toBe(204);
    console.log(`Deleted meeting: ${meeting.id}`);
  });

  test('should create full meeting structure (meeting + agenda + decision)', async ({ request }) => {
    const timestamp = Date.now();

    // 1. Create meeting
    const meetingRes = await request.post(`${SUPABASE_URL}/rest/v1/meetings`, {
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      data: {
        title: `Full E2E Test ${timestamp}`,
        date: new Date().toISOString().split('T')[0],
        start_time: '10:00',
        location: 'Salle de Test',
        status: 'draft'
      }
    });

    expect(meetingRes.status()).toBe(201);
    const meeting = (await meetingRes.json())[0];
    console.log(`Created meeting: ${meeting.id}`);

    // 2. Create agenda item
    const agendaRes = await request.post(`${SUPABASE_URL}/rest/v1/agenda_items`, {
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      data: {
        meeting_id: meeting.id,
        title: 'Point de test E2E',
        position: 0,
        duration_minutes: 15,
        methodology: 'Tour de table'
      }
    });

    expect(agendaRes.status()).toBe(201);
    const agendaItem = (await agendaRes.json())[0];
    console.log(`Created agenda item: ${agendaItem.id}`);

    // 3. Create decision
    const decisionRes = await request.post(`${SUPABASE_URL}/rest/v1/decisions`, {
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      data: {
        meeting_id: meeting.id,
        agenda_item_id: agendaItem.id,
        content: 'Decision de test E2E - approuvee a l\'unanimite',
        impact_level: 'medium_term'
      }
    });

    expect(decisionRes.status()).toBe(201);
    const decision = (await decisionRes.json())[0];
    console.log(`Created decision: ${decision.id}`);

    // 4. Verify the data was created correctly
    const fetchMeetingRes = await request.get(
      `${SUPABASE_URL}/rest/v1/meetings?id=eq.${meeting.id}`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        }
      }
    );
    expect(fetchMeetingRes.status()).toBe(200);
    const fetchedMeetings = await fetchMeetingRes.json();
    expect(fetchedMeetings.length).toBe(1);
    expect(fetchedMeetings[0].title).toContain('Full E2E Test');

    const fetchAgendaRes = await request.get(
      `${SUPABASE_URL}/rest/v1/agenda_items?meeting_id=eq.${meeting.id}`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        }
      }
    );
    expect(fetchAgendaRes.status()).toBe(200);
    const fetchedAgenda = await fetchAgendaRes.json();
    expect(fetchedAgenda.length).toBe(1);

    const fetchDecisionsRes = await request.get(
      `${SUPABASE_URL}/rest/v1/decisions?meeting_id=eq.${meeting.id}`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        }
      }
    );
    expect(fetchDecisionsRes.status()).toBe(200);
    const fetchedDecisions = await fetchDecisionsRes.json();
    expect(fetchedDecisions.length).toBe(1);

    console.log('Verification complete - all data exists');

    // 5. Cleanup - delete in reverse order (or rely on CASCADE)
    // Delete meeting - should cascade to agenda_items and decisions
    const deleteRes = await request.delete(
      `${SUPABASE_URL}/rest/v1/meetings?id=eq.${meeting.id}`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        }
      }
    );
    expect(deleteRes.status()).toBe(204);

    // Verify cascade delete worked
    const verifyAgendaRes = await request.get(
      `${SUPABASE_URL}/rest/v1/agenda_items?meeting_id=eq.${meeting.id}`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        }
      }
    );
    const remainingAgenda = await verifyAgendaRes.json();
    expect(remainingAgenda.length).toBe(0);

    const verifyDecisionsRes = await request.get(
      `${SUPABASE_URL}/rest/v1/decisions?meeting_id=eq.${meeting.id}`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        }
      }
    );
    const remainingDecisions = await verifyDecisionsRes.json();
    expect(remainingDecisions.length).toBe(0);

    console.log('Cleanup complete - cascade delete verified');
  });

  test('should create and update meeting status workflow', async ({ request }) => {
    // Create meeting in draft status
    const createRes = await request.post(`${SUPABASE_URL}/rest/v1/meetings`, {
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      data: {
        title: `Status Workflow Test ${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        status: 'draft'
      }
    });

    const meeting = (await createRes.json())[0];
    expect(meeting.status).toBe('draft');

    // Update to odj_ready
    const updateRes1 = await request.patch(
      `${SUPABASE_URL}/rest/v1/meetings?id=eq.${meeting.id}`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        data: { status: 'odj_ready' }
      }
    );
    expect(updateRes1.status()).toBe(200);
    const updated1 = (await updateRes1.json())[0];
    expect(updated1.status).toBe('odj_ready');

    // Update to in_progress
    const updateRes2 = await request.patch(
      `${SUPABASE_URL}/rest/v1/meetings?id=eq.${meeting.id}`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        data: { status: 'in_progress' }
      }
    );
    expect(updateRes2.status()).toBe(200);
    const updated2 = (await updateRes2.json())[0];
    expect(updated2.status).toBe('in_progress');

    // Update to finalized
    const updateRes3 = await request.patch(
      `${SUPABASE_URL}/rest/v1/meetings?id=eq.${meeting.id}`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        data: { status: 'finalized' }
      }
    );
    expect(updateRes3.status()).toBe(200);
    const updated3 = (await updateRes3.json())[0];
    expect(updated3.status).toBe('finalized');

    console.log(`Status workflow: draft -> odj_ready -> in_progress -> finalized`);

    // Cleanup
    await request.delete(`${SUPABASE_URL}/rest/v1/meetings?id=eq.${meeting.id}`, {
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      }
    });
  });

  test('should list existing meetings', async ({ request }) => {
    const response = await request.get(`${SUPABASE_URL}/rest/v1/meetings?order=date.desc`, {
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      }
    });

    expect(response.status()).toBe(200);
    const meetings = await response.json();
    expect(Array.isArray(meetings)).toBeTruthy();

    console.log(`Found ${meetings.length} existing meetings`);

    if (meetings.length > 0) {
      console.log('Latest meetings:');
      meetings.slice(0, 5).forEach((m: any) => {
        console.log(`  - ${m.date}: ${m.title} (${m.status})`);
      });
    }
  });

  test('should list existing decisions', async ({ request }) => {
    const response = await request.get(
      `${SUPABASE_URL}/rest/v1/decisions?order=created_at.desc`,
      {
        headers: {
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        }
      }
    );

    expect(response.status()).toBe(200);
    const decisions = await response.json();
    expect(Array.isArray(decisions)).toBeTruthy();

    console.log(`Found ${decisions.length} existing decisions`);

    if (decisions.length > 0) {
      console.log('Latest decisions:');
      decisions.slice(0, 5).forEach((d: any) => {
        console.log(`  - [${d.impact_level}] ${d.content.substring(0, 50)}...`);
      });
    }
  });
});
