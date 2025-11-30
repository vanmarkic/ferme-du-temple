import type { AstroCookies } from 'astro';
import {
  createSupabaseClient,
  createServerSupabaseClient as createServerSupabaseClientBase,
  getSession as getSessionBase,
  isAdmin as isAdminBase,
  requireAdmin as requireAdminBase,
  setAuthCookies as setAuthCookiesBase,
  clearAuthCookies,
  type AuthConfig,
} from '@repo/auth';

const supabaseUrl = import.meta.env.SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || '';

const authConfig: AuthConfig = {
  supabaseUrl,
  supabaseAnonKey,
  adminTableName: 'admin_users',
  loginPath: '/admin/login',
};

// Browser client (only created if credentials exist)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createSupabaseClient(supabaseUrl, supabaseAnonKey)
  : null;

// Re-export with config applied
export async function getSession(cookies: AstroCookies) {
  return getSessionBase(cookies, authConfig);
}

export async function isAdmin(cookies: AstroCookies) {
  return isAdminBase(cookies, authConfig);
}

export async function requireAdmin(cookies: AstroCookies, redirectTo?: string) {
  return requireAdminBase(cookies, authConfig, redirectTo);
}

export function setAuthCookies(
  cookies: AstroCookies,
  accessToken: string,
  refreshToken: string,
  expiresIn: number
) {
  setAuthCookiesBase(cookies, accessToken, refreshToken, expiresIn, import.meta.env.PROD);
}

export { clearAuthCookies };

// Server-side Supabase client (ignores cookies param for API compatibility)
export function createServerSupabaseClient(_cookies: AstroCookies) {
  return createServerSupabaseClientBase(supabaseUrl, supabaseAnonKey);
}
