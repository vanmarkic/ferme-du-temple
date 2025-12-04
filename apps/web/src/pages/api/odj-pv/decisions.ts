import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { isAdmin } from '../../../lib/auth';
import type { Decision, ImpactLevel } from '../../../types/odj-pv';

const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function getServiceClient() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }
  return createClient(supabaseUrl, supabaseServiceKey);
}

// GET: List decisions (all or by meeting_id, with optional filters)
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
    const impactLevel = url.searchParams.get('impact_level');
    const year = url.searchParams.get('year');

    const supabase = getServiceClient();
    let query = supabase
      .from('decisions')
      .select('*')
      .order('created_at', { ascending: false });

    // Filter by meeting_id if provided
    if (meetingId) {
      query = query.eq('meeting_id', meetingId);
    }

    // Filter by impact_level if provided
    if (impactLevel) {
      query = query.eq('impact_level', impactLevel);
    }

    // Filter by year if provided
    if (year) {
      const yearNum = parseInt(year, 10);
      if (!isNaN(yearNum)) {
        query = query.gte('created_at', `${yearNum}-01-01`)
                     .lt('created_at', `${yearNum + 1}-01-01`);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching decisions:', error);
      return new Response(
        JSON.stringify({ message: 'Failed to fetch decisions' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in GET /api/odj-pv/decisions:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// POST: Create a new decision
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
    const { meeting_id, agenda_item_id, content, impact_level } = body;

    // Validate required fields
    if (!meeting_id || !content || !impact_level) {
      return new Response(
        JSON.stringify({ message: 'meeting_id, content, and impact_level are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate impact_level
    const validImpactLevels: ImpactLevel[] = ['long_term', 'medium_term', 'daily'];
    if (!validImpactLevels.includes(impact_level)) {
      return new Response(
        JSON.stringify({ message: 'Invalid impact_level. Must be: long_term, medium_term, or daily' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = getServiceClient();

    // Verify meeting exists
    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .select('id')
      .eq('id', meeting_id)
      .single();

    if (meetingError || !meeting) {
      return new Response(
        JSON.stringify({ message: 'Meeting not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // If agenda_item_id is provided, verify it exists and belongs to the meeting
    if (agenda_item_id) {
      const { data: agendaItem, error: agendaError } = await supabase
        .from('agenda_items')
        .select('id, meeting_id')
        .eq('id', agenda_item_id)
        .single();

      if (agendaError || !agendaItem) {
        return new Response(
          JSON.stringify({ message: 'Agenda item not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (agendaItem.meeting_id !== meeting_id) {
        return new Response(
          JSON.stringify({ message: 'Agenda item does not belong to the specified meeting' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Insert decision
    const { data: decision, error: insertError } = await supabase
      .from('decisions')
      .insert({
        meeting_id,
        agenda_item_id: agenda_item_id || null,
        content,
        impact_level,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating decision:', insertError);
      return new Response(
        JSON.stringify({ message: 'Failed to create decision' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(decision), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in POST /api/odj-pv/decisions:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// PUT: Update a decision
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
    const { id, content, impact_level, agenda_item_id } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ message: 'Decision id is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = getServiceClient();

    // Verify decision exists
    const { data: existingDecision, error: fetchError } = await supabase
      .from('decisions')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingDecision) {
      return new Response(
        JSON.stringify({ message: 'Decision not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate impact_level if provided
    if (impact_level) {
      const validImpactLevels: ImpactLevel[] = ['long_term', 'medium_term', 'daily'];
      if (!validImpactLevels.includes(impact_level)) {
        return new Response(
          JSON.stringify({ message: 'Invalid impact_level. Must be: long_term, medium_term, or daily' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // If agenda_item_id is being updated, verify it exists and belongs to the same meeting
    if (agenda_item_id !== undefined && agenda_item_id !== null) {
      const { data: agendaItem, error: agendaError } = await supabase
        .from('agenda_items')
        .select('id, meeting_id')
        .eq('id', agenda_item_id)
        .single();

      if (agendaError || !agendaItem) {
        return new Response(
          JSON.stringify({ message: 'Agenda item not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (agendaItem.meeting_id !== existingDecision.meeting_id) {
        return new Response(
          JSON.stringify({ message: 'Agenda item does not belong to the same meeting' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Build update object with only provided fields
    const updateData: Partial<Decision> = {};
    if (content !== undefined) updateData.content = content;
    if (impact_level !== undefined) updateData.impact_level = impact_level;
    if (agenda_item_id !== undefined) updateData.agenda_item_id = agenda_item_id;

    // Update decision
    const { data: updatedDecision, error: updateError } = await supabase
      .from('decisions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating decision:', updateError);
      return new Response(
        JSON.stringify({ message: 'Failed to update decision' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify(updatedDecision), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in PUT /api/odj-pv/decisions:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// DELETE: Delete a decision
export const DELETE: APIRoute = async ({ url, cookies }) => {
  try {
    const isAdminUser = await isAdmin(cookies);
    if (!isAdminUser) {
      return new Response(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const decisionId = url.searchParams.get('id');
    if (!decisionId) {
      return new Response(
        JSON.stringify({ message: 'Decision id is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = getServiceClient();

    // Verify decision exists
    const { data: existingDecision, error: fetchError } = await supabase
      .from('decisions')
      .select('id')
      .eq('id', decisionId)
      .single();

    if (fetchError || !existingDecision) {
      return new Response(
        JSON.stringify({ message: 'Decision not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Delete decision
    const { error: deleteError } = await supabase
      .from('decisions')
      .delete()
      .eq('id', decisionId);

    if (deleteError) {
      console.error('Error deleting decision:', deleteError);
      return new Response(
        JSON.stringify({ message: 'Failed to delete decision' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in DELETE /api/odj-pv/decisions:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
