import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { getSession, isAdmin } from '../../../lib/auth';

export const prerender = false;

const jsonHeaders = { 'Content-Type': 'application/json' };

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const isAdminUser = await isAdmin(cookies);
    if (!isAdminUser) {
      return new Response(
        JSON.stringify({ error: 'Non autorise' }),
        { status: 401, headers: jsonHeaders }
      );
    }

    const { session } = await getSession(cookies);
    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Session expiree' }),
        { status: 401, headers: jsonHeaders }
      );
    }

    const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL || '';
    const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from('members')
      .select('id, email, role')
      .eq('id', session.user.id)
      .single();

    if (error || !data) {
      return new Response(
        JSON.stringify({ error: 'Utilisateur non trouve' }),
        { status: 404, headers: jsonHeaders }
      );
    }

    return new Response(
      JSON.stringify({
        id: data.id,
        email: data.email,
        role: data.role,
        isSuperAdmin: data.role === 'super_admin',
        accessToken: session.access_token,
        refreshToken: session.refresh_token,
      }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (error) {
    console.error('Error in /api/admin/me:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur serveur' }),
      { status: 500, headers: jsonHeaders }
    );
  }
};
