import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { isAdmin } from '../../../../lib/auth';

const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function getServiceClient() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }
  return createClient(supabaseUrl, supabaseServiceKey);
}

// POST: Reorder agenda items
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
    const { items } = body;

    if (!items || !Array.isArray(items)) {
      return new Response(
        JSON.stringify({ message: 'items array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate that all items have id and position
    for (const item of items) {
      if (!item.id || item.position === undefined || item.position === null) {
        return new Response(
          JSON.stringify({ message: 'Each item must have id and position' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    const supabase = getServiceClient();

    // Update positions for each item
    const updatePromises = items.map((item: { id: string; position: number }) =>
      supabase
        .from('agenda_items')
        .update({ position: item.position })
        .eq('id', item.id)
    );

    const results = await Promise.all(updatePromises);

    // Check for errors
    const errors = results.filter(result => result.error);
    if (errors.length > 0) {
      console.error('Error reordering agenda items:', errors);
      return new Response(
        JSON.stringify({ message: 'Failed to reorder some items' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in POST /api/odj-pv/agenda-items/reorder:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
