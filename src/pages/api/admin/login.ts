import type { APIRoute } from 'astro';
import { supabase, setAuthCookies } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.session) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is an admin
    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('id, email, role')
      .eq('id', authData.user.id)
      .single();

    if (adminError || !adminData) {
      // User is authenticated but not an admin
      await supabase.auth.signOut();
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin access required' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Set authentication cookies
    setAuthCookies(
      cookies,
      authData.session.access_token,
      authData.session.refresh_token,
      authData.session.expires_in
    );

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: adminData.id,
          email: adminData.email,
          role: adminData.role,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
