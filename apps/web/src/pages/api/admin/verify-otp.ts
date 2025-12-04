import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { setAuthCookies } from '../../../lib/auth';

export const prerender = false;

const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return new Response(
        JSON.stringify({ error: 'Email et code requis' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!supabaseUrl || !supabaseAnonKey) {
      return new Response(
        JSON.stringify({ error: 'Configuration Supabase manquante' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);

    // Verify OTP
    const { data, error: verifyError } = await supabaseAuth.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });

    if (verifyError || !data.session) {
      console.error('OTP verify error:', verifyError);
      return new Response(
        JSON.stringify({ error: 'Code invalide ou expire' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify user is in members table
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey);
    const { data: adminUser, error: adminError } = await supabaseService
      .from('members')
      .select('id')
      .eq('id', data.user.id)
      .single();

    if (adminError || !adminUser) {
      return new Response(
        JSON.stringify({ error: 'Acces non autorise' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Set auth cookies
    setAuthCookies(
      cookies,
      data.session.access_token,
      data.session.refresh_token,
      data.session.expires_in
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Connexion reussie',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Verify OTP API error:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur interne' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
