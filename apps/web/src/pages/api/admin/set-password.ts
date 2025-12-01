import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { getSession, isAdmin } from '../../../lib/auth';

export const prerender = false;

const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Verify user is authenticated and admin
    const isAdminUser = await isAdmin(cookies);
    if (!isAdminUser) {
      return new Response(
        JSON.stringify({ error: 'Non autorise' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { session } = await getSession(cookies);
    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Session expiree' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { password } = body;

    if (!password || password.length < 8) {
      return new Response(
        JSON.stringify({ error: 'Mot de passe trop court (min 8 caracteres)' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: 'Configuration Supabase manquante' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

    // Update user password using admin API
    const { error: updateError } = await supabaseService.auth.admin.updateUserById(
      session.user.id,
      {
        password,
        user_metadata: { has_password: true },
      }
    );

    if (updateError) {
      console.error('Password update error:', updateError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la mise a jour du mot de passe' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Mot de passe configure',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Set password API error:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur interne' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
