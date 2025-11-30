/**
 * Credit Castor App - Supabase version
 *
 * This is the entry point for Credit Castor.
 * Authentication is handled client-side via /api/admin/me endpoint.
 * Unauthenticated users can access in readonly mode.
 */

import { useEffect, useState } from 'react';
import EnDivisionCorrect from './EnDivisionCorrect';
import { UnlockProvider } from './contexts/UnlockContext';
import { CalculatorProvider } from './calculator/CalculatorProvider';
import { supabase } from './services/supabase';

export default function CreditCastorApp() {
  const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    fetch('/api/admin/me')
      .then(async res => {
        if (res.ok) {
          const data = await res.json();
          // Set the Supabase session with tokens from the API
          if (data.accessToken && data.refreshToken) {
            await supabase.auth.setSession({
              access_token: data.accessToken,
              refresh_token: data.refreshToken,
            });
          }
          setAuthState('authenticated');
        } else {
          // Unauthenticated users get readonly access
          setAuthState('unauthenticated');
        }
      })
      .catch(() => {
        // On error, allow readonly access
        setAuthState('unauthenticated');
      });
  }, []);

  if (authState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  // Both authenticated and unauthenticated users can access the app
  // Unauthenticated users will be in readonly mode (enforced by UnlockProvider)
  return (
    <UnlockProvider forceReadonly={authState === 'unauthenticated'}>
      <CalculatorProvider>
        <EnDivisionCorrect />
      </CalculatorProvider>
    </UnlockProvider>
  );
}
