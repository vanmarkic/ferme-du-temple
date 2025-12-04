import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { getSession, isAdmin } from '@/lib/auth';
import { suggestRoles } from '@/lib/odj-pv/roles';
import type { Member, MemberRole } from '@/types/odj-pv';

export const prerender = false;

/**
 * GET: Get suggested role assignments based on the role rotation algorithm
 *
 * Query params:
 * - limit: Number of historical meetings to consider (default: 10)
 *
 * Returns: Array of suggested role assignments with gap information and warnings
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
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);

    // Create authenticated Supabase client
    const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL || '';
    const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });

    // Fetch active members
    const { data: membersData, error: membersError } = await supabase
      .from('members')
      .select('*')
      .eq('active', true)
      .order('name', { ascending: true });

    if (membersError) {
      console.error('Supabase members query error:', membersError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la récupération des membres.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const members: Member[] = membersData || [];

    // Fetch role history (ordered by meeting date, newest first)
    // Join with meetings to get meeting dates for proper ordering
    const { data: rolesData, error: rolesError } = await supabase
      .from('member_roles')
      .select(`
        *,
        meetings!inner(date)
      `)
      .order('meetings(date)', { ascending: false })
      .limit(limit * 6); // Multiply by 6 roles per meeting to get enough history

    if (rolesError) {
      console.error('Supabase roles query error:', rolesError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la récupération de l\'historique des rôles.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Transform data to remove the nested meetings object
    const roleHistory: MemberRole[] = (rolesData || []).map((item: any) => ({
      id: item.id,
      member_id: item.member_id,
      meeting_id: item.meeting_id,
      role: item.role,
      created_at: item.created_at,
    }));

    // Generate suggestions using the algorithm
    const suggestions = suggestRoles(members, roleHistory);

    // Enrich suggestions with member names for convenience
    const enrichedSuggestions = suggestions.map(suggestion => {
      const member = members.find(m => m.id === suggestion.member_id);
      return {
        ...suggestion,
        member_name: member?.name || 'Unknown',
      };
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: enrichedSuggestions,
        meta: {
          active_members_count: members.length,
          history_entries_count: roleHistory.length,
          history_limit: limit,
        },
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
