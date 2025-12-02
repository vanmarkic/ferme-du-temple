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
import { AdminSidebar } from '../AdminSidebar';

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
  const isAuthenticated = authState === 'authenticated';

  return (
    <div className="min-h-screen bg-gradient-to-br from-magenta/5 to-butter-yellow/5 flex flex-col md:flex-row">
      {/* Only show AdminSidebar for authenticated users */}
      {isAuthenticated && <AdminSidebar currentPage="credit" />}
      <div className="flex-1 pt-14 md:pt-0 overflow-auto relative">
        <UnlockProvider forceReadonly={!isAuthenticated}>
          <CalculatorProvider>
            <EnDivisionCorrect />
          </CalculatorProvider>
        </UnlockProvider>

        {/* Login button for unauthenticated users - bottom left */}
        {!isAuthenticated && (
          <a
            href="/admin/login"
            className="fixed bottom-6 left-6 z-50 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-lg transition-colors flex items-center gap-2 no-print"
            title="Se connecter en tant qu'administrateur"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            Se connecter
          </a>
        )}
      </div>
    </div>
  );
}
