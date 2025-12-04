import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { getSession, isAdmin } from '@/lib/auth';
import { createSnapshot, autoSaveVersion } from '@/lib/odj-pv/versioning';
import type { MeetingVersion } from '@/types/odj-pv';

export const prerender = false;

// POST: Smart autosave that always saves current state and creates milestone versions
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
    const { meeting_id } = body;

    if (!meeting_id) {
      return new Response(
        JSON.stringify({
          error: 'meeting_id requis.',
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

    // Always save the current state (updates last_saved_at)
    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from('meetings')
      .update({ last_saved_at: now })
      .eq('id', meeting_id);

    if (updateError) {
      console.error('Update last_saved_at error:', updateError);
      return new Response(
        JSON.stringify({
          error: 'Erreur lors de la sauvegarde.',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Create milestone version if needed (T-5, T-10, T-20, T-30 min, then every 10 min)
    let versionCreated: MeetingVersion | null = null;
    try {
      versionCreated = await autoSaveVersion(meeting_id);
    } catch (error) {
      console.error('Auto-save version error:', error);
      // Don't fail the entire autosave if version creation fails
      // The main state was still saved
    }

    // Return successful response
    return new Response(
      JSON.stringify({
        success: true,
        saved_at: now,
        version_created: !!versionCreated,
        version: versionCreated,
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
