import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

export const POST: APIRoute = async ({ request, url }) => {
  try {
    const body = await request.json();
    const { email, redirectTo = '/admin/dashboard' } = body;

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email requis' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: 'Configuration Supabase manquante' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user is in admin_users table
    const { data: adminUser, error: adminError } = await supabase
      .from('admin_users')
      .select('id, email')
      .eq('email', email.toLowerCase())
      .single();

    if (adminError || !adminUser) {
      // Don't reveal if email exists or not for security
      // But still return success to prevent email enumeration
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Si cet email est autorise, un lien de connexion a ete envoye.'
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Use anon key for auth operations
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);

    // Build the callback URL
    const siteUrl = url.origin;
    const callbackUrl = `${siteUrl}/admin/auth/callback?redirect=${encodeURIComponent(redirectTo)}`;

    // Send magic link
    const { error: otpError } = await supabaseAuth.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: callbackUrl,
      },
    });

    if (otpError) {
      console.error('Magic link error:', otpError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de l\'envoi du lien' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Lien de connexion envoye'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Magic link API error:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur interne' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
