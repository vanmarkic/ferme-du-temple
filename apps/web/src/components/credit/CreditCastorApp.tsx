/**
 * Credit Castor App - Supabase version
 *
 * This is the entry point for Credit Castor.
 * Authentication is handled client-side via /api/admin/me endpoint.
 * Now running in the main web app - no cross-origin complexity.
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
          setAuthState('unauthenticated');
        }
      })
      .catch(() => {
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

  if (authState === 'unauthenticated') {
    const redirectTo = encodeURIComponent(window.location.pathname);
    window.location.href = `/admin/login?redirect=${redirectTo}`;
    return null;
  }

  return (
    <UnlockProvider>
      <CalculatorProvider>
        <EnDivisionCorrect />
      </CalculatorProvider>
    </UnlockProvider>
  );
}
