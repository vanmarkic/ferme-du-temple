import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { getSession, isAdmin } from '@/lib/auth';
import type { MeetingVersion, MeetingSnapshot } from '@/types/odj-pv';

export const prerender = false;

// GET: List versions for a meeting
export const GET: APIRoute = async ({ request, cookies }) => {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin(cookies);

    if (!isAdminUser) {
      return new Response(
        JSON.stringify({
          error: 'Non autorisé. Accès administrateur requis.',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse query parameters
    const url = new URL(request.url);
    const meetingId = url.searchParams.get('meeting_id');

    if (!meetingId) {
      return new Response(
        JSON.stringify({
          error: 'ID de réunion requis (meeting_id).',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Get authenticated session
    const { session } = await getSession(cookies);

    if (!session) {
      return new Response(
        JSON.stringify({
          error: 'Session expirée. Veuillez vous reconnecter.',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Create authenticated Supabase client
    const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL || '';
    const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });

    // Fetch versions (ordered by created_at desc, limit 10)
    const { data, error } = await supabase
      .from('meeting_versions')
      .select('*')
      .eq('meeting_id', meetingId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Supabase query error:', error);
      return new Response(
        JSON.stringify({
          error: 'Erreur lors de la récupération des versions.',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Return successful response
    return new Response(
      JSON.stringify({
        success: true,
        data: data || [],
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Erreur serveur. Veuillez réessayer plus tard.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

// POST: Create a new version snapshot
export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin(cookies);

    if (!isAdminUser) {
      return new Response(
        JSON.stringify({
          error: 'Non autorisé. Accès administrateur requis.',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse request body
    const body = await request.json();
    const { meeting_id, snapshot_json } = body;

    if (!meeting_id || !snapshot_json) {
      return new Response(
        JSON.stringify({
          error: 'meeting_id et snapshot_json requis.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Get authenticated session
    const { session } = await getSession(cookies);

    if (!session) {
      return new Response(
        JSON.stringify({
          error: 'Session expirée. Veuillez vous reconnecter.',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Create authenticated Supabase client
    const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL || '';
    const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });

    // Create version
    const { data, error } = await supabase
      .from('meeting_versions')
      .insert({
        meeting_id,
        snapshot_json,
      })
      .select()
      .single();

    if (error) {
      console.error('Create version error:', error);
      return new Response(
        JSON.stringify({
          error: 'Erreur lors de la création de la version.',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Return successful response
    return new Response(
      JSON.stringify({
        success: true,
        data,
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Erreur serveur. Veuillez réessayer plus tard.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

// DELETE: Delete old versions (for cleanup after finalization)
export const DELETE: APIRoute = async ({ request, cookies }) => {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin(cookies);

    if (!isAdminUser) {
      return new Response(
        JSON.stringify({
          error: 'Non autorisé. Accès administrateur requis.',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse query parameters
    const url = new URL(request.url);
    const versionIds = url.searchParams.get('ids');

    if (!versionIds) {
      return new Response(
        JSON.stringify({
          error: 'IDs de version requis (ids, comma-separated).',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Get authenticated session
    const { session } = await getSession(cookies);

    if (!session) {
      return new Response(
        JSON.stringify({
          error: 'Session expirée. Veuillez vous reconnecter.',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Create authenticated Supabase client
    const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL || '';
    const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });

    // Parse IDs
    const ids = versionIds.split(',').map(id => id.trim());

    // Delete versions
    const { error } = await supabase
      .from('meeting_versions')
      .delete()
      .in('id', ids);

    if (error) {
      console.error('Delete versions error:', error);
      return new Response(
        JSON.stringify({
          error: 'Erreur lors de la suppression des versions.',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Return successful response
    return new Response(
      JSON.stringify({
        success: true,
        deleted: ids.length,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Erreur serveur. Veuillez réessayer plus tard.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
