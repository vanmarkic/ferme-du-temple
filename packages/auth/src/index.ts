export { createSupabaseClient, createServerSupabaseClient } from './client';
export type { SupabaseClient } from './client';
export { getAuthTokens, setAuthCookies, clearAuthCookies } from './cookies';
export { getSession, isAdmin, requireAdmin } from './middleware';
export type { AuthConfig } from './middleware';
