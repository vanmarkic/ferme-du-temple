import type { AstroCookies } from 'astro';
import {
  createSupabaseClient,
  getSession as getSessionBase,
  isAdmin as isAdminBase,
  type AuthConfig,
} from '@repo/auth';

const supabaseUrl = import.meta.env.SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || '';

const authConfig: AuthConfig = {
  supabaseUrl,
  supabaseAnonKey,
  adminTableName: 'admin_users',
  loginPath: '/admin/login',  // Redirects to main app's login
};

export const supabase = supabaseUrl && supabaseAnonKey
  ? createSupabaseClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function getSession(cookies: AstroCookies) {
  return getSessionBase(cookies, authConfig);
}

export async function isAdmin(cookies: AstroCookies) {
  return isAdminBase(cookies, authConfig);
}
