import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { getSession, isAdmin } from '@/lib/auth';
import { sendMissionEmails } from '@/lib/odj-pv/email';
import type { Mission, Member, Meeting } from '@/types/odj-pv';

export const prerender = false;

// POST: Send emails for selected missions
export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const isAdminUser = await isAdmin(cookies);

    if (!isAdminUser) {
      return new Response(
        JSON.stringify({ error: 'Non autorisé. Accès administrateur requis.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { mission_ids } = body;

    if (!mission_ids || !Array.isArray(mission_ids) || mission_ids.length === 0) {
      return new Response(
        JSON.stringify({ error: 'mission_ids requis (array non vide)' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { session } = await getSession(cookies);
    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Session expirée. Veuillez vous reconnecter.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL || '';
    const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });

    // Fetch the missions
    const { data: missions, error: missionsError } = await supabase
      .from('missions')
      .select('*')
      .in('id', mission_ids);

    if (missionsError) {
      console.error('Error fetching missions:', missionsError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la récupération des missions.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!missions || missions.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Aucune mission trouvée.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get the meeting (assuming all missions belong to the same meeting)
    const meetingId = missions[0].meeting_id;
    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', meetingId)
      .single();

    if (meetingError || !meeting) {
      console.error('Error fetching meeting:', meetingError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la récupération de la réunion.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get all members (we'll need them to look up member details)
    const { data: members, error: membersError } = await supabase
      .from('members')
      .select('*');

    if (membersError) {
      console.error('Error fetching members:', membersError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la récupération des membres.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Send the emails
    const results = await sendMissionEmails(
      missions as Mission[],
      members as Member[],
      meeting as Meeting
    );

    // Update the email_sent status for successfully sent missions
    if (results.sent.length > 0) {
      const now = new Date().toISOString();
      const { error: updateError } = await supabase
        .from('missions')
        .update({ email_sent: true, email_sent_at: now })
        .in('id', results.sent);

      if (updateError) {
        console.error('Error updating missions after email send:', updateError);
        // Don't fail the request, but log the error
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        sent: results.sent,
        failed: results.failed,
        message: `${results.sent.length} email(s) envoyé(s), ${results.failed.length} échec(s)`,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur serveur. Veuillez réessayer plus tard.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
