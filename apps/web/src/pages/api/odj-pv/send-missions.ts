import type { APIRoute } from 'astro';
import { isAdmin } from '../../../lib/auth';
import { sendMissionEmails } from '../../../lib/odj-pv/email';
import type { Mission, Member, Meeting } from '../../../types/odj-pv';

export const prerender = false;

const jsonHeaders = { 'Content-Type': 'application/json' };

export const POST: APIRoute = async ({ cookies, request }) => {
  try {
    const isAdminUser = await isAdmin(cookies);
    if (!isAdminUser) {
      return new Response(
        JSON.stringify({ error: 'Non autorisé' }),
        { status: 401, headers: jsonHeaders }
      );
    }

    const body = await request.json();
    const { missions, members, meeting } = body as {
      missions: Mission[];
      members: Member[];
      meeting: Meeting;
    };

    if (!missions || !members || !meeting) {
      return new Response(
        JSON.stringify({ error: 'Données manquantes' }),
        { status: 400, headers: jsonHeaders }
      );
    }

    const results = await sendMissionEmails(missions, members, meeting);

    return new Response(
      JSON.stringify(results),
      { status: 200, headers: jsonHeaders }
    );
  } catch (error) {
    console.error('Error sending mission emails:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur serveur' }),
      { status: 500, headers: jsonHeaders }
    );
  }
};
