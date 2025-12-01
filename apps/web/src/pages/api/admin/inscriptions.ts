import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { getSession, isAdmin } from '@/lib/auth';

export const prerender = false;

// Helper to check if user is super_admin
async function isSuperAdmin(cookies: Parameters<typeof isAdmin>[0]): Promise<boolean> {
  const { session } = await getSession(cookies);
  if (!session) return false;

  const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL || '';
  const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data } = await supabase
    .from('admin_users')
    .select('role')
    .eq('id', session.user.id)
    .single();

  return data?.role === 'super_admin';
}

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
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    const sort = url.searchParams.get('sort') || 'created_at';
    const order = url.searchParams.get('order') || 'desc';
    const search = url.searchParams.get('search') || '';

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return new Response(
        JSON.stringify({
          error: 'Paramètres de pagination invalides.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate sort column to prevent SQL injection
    const allowedSortColumns = [
      'id',
      'nom',
      'prenom',
      'email',
      'telephone',
      'created_at',
      'updated_at',
    ];
    if (!allowedSortColumns.includes(sort)) {
      return new Response(
        JSON.stringify({
          error: 'Paramètre de tri invalide.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate order parameter
    if (order !== 'asc' && order !== 'desc') {
      return new Response(
        JSON.stringify({
          error: "Paramètre d'ordre invalide.",
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

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('inscriptions')
      .select('*', { count: 'exact' });

    // Apply search filter if provided
    if (search) {
      const searchTerm = `%${search}%`;
      query = query.or(
        `nom.ilike.${searchTerm},prenom.ilike.${searchTerm},email.ilike.${searchTerm}`
      );
    }

    // Apply sorting and pagination
    query = query
      .order(sort, { ascending: order === 'asc' })
      .range(offset, offset + limit - 1);

    // Execute query
    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      return new Response(
        JSON.stringify({
          error: 'Erreur lors de la récupération des inscriptions.',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Calculate pagination metadata
    const totalPages = count ? Math.ceil(count / limit) : 0;

    // Return successful response with data and metadata
    return new Response(
      JSON.stringify({
        success: true,
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
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

// DELETE: Remove an inscription (super_admin only)
export const DELETE: APIRoute = async ({ url, cookies }) => {
  try {
    // Check if user is super_admin
    const superAdmin = await isSuperAdmin(cookies);
    if (!superAdmin) {
      return new Response(
        JSON.stringify({ error: 'Acces refuse. Super admin requis.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const inscriptionId = url.searchParams.get('id');
    if (!inscriptionId) {
      return new Response(
        JSON.stringify({ error: 'ID inscription requis' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL || '';
    const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error } = await supabase
      .from('inscriptions')
      .delete()
      .eq('id', inscriptionId);

    if (error) {
      console.error('Delete inscription error:', error);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la suppression' }),
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
      JSON.stringify({ error: 'Erreur serveur' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
