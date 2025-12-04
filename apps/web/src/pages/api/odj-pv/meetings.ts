import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { isAdmin } from '../../../lib/auth';

const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function getServiceClient() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }
  return createClient(supabaseUrl, supabaseServiceKey);
}

// GET: List all meetings (ordered by date desc)
export const GET: APIRoute = async ({ cookies }) => {
  try {
    const isAdminUser = await isAdmin(cookies);
    if (!isAdminUser) {
      return new Response(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from('meetings')
      .select('id, title, date, start_time, end_time, location, what_to_bring, status, created_at, updated_at')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching meetings:', error);
      return new Response(
        JSON.stringify({ message: 'Failed to fetch meetings' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in GET /api/odj-pv/meetings:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// POST: Create a new meeting
export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const isAdminUser = await isAdmin(cookies);
    if (!isAdminUser) {
      return new Response(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { title, date, start_time, end_time, location, what_to_bring, status = 'draft' } = body;

    if (!title || !date) {
      return new Response(
        JSON.stringify({ message: 'Title and date are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = getServiceClient();

    const { data, error } = await supabase
      .from('meetings')
      .insert({
        title,
        date,
        start_time,
        end_time,
        location,
        what_to_bring,
        status,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating meeting:', error);
      return new Response(
        JSON.stringify({ message: 'Failed to create meeting' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(data),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in POST /api/odj-pv/meetings:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// PUT: Update a meeting (requires id in body)
export const PUT: APIRoute = async ({ request, cookies }) => {
  try {
    const isAdminUser = await isAdmin(cookies);
    if (!isAdminUser) {
      return new Response(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { id, title, date, start_time, end_time, location, what_to_bring, status } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ message: 'Meeting ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = getServiceClient();

    // Build update object with only provided fields
    const updateData: Record<string, any> = {};
    if (title !== undefined) updateData.title = title;
    if (date !== undefined) updateData.date = date;
    if (start_time !== undefined) updateData.start_time = start_time;
    if (end_time !== undefined) updateData.end_time = end_time;
    if (location !== undefined) updateData.location = location;
    if (what_to_bring !== undefined) updateData.what_to_bring = what_to_bring;
    if (status !== undefined) updateData.status = status;

    if (Object.keys(updateData).length === 0) {
      return new Response(
        JSON.stringify({ message: 'No fields to update' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { data, error } = await supabase
      .from('meetings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating meeting:', error);
      return new Response(
        JSON.stringify({ message: 'Failed to update meeting' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(data),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in PUT /api/odj-pv/meetings:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// DELETE: Delete a meeting (requires id query param)
export const DELETE: APIRoute = async ({ url, cookies }) => {
  try {
    const isAdminUser = await isAdmin(cookies);
    if (!isAdminUser) {
      return new Response(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const meetingId = url.searchParams.get('id');
    if (!meetingId) {
      return new Response(
        JSON.stringify({ message: 'Meeting ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = getServiceClient();

    // Delete meeting (cascading deletes will handle related records)
    const { error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', meetingId);

    if (error) {
      console.error('Error deleting meeting:', error);
      return new Response(
        JSON.stringify({ message: 'Failed to delete meeting' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in DELETE /api/odj-pv/meetings:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
