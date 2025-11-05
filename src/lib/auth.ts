import { createClient } from '@supabase/supabase-js';
import type { AstroCookies } from 'astro';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

/**
 * Create a Supabase client configured for server-side auth
 */
export function createServerSupabaseClient(cookies: AstroCookies) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        cookie: cookies.get('sb-access-token')?.value || '',
      },
    },
  });
}

/**
 * Get the current authenticated user's session
 */
export async function getSession(cookies: AstroCookies) {
  const accessToken = cookies.get('sb-access-token')?.value;
  const refreshToken = cookies.get('sb-refresh-token')?.value;

  if (!accessToken) {
    return { session: null, user: null };
  }

  const supabase = createServerSupabaseClient(cookies);
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session) {
    return { session: null, user: null };
  }

  return { session, user: session.user };
}

/**
 * Check if the current user is an admin
 */
export async function isAdmin(cookies: AstroCookies): Promise<boolean> {
  const { user } = await getSession(cookies);

  if (!user) {
    return false;
  }

  const supabase = createServerSupabaseClient(cookies);
  const { data, error } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', user.id)
    .single();

  return !error && !!data;
}

/**
 * Require admin authentication, redirect to login if not authenticated
 */
export async function requireAdmin(cookies: AstroCookies, redirectTo: string = '/admin') {
  const isAdminUser = await isAdmin(cookies);

  if (!isAdminUser) {
    return {
      authenticated: false,
      redirectTo: `/admin/login?redirect=${encodeURIComponent(redirectTo)}`,
    };
  }

  return {
    authenticated: true,
    user: (await getSession(cookies)).user,
  };
}

/**
 * Set authentication cookies
 */
export function setAuthCookies(
  cookies: AstroCookies,
  accessToken: string,
  refreshToken: string,
  expiresIn: number
) {
  const maxAge = expiresIn;

  cookies.set('sb-access-token', accessToken, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    maxAge,
  });

  cookies.set('sb-refresh-token', refreshToken, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

/**
 * Clear authentication cookies
 */
export function clearAuthCookies(cookies: AstroCookies) {
  cookies.delete('sb-access-token', { path: '/' });
  cookies.delete('sb-refresh-token', { path: '/' });
}
