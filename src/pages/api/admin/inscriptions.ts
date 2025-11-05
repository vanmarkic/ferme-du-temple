import type { APIRoute } from 'astro';
import { createServerSupabaseClient, isAdmin } from '@/lib/auth';

export const prerender = false;

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

    // Create Supabase client with server-side auth
    const supabase = createServerSupabaseClient(cookies);

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
