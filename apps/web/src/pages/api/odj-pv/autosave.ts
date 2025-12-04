import type { APIRoute } from 'astro';
import { getSession, isAdmin } from '@/lib/auth';
import { autoSaveVersion } from '@/lib/odj-pv/versioning';
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

    // Create milestone version using the versioning logic
    // This automatically:
    // 1. Creates snapshots at T-5, T-10, T-20, T-30 minutes
    // 2. Then creates snapshots every 10 minutes after T-30
    // 3. Skips creation if not enough time has passed
    let versionCreated: MeetingVersion | null = null;
    let error_message: string | null = null;

    try {
      versionCreated = await autoSaveVersion(meeting_id);
    } catch (error) {
      console.error('Auto-save version error:', error);
      error_message = error instanceof Error ? error.message : 'Unknown error';
    }

    const now = new Date().toISOString();

    // Return successful response
    return new Response(
      JSON.stringify({
        success: true,
        saved_at: now,
        version_created: !!versionCreated,
        version: versionCreated,
        error: error_message,
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
