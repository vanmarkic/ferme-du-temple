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

// GET: List agenda items for a meeting
export const GET: APIRoute = async ({ url, cookies }) => {
  try {
    const isAdminUser = await isAdmin(cookies);
    if (!isAdminUser) {
      return new Response(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const meetingId = url.searchParams.get('meeting_id');
    if (!meetingId) {
      return new Response(
        JSON.stringify({ message: 'meeting_id is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = getServiceClient();
    const { data, error } = await supabase
      .from('agenda_items')
      .select('*')
      .eq('meeting_id', meetingId)
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching agenda items:', error);
      return new Response(
        JSON.stringify({ message: 'Failed to fetch agenda items' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in GET /api/odj-pv/agenda-items:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// POST: Create a new agenda item
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
    const { meeting_id, title, responsible, duration_minutes, methodology, notes, position } = body;

    if (!meeting_id || !title) {
      return new Response(
        JSON.stringify({ message: 'meeting_id and title are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = getServiceClient();

    // If position is not provided, get the next position
    let finalPosition = position;
    if (finalPosition === undefined || finalPosition === null) {
      const { data: existingItems, error: countError } = await supabase
        .from('agenda_items')
        .select('position')
        .eq('meeting_id', meeting_id)
        .order('position', { ascending: false })
        .limit(1);

      if (countError) {
        console.error('Error getting max position:', countError);
        return new Response(
          JSON.stringify({ message: 'Failed to determine position' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      finalPosition = existingItems && existingItems.length > 0 ? existingItems[0].position + 1 : 0;
    }

    const { data, error } = await supabase
      .from('agenda_items')
      .insert({
        meeting_id,
        title,
        responsible,
        duration_minutes: duration_minutes ?? 5,
        methodology,
        notes,
        position: finalPosition,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating agenda item:', error);
      return new Response(
        JSON.stringify({ message: 'Failed to create agenda item' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in POST /api/odj-pv/agenda-items:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// PUT: Update an agenda item
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
    const { id, title, responsible, duration_minutes, methodology, notes, position } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ message: 'id is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = getServiceClient();

    // Build update object with only provided fields
    const updateData: Record<string, any> = {};
    if (title !== undefined) updateData.title = title;
    if (responsible !== undefined) updateData.responsible = responsible;
    if (duration_minutes !== undefined) updateData.duration_minutes = duration_minutes;
    if (methodology !== undefined) updateData.methodology = methodology;
    if (notes !== undefined) updateData.notes = notes;
    if (position !== undefined) updateData.position = position;

    if (Object.keys(updateData).length === 0) {
      return new Response(
        JSON.stringify({ message: 'No fields to update' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { data, error } = await supabase
      .from('agenda_items')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating agenda item:', error);
      return new Response(
        JSON.stringify({ message: 'Failed to update agenda item' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in PUT /api/odj-pv/agenda-items:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// DELETE: Delete an agenda item
export const DELETE: APIRoute = async ({ url, cookies }) => {
  try {
    const isAdminUser = await isAdmin(cookies);
    if (!isAdminUser) {
      return new Response(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const id = url.searchParams.get('id');
    if (!id) {
      return new Response(
        JSON.stringify({ message: 'id is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = getServiceClient();

    const { error } = await supabase
      .from('agenda_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting agenda item:', error);
      return new Response(
        JSON.stringify({ message: 'Failed to delete agenda item' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in DELETE /api/odj-pv/agenda-items:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
