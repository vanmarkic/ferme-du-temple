import type { AstroCookies } from 'astro';
import { createServerSupabaseClient } from './client';
import { getAuthTokens } from './cookies';

export interface AuthConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  adminTableName?: string;
  loginPath?: string;
}

export async function getSession(cookies: AstroCookies, config: AuthConfig) {
  const { accessToken, refreshToken } = getAuthTokens(cookies);

  if (!accessToken || !refreshToken) {
    return { session: null, user: null };
  }

  const supabase = createServerSupabaseClient(config.supabaseUrl, config.supabaseAnonKey);
  const { data: { session }, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error || !session) {
    return { session: null, user: null };
  }

  return { session, user: session.user };
}

export async function isAdmin(cookies: AstroCookies, config: AuthConfig): Promise<boolean> {
  const { session, user } = await getSession(cookies, config);

  if (!user || !session) {
    return false;
  }

  const supabase = createServerSupabaseClient(config.supabaseUrl, config.supabaseAnonKey);
  await supabase.auth.setSession({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  });

  const tableName = config.adminTableName || 'admin_users';
  const { data, error } = await supabase
    .from(tableName)
    .select('id')
    .eq('id', user.id)
    .single();

  return !error && !!data;
}

export async function requireAdmin(cookies: AstroCookies, config: AuthConfig, redirectTo: string = '/admin') {
  const isAdminUser = await isAdmin(cookies, config);

  if (!isAdminUser) {
    const loginPath = config.loginPath || '/admin/login';
    return {
      authenticated: false,
      redirectTo: `${loginPath}?redirect=${encodeURIComponent(redirectTo)}`,
    };
  }

  const { user } = await getSession(cookies, config);
  return {
    authenticated: true,
    user,
  };
}
