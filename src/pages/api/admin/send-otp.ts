import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email } = body;

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

    const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user is in admin_users table
    const { data: adminUser, error: adminError } = await supabaseService
      .from('admin_users')
      .select('id, email')
      .eq('email', email.toLowerCase())
      .single();

    if (adminError || !adminUser) {
      // Don't reveal if email exists or not for security
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Si cet email est autorise, un code a ete envoye.',
          hasPassword: false,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if user already has a password set
    const { data: authUser } = await supabaseService.auth.admin.getUserById(adminUser.id);
    const hasPassword = authUser?.user?.user_metadata?.has_password === true;

    // Use anon key for auth operations - send OTP email
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);

    const { error: otpError } = await supabaseAuth.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    });

    if (otpError) {
      console.error('OTP send error:', otpError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de l\'envoi du code' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Code envoye',
        hasPassword,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Send OTP API error:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur interne' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
