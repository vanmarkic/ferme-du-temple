import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { getSession, isAdmin } from '@/lib/auth';
import type { MemberRole } from '@/types/odj-pv';

export const prerender = false;

/**
 * GET: Retrieve member roles
 * - If meeting_id query param: return roles for that specific meeting
 * - If history=true query param: return last N meetings' role assignments (for gap calculation)
 */
export const GET: APIRoute = async ({ request, cookies }) => {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin(cookies);
    if (!isAdminUser) {
      return new Response(
        JSON.stringify({ error: 'Non autorisé. Accès administrateur requis.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get authenticated session
    const { session } = await getSession(cookies);
    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Session expirée. Veuillez vous reconnecter.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse query parameters
    const url = new URL(request.url);
    const meetingId = url.searchParams.get('meeting_id');
    const history = url.searchParams.get('history') === 'true';
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);

    // Create authenticated Supabase client
    const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL || '';
    const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });

    // If meeting_id is provided, return roles for that specific meeting
    if (meetingId) {
      const { data, error } = await supabase
        .from('member_roles')
        .select('*')
        .eq('meeting_id', meetingId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Supabase query error:', error);
        return new Response(
          JSON.stringify({ error: 'Erreur lors de la récupération des rôles.' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, data: data || [] }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // If history=true, return role history ordered by meeting date (newest first)
    if (history) {
      // Join with meetings to get meeting dates for proper ordering
      const { data, error } = await supabase
        .from('member_roles')
        .select(`
          *,
          meetings!inner(date)
        `)
        .order('meetings(date)', { ascending: false })
        .limit(limit * 6); // Multiply by 6 roles per meeting to get enough history

      if (error) {
        console.error('Supabase query error:', error);
        return new Response(
          JSON.stringify({ error: 'Erreur lors de la récupération de l\'historique.' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Transform data to remove the nested meetings object
      const roleHistory: MemberRole[] = (data || []).map((item: any) => ({
        id: item.id,
        member_id: item.member_id,
        meeting_id: item.meeting_id,
        role: item.role,
        created_at: item.created_at,
      }));

      return new Response(
        JSON.stringify({ success: true, data: roleHistory }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // If no specific query, return all roles
    const { data, error } = await supabase
      .from('member_roles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase query error:', error);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la récupération des rôles.' }),
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

/**
 * POST: Create role assignments for a meeting
 * Body: { meeting_id: string, roles: Array<{ member_id: string, role: RoleType }> }
 */
export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin(cookies);
    if (!isAdminUser) {
      return new Response(
        JSON.stringify({ error: 'Non autorisé. Accès administrateur requis.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get authenticated session
    const { session } = await getSession(cookies);
    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Session expirée. Veuillez vous reconnecter.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body = await request.json();
    const { meeting_id, roles } = body;

    // Validate input
    if (!meeting_id || !Array.isArray(roles) || roles.length === 0) {
      return new Response(
        JSON.stringify({ error: 'meeting_id et roles sont requis.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate each role object
    for (const role of roles) {
      if (!role.member_id || !role.role) {
        return new Response(
          JSON.stringify({ error: 'Chaque rôle doit avoir member_id et role.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Create authenticated Supabase client
    const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL || '';
    const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });

    // Prepare role records for insertion
    const roleRecords = roles.map((role) => ({
      meeting_id,
      member_id: role.member_id,
      role: role.role,
    }));

    // Insert role assignments
    const { data, error } = await supabase
      .from('member_roles')
      .insert(roleRecords)
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la création des rôles.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: data || [] }),
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

/**
 * DELETE: Delete role assignments for a meeting
 * Query param: meeting_id (required)
 */
export const DELETE: APIRoute = async ({ url, cookies }) => {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin(cookies);
    if (!isAdminUser) {
      return new Response(
        JSON.stringify({ error: 'Non autorisé. Accès administrateur requis.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get authenticated session
    const { session } = await getSession(cookies);
    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Session expirée. Veuillez vous reconnecter.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get meeting_id from query params
    const meetingId = url.searchParams.get('meeting_id');
    if (!meetingId) {
      return new Response(
        JSON.stringify({ error: 'meeting_id est requis.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
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

    // Delete role assignments for the meeting
    const { error } = await supabase
      .from('member_roles')
      .delete()
      .eq('meeting_id', meetingId);

    if (error) {
      console.error('Supabase delete error:', error);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la suppression des rôles.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
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
