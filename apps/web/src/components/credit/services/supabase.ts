/**
 * Supabase client for Credit Castor
 *
 * Uses the same SUPABASE_URL and SUPABASE_ANON_KEY environment variables
 * as the main ferme-du-temple app.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// For client-side React components, use PUBLIC_ prefixed env vars
// These must be set in the Astro config or .env file
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || '';

// Log warning if not configured (but don't fail during build)
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Credit Castor: Supabase not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.'
  );
}

// Create client (with placeholder values for build time)
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

/**
 * Check if Supabase is properly configured
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
  if (!isSupabaseConfigured()) return null;

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }
  return user;
}

/**
 * Sign out
 */
export async function signOut() {
  if (!isSupabaseConfigured()) {
    return { error: new Error('Supabase not configured') };
  }

  const { error } = await supabase.auth.signOut();
  return { error };
}
