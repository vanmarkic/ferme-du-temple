import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { getSession, isAdmin } from '@/lib/auth';
import type { Mission } from '@/types/odj-pv';

export const prerender = false;

// GET: List missions for a meeting
export const GET: APIRoute = async ({ request, cookies }) => {
  try {
    const isAdminUser = await isAdmin(cookies);

    if (!isAdminUser) {
      return new Response(
        JSON.stringify({ error: 'Non autorisé. Accès administrateur requis.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(request.url);
    const meetingId = url.searchParams.get('meeting_id');

    if (!meetingId) {
      return new Response(
        JSON.stringify({ error: 'meeting_id requis' }),
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

    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('meeting_id', meetingId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase query error:', error);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la récupération des missions.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: data || [] }),
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

// POST: Create a new mission
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
    const { meeting_id, description, member_id, agenda_item_id } = body;

    if (!meeting_id || !description) {
      return new Response(
        JSON.stringify({ error: 'meeting_id et description requis' }),
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

    const missionData: Partial<Mission> = {
      meeting_id,
      description,
      member_id: member_id || null,
      agenda_item_id: agenda_item_id || null,
      email_sent: false,
      email_sent_at: null,
    };

    const { data, error } = await supabase
      .from('missions')
      .insert(missionData)
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la création de la mission.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur serveur. Veuillez réessayer plus tard.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// PUT: Update a mission
export const PUT: APIRoute = async ({ request, cookies }) => {
  try {
    const isAdminUser = await isAdmin(cookies);

    if (!isAdminUser) {
      return new Response(
        JSON.stringify({ error: 'Non autorisé. Accès administrateur requis.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'id requis' }),
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

    // Only allow updating specific fields
    const allowedFields = ['description', 'member_id', 'agenda_item_id', 'email_sent', 'email_sent_at'];
    const updateData: Partial<Mission> = {};

    for (const field of allowedFields) {
      if (field in updates) {
        updateData[field as keyof Mission] = updates[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return new Response(
        JSON.stringify({ error: 'Aucun champ à mettre à jour' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { data, error } = await supabase
      .from('missions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la mise à jour de la mission.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
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

// DELETE: Delete a mission
export const DELETE: APIRoute = async ({ url, cookies }) => {
  try {
    const isAdminUser = await isAdmin(cookies);

    if (!isAdminUser) {
      return new Response(
        JSON.stringify({ error: 'Non autorisé. Accès administrateur requis.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const missionId = url.searchParams.get('id');
    if (!missionId) {
      return new Response(
        JSON.stringify({ error: 'ID mission requis' }),
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

    const { error } = await supabase
      .from('missions')
      .delete()
      .eq('id', missionId);

    if (error) {
      console.error('Delete mission error:', error);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la suppression de la mission.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Delete API error:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur serveur. Veuillez réessayer plus tard.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
